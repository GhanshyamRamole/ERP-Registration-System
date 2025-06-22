package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	FirstName    string         `json:"first_name" gorm:"not null"`
	LastName     string         `json:"last_name" gorm:"not null"`
	Email        string         `json:"email" gorm:"not null;unique"`
	PasswordHash string         `json:"-" gorm:"not null"`
	Role         string         `json:"role" gorm:"not null;default:'employee'"`
	Department   string         `json:"department" gorm:"not null"`
	JobTitle     string         `json:"job_title" gorm:"not null"`
	Phone        string         `json:"phone" gorm:"not null"`
	CompanyID    uint           `json:"company_id" gorm:"not null"`
	Company      Company        `json:"company,omitempty" gorm:"foreignKey:CompanyID"`
	IsActive     bool           `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}