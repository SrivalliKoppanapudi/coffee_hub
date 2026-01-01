-- ============================================
-- CoffeeHub Database Seed Data
-- ============================================
-- NOTE: Passwords in this file are BCrypt hashed
-- Default password for all users: "password123"
-- BCrypt hash for "password123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ============================================

-- Clear existing data (optional - use with caution)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE food_orders;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE bookings;
-- TRUNCATE TABLE payment_transactions;
-- TRUNCATE TABLE menu_price_history;
-- TRUNCATE TABLE menu_items;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE customers;
-- TRUNCATE TABLE staff;
-- TRUNCATE TABLE restaurant_tables;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. USERS (with BCrypt hashed passwords)
-- ============================================
INSERT INTO users (id, username, email, password, role) VALUES
-- Admin user
(12, 'admin', 'admin@coffeehub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),

-- Customer users
(2, 'john_doe', 'john.doe@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER'),
(3, 'jane_smith', 'jane.smith@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER'),
(4, 'mike_wilson', 'mike.wilson@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER'),
(5, 'sarah_jones', 'sarah.jones@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER'),
(6, 'david_brown', 'david.brown@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER'),

-- Chef users
(7, 'chef_mario', 'chef.mario@coffeehub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CHEF'),
(8, 'chef_luigi', 'chef.luigi@coffeehub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CHEF'),

-- Waiter users
(9, 'waiter_alice', 'waiter.alice@coffeehub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'WAITER'),
(10, 'waiter_bob', 'waiter.bob@coffeehub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'WAITER'),
(11, 'waiter_carol', 'waiter.carol@coffeehub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'WAITER');

-- ============================================
-- 2. CUSTOMERS
-- ============================================
INSERT INTO customers (id, user_id, first_name, last_name, contact_number, email, address, loyalty_points, preferred_table, username, created_at) VALUES
(1, 2, 'John', 'Doe', '+1-555-0101', 'john.doe@email.com', '123 Main Street, City, State 12345', 150, 5, 'john_doe', NOW()),
(2, 3, 'Jane', 'Smith', '+1-555-0102', 'jane.smith@email.com', '456 Oak Avenue, City, State 12345', 75, 8, 'jane_smith', NOW()),
(3, 4, 'Mike', 'Wilson', '+1-555-0103', 'mike.wilson@email.com', '789 Pine Road, City, State 12345', 200, 3, 'mike_wilson', NOW()),
(4, 5, 'Sarah', 'Jones', '+1-555-0104', 'sarah.jones@email.com', '321 Elm Street, City, State 12345', 50, 12, 'sarah_jones', NOW()),
(5, 6, 'David', 'Brown', '+1-555-0105', 'david.brown@email.com', '654 Maple Drive, City, State 12345', 300, 7, 'david_brown', NOW());

-- ============================================
-- 3. STAFF
-- ============================================
INSERT INTO staff (id, user_id, first_name, last_name, staff_type, contact_number, shift_start, shift_end, experience_years) VALUES
(1, 7, 'Mario', 'Rossi', 'CHEF', '+1-555-0201', '08:00:00', '16:00:00', 10),
(2, 8, 'Luigi', 'Verdi', 'CHEF', '+1-555-0202', '16:00:00', '00:00:00', 8),
(3, 9, 'Alice', 'Johnson', 'WAITER', '+1-555-0203', '09:00:00', '17:00:00', 3),
(4, 10, 'Bob', 'Williams', 'WAITER', '+1-555-0204', '17:00:00', '01:00:00', 5),
(5, 11, 'Carol', 'Davis', 'WAITER', '+1-555-0205', '10:00:00', '18:00:00', 2);

-- ============================================
-- 4. CATEGORIES
-- ============================================
INSERT INTO categories (id, name, created_at, updated_at) VALUES
(1, 'Hot Coffee', NOW(), NOW()),
(2, 'Cold Coffee', NOW(), NOW()),
(3, 'Tea', NOW(), NOW()),
(4, 'Pastries', NOW(), NOW()),
(5, 'Sandwiches', NOW(), NOW()),
(6, 'Desserts', NOW(), NOW()),
(7, 'Beverages', NOW(), NOW());

-- ============================================
-- 5. MENU ITEMS
-- ============================================
INSERT INTO menu_items (id, name, description, category_id, current_price, available, sku, image_url, price, created_at, updated_at) VALUES
-- Hot Coffee
(1, 'Espresso', 'Strong, concentrated coffee shot', 1, 3.50, TRUE, 'COFF-001', '/images/espresso.jpg', 3.50, NOW(), NOW()),
(2, 'Americano', 'Espresso with hot water', 1, 4.00, TRUE, 'COFF-002', '/images/americano.jpg', 4.00, NOW(), NOW()),
(3, 'Cappuccino', 'Espresso with steamed milk and foam', 1, 4.50, TRUE, 'COFF-003', '/images/cappuccino.jpg', 4.50, NOW(), NOW()),
(4, 'Latte', 'Espresso with steamed milk', 1, 5.00, TRUE, 'COFF-004', '/images/latte.jpg', 5.00, NOW(), NOW()),
(5, 'Mocha', 'Espresso with chocolate and steamed milk', 1, 5.50, TRUE, 'COFF-005', '/images/mocha.jpg', 5.50, NOW(), NOW()),
(6, 'Macchiato', 'Espresso with a dollop of foam', 1, 4.25, TRUE, 'COFF-006', '/images/macchiato.jpg', 4.25, NOW(), NOW()),

-- Cold Coffee
(7, 'Iced Americano', 'Espresso with cold water and ice', 2, 4.50, TRUE, 'COFF-007', '/images/iced-americano.jpg', 4.50, NOW(), NOW()),
(8, 'Iced Latte', 'Espresso with cold milk and ice', 2, 5.50, TRUE, 'COFF-008', '/images/iced-latte.jpg', 5.50, NOW(), NOW()),
(9, 'Cold Brew', 'Slow-steeped coffee, smooth and refreshing', 2, 5.00, TRUE, 'COFF-009', '/images/cold-brew.jpg', 5.00, NOW(), NOW()),
(10, 'Frappuccino', 'Blended coffee drink with ice', 2, 6.00, TRUE, 'COFF-010', '/images/frappuccino.jpg', 6.00, NOW(), NOW()),

-- Tea
(11, 'Green Tea', 'Premium green tea leaves', 3, 3.00, TRUE, 'TEA-001', '/images/green-tea.jpg', 3.00, NOW(), NOW()),
(12, 'Black Tea', 'Classic black tea', 3, 3.00, TRUE, 'TEA-002', '/images/black-tea.jpg', 3.00, NOW(), NOW()),
(13, 'Chai Latte', 'Spiced tea with steamed milk', 3, 4.50, TRUE, 'TEA-003', '/images/chai-latte.jpg', 4.50, NOW(), NOW()),
(14, 'Herbal Tea', 'Assorted herbal tea selection', 3, 3.50, TRUE, 'TEA-004', '/images/herbal-tea.jpg', 3.50, NOW(), NOW()),

-- Pastries
(15, 'Croissant', 'Buttery, flaky French pastry', 4, 3.50, TRUE, 'PAST-001', '/images/croissant.jpg', 3.50, NOW(), NOW()),
(16, 'Blueberry Muffin', 'Fresh blueberries in a soft muffin', 4, 4.00, TRUE, 'PAST-002', '/images/blueberry-muffin.jpg', 4.00, NOW(), NOW()),
(17, 'Chocolate Chip Cookie', 'Classic cookie with chocolate chips', 4, 2.50, TRUE, 'PAST-003', '/images/chocolate-cookie.jpg', 2.50, NOW(), NOW()),
(18, 'Danish Pastry', 'Sweet pastry with fruit filling', 4, 4.50, TRUE, 'PAST-004', '/images/danish.jpg', 4.50, NOW(), NOW()),

-- Sandwiches
(19, 'Ham & Cheese Sandwich', 'Sliced ham and cheese on fresh bread', 5, 7.50, TRUE, 'SAND-001', '/images/ham-cheese.jpg', 7.50, NOW(), NOW()),
(20, 'Turkey Club', 'Turkey, bacon, lettuce, and tomato', 5, 8.50, TRUE, 'SAND-002', '/images/turkey-club.jpg', 8.50, NOW(), NOW()),
(21, 'Veggie Wrap', 'Fresh vegetables in a tortilla wrap', 5, 7.00, TRUE, 'SAND-003', '/images/veggie-wrap.jpg', 7.00, NOW(), NOW()),
(22, 'Grilled Cheese', 'Melted cheese on toasted bread', 5, 6.50, TRUE, 'SAND-004', '/images/grilled-cheese.jpg', 6.50, NOW(), NOW()),

-- Desserts
(23, 'Chocolate Cake', 'Rich chocolate layer cake', 6, 6.00, TRUE, 'DESS-001', '/images/chocolate-cake.jpg', 6.00, NOW(), NOW()),
(24, 'Cheesecake', 'Creamy New York style cheesecake', 6, 6.50, TRUE, 'DESS-002', '/images/cheesecake.jpg', 6.50, NOW(), NOW()),
(25, 'Tiramisu', 'Classic Italian dessert', 6, 7.00, TRUE, 'DESS-003', '/images/tiramisu.jpg', 7.00, NOW(), NOW()),
(26, 'Brownie', 'Fudgy chocolate brownie', 6, 4.50, TRUE, 'DESS-004', '/images/brownie.jpg', 4.50, NOW(), NOW()),

-- Beverages
(27, 'Orange Juice', 'Fresh squeezed orange juice', 7, 3.50, TRUE, 'BEV-001', '/images/orange-juice.jpg', 3.50, NOW(), NOW()),
(28, 'Apple Juice', 'Crisp apple juice', 7, 3.50, TRUE, 'BEV-002', '/images/apple-juice.jpg', 3.50, NOW(), NOW()),
(29, 'Sparkling Water', 'Refreshing carbonated water', 7, 2.50, TRUE, 'BEV-003', '/images/sparkling-water.jpg', 2.50, NOW(), NOW()),
(30, 'Hot Chocolate', 'Rich, creamy hot chocolate', 7, 4.00, TRUE, 'BEV-004', '/images/hot-chocolate.jpg', 4.00, NOW(), NOW());

-- ============================================
-- 6. RESTAURANT TABLES
-- ============================================
INSERT INTO restaurant_tables (id, table_number, seating_capacity, location_zone, is_available, table_type) VALUES
(1, 1, 2, 'Window', TRUE, 'REGULAR'),
(2, 2, 2, 'Window', TRUE, 'REGULAR'),
(3, 3, 4, 'Main Hall', TRUE, 'REGULAR'),
(4, 4, 4, 'Main Hall', TRUE, 'REGULAR'),
(5, 5, 4, 'Main Hall', TRUE, 'REGULAR'),
(6, 6, 6, 'Main Hall', TRUE, 'REGULAR'),
(7, 7, 2, 'Corner', TRUE, 'REGULAR'),
(8, 8, 4, 'Corner', TRUE, 'REGULAR'),
(9, 9, 8, 'Private Room', TRUE, 'VIP'),
(10, 10, 8, 'Private Room', TRUE, 'VIP'),
(11, 11, 4, 'Outdoor', TRUE, 'OUTDOOR'),
(12, 12, 4, 'Outdoor', TRUE, 'OUTDOOR'),
(13, 13, 2, 'Outdoor', TRUE, 'OUTDOOR'),
(14, 14, 6, 'Main Hall', TRUE, 'REGULAR'),
(15, 15, 4, 'Window', TRUE, 'REGULAR');

-- ============================================
-- 7. BOOKINGS
-- ============================================
INSERT INTO bookings (id, customer_id, table_id, booking_datetime, duration_hours, party_size, status, special_requests, booking_fee, created_at) VALUES
(1, 1, 5, DATE_ADD(NOW(), INTERVAL 1 DAY), 2, 3, 'CONFIRMED', 'Window seat preferred', 5.00, NOW()),
(2, 2, 8, DATE_ADD(NOW(), INTERVAL 2 DAY), 1, 2, 'CONFIRMED', NULL, 5.00, NOW()),
(3, 3, 3, DATE_ADD(NOW(), INTERVAL 3 DAY), 3, 4, 'CONFIRMED', 'Birthday celebration', 10.00, NOW()),
(4, 4, 12, DATE_ADD(NOW(), INTERVAL 1 DAY), 2, 2, 'CONFIRMED', 'Outdoor seating', 5.00, NOW()),
(5, 5, 9, DATE_ADD(NOW(), INTERVAL 4 DAY), 4, 6, 'CONFIRMED', 'Business meeting', 15.00, NOW()),
(6, 1, 7, DATE_ADD(NOW(), INTERVAL -1 DAY), 2, 2, 'COMPLETED', NULL, 5.00, DATE_ADD(NOW(), INTERVAL -2 DAY)),
(7, 2, 11, DATE_ADD(NOW(), INTERVAL -2 DAY), 1, 2, 'COMPLETED', NULL, 5.00, DATE_ADD(NOW(), INTERVAL -3 DAY));

-- ============================================
-- 8. FOOD ORDERS
-- ============================================
INSERT INTO food_orders (id, booking_id, placed_by, placed_at, status, total_amount, notes, is_paid, payment_id) VALUES
(1, 1, 'john_doe', DATE_ADD(NOW(), INTERVAL -1 HOUR), 'PENDING', 15.50, 'Extra hot please', FALSE, NULL),
(2, 2, 'jane_smith', DATE_ADD(NOW(), INTERVAL -2 HOUR), 'IN_PREPARATION', 22.00, NULL, TRUE, 'pay_123456789'),
(3, 3, 'mike_wilson', DATE_ADD(NOW(), INTERVAL -30 MINUTE), 'READY_TO_SERVE', 35.75, 'No onions', TRUE, 'pay_987654321'),
(4, 6, 1, DATE_ADD(NOW(), INTERVAL -1 DAY), 'SERVED', 18.50, NULL, TRUE, 'pay_111222333'),
(5, 7, 2, DATE_ADD(NOW(), INTERVAL -2 DAY), 'SERVED', 12.00, NULL, TRUE, 'pay_444555666');

-- ============================================
-- 9. ORDER ITEMS
-- ============================================
INSERT INTO order_items (id, order_id, menu_item_id, quantity, special_request, price) VALUES
-- Order 1 (John's order)
(1, 1, 4, 2, 'Extra hot', 5.00), -- 2x Latte
(2, 1, 15, 1, NULL, 3.50), -- 1x Croissant

-- Order 2 (Jane's order)
(3, 2, 3, 2, NULL, 4.50), -- 2x Cappuccino
(4, 2, 16, 2, NULL, 4.00), -- 2x Blueberry Muffin
(5, 2, 11, 1, NULL, 3.00), -- 1x Green Tea

-- Order 3 (Mike's order)
(6, 3, 5, 2, NULL, 5.50), -- 2x Mocha
(7, 3, 19, 2, 'No onions', 7.50), -- 2x Ham & Cheese
(8, 3, 23, 1, NULL, 6.00), -- 1x Chocolate Cake

-- Order 4 (Past order - John)
(9, 4, 1, 1, NULL, 3.50), -- 1x Espresso
(10, 4, 8, 1, NULL, 5.50), -- 1x Iced Latte
(11, 4, 20, 1, NULL, 8.50), -- 1x Turkey Club

-- Order 5 (Past order - Jane)
(12, 5, 7, 2, NULL, 4.50), -- 2x Iced Americano
(13, 5, 17, 2, NULL, 2.50); -- 2x Chocolate Chip Cookie

-- ============================================
-- 10. ORDERS (Alternative order table)
-- ============================================
INSERT INTO orders (id, user_id, customer_name, customer_phone, table_number, status, total_cents, created_at, payment_intent_id) VALUES
(1, 2, 'John Doe', '+1-555-0101', '5', 'PENDING', 1550, DATE_ADD(NOW(), INTERVAL -1 HOUR), NULL),
(2, 3, 'Jane Smith', '+1-555-0102', '8', 'IN_PREPARATION', 2200, DATE_ADD(NOW(), INTERVAL -2 HOUR), 'pi_123456789'),
(3, 4, 'Mike Wilson', '+1-555-0103', '3', 'READY_TO_SERVE', 3575, DATE_ADD(NOW(), INTERVAL -30 MINUTE), 'pi_987654321'),
(4, 2, 'John Doe', '+1-555-0101', '7', 'SERVED', 1850, DATE_ADD(NOW(), INTERVAL -1 DAY), 'pi_111222333'),
(5, 3, 'Jane Smith', '+1-555-0102', '11', 'SERVED', 1200, DATE_ADD(NOW(), INTERVAL -2 DAY), 'pi_444555666');

-- ============================================
-- 11. PAYMENT TRANSACTIONS
-- ============================================
INSERT INTO payment_transactions (id, provider, provider_payment_id, amount, currency, status, type, metadata, client_secret, created_at, updated_at) VALUES
(1, 'STRIPE', 'pay_123456789', 22.00, 'INR', 'COMPLETED', 'ORDER_PAYMENT', '{"orderId": 2, "customerId": 2}', 'pi_123456789_secret_xyz', DATE_ADD(NOW(), INTERVAL -2 HOUR), DATE_ADD(NOW(), INTERVAL -2 HOUR)),
(2, 'STRIPE', 'pay_987654321', 35.75, 'INR', 'COMPLETED', 'ORDER_PAYMENT', '{"orderId": 3, "customerId": 3}', 'pi_987654321_secret_abc', DATE_ADD(NOW(), INTERVAL -30 MINUTE), DATE_ADD(NOW(), INTERVAL -30 MINUTE)),
(3, 'STRIPE', 'pay_111222333', 18.50, 'INR', 'COMPLETED', 'ORDER_PAYMENT', '{"orderId": 4, "customerId": 1}', 'pi_111222333_secret_def', DATE_ADD(NOW(), INTERVAL -1 DAY), DATE_ADD(NOW(), INTERVAL -1 DAY)),
(4, 'STRIPE', 'pay_444555666', 12.00, 'INR', 'COMPLETED', 'ORDER_PAYMENT', '{"orderId": 5, "customerId": 2}', 'pi_444555666_secret_ghi', DATE_ADD(NOW(), INTERVAL -2 DAY), DATE_ADD(NOW(), INTERVAL -2 DAY)),
(5, 'STRIPE', 'pay_booking_001', 5.00, 'INR', 'COMPLETED', 'BOOKING_FEE', '{"bookingId": 1, "customerId": 1}', NULL, DATE_ADD(NOW(), INTERVAL -1 DAY), DATE_ADD(NOW(), INTERVAL -1 DAY)),
(6, 'STRIPE', 'pay_booking_002', 5.00, 'INR', 'COMPLETED', 'BOOKING_FEE', '{"bookingId": 2, "customerId": 2}', NULL, DATE_ADD(NOW(), INTERVAL -2 DAY), DATE_ADD(NOW(), INTERVAL -2 DAY));

-- ============================================
-- 12. MENU PRICE HISTORY
-- ============================================
INSERT INTO menu_price_history (id, menu_item_id, price, effective_from, effective_to, created_at) VALUES
-- Historical prices for some items
(1, 1, 3.00, DATE_ADD(NOW(), INTERVAL -30 DAY), DATE_ADD(NOW(), INTERVAL -10 DAY), DATE_ADD(NOW(), INTERVAL -30 DAY)),
(2, 1, 3.25, DATE_ADD(NOW(), INTERVAL -10 DAY), DATE_ADD(NOW(), INTERVAL -5 DAY), DATE_ADD(NOW(), INTERVAL -10 DAY)),
(3, 1, 3.50, DATE_ADD(NOW(), INTERVAL -5 DAY), NULL, DATE_ADD(NOW(), INTERVAL -5 DAY)),

(4, 4, 4.50, DATE_ADD(NOW(), INTERVAL -20 DAY), DATE_ADD(NOW(), INTERVAL -7 DAY), DATE_ADD(NOW(), INTERVAL -20 DAY)),
(5, 4, 5.00, DATE_ADD(NOW(), INTERVAL -7 DAY), NULL, DATE_ADD(NOW(), INTERVAL -7 DAY)),

(6, 5, 5.00, DATE_ADD(NOW(), INTERVAL -15 DAY), DATE_ADD(NOW(), INTERVAL -3 DAY), DATE_ADD(NOW(), INTERVAL -15 DAY)),
(7, 5, 5.50, DATE_ADD(NOW(), INTERVAL -3 DAY), NULL, DATE_ADD(NOW(), INTERVAL -3 DAY)),

(8, 15, 3.00, DATE_ADD(NOW(), INTERVAL -25 DAY), DATE_ADD(NOW(), INTERVAL -12 DAY), DATE_ADD(NOW(), INTERVAL -25 DAY)),
(9, 15, 3.50, DATE_ADD(NOW(), INTERVAL -12 DAY), NULL, DATE_ADD(NOW(), INTERVAL -12 DAY));

-- ============================================
-- Reset AUTO_INCREMENT for tables
-- ============================================
ALTER TABLE users AUTO_INCREMENT = 12;
ALTER TABLE customers AUTO_INCREMENT = 6;
ALTER TABLE staff AUTO_INCREMENT = 6;
ALTER TABLE categories AUTO_INCREMENT = 8;
ALTER TABLE menu_items AUTO_INCREMENT = 31;
ALTER TABLE restaurant_tables AUTO_INCREMENT = 16;
ALTER TABLE bookings AUTO_INCREMENT = 8;
ALTER TABLE food_orders AUTO_INCREMENT = 6;
ALTER TABLE order_items AUTO_INCREMENT = 14;
ALTER TABLE orders AUTO_INCREMENT = 6;
ALTER TABLE payment_transactions AUTO_INCREMENT = 7;
ALTER TABLE menu_price_history AUTO_INCREMENT = 10;

