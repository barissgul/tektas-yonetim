-- Trendyol Siparişler Tablosu
CREATE TABLE trendyol_orders (
    id BIGINT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id BIGINT,
    customer_first_name VARCHAR(100),
    customer_last_name VARCHAR(100),
    customer_email VARCHAR(255),
    gross_amount DECIMAL(10,2),
    total_discount DECIMAL(10,2),
    total_ty_discount DECIMAL(10,2),
    total_price DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'TRY',
    order_date BIGINT, -- timestamp
    identity_number VARCHAR(11),
    cargo_tracking_number BIGINT,
    cargo_tracking_link TEXT,
    cargo_provider_name VARCHAR(255),
    cargo_deci DECIMAL(5,2),
    status VARCHAR(50),
    shipment_package_status VARCHAR(50),
    delivery_type VARCHAR(20),
    time_slot_id INT DEFAULT 0,
    estimated_delivery_start_date BIGINT,
    estimated_delivery_end_date BIGINT,
    agreed_delivery_date BIGINT,
    fast_delivery BOOLEAN DEFAULT FALSE,
    fast_delivery_type VARCHAR(50),
    origin_shipment_date BIGINT,
    last_modified_date BIGINT,
    commercial BOOLEAN DEFAULT FALSE,
    delivered_by_service BOOLEAN DEFAULT FALSE,
    agreed_delivery_date_extendible BOOLEAN DEFAULT FALSE,
    extended_agreed_delivery_date BIGINT DEFAULT 0,
    agreed_delivery_extension_end_date BIGINT DEFAULT 0,
    agreed_delivery_extension_start_date BIGINT DEFAULT 0,
    warehouse_id BIGINT,
    group_deal BOOLEAN DEFAULT FALSE,
    invoice_link TEXT,
    micro BOOLEAN DEFAULT FALSE,
    gift_box_requested BOOLEAN DEFAULT FALSE,
    is_3p_by_trendyol BOOLEAN DEFAULT FALSE,
    contains_dangerous_product BOOLEAN DEFAULT FALSE,
    is_cod BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100),
    origin_package_ids TEXT,
    tax_number VARCHAR(50),
    delivery_address_type VARCHAR(50),
    
    -- Adres bilgileri (JSON olarak saklanabilir)
    shipment_address JSON,
    invoice_address JSON,
    
    -- Sistem alanları
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    magaza_kodu VARCHAR(50),
    
    INDEX idx_order_number (order_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_magaza_kodu (magaza_kodu)
);

-- Trendyol Sipariş Detayları Tablosu
CREATE TABLE trendyol_order_lines (
    id BIGINT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    quantity INT,
    sales_campaign_id BIGINT,
    product_size VARCHAR(100),
    merchant_sku VARCHAR(100),
    product_name TEXT,
    product_code BIGINT,
    merchant_id BIGINT,
    amount DECIMAL(10,2),
    discount DECIMAL(10,2),
    ty_discount DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'TRY',
    product_color VARCHAR(100),
    sku VARCHAR(100),
    vat_base_amount DECIMAL(10,2),
    barcode VARCHAR(100),
    order_line_item_status_name VARCHAR(50),
    price DECIMAL(10,2),
    product_category_id BIGINT,
    commission DECIMAL(5,2),
    
    -- Discount details JSON olarak
    discount_details JSON,
    
    -- Fast delivery options JSON olarak
    fast_delivery_options JSON,
    
    -- Sistem alanları
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES trendyol_orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_order_number (order_number),
    INDEX idx_merchant_sku (merchant_sku),
    INDEX idx_product_code (product_code),
    INDEX idx_merchant_id (merchant_id)
);

-- Package Histories Tablosu (Opsiyonel - JSON olarak da saklanabilir)
CREATE TABLE trendyol_package_histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    created_date BIGINT,
    status VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES trendyol_orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_date (created_date)
);
