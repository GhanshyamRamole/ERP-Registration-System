package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"erp-registration-backend/internal/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type RegistrationRequest struct {
	CompanyInfo struct {
		CompanyName string `json:"companyName" binding:"required"`
		Industry    string `json:"industry" binding:"required"`
		CompanySize string `json:"companySize" binding:"required"`
		Website     string `json:"website"`
		TaxID       string `json:"taxId" binding:"required"`
		Phone       string `json:"phone" binding:"required"`
		Address     struct {
			Street  string `json:"street" binding:"required"`
			City    string `json:"city" binding:"required"`
			State   string `json:"state" binding:"required"`
			ZipCode string `json:"zipCode" binding:"required"`
			Country string `json:"country" binding:"required"`
		} `json:"address" binding:"required"`
	} `json:"companyInfo" binding:"required"`
	
	UserInfo struct {
		FirstName   string `json:"firstName" binding:"required"`
		LastName    string `json:"lastName" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
		Password    string `json:"password" binding:"required,min=8"`
		Role        string `json:"role" binding:"required"`
		Department  string `json:"department" binding:"required"`
		JobTitle    string `json:"jobTitle" binding:"required"`
		Phone       string `json:"phone" binding:"required"`
	} `json:"userInfo" binding:"required"`
	
	TermsAccepted bool `json:"termsAccepted" binding:"required"`
}

func (h *Handler) RegisterCompany(c *gin.Context) {
	// Parse multipart form
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil { // 32MB max
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	// Get JSON data from form
	companyJSON := c.PostForm("company")
	userJSON := c.PostForm("user")
	termsAccepted := c.PostForm("termsAccepted")

	if companyJSON == "" || userJSON == "" || termsAccepted != "true" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Parse company info
	var companyInfo struct {
		CompanyName string `json:"companyName"`
		Industry    string `json:"industry"`
		CompanySize string `json:"companySize"`
		Website     string `json:"website"`
		TaxID       string `json:"taxId"`
		Phone       string `json:"phone"`
		Address     struct {
			Street  string `json:"street"`
			City    string `json:"city"`
			State   string `json:"state"`
			ZipCode string `json:"zipCode"`
			Country string `json:"country"`
		} `json:"address"`
	}

	if err := c.ShouldBindJSON(&companyInfo); err != nil {
		// Try to parse from form data
		companyInfo.CompanyName = c.PostForm("companyName")
		companyInfo.Industry = c.PostForm("industry")
		companyInfo.CompanySize = c.PostForm("companySize")
		companyInfo.Website = c.PostForm("website")
		companyInfo.TaxID = c.PostForm("taxId")
		companyInfo.Phone = c.PostForm("phone")
	}

	// Parse user info
	var userInfo struct {
		FirstName  string `json:"firstName"`
		LastName   string `json:"lastName"`
		Email      string `json:"email"`
		Password   string `json:"password"`
		Role       string `json:"role"`
		Department string `json:"department"`
		JobTitle   string `json:"jobTitle"`
		Phone      string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&userInfo); err != nil {
		// Try to parse from form data
		userInfo.FirstName = c.PostForm("firstName")
		userInfo.LastName = c.PostForm("lastName")
		userInfo.Email = c.PostForm("email")
		userInfo.Password = c.PostForm("password")
		userInfo.Role = c.PostForm("role")
		userInfo.Department = c.PostForm("department")
		userInfo.JobTitle = c.PostForm("jobTitle")
		userInfo.Phone = c.PostForm("userPhone")
	}

	// Validate required fields
	if companyInfo.CompanyName == "" || companyInfo.Industry == "" || userInfo.Email == "" || userInfo.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Check if company with same tax ID already exists
	var existingCompany models.Company
	if err := h.db.Where("tax_id = ?", companyInfo.TaxID).First(&existingCompany).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Company with this Tax ID already exists"})
		return
	}

	// Check if user with same email already exists
	var existingUser models.User
	if err := h.db.Where("email = ?", userInfo.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userInfo.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Create company
	company := models.Company{
		CompanyName: companyInfo.CompanyName,
		Industry:    companyInfo.Industry,
		CompanySize: companyInfo.CompanySize,
		Website:     companyInfo.Website,
		TaxID:       companyInfo.TaxID,
		Phone:       companyInfo.Phone,
		Address: models.Address{
			Street:  companyInfo.Address.Street,
			City:    companyInfo.Address.City,
			State:   companyInfo.Address.State,
			ZipCode: companyInfo.Address.ZipCode,
			Country: companyInfo.Address.Country,
		},
	}

	if err := tx.Create(&company).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create company"})
		return
	}

	// Create user
	user := models.User{
		FirstName:    userInfo.FirstName,
		LastName:     userInfo.LastName,
		Email:        userInfo.Email,
		PasswordHash: string(hashedPassword),
		Role:         userInfo.Role,
		Department:   userInfo.Department,
		JobTitle:     userInfo.JobTitle,
		Phone:        userInfo.Phone,
		CompanyID:    company.ID,
		IsActive:     true,
	}

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Handle file uploads
	form, _ := c.MultipartForm()
	files := form.File

	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	for fieldName, fileHeaders := range files {
		if strings.HasPrefix(fieldName, "document_") {
			for _, fileHeader := range fileHeaders {
				// Open uploaded file
				file, err := fileHeader.Open()
				if err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
					return
				}
				defer file.Close()

				// Create unique filename
				filename := fmt.Sprintf("%d_%s", company.ID, fileHeader.Filename)
				filepath := filepath.Join(uploadDir, filename)

				// Create destination file
				dst, err := os.Create(filepath)
				if err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
					return
				}
				defer dst.Close()

				// Copy file content
				if _, err := io.Copy(dst, file); err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
					return
				}

				// Save document record
				document := models.Document{
					FileName:  fileHeader.Filename,
					FilePath:  filepath,
					FileSize:  fileHeader.Size,
					MimeType:  fileHeader.Header.Get("Content-Type"),
					CompanyID: company.ID,
				}

				if err := tx.Create(&document).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document record"})
					return
				}
			}
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete registration"})
		return
	}

	// Generate JWT token for immediate login
	token, err := generateJWT(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration successful but failed to generate token"})
		return
	}

	// Load complete user data
	h.db.Preload("Company").First(&user, user.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful",
		"token":   token,
		"user":    user,
		"company": company,
	})
}

func (h *Handler) GetCompanies(c *gin.Context) {
	var companies []models.Company
	
	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	query := h.db.Model(&models.Company{})
	
	// Add search filter if provided
	if search := c.Query("search"); search != "" {
		query = query.Where("company_name ILIKE ? OR industry ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Get total count
	var total int64
	query.Count(&total)

	// Get companies with pagination
	if err := query.Offset(offset).Limit(limit).Preload("Users").Find(&companies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch companies"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"companies": companies,
		"total":     total,
		"page":      page,
		"limit":     limit,
	})
}