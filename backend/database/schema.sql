-- USERS TABLE
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
    CHECK(
        role IN ('ADMIN','OPERATIONS','MANAGEMENT')
    )
    DEFAULT 'OPERATIONS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CUSTOMERS TABLE
CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    mobile_number VARCHAR(15),
    email VARCHAR(100),
    gst_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SHIPMENTS TABLE
CREATE TABLE shipments(
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50)
    UNIQUE NOT NULL,
    customer_id INTEGER
    REFERENCES customers(id)
    ON DELETE CASCADE,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    shipment_mode VARCHAR(50)
    CHECK(
        shipment_mode IN
        ('AIR','SURFACE','RAIL','PTL','FTL')
    ),
    weight DECIMAL(10,2),
    carrier_name VARCHAR(100),
    expected_delivery_date DATE,
    shipment_cost DECIMAL(10,2),
    status VARCHAR(50)
    CHECK(
        status IN
        (
            'BOOKED',
            'PICKED_UP',
            'IN_TRANSIT',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'EXCEPTION'
        )
    )
    DEFAULT 'BOOKED',
    created_by INTEGER
    REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRACKING HISTORY TABLE
CREATE TABLE tracking_history(
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER
    REFERENCES shipments(id)
    ON DELETE CASCADE,
    status VARCHAR(50),
    location TEXT,
    remarks TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);