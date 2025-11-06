package com.javabite.code.coffeehub.service;
import com.javabite.code.coffeehub.dto.CustomerDto;
import com.javabite.code.coffeehub.entity.Customer;
import com.javabite.code.coffeehub.entity.UserEnitiy;
import com.javabite.code.coffeehub.repo.CustomerRepository;
import com.javabite.code.coffeehub.repo.UserRepo;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CustomerService {
    private final CustomerRepository repo;
    private final UserRepo userRepo; // ✅ to fetch UserEnitiy by id

    public CustomerService(CustomerRepository repo, UserRepo userRepo){ this.repo = repo;
    this.userRepo=userRepo;}

    public CustomerDto getByUserId(Long userId){
        Optional<Customer> c = repo.findByUserId(userId);
        return c.map(this::toDto).orElse(null);
    }

    public CustomerDto createOrUpdate(CustomerDto dto) {
        // find existing or create new
        Customer c = repo.findByUserId(dto.getUserId())
                .orElseGet(() -> {
                    // fetch the UserEnitiy for this userId
                    UserEnitiy user = userRepo.findById(dto.getUserId())
                            .orElseThrow(() -> new RuntimeException("User not found with id " + dto.getUserId()));
                    return Customer.builder()
                            .user(user) // ✅ set UserEnitiy, not just id
                            .build();
                });

        // update profile fields
        c.setFirstName(dto.getFirstName());
        c.setLastName(dto.getLastName());
        c.setContactNumber(dto.getContactNumber());
        c.setEmail(dto.getEmail());
        c.setAddress(dto.getAddress());
        c.setLoyaltyPoints(dto.getLoyaltyPoints() == null ? 0 : dto.getLoyaltyPoints());
        c.setPreferredTable(dto.getPreferredTable());

        c = repo.save(c);
        return toDto(c);
    }

    private CustomerDto toDto(Customer c) {
        CustomerDto d = new CustomerDto();
        d.setUserId(c.getUser().getId()); // ✅ extract id from UserEnitiy
        d.setFirstName(c.getFirstName());
        d.setLastName(c.getLastName());
        d.setContactNumber(c.getContactNumber());
        d.setEmail(c.getEmail());
        d.setAddress(c.getAddress());
        d.setLoyaltyPoints(c.getLoyaltyPoints());
        d.setPreferredTable(c.getPreferredTable());
        d.setUserName(c.getUsername());
        return d;
    }
}
