CREATE TABLE audit_logs(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(200),
    module VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);