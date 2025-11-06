package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.entity.MenuItem;
import com.javabite.code.coffeehub.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;


    @GetMapping
    public ResponseEntity<Page<MenuItem>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(menuService.listAll(q, category, PageRequest.of(page, size)));
    }



    @PreAuthorize("hasAnyRole('ADMIN','CHEF')") // Admin and Chef can create
    @PostMapping
    public ResponseEntity<MenuItem> create(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuService.create(menuItem));
    }


    @PreAuthorize("hasAnyRole('ADMIN','CHEF')") // Admin and Chef can update
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> update(
            @PathVariable Long id,
            @RequestBody MenuItem updatedMenuItem
    ) {
        return ResponseEntity.ok(menuService.update(id, updatedMenuItem));
    }

//    // ✅ Update only price (you already had this)
//    @PutMapping("/price/{id}")
//    public ResponseEntity<MenuItem> updatePrice(
//            @PathVariable Long id,
//            @RequestParam BigDecimal price
//    ) {
//        return ResponseEntity.ok(menuService.updatePrice(id, price));
//    }

    @PreAuthorize("hasAnyRole('ADMIN','CHEF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
