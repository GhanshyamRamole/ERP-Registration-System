package database

import (
	"erp-registration-backend/internal/models"
	"gorm.io/gorm"
)

// RunMigrations runs all database migrations
func RunMigrations(db *gorm.DB) error {
	// Auto-migrate all models
	err := db.AutoMigrate(
		&models.Company{},
		&models.User{},
		&models.Document{},
	)
	if err != nil {
		return err
	}

	// Create indexes for better performance
	if err := createIndexes(db); err != nil {
		return err
	}

	return nil
}

// createIndexes creates database indexes for better performance
func createIndexes(db *gorm.DB) error {
	// Company indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON companies(tax_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at)")
	
	// User indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)")
	
	// Document indexes
	db.Exec("CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at)")

	return nil
}

// SeedDatabase seeds the database with initial data for development
func SeedDatabase(db *gorm.DB) error {
	// Check if we already have data
	var count int64
	db.Model(&models.Company{}).Count(&count)
	if count > 0 {
		return nil // Already seeded
	}

	// Add sample companies for development
	sampleCompanies := []models.Company{
		{
			CompanyName: "Tech Solutions Inc",
			Industry:    "technology",
			CompanySize: "51-200",
			Website:     "https://techsolutions.com",
			TaxID:       "TAX123456789",
			Phone:       "+1-555-0123",
			Address: models.Address{
				Street:  "123 Tech Street",
				City:    "San Francisco",
				State:   "CA",
				ZipCode: "94105",
				Country: "US",
			},
		},
		{
			CompanyName: "Healthcare Plus",
			Industry:    "healthcare",
			CompanySize: "201-500",
			Website:     "https://healthcareplus.com",
			TaxID:       "TAX987654321",
			Phone:       "+1-555-0456",
			Address: models.Address{
				Street:  "456 Medical Ave",
				City:    "New York",
				State:   "NY",
				ZipCode: "10001",
				Country: "US",
			},
		},
	}

	for _, company := range sampleCompanies {
		if err := db.Create(&company).Error; err != nil {
			return err
		}
	}

	return nil
}