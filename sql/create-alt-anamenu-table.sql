-- Alt Ana Menü tablosu oluştur
CREATE TABLE IF NOT EXISTS `alt_anamenu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alt_anamenu` varchar(255) NOT NULL,
  `anamenu_id` int NOT NULL,
  `ikon` varchar(100) DEFAULT NULL,
  `sira` int DEFAULT '0',
  `yetki_ids` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_alt_anamenu_anamenu` (`anamenu_id`),
  CONSTRAINT `FK_alt_anamenu_anamenu` FOREIGN KEY (`anamenu_id`) REFERENCES `anamenu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

-- Menu tablosuna alt_anamenu_id kolonu ekle
ALTER TABLE `menu` 
ADD COLUMN `alt_anamenu_id` int DEFAULT NULL AFTER `anamenu_id`,
ADD KEY `FK_menu_alt_anamenu` (`alt_anamenu_id`),
ADD CONSTRAINT `FK_menu_alt_anamenu` FOREIGN KEY (`alt_anamenu_id`) REFERENCES `alt_anamenu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- anamenu_id kolonunu nullable yap
ALTER TABLE `menu` MODIFY COLUMN `anamenu_id` int DEFAULT NULL;
