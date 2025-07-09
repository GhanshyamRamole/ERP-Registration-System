package main

import (
	"log"
	"os"
	"strconv"

	"erp-registration-backend/internal/config"
	"erp-registration-backend/internal/database"
	"erp-registration-backend/internal/handlers"
	"erp-registration-backend/internal/middleware"
	"erp-registration-backend/internal/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run database migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed database in development mode
	if os.Getenv("APP_ENV") == "development" {
		if err := database.SeedDatabase(db); err != nil {
			log.Printf("Warning: Failed to seed database: %v", err)
		}
	}

	// Initialize handlers
	h := handlers.New(db)

	// Setup router
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{
			"http://localhost:5173", 
			"http://localhost:3000",
			"https://teal-begonia-693134.netlify.app",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"service": "ERP Registration Backend",
			"version": "1.0.0",
		})
	})

	// API routes
	api := r.Group("/api")
	{
		api.POST("/register", h.RegisterCompany)
		api.POST("/login", h.Login)
		
		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/profile", h.GetProfile)
			protected.PUT("/profile", h.UpdateProfile)
			protected.GET("/companies", h.GetCompanies)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📊 Database: %s", cfg.DatabaseURL)
	log.Printf("🌍 Environment: %s", getEnv("APP_ENV", "production"))
	
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}