package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.MenuPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
public interface MenuPriceHistoryRepository extends JpaRepository<MenuPriceHistory, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE MenuPriceHistory m SET m.effectiveTo = CURRENT_TIMESTAMP WHERE m.menuItem.id = :menuItemId AND m.effectiveTo IS NULL")
    void closeOpenHistoryForMenuItem(@Param("menuItemId") Long menuItemId);
}