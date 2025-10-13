-- Markalar Tablosu
CREATE TABLE IF NOT EXISTS marka (
  id INT PRIMARY KEY AUTO_INCREMENT,
  marka VARCHAR(255) NOT NULL,
  resim_url VARCHAR(500) DEFAULT NULL,
  durum TINYINT DEFAULT 1 COMMENT '1: Aktif, 0: Pasif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_marka (marka),
  INDEX idx_durum (durum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Örnek Markalar
INSERT INTO marka (marka, resim_url, durum) VALUES
('Bosch', NULL, 1),
('Valeo', NULL, 1),
('LuK', NULL, 1),
('Sachs', NULL, 1),
('Brembo', NULL, 1),
('Mann Filter', NULL, 1),
('NGK', NULL, 1),
('Mahle', NULL, 1),
('Hella', NULL, 1),
('Continental', NULL, 1);

