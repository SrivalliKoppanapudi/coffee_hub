# CoffeeHub Database Seed Data

This document explains how to seed the CoffeeHub database with initial test data.

## Overview

The seed data includes:
- **11 Users** (1 Admin, 5 Customers, 2 Chefs, 3 Waiters)
- **5 Customers** with profile information
- **5 Staff members** (2 Chefs, 3 Waiters)
- **7 Categories** (Hot Coffee, Cold Coffee, Tea, Pastries, Sandwiches, Desserts, Beverages)
- **30 Menu Items** across all categories
- **15 Restaurant Tables** (Window, Main Hall, Corner, VIP, Outdoor)
- **7 Bookings** (5 upcoming, 2 completed)
- **5 Food Orders** with various statuses
- **13 Order Items** linked to food orders
- **6 Payment Transactions** (4 order payments, 2 booking fees)
- **9 Menu Price History** records showing price changes over time

## Default Credentials

**All users have the same password:** `password123`

### User Accounts:

| Role | Username | Email | Password |
|-----|----------|-------|----------|
| Admin | admin | admin@coffeehub.com | password123 |
| Customer | john_doe | john.doe@email.com | password123 |
| Customer | jane_smith | jane.smith@email.com | password123 |
| Customer | mike_wilson | mike.wilson@email.com | password123 |
| Customer | sarah_jones | sarah.jones@email.com | password123 |
| Customer | david_brown | david.brown@email.com | password123 |
| Chef | chef_mario | chef.mario@coffeehub.com | password123 |
| Chef | chef_luigi | chef.luigi@coffeehub.com | password123 |
| Waiter | waiter_alice | waiter.alice@coffeehub.com | password123 |
| Waiter | waiter_bob | waiter.bob@coffeehub.com | password123 |
| Waiter | waiter_carol | waiter.carol@coffeehub.com | password123 |

## Method 1: Using SQL File (Recommended)

### Steps:

1. **Ensure your database is created:**
   ```sql
   CREATE DATABASE coffeehubdb;
   ```

2. **Run the SQL file:**
   - Option A: Using MySQL command line
     ```bash
     mysql -u root -p coffeehubdb < src/main/resources/data.sql
     ```
   
   - Option B: Using MySQL Workbench or any SQL client
     - Open `src/main/resources/data.sql`
     - Execute the entire script

3. **Verify the data:**
   ```sql
   SELECT COUNT(*) FROM users;        -- Should return 11
   SELECT COUNT(*) FROM customers;     -- Should return 5
   SELECT COUNT(*) FROM menu_items;    -- Should return 30
   SELECT COUNT(*) FROM restaurant_tables; -- Should return 15
   ```

### Important Notes:
- The SQL file uses BCrypt hashed passwords (hash for "password123")
- Make sure foreign key constraints are satisfied (users must be created before customers/staff)
- If you get foreign key errors, ensure tables are created in the correct order

## Method 2: Using Java DataSeeder Class

### Steps:

1. **Enable the DataSeeder:**
   - Open `src/main/java/com/javabite/code/coffeehub/config/DataSeeder.java`
   - Uncomment the `@Bean` annotation on line 50:
     ```java
     @Bean  // Uncomment this line
     public CommandLineRunner seedData() {
     ```

2. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   or
   ```bash
   ./mvnw spring-boot:run
   ```

3. **The seeder will:**
   - Check if data already exists (skips if data found)
   - Create all seed data with proper relationships
   - Use BCrypt password encoding automatically
   - Print progress messages to console

4. **Disable after first run:**
   - Comment out the `@Bean` annotation again to prevent re-seeding

### Advantages of Java Seeder:
- Automatic BCrypt password encoding
- Proper entity relationships
- Type-safe
- Can be easily modified for different scenarios

## Method 3: Manual API Calls

You can also create users through the API endpoints:

1. **Create Admin User:**
   ```bash
   POST /api/auth/signup
   {
     "username": "admin",
     "email": "admin@coffeehub.com",
     "password": "password123",
     "role": "ADMIN"
   }
   ```

2. **Create Customer:**
   ```bash
   POST /api/auth/signup
   {
     "username": "john_doe",
     "email": "john.doe@email.com",
     "password": "password123",
     "role": "CUSTOMER"
   }
   ```

3. **Login and use other endpoints** to create menu items, tables, bookings, etc.

## Data Relationships

### Entity Relationships:
- `Customer` → `UserEnitiy` (One-to-One)
- `Staff` → `UserEnitiy` (via userId)
- `MenuItem` → `Category` (Many-to-One)
- `Booking` → `Customer` (via customerId)
- `Booking` → `RestaurantTable` (via tableId)
- `FoodOrder` → `Booking` (Many-to-One)
- `OrderItem` → `FoodOrder` (Many-to-One)
- `OrderItem` → `MenuItem` (Many-to-One)
- `MenuPriceHistory` → `MenuItem` (Many-to-One)

## Sample Data Highlights

### Menu Items by Category:
- **Hot Coffee:** Espresso, Americano, Cappuccino, Latte, Mocha, Macchiato
- **Cold Coffee:** Iced Americano, Iced Latte, Cold Brew, Frappuccino
- **Tea:** Green Tea, Black Tea, Chai Latte, Herbal Tea
- **Pastries:** Croissant, Blueberry Muffin, Chocolate Chip Cookie, Danish Pastry
- **Sandwiches:** Ham & Cheese, Turkey Club, Veggie Wrap, Grilled Cheese
- **Desserts:** Chocolate Cake, Cheesecake, Tiramisu, Brownie
- **Beverages:** Orange Juice, Apple Juice, Sparkling Water, Hot Chocolate

### Restaurant Tables:
- **Window Zone:** Tables 1, 2, 15 (2-4 seats)
- **Main Hall:** Tables 3-6, 14 (4-6 seats)
- **Corner:** Tables 7, 8 (2-4 seats)
- **Private Room (VIP):** Tables 9, 10 (8 seats each)
- **Outdoor:** Tables 11-13 (2-4 seats)

### Order Statuses:
- `PENDING` - Order placed, awaiting preparation
- `IN_PREPARATION` - Order being prepared
- `READY_TO_SERVE` - Order ready for serving
- `SERVED` - Order completed
- `CANCELLED` - Order cancelled

### Booking Statuses:
- `CONFIRMED` - Booking confirmed
- `COMPLETED` - Booking completed
- `CANCELLED` - Booking cancelled

## Troubleshooting

### Issue: Foreign Key Constraint Errors
**Solution:** Ensure tables are created in order. The SQL file handles this, but if using manual inserts, create in this order:
1. Users
2. Customers, Staff
3. Categories
4. Menu Items
5. Restaurant Tables
6. Bookings
7. Food Orders
8. Order Items
9. Payment Transactions
10. Menu Price History

### Issue: Password Not Working
**Solution:** 
- For SQL method: The BCrypt hash is included. If it doesn't work, use the Java seeder which generates fresh hashes.
- For Java seeder: Ensure `PasswordEncoder` bean is properly configured.

### Issue: Duplicate Key Errors
**Solution:** 
- Clear existing data first (uncomment the TRUNCATE statements in data.sql)
- Or modify the seeder to check for existing data before inserting

### Issue: Date/Time Issues
**Solution:** 
- The SQL uses `NOW()` and `DATE_ADD()` functions which are MySQL-specific
- For other databases, adjust date functions accordingly
- Java seeder uses `LocalDateTime.now()` which is database-agnostic

## Customization

### To Add More Data:
1. **More Users:** Add entries to the `users` INSERT statement
2. **More Menu Items:** Add entries to the `menu_items` INSERT statement
3. **More Tables:** Add entries to the `restaurant_tables` INSERT statement
4. **More Bookings:** Add entries to the `bookings` INSERT statement

### To Modify Prices:
- Update `current_price` and `price` fields in `menu_items` table
- Add new entries to `menu_price_history` to track price changes

### To Change Default Password:
1. Generate a new BCrypt hash (use online BCrypt generator or Spring's PasswordEncoder)
2. Update all password hashes in `data.sql`
3. Or use the Java seeder and change the `defaultPassword` variable

## Security Note

⚠️ **Important:** The seed data is for **development/testing only**. 
- Never use these credentials in production
- Change all passwords before deploying
- Remove or disable seeders in production environments

## Next Steps

After seeding:
1. Test login with different user roles
2. Create bookings as a customer
3. Place orders through the API
4. Test admin dashboard functionality
5. Test chef/waiter dashboards

---

**Happy Coding! ☕**

