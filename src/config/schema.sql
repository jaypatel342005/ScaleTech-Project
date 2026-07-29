CREATE DATABASE IF NOT EXISTS support_ticket_router;
USE support_ticket_router;

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    customer_email VARCHAR(150),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50),
    priority ENUM('LOW','MEDIUM','HIGH','CRITICAL'),
    suggested_reply TEXT,
    status ENUM('OPEN','CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id)
    REFERENCES tickets(id)
    ON DELETE CASCADE
);

-- Dummy Tickets Data
INSERT INTO tickets (
    customer_name, customer_email, subject, message, category, priority, suggested_reply, status
) SELECT * FROM (
    SELECT 'John Doe', 'john@example.com', 'Unable to Login', 'I forgot my password and cannot login to my account.', 'Account', 'HIGH', 'Please use the "Forgot Password" option to reset your password.', 'OPEN' UNION ALL
    SELECT 'Alice Smith', 'alice@example.com', 'Payment Deducted Twice', 'My credit card was charged twice for the same order.', 'Billing', 'CRITICAL', 'Sorry for the inconvenience. We are checking your payment issue.', 'OPEN' UNION ALL
    SELECT 'Bob Johnson', 'bob@example.com', 'Food Not Delivered', 'My order shows delivered but I never received it.', 'Delivery', 'HIGH', 'We apologize. Our delivery team is investigating your order.', 'OPEN' UNION ALL
    SELECT 'Emma Wilson', 'emma@example.com', 'Refund Status', 'I cancelled my order three days ago but have not received my refund.', 'Refund', 'MEDIUM', 'Your refund request is being processed. It may take 3-5 business days.', 'OPEN' UNION ALL
    SELECT 'David Brown', 'david@example.com', 'App Crashing', 'The mobile app crashes every time I try to place an order.', 'Technical', 'HIGH', 'Our technical team is working on the issue. Please update the app if possible.', 'OPEN'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets LIMIT 1);
