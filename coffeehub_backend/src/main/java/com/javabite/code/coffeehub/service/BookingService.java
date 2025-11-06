package com.javabite.code.coffeehub.service;
import com.javabite.code.coffeehub.entity.Booking;
import com.javabite.code.coffeehub.exp.TableCapacityExceededException;
import com.javabite.code.coffeehub.repo.BookingRepository;
import com.javabite.code.coffeehub.repo.RestaurantTableRepository;
import com.javabite.code.coffeehub.repo.CustomerRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepo;
    private final RestaurantTableRepository tableRepo;
    private final CustomerRepository customerRepo;

    public BookingService(BookingRepository bookingRepo,
                          RestaurantTableRepository tableRepo,
                          CustomerRepository customerRepo){
        this.bookingRepo = bookingRepo;
        this.tableRepo = tableRepo;
        this.customerRepo = customerRepo;
    }

    public List<Booking> bookingsForCustomer(Long customerId){
        return bookingRepo.findByCustomerIdOrderByBookingDatetimeDesc(customerId);
    }

    public List<com.javabite.code.coffeehub.entity.RestaurantTable> availableTables(LocalDateTime start, LocalDateTime end){
        List<com.javabite.code.coffeehub.entity.RestaurantTable> tables = tableRepo.findAll();
        return tables.stream().filter(t -> {
            // Check if any booking overlaps this table in [start,end)
            List<Booking> overlapping = bookingRepo.findByTableIdAndBookingDatetimeBetween(
                    t.getId(), start.minusDays(1), end.plusDays(1)
            );
            // safer overlap check in Java:
            boolean hasOverlap = overlapping.stream().anyMatch(b -> {
                LocalDateTime existingStart = b.getBookingDatetime();
                LocalDateTime existingEnd = existingStart.plusHours(b.getDurationHours());
                return start.isBefore(existingEnd) && end.isAfter(existingStart);
            });
            return !hasOverlap && Boolean.TRUE.equals(t.getIsAvailable());
        }).toList();
    }

    public Booking createBooking(Long userId, Booking request) {
        // Resolve customer id from userId
        var cust = customerRepo.findByUserId(userId).orElseThrow(() -> new RuntimeException("Customer profile not found"));
        // validate table exists
        var table = tableRepo.findById(request.getTableId()).orElseThrow(() -> new RuntimeException("Table not found"));

        LocalDateTime start = request.getBookingDatetime();
        LocalDateTime end = start.plusHours(request.getDurationHours());

        // check capacity
        if(request.getPartySize() != null && request.getPartySize() > table.getSeatingCapacity()){

                throw new TableCapacityExceededException("Party size exceeds table capacity for table " + table.getId());


        }

        // check overlap using repository
        List<Booking> overlapping = bookingRepo.findByTableIdAndBookingDatetimeBetween(table.getId(), start.minusDays(1), end.plusDays(1));
        boolean hasOverlap = overlapping.stream().anyMatch(b -> {
            LocalDateTime s = b.getBookingDatetime();
            LocalDateTime e = s.plusHours(b.getDurationHours());
            return start.isBefore(e) && end.isAfter(s);
        });
        if(hasOverlap) throw new RuntimeException("Table already booked for selected slot");

        request.setCustomerId(cust.getId());
        request.setStatus("CONFIRMED");
        return bookingRepo.save(request);
    }

    public Booking cancelBooking(Long userId, Long bookingId){
        Booking b = bookingRepo.findById(bookingId).orElseThrow();
        var cust = customerRepo.findByUserId(userId).orElseThrow();
        if(!b.getCustomerId().equals(cust.getId())) throw new RuntimeException("Forbidden");
        b.setStatus("CANCELLED");
        return bookingRepo.save(b);
    }
}
