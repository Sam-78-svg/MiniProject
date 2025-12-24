CREATE DATABASE phishing_simulator;
USE phishing_simulator;
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100),
    target_group VARCHAR(100),
    link_clicked INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    numberof_emails INT DEFAULT 0
);