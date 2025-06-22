package models

import (
	"time"
	"gorm.io/gorm"
)

type Document struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	FileName  string         `json:"file_name" gorm:"not null"`
	FilePath  string         `json:"file_path" gorm:"not null"`
	FileSize  int64          `json:"file_size" gorm:"not null"`
	MimeType  string         `json:"mime_type" gorm:"not null"`
	CompanyID uint           `json:"company_id" gorm:"not null"`
	Company   Company        `json:"company,omitempty" gorm:"foreignKey:CompanyID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}