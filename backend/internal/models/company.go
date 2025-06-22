package models

import (
	"time"
	"gorm.io/gorm"
)

type Company struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CompanyName string         `json:"company_name" gorm:"not null"`
	Industry    string         `json:"industry" gorm:"not null"`
	CompanySize string         `json:"company_size" gorm:"not null"`
	Website     string         `json:"website"`
	TaxID       string         `json:"tax_id" gorm:"not null;unique"`
	Phone       string         `json:"phone" gorm:"not null"`
	Address     Address        `json:"address" gorm:"embedded"`
	Users       []User         `json:"users,omitempty" gorm:"foreignKey:CompanyID"`
	Documents   []Document     `json:"documents,omitempty" gorm:"foreignKey:CompanyID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Address struct {
	Street  string `json:"street" gorm:"not null"`
	City    string `json:"city" gorm:"not null"`
	State   string `json:"state" gorm:"not null"`
	ZipCode string `json:"zip_code" gorm:"not null"`
	Country string `json:"country" gorm:"not null"`
}