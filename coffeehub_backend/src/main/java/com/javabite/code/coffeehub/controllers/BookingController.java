package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.dto.BookingRequestDto;
import com.javabite.code.coffeehub.entity.Booking;
import com.javabite.code.coffeehub.entity.Customer;
import com.javabite.code.coffeehub.entity.UserEnitiy;
import com.javabite.code.coffeehub.repo.CustomerRepository;
import com.javabite.code.coffeehub.repo.UserRepo;
import com.javabite.code.coffeehub.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {
    private final BookingService bookingService;
    private final UserRepo userRepo;
    private final CustomerRepository customerRepo;
    public BookingController(BookingService bookingService, UserRepo userRepo,CustomerRepository customerRepo){
        this.bookingService = bookingService; this.userRepo = userRepo;this.customerRepo=customerRepo;
    }

    // availability check: provide start & end as ISO datetime query params
    @GetMapping("/availability")
    public ResponseEntity<List<com.javabite.code.coffeehub.entity.RestaurantTable>> availability(
            @RequestParam String start, @RequestParam String end){
        LocalDateTime s = LocalDateTime.parse(start);
        LocalDateTime e = LocalDateTime.parse(end);
        return ResponseEntity.ok(bookingService.availableTables(s, e));
    }

    // create booking
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/book")
    public ResponseEntity<Booking> create(Authentication auth, @RequestBody BookingRequestDto req){
        String email = auth.getName();
        UserEnitiy u = userRepo.findByEmail(email).orElseThrow();
        Booking b = Booking.builder()
                .tableId(req.getTableId())
                .bookingDatetime(req.getBookingDatetime())
                .durationHours(req.getDurationHours())
                .partySize(req.getPartySize())
                .specialRequests(req.getSpecialRequests())

                .build();
        Booking saved = bookingService.createBooking(u.getId(), b);
        return ResponseEntity.ok(saved);
    }

    // get my bookings
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<List<Booking>> myBookings(Authentication auth) {
        String email = auth.getName();

        // find logged-in user
        UserEnitiy u = userRepo.findByEmail(email).orElseThrow();

        // fetch customer mapped to this user
        Customer customer = customerRepo.findByUser(u)
                .orElseThrow(() -> new RuntimeException("Customer not found for user"));

        // pass the customer id (not user id)
        List<Booking> bookings = bookingService.bookingsForCustomer(customer.getId());

        return ResponseEntity.ok(bookings);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(Authentication auth, @PathVariable Long id){
        String email = auth.getName();
        UserEnitiy u = userRepo.findByEmail(email).orElseThrow();
        Booking b = bookingService.cancelBooking(u.getId(), id);
        return ResponseEntity.ok(b);
    }
}
