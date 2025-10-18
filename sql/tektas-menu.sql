-- Tektas Ana Menüsü ekle
INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids)
SELECT 'Tektas Stok', 'PiPackage', 1, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM anamenu WHERE anamenu = 'Tektas Stok'
);

-- Kontrol
SELECT * FROM anamenu WHERE anamenu = 'Tektas Stok';

