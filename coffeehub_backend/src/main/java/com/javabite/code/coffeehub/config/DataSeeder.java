package com.javabite.code.coffeehub.config;

import com.javabite.code.coffeehub.entity.*;
import com.javabite.code.coffeehub.enums.OrderStatus;
import com.javabite.code.coffeehub.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Seeder for CoffeeHub Database
 * 
 * This class seeds the database with initial data for testing and development.
 * To use this seeder, uncomment the @Bean annotation below.
 * 
 * Default password for all users: "password123"
 */
@Configuration
public class DataSeeder {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FoodOrderRepository foodOrderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private MenuPriceHistoryRepository menuPriceHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Uncomment the @Bean annotation below to enable data seeding
    //@Bean
    public CommandLineRunner seedData() {
        return args -> {
            // Check if data already exists
            if (userRepo.count() > 0) {
                System.out.println("Database already contains data. Skipping seed.");
                return;
            }

            System.out.println("Starting database seeding...");

            // 1. Seed Users
            List<UserEnitiy> users = seedUsers();
            System.out.println("✓ Seeded " + users.size() + " users");

            // 2. Seed Customers
            List<Customer> customers = seedCustomers(users);
            System.out.println("✓ Seeded " + customers.size() + " customers");

            // 3. Seed Staff
            seedStaff(users);
            System.out.println("✓ Seeded staff members");

            // 4. Seed Categories
            List<Category> categories = seedCategories();
            System.out.println("✓ Seeded " + categories.size() + " categories");

            // 5. Seed Menu Items
            List<MenuItem> menuItems = seedMenuItems(categories);
            System.out.println("✓ Seeded " + menuItems.size() + " menu items");

            // 6. Seed Restaurant Tables
            List<RestaurantTable> tables = seedRestaurantTables();
            System.out.println("✓ Seeded " + tables.size() + " restaurant tables");

            // 7. Seed Bookings
            List<Booking> bookings = seedBookings(customers, tables);
            System.out.println("✓ Seeded " + bookings.size() + " bookings");

            // 8. Seed Food Orders
            List<FoodOrder> foodOrders = seedFoodOrders(bookings, customers);
            System.out.println("✓ Seeded " + foodOrders.size() + " food orders");

            // 9. Seed Order Items
            seedOrderItems(foodOrders, menuItems);
            System.out.println("✓ Seeded order items");

            // 10. Seed Payment Transactions
            seedPaymentTransactions(foodOrders, bookings);
            System.out.println("✓ Seeded payment transactions");

            // 11. Seed Menu Price History
            seedMenuPriceHistory(menuItems);
            System.out.println("✓ Seeded menu price history");

            System.out.println("Database seeding completed successfully!");
        };
    }

    private List<UserEnitiy> seedUsers() {
        List<UserEnitiy> users = new ArrayList<>();
        String defaultPassword = passwordEncoder.encode("password123");

        // Admin
        users.add(createUser("admin", "admin@coffeehub.com", defaultPassword, Role.ADMIN));

        // Customers
        users.add(createUser("john_doe", "john.doe@email.com", defaultPassword, Role.CUSTOMER));
        users.add(createUser("jane_smith", "jane.smith@email.com", defaultPassword, Role.CUSTOMER));
        users.add(createUser("mike_wilson", "mike.wilson@email.com", defaultPassword, Role.CUSTOMER));
        users.add(createUser("sarah_jones", "sarah.jones@email.com", defaultPassword, Role.CUSTOMER));
        users.add(createUser("david_brown", "david.brown@email.com", defaultPassword, Role.CUSTOMER));

        // Chefs
        users.add(createUser("chef_mario", "chef.mario@coffeehub.com", defaultPassword, Role.CHEF));
        users.add(createUser("chef_luigi", "chef.luigi@coffeehub.com", defaultPassword, Role.CHEF));

        // Waiters
        users.add(createUser("waiter_alice", "waiter.alice@coffeehub.com", defaultPassword, Role.WAITER));
        users.add(createUser("waiter_bob", "waiter.bob@coffeehub.com", defaultPassword, Role.WAITER));
        users.add(createUser("waiter_carol", "waiter.carol@coffeehub.com", defaultPassword, Role.WAITER));

        return userRepo.saveAll(users);
    }

    private UserEnitiy createUser(String username, String email, String password, Role role) {
        UserEnitiy user = new UserEnitiy();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    private List<Customer> seedCustomers(List<UserEnitiy> users) {
        List<Customer> customers = new ArrayList<>();

        customers.add(Customer.builder()
                .user(users.get(1)) // john_doe
                .firstName("John")
                .lastName("Doe")
                .contactNumber("+1-555-0101")
                .email("john.doe@email.com")
                .address("123 Main Street, City, State 12345")
                .loyaltyPoints(150)
                .preferredTable(5)
                .username("john_doe")
                .createdAt(Instant.now())
                .build());

        customers.add(Customer.builder()
                .user(users.get(2)) // jane_smith
                .firstName("Jane")
                .lastName("Smith")
                .contactNumber("+1-555-0102")
                .email("jane.smith@email.com")
                .address("456 Oak Avenue, City, State 12345")
                .loyaltyPoints(75)
                .preferredTable(8)
                .username("jane_smith")
                .createdAt(Instant.now())
                .build());

        customers.add(Customer.builder()
                .user(users.get(3)) // mike_wilson
                .firstName("Mike")
                .lastName("Wilson")
                .contactNumber("+1-555-0103")
                .email("mike.wilson@email.com")
                .address("789 Pine Road, City, State 12345")
                .loyaltyPoints(200)
                .preferredTable(3)
                .username("mike_wilson")
                .createdAt(Instant.now())
                .build());

        customers.add(Customer.builder()
                .user(users.get(4)) // sarah_jones
                .firstName("Sarah")
                .lastName("Jones")
                .contactNumber("+1-555-0104")
                .email("sarah.jones@email.com")
                .address("321 Elm Street, City, State 12345")
                .loyaltyPoints(50)
                .preferredTable(12)
                .username("sarah_jones")
                .createdAt(Instant.now())
                .build());

        customers.add(Customer.builder()
                .user(users.get(5)) // david_brown
                .firstName("David")
                .lastName("Brown")
                .contactNumber("+1-555-0105")
                .email("david.brown@email.com")
                .address("654 Maple Drive, City, State 12345")
                .loyaltyPoints(300)
                .preferredTable(7)
                .username("david_brown")
                .createdAt(Instant.now())
                .build());

        return customerRepository.saveAll(customers);
    }

    private void seedStaff(List<UserEnitiy> users) {
        List<Staff> staffList = new ArrayList<>();

        staffList.add(Staff.builder()
                .userId(users.get(6).getId()) // chef_mario
                .firstName("Mario")
                .lastName("Rossi")
                .staffType("CHEF")
                .contactNumber("+1-555-0201")
                .shiftStart(LocalTime.of(8, 0))
                .shiftEnd(LocalTime.of(16, 0))
                .experienceYears(10)
                .build());

        staffList.add(Staff.builder()
                .userId(users.get(7).getId()) // chef_luigi
                .firstName("Luigi")
                .lastName("Verdi")
                .staffType("CHEF")
                .contactNumber("+1-555-0202")
                .shiftStart(LocalTime.of(16, 0))
                .shiftEnd(LocalTime.of(0, 0))
                .experienceYears(8)
                .build());

        staffList.add(Staff.builder()
                .userId(users.get(8).getId()) // waiter_alice
                .firstName("Alice")
                .lastName("Johnson")
                .staffType("WAITER")
                .contactNumber("+1-555-0203")
                .shiftStart(LocalTime.of(9, 0))
                .shiftEnd(LocalTime.of(17, 0))
                .experienceYears(3)
                .build());

        staffList.add(Staff.builder()
                .userId(users.get(9).getId()) // waiter_bob
                .firstName("Bob")
                .lastName("Williams")
                .staffType("WAITER")
                .contactNumber("+1-555-0204")
                .shiftStart(LocalTime.of(17, 0))
                .shiftEnd(LocalTime.of(1, 0))
                .experienceYears(5)
                .build());

        staffList.add(Staff.builder()
                .userId(users.get(10).getId()) // waiter_carol
                .firstName("Carol")
                .lastName("Davis")
                .staffType("WAITER")
                .contactNumber("+1-555-0205")
                .shiftStart(LocalTime.of(10, 0))
                .shiftEnd(LocalTime.of(18, 0))
                .experienceYears(2)
                .build());

        // Note: You'll need to inject StaffRepository if it exists
        // staffRepository.saveAll(staffList);
    }

    private List<Category> seedCategories() {
        List<Category> categories = new ArrayList<>();

        categories.add(Category.builder().name("Hot Coffee").build());
        categories.add(Category.builder().name("Cold Coffee").build());
        categories.add(Category.builder().name("Tea").build());
        categories.add(Category.builder().name("Pastries").build());
        categories.add(Category.builder().name("Sandwiches").build());
        categories.add(Category.builder().name("Desserts").build());
        categories.add(Category.builder().name("Beverages").build());

        return categoryRepository.saveAll(categories);
    }

    private List<MenuItem> seedMenuItems(List<Category> categories) {
        List<MenuItem> menuItems = new ArrayList<>();
        Category hotCoffee = categories.get(0);
        Category coldCoffee = categories.get(1);
        Category tea = categories.get(2);
        Category pastries = categories.get(3);
        Category sandwiches = categories.get(4);
        Category desserts = categories.get(5);
        Category beverages = categories.get(6);

        // Hot Coffee
        menuItems.add(createMenuItem("Espresso", "Strong, concentrated coffee shot", hotCoffee, 3.50, "COFF-001"));
        menuItems.add(createMenuItem("Americano", "Espresso with hot water", hotCoffee, 4.00, "COFF-002"));
        menuItems.add(createMenuItem("Cappuccino", "Espresso with steamed milk and foam", hotCoffee, 4.50, "COFF-003"));
        menuItems.add(createMenuItem("Latte", "Espresso with steamed milk", hotCoffee, 5.00, "COFF-004"));
        menuItems.add(createMenuItem("Mocha", "Espresso with chocolate and steamed milk", hotCoffee, 5.50, "COFF-005"));
        menuItems.add(createMenuItem("Macchiato", "Espresso with a dollop of foam", hotCoffee, 4.25, "COFF-006"));

        // Cold Coffee
        menuItems.add(createMenuItem("Iced Americano", "Espresso with cold water and ice", coldCoffee, 4.50, "COFF-007"));
        menuItems.add(createMenuItem("Iced Latte", "Espresso with cold milk and ice", coldCoffee, 5.50, "COFF-008"));
        menuItems.add(createMenuItem("Cold Brew", "Slow-steeped coffee, smooth and refreshing", coldCoffee, 5.00, "COFF-009"));
        menuItems.add(createMenuItem("Frappuccino", "Blended coffee drink with ice", coldCoffee, 6.00, "COFF-010"));

        // Tea
        menuItems.add(createMenuItem("Green Tea", "Premium green tea leaves", tea, 3.00, "TEA-001"));
        menuItems.add(createMenuItem("Black Tea", "Classic black tea", tea, 3.00, "TEA-002"));
        menuItems.add(createMenuItem("Chai Latte", "Spiced tea with steamed milk", tea, 4.50, "TEA-003"));
        menuItems.add(createMenuItem("Herbal Tea", "Assorted herbal tea selection", tea, 3.50, "TEA-004"));

        // Pastries
        menuItems.add(createMenuItem("Croissant", "Buttery, flaky French pastry", pastries, 3.50, "PAST-001"));
        menuItems.add(createMenuItem("Blueberry Muffin", "Fresh blueberries in a soft muffin", pastries, 4.00, "PAST-002"));
        menuItems.add(createMenuItem("Chocolate Chip Cookie", "Classic cookie with chocolate chips", pastries, 2.50, "PAST-003"));
        menuItems.add(createMenuItem("Danish Pastry", "Sweet pastry with fruit filling", pastries, 4.50, "PAST-004"));

        // Sandwiches
        menuItems.add(createMenuItem("Ham & Cheese Sandwich", "Sliced ham and cheese on fresh bread", sandwiches, 7.50, "SAND-001"));
        menuItems.add(createMenuItem("Turkey Club", "Turkey, bacon, lettuce, and tomato", sandwiches, 8.50, "SAND-002"));
        menuItems.add(createMenuItem("Veggie Wrap", "Fresh vegetables in a tortilla wrap", sandwiches, 7.00, "SAND-003"));
        menuItems.add(createMenuItem("Grilled Cheese", "Melted cheese on toasted bread", sandwiches, 6.50, "SAND-004"));

        // Desserts
        menuItems.add(createMenuItem("Chocolate Cake", "Rich chocolate layer cake", desserts, 6.00, "DESS-001"));
        menuItems.add(createMenuItem("Cheesecake", "Creamy New York style cheesecake", desserts, 6.50, "DESS-002"));
        menuItems.add(createMenuItem("Tiramisu", "Classic Italian dessert", desserts, 7.00, "DESS-003"));
        menuItems.add(createMenuItem("Brownie", "Fudgy chocolate brownie", desserts, 4.50, "DESS-004"));

        // Beverages
        menuItems.add(createMenuItem("Orange Juice", "Fresh squeezed orange juice", beverages, 3.50, "BEV-001"));
        menuItems.add(createMenuItem("Apple Juice", "Crisp apple juice", beverages, 3.50, "BEV-002"));
        menuItems.add(createMenuItem("Sparkling Water", "Refreshing carbonated water", beverages, 2.50, "BEV-003"));
        menuItems.add(createMenuItem("Hot Chocolate", "Rich, creamy hot chocolate", beverages, 4.00, "BEV-004"));

        return menuItemRepository.saveAll(menuItems);
    }

    private MenuItem createMenuItem(String name, String description, Category category, double price, String sku) {
        MenuItem item = MenuItem.builder()
                .name(name)
                .description(description)
                .category(category)
                .currentPrice(BigDecimal.valueOf(price))
                .price(BigDecimal.valueOf(price))
                .isAvailable(true)
                .sku(sku)
                .imageUrl("/images/" + name.toLowerCase().replace(" ", "-") + ".jpg")
                .build();
        return item;
    }

    private List<RestaurantTable> seedRestaurantTables() {
        List<RestaurantTable> tables = new ArrayList<>();

        // Window tables
        tables.add(createTable(1, 2, "Window", "REGULAR"));
        tables.add(createTable(2, 2, "Window", "REGULAR"));
        tables.add(createTable(15, 4, "Window", "REGULAR"));

        // Main Hall tables
        tables.add(createTable(3, 4, "Main Hall", "REGULAR"));
        tables.add(createTable(4, 4, "Main Hall", "REGULAR"));
        tables.add(createTable(5, 4, "Main Hall", "REGULAR"));
        tables.add(createTable(6, 6, "Main Hall", "REGULAR"));
        tables.add(createTable(14, 6, "Main Hall", "REGULAR"));

        // Corner tables
        tables.add(createTable(7, 2, "Corner", "REGULAR"));
        tables.add(createTable(8, 4, "Corner", "REGULAR"));

        // VIP tables
        tables.add(createTable(9, 8, "Private Room", "VIP"));
        tables.add(createTable(10, 8, "Private Room", "VIP"));

        // Outdoor tables
        tables.add(createTable(11, 4, "Outdoor", "OUTDOOR"));
        tables.add(createTable(12, 4, "Outdoor", "OUTDOOR"));
        tables.add(createTable(13, 2, "Outdoor", "OUTDOOR"));

        return restaurantTableRepository.saveAll(tables);
    }

    private RestaurantTable createTable(int tableNumber, int capacity, String zone, String type) {
        return RestaurantTable.builder()
                .tableNumber(tableNumber)
                .seatingCapacity(capacity)
                .locationZone(zone)
                .isAvailable(true)
                .tableType(type)
                .build();
    }

    private List<Booking> seedBookings(List<Customer> customers, List<RestaurantTable> tables) {
        List<Booking> bookings = new ArrayList<>();

        bookings.add(Booking.builder()
                .customerId(customers.get(0).getId())
                .tableId(tables.get(4).getId()) // Table 5
                .bookingDatetime(LocalDateTime.now().plusDays(1))
                .durationHours(2)
                .partySize(3)
                .status("CONFIRMED")
                .specialRequests("Window seat preferred")
                .bookingFee(BigDecimal.valueOf(5.00))
                .createdAt(Instant.now())
                .build());

        bookings.add(Booking.builder()
                .customerId(customers.get(1).getId())
                .tableId(tables.get(7).getId()) // Table 8
                .bookingDatetime(LocalDateTime.now().plusDays(2))
                .durationHours(1)
                .partySize(2)
                .status("CONFIRMED")
                .bookingFee(BigDecimal.valueOf(5.00))
                .createdAt(Instant.now())
                .build());

        bookings.add(Booking.builder()
                .customerId(customers.get(2).getId())
                .tableId(tables.get(2).getId()) // Table 3
                .bookingDatetime(LocalDateTime.now().plusDays(3))
                .durationHours(3)
                .partySize(4)
                .status("CONFIRMED")
                .specialRequests("Birthday celebration")
                .bookingFee(BigDecimal.valueOf(10.00))
                .createdAt(Instant.now())
                .build());

        bookings.add(Booking.builder()
                .customerId(customers.get(3).getId())
                .tableId(tables.get(11).getId()) // Table 12
                .bookingDatetime(LocalDateTime.now().plusDays(1))
                .durationHours(2)
                .partySize(2)
                .status("CONFIRMED")
                .specialRequests("Outdoor seating")
                .bookingFee(BigDecimal.valueOf(5.00))
                .createdAt(Instant.now())
                .build());

        bookings.add(Booking.builder()
                .customerId(customers.get(4).getId())
                .tableId(tables.get(8).getId()) // Table 9
                .bookingDatetime(LocalDateTime.now().plusDays(4))
                .durationHours(4)
                .partySize(6)
                .status("CONFIRMED")
                .specialRequests("Business meeting")
                .bookingFee(BigDecimal.valueOf(15.00))
                .createdAt(Instant.now())
                .build());

        // Past bookings
        bookings.add(Booking.builder()
                .customerId(customers.get(0).getId())
                .tableId(tables.get(6).getId()) // Table 7
                .bookingDatetime(LocalDateTime.now().minusDays(1))
                .durationHours(2)
                .partySize(2)
                .status("COMPLETED")
                .bookingFee(BigDecimal.valueOf(5.00))
                .createdAt(Instant.now().minusSeconds(172800))
                .build());

        bookings.add(Booking.builder()
                .customerId(customers.get(1).getId())
                .tableId(tables.get(10).getId()) // Table 11
                .bookingDatetime(LocalDateTime.now().minusDays(2))
                .durationHours(1)
                .partySize(2)
                .status("COMPLETED")
                .bookingFee(BigDecimal.valueOf(5.00))
                .createdAt(Instant.now().minusSeconds(259200))
                .build());

        return bookingRepository.saveAll(bookings);
    }

    private List<FoodOrder> seedFoodOrders(List<Booking> bookings, List<Customer> customers) {
        List<FoodOrder> foodOrders = new ArrayList<>();

        foodOrders.add(FoodOrder.builder()
                .booking(bookings.get(0))
                .placedBy("john_doe")
                .placedAt(LocalDateTime.now().minusHours(1))
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.valueOf(15.50))
                .notes("Extra hot please")
                .isPaid(false)
                .build());

        foodOrders.add(FoodOrder.builder()
                .booking(bookings.get(1))
                .placedBy("jane_smith")
                .placedAt(LocalDateTime.now().minusHours(2))
                .status(OrderStatus.IN_PREPARATION)
                .totalAmount(BigDecimal.valueOf(22.00))
                .isPaid(true)
                .paymentId("pay_123456789")
                .build());

        foodOrders.add(FoodOrder.builder()
                .booking(bookings.get(2))
                .placedBy("mike_wilson")
                .placedAt(LocalDateTime.now().minusMinutes(30))
                .status(OrderStatus.READY_TO_SERVE)
                .totalAmount(BigDecimal.valueOf(35.75))
                .notes("No onions")
                .isPaid(true)
                .paymentId("pay_987654321")
                .build());

        foodOrders.add(FoodOrder.builder()
                .booking(bookings.get(5))
                .placedBy("john_doe")
                .placedAt(LocalDateTime.now().minusDays(1))
                .status(OrderStatus.SERVED)
                .totalAmount(BigDecimal.valueOf(18.50))
                .isPaid(true)
                .paymentId("pay_111222333")
                .build());

        foodOrders.add(FoodOrder.builder()
                .booking(bookings.get(6))
                .placedBy("jane_smith")
                .placedAt(LocalDateTime.now().minusDays(2))
                .status(OrderStatus.SERVED)
                .totalAmount(BigDecimal.valueOf(12.00))
                .isPaid(true)
                .paymentId("pay_444555666")
                .build());

        return foodOrderRepository.saveAll(foodOrders);
    }

    private void seedOrderItems(List<FoodOrder> foodOrders, List<MenuItem> menuItems) {
        List<OrderItem> orderItems = new ArrayList<>();

        // Order 1: 2x Latte, 1x Croissant
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(0))
                .menuItem(menuItems.get(3)) // Latte
                .quantity(2)
                .specialRequest("Extra hot")
                .price(BigDecimal.valueOf(5.00))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(0))
                .menuItem(menuItems.get(14)) // Croissant
                .quantity(1)
                .price(BigDecimal.valueOf(3.50))
                .build());

        // Order 2: 2x Cappuccino, 2x Blueberry Muffin, 1x Green Tea
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(1))
                .menuItem(menuItems.get(2)) // Cappuccino
                .quantity(2)
                .price(BigDecimal.valueOf(4.50))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(1))
                .menuItem(menuItems.get(15)) // Blueberry Muffin
                .quantity(2)
                .price(BigDecimal.valueOf(4.00))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(1))
                .menuItem(menuItems.get(10)) // Green Tea
                .quantity(1)
                .price(BigDecimal.valueOf(3.00))
                .build());

        // Order 3: 2x Mocha, 2x Ham & Cheese, 1x Chocolate Cake
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(2))
                .menuItem(menuItems.get(4)) // Mocha
                .quantity(2)
                .price(BigDecimal.valueOf(5.50))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(2))
                .menuItem(menuItems.get(18)) // Ham & Cheese
                .quantity(2)
                .specialRequest("No onions")
                .price(BigDecimal.valueOf(7.50))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(2))
                .menuItem(menuItems.get(22)) // Chocolate Cake
                .quantity(1)
                .price(BigDecimal.valueOf(6.00))
                .build());

        // Order 4: 1x Espresso, 1x Iced Latte, 1x Turkey Club
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(3))
                .menuItem(menuItems.get(0)) // Espresso
                .quantity(1)
                .price(BigDecimal.valueOf(3.50))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(3))
                .menuItem(menuItems.get(7)) // Iced Latte
                .quantity(1)
                .price(BigDecimal.valueOf(5.50))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(3))
                .menuItem(menuItems.get(19)) // Turkey Club
                .quantity(1)
                .price(BigDecimal.valueOf(8.50))
                .build());

        // Order 5: 2x Iced Americano, 2x Chocolate Chip Cookie
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(4))
                .menuItem(menuItems.get(6)) // Iced Americano
                .quantity(2)
                .price(BigDecimal.valueOf(4.50))
                .build());
        orderItems.add(OrderItem.builder()
                .order(foodOrders.get(4))
                .menuItem(menuItems.get(16)) // Chocolate Chip Cookie
                .quantity(2)
                .price(BigDecimal.valueOf(2.50))
                .build());

        orderItemRepository.saveAll(orderItems);
    }

    private void seedPaymentTransactions(List<FoodOrder> foodOrders, List<Booking> bookings) {
        List<PaymentTransaction> transactions = new ArrayList<>();

        transactions.add(PaymentTransaction.builder()
                .provider("STRIPE")
                .providerPaymentId("pay_123456789")
                .amount(BigDecimal.valueOf(22.00))
                .currency("INR")
                .status("COMPLETED")
                .type("ORDER_PAYMENT")
                .metadata("{\"orderId\": 2, \"customerId\": 2}")
                .clientSecret("pi_123456789_secret_xyz")
                .createdAt(LocalDateTime.now().minusHours(2))
                .updatedAt(LocalDateTime.now().minusHours(2))
                .build());

        transactions.add(PaymentTransaction.builder()
                .provider("STRIPE")
                .providerPaymentId("pay_987654321")
                .amount(BigDecimal.valueOf(35.75))
                .currency("INR")
                .status("COMPLETED")
                .type("ORDER_PAYMENT")
                .metadata("{\"orderId\": 3, \"customerId\": 3}")
                .clientSecret("pi_987654321_secret_abc")
                .createdAt(LocalDateTime.now().minusMinutes(30))
                .updatedAt(LocalDateTime.now().minusMinutes(30))
                .build());

        transactions.add(PaymentTransaction.builder()
                .provider("STRIPE")
                .providerPaymentId("pay_111222333")
                .amount(BigDecimal.valueOf(18.50))
                .currency("INR")
                .status("COMPLETED")
                .type("ORDER_PAYMENT")
                .metadata("{\"orderId\": 4, \"customerId\": 1}")
                .clientSecret("pi_111222333_secret_def")
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        transactions.add(PaymentTransaction.builder()
                .provider("STRIPE")
                .providerPaymentId("pay_444555666")
                .amount(BigDecimal.valueOf(12.00))
                .currency("INR")
                .status("COMPLETED")
                .type("ORDER_PAYMENT")
                .metadata("{\"orderId\": 5, \"customerId\": 2}")
                .clientSecret("pi_444555666_secret_ghi")
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        transactions.add(PaymentTransaction.builder()
                .provider("STRIPE")
                .providerPaymentId("pay_booking_001")
                .amount(BigDecimal.valueOf(5.00))
                .currency("INR")
                .status("COMPLETED")
                .type("BOOKING_FEE")
                .metadata("{\"bookingId\": 1, \"customerId\": 1}")
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        transactions.add(PaymentTransaction.builder()
                .provider("STRIPE")
                .providerPaymentId("pay_booking_002")
                .amount(BigDecimal.valueOf(5.00))
                .currency("INR")
                .status("COMPLETED")
                .type("BOOKING_FEE")
                .metadata("{\"bookingId\": 2, \"customerId\": 2}")
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        paymentTransactionRepository.saveAll(transactions);
    }

    private void seedMenuPriceHistory(List<MenuItem> menuItems) {
        List<MenuPriceHistory> priceHistory = new ArrayList<>();

        // Espresso price history
        MenuItem espresso = menuItems.get(0);
        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(espresso)
                .price(BigDecimal.valueOf(3.00))
                .effectiveFrom(LocalDateTime.now().minusDays(30))
                .effectiveTo(LocalDateTime.now().minusDays(10))
                .createdAt(LocalDateTime.now().minusDays(30))
                .build());

        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(espresso)
                .price(BigDecimal.valueOf(3.25))
                .effectiveFrom(LocalDateTime.now().minusDays(10))
                .effectiveTo(LocalDateTime.now().minusDays(5))
                .createdAt(LocalDateTime.now().minusDays(10))
                .build());

        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(espresso)
                .price(BigDecimal.valueOf(3.50))
                .effectiveFrom(LocalDateTime.now().minusDays(5))
                .effectiveTo(null)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build());

        // Latte price history
        MenuItem latte = menuItems.get(3);
        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(latte)
                .price(BigDecimal.valueOf(4.50))
                .effectiveFrom(LocalDateTime.now().minusDays(20))
                .effectiveTo(LocalDateTime.now().minusDays(7))
                .createdAt(LocalDateTime.now().minusDays(20))
                .build());

        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(latte)
                .price(BigDecimal.valueOf(5.00))
                .effectiveFrom(LocalDateTime.now().minusDays(7))
                .effectiveTo(null)
                .createdAt(LocalDateTime.now().minusDays(7))
                .build());

        // Mocha price history
        MenuItem mocha = menuItems.get(4);
        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(mocha)
                .price(BigDecimal.valueOf(5.00))
                .effectiveFrom(LocalDateTime.now().minusDays(15))
                .effectiveTo(LocalDateTime.now().minusDays(3))
                .createdAt(LocalDateTime.now().minusDays(15))
                .build());

        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(mocha)
                .price(BigDecimal.valueOf(5.50))
                .effectiveFrom(LocalDateTime.now().minusDays(3))
                .effectiveTo(null)
                .createdAt(LocalDateTime.now().minusDays(3))
                .build());

        // Croissant price history
        MenuItem croissant = menuItems.get(14);
        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(croissant)
                .price(BigDecimal.valueOf(3.00))
                .effectiveFrom(LocalDateTime.now().minusDays(25))
                .effectiveTo(LocalDateTime.now().minusDays(12))
                .createdAt(LocalDateTime.now().minusDays(25))
                .build());

        priceHistory.add(MenuPriceHistory.builder()
                .menuItem(croissant)
                .price(BigDecimal.valueOf(3.50))
                .effectiveFrom(LocalDateTime.now().minusDays(12))
                .effectiveTo(null)
                .createdAt(LocalDateTime.now().minusDays(12))
                .build());

        menuPriceHistoryRepository.saveAll(priceHistory);
    }
}

