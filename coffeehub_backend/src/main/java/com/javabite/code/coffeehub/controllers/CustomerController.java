package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.dto.CustomerDto;
import com.javabite.code.coffeehub.entity.Customer;
import com.javabite.code.coffeehub.entity.UserEnitiy; // your user entity package
import com.javabite.code.coffeehub.repo.UserRepo;
import com.javabite.code.coffeehub.service.CustomerService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {
    private final CustomerService service;
    private final UserRepo userRepo;
    public CustomerController(CustomerService service, UserRepo userRepo){
        this.service = service; this.userRepo = userRepo;
    }

    // Get my profile
    @GetMapping("/me")
    public ResponseEntity<CustomerDto> me(Authentication auth){
        String email = auth.getName();
        UserEnitiy u = userRepo.findByEmail(email).orElseThrow();
        CustomerDto dto = service.getByUserId(u.getId());
        return ResponseEntity.ok(dto);
    }

    // Create/update profile for logged-in user
    @PutMapping("/me")
    public ResponseEntity<CustomerDto> updateMe(Authentication auth, @RequestBody CustomerDto dto){
        String email = auth.getName();
        UserEnitiy u = userRepo.findByEmail(email).orElseThrow();
        dto.setUserId(u.getId());
        CustomerDto saved = service.createOrUpdate(dto);
        return ResponseEntity.ok(saved);
    }
}
