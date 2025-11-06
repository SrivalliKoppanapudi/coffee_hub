package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Page<MenuItem> findByCategory_IdAndIsAvailableTrue(Long categoryId,
                                                       Pageable pageable);
    Page<MenuItem>
    findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name,
                                                                    String desc, Pageable pageable);
}
