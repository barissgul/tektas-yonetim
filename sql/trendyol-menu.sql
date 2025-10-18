-- Trendyol Ana Menüsü ekle
INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids)
SELECT 'Trendyol', 'PiShoppingCart', 5, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM anamenu WHERE anamenu = 'Trendyol'
);

-- Trendyol ana menüsünün ID'sini al
SET @trendyol_id = (SELECT id FROM anamenu WHERE anamenu = 'Trendyol' LIMIT 1);

-- Alt menüleri ekle
INSERT INTO menu (menu, anamenu_id, rota, ikon, sira, yetki_ids)
SELECT 'Yapılandırma', @trendyol_id, '/trendyol/yapilandirma', 'PiGear', 1, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE menu = 'Yapılandırma' AND anamenu_id = @trendyol_id
);

INSERT INTO menu (menu, anamenu_id, rota, ikon, sira, yetki_ids)
SELECT 'Ürünler', @trendyol_id, '/trendyol/urunler', 'PiPackage', 2, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE menu = 'Ürünler' AND anamenu_id = @trendyol_id
);

INSERT INTO menu (menu, anamenu_id, rota, ikon, sira, yetki_ids)
SELECT 'Siparişler', @trendyol_id, '/trendyol/siparisler', 'PiShoppingCart', 3, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE menu = 'Siparişler' AND anamenu_id = @trendyol_id
);

INSERT INTO menu (menu, anamenu_id, rota, ikon, sira, yetki_ids)
SELECT 'Stok & Fiyat', @trendyol_id, '/trendyol/stok-fiyat', 'PiCurrencyDollar', 4, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE menu = 'Stok & Fiyat' AND anamenu_id = @trendyol_id
);

-- Kontrol
SELECT 
    CONCAT('Ana Menü: ', a.anamenu) as menu_adi,
    a.ikon,
    a.sira
FROM anamenu a
WHERE a.anamenu = 'Trendyol'
UNION ALL
SELECT 
    CONCAT('  ↳ Alt Menü: ', m.menu) as menu_adi,
    m.ikon,
    m.sira
FROM menu m
JOIN anamenu a ON m.anamenu_id = a.id
WHERE a.anamenu = 'Trendyol'
ORDER BY sira;

