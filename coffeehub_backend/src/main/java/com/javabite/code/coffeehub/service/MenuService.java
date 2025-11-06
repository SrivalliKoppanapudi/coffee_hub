package com.javabite.code.coffeehub.service;

import com.javabite.code.coffeehub.entity.Category;
import com.javabite.code.coffeehub.entity.MenuItem;
import com.javabite.code.coffeehub.entity.MenuPriceHistory;
import com.javabite.code.coffeehub.repo.CategoryRepository;
import com.javabite.code.coffeehub.repo.MenuItemRepository;
import com.javabite.code.coffeehub.repo.MenuPriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuPriceHistoryRepository menuPriceHistoryRepository;

    private final CategoryRepository categoryRepository;

    public Page<MenuItem> listAll(String q, Long categoryId, Pageable pageable) {
        if (q != null && !q.isBlank())
            return menuItemRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pageable);
        if (categoryId != null)
            return menuItemRepository.findByCategory_IdAndIsAvailableTrue(categoryId, pageable);
        return menuItemRepository.findAll(pageable);
    }

    @Transactional
    public MenuItem updatePrice(Long menuItemId, BigDecimal newPrice) {
        MenuItem mi = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));

        // Close previous history
        menuPriceHistoryRepository.closeOpenHistoryForMenuItem(mi.getId());

        MenuPriceHistory h = MenuPriceHistory.builder()
                .menuItem(mi)
                .price(newPrice)
                .build();

        menuPriceHistoryRepository.save(h);

        mi.setCurrentPrice(newPrice);
        return menuItemRepository.save(mi);
    }

    // ✅ Create Menu Item
    @Transactional
    public MenuItem create(MenuItem menuItem) {
        // Save menu item first
        MenuItem saved = menuItemRepository.save(menuItem);

        // Record initial price in history
        if (menuItem.getCurrentPrice() != null) {
            MenuPriceHistory history = MenuPriceHistory.builder()
                    .menuItem(saved)
                    .price(menuItem.getCurrentPrice())
                    .build();
            menuPriceHistoryRepository.save(history);
        }
        return saved;
    }

    // ✅ Update Menu Item
    @Transactional
    public MenuItem update(Long id, MenuItem updated) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        existing.setIsAvailable(updated.getIsAvailable());
        existing.setSku(updated.getSku());
        if (updated.getCategory() != null) {
            Category category = categoryRepository.findById(updated.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        // Handle price update
        if (updated.getCurrentPrice() != null &&
                (existing.getCurrentPrice() == null ||
                        existing.getCurrentPrice().compareTo(updated.getCurrentPrice()) != 0)) {

            // close old price history
            menuPriceHistoryRepository.closeOpenHistoryForMenuItem(existing.getId());

            // add new price history
            MenuPriceHistory history = MenuPriceHistory.builder()
                    .menuItem(existing)
                    .price(updated.getCurrentPrice())
                    .build();
            menuPriceHistoryRepository.save(history);

            existing.setCurrentPrice(updated.getCurrentPrice());
        }

        return menuItemRepository.save(existing);
    }

    // ✅ Delete Menu Item
    @Transactional
    public void delete(Long id) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));

        // Option A: hard delete
        menuItemRepository.delete(existing);

        // Option B (soft delete): mark unavailable
        // existing.setIsAvailable(false);
        // menuItemRepository.save(existing);
    }
}
