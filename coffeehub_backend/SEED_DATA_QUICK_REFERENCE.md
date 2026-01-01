# CoffeeHub Seed Data - Quick Reference

## 📊 Data Summary

| Entity | Count | Description |
|--------|-------|-------------|
| Users | 11 | 1 Admin, 5 Customers, 2 Chefs, 3 Waiters |
| Customers | 5 | Customer profiles with loyalty points |
| Staff | 5 | 2 Chefs, 3 Waiters with shift schedules |
| Categories | 7 | Menu categories |
| Menu Items | 30 | Food and beverage items |
| Tables | 15 | Restaurant tables (Window, Main, VIP, Outdoor) |
| Bookings | 7 | 5 upcoming, 2 completed |
| Food Orders | 5 | Orders with various statuses |
| Order Items | 13 | Items in orders |
| Payments | 6 | Payment transactions |
| Price History | 9 | Historical price changes |

## 🔑 Login Credentials

**Password for ALL users:** `password123`

### Quick Login Test:
- **Admin:** `admin@coffeehub.com` / `password123`
- **Customer:** `john.doe@email.com` / `password123`
- **Chef:** `chef.mario@coffeehub.com` / `password123`
- **Waiter:** `waiter.alice@coffeehub.com` / `password123`

## 📋 Sample Menu Items

### Hot Coffee (6 items)
- Espresso ($3.50)
- Americano ($4.00)
- Cappuccino ($4.50)
- Latte ($5.00)
- Mocha ($5.50)
- Macchiato ($4.25)

### Cold Coffee (4 items)
- Iced Americano ($4.50)
- Iced Latte ($5.50)
- Cold Brew ($5.00)
- Frappuccino ($6.00)

### Other Categories
- **Tea:** 4 items ($3.00 - $4.50)
- **Pastries:** 4 items ($2.50 - $4.50)
- **Sandwiches:** 4 items ($6.50 - $8.50)
- **Desserts:** 4 items ($4.50 - $7.00)
- **Beverages:** 4 items ($2.50 - $4.00)

## 🪑 Restaurant Tables

| Table # | Capacity | Zone | Type |
|---------|----------|------|------|
| 1-2 | 2 | Window | REGULAR |
| 3-6, 14 | 4-6 | Main Hall | REGULAR |
| 7-8 | 2-4 | Corner | REGULAR |
| 9-10 | 8 | Private Room | VIP |
| 11-13 | 2-4 | Outdoor | OUTDOOR |
| 15 | 4 | Window | REGULAR |

## 📅 Sample Bookings

1. **John Doe** - Table 5, Tomorrow, 2 hours, 3 people, CONFIRMED
2. **Jane Smith** - Table 8, Day after tomorrow, 1 hour, 2 people, CONFIRMED
3. **Mike Wilson** - Table 3, 3 days, 3 hours, 4 people, CONFIRMED (Birthday)
4. **Sarah Jones** - Table 12, Tomorrow, 2 hours, 2 people, CONFIRMED (Outdoor)
5. **David Brown** - Table 9, 4 days, 4 hours, 6 people, CONFIRMED (Business)

## 🛒 Sample Orders

1. **Order #1** - John Doe: 2x Latte, 1x Croissant ($15.50) - PENDING
2. **Order #2** - Jane Smith: 2x Cappuccino, 2x Muffin, 1x Tea ($22.00) - IN_PREPARATION
3. **Order #3** - Mike Wilson: 2x Mocha, 2x Sandwich, 1x Cake ($35.75) - READY_TO_SERVE
4. **Order #4** - John Doe (Past): 1x Espresso, 1x Iced Latte, 1x Turkey Club ($18.50) - SERVED
5. **Order #5** - Jane Smith (Past): 2x Iced Americano, 2x Cookie ($12.00) - SERVED

## 💳 Payment Status

- **4 Order Payments:** All COMPLETED
- **2 Booking Fees:** All COMPLETED
- **Provider:** STRIPE
- **Currency:** INR

## 🔄 Order Status Flow

```
PENDING → IN_PREPARATION → READY_TO_SERVE → SERVED
                              ↓
                          CANCELLED
```

## 📈 Customer Loyalty Points

- **David Brown:** 300 points (Highest)
- **Mike Wilson:** 200 points
- **John Doe:** 150 points
- **Jane Smith:** 75 points
- **Sarah Jones:** 50 points

## 🕐 Staff Shifts

### Chefs
- **Mario:** 08:00 - 16:00 (10 years exp)
- **Luigi:** 16:00 - 00:00 (8 years exp)

### Waiters
- **Alice:** 09:00 - 17:00 (3 years exp)
- **Bob:** 17:00 - 01:00 (5 years exp)
- **Carol:** 10:00 - 18:00 (2 years exp)

## 🗂️ Database Tables

### Core Tables
- `users` - User accounts
- `customers` - Customer profiles
- `staff` - Staff information
- `categories` - Menu categories
- `menu_items` - Menu items
- `restaurant_tables` - Table information

### Transaction Tables
- `bookings` - Table bookings
- `food_orders` - Food orders
- `order_items` - Order line items
- `orders` - Alternative order table
- `payment_transactions` - Payment records
- `menu_price_history` - Price tracking

## 🚀 Quick Start

1. **Run SQL file:**
   ```bash
   mysql -u root -p coffeehubdb < src/main/resources/data.sql
   ```

2. **Or use Java seeder:**
   - Uncomment `@Bean` in `DataSeeder.java`
   - Run application
   - Comment out again

3. **Test login:**
   - Use any email from the credentials table
   - Password: `password123`

## 📝 Notes

- All prices in USD (can be changed to INR or other currency)
- Dates are relative (uses NOW() + days)
- BCrypt password hash included in SQL
- Foreign keys properly maintained
- Sample data covers all entity relationships

---

**For detailed information, see `SEED_DATA_README.md`**

