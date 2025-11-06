package com.javabite.code.coffeehub.service;
import com.javabite.code.coffeehub.entity.RestaurantTable;
import com.javabite.code.coffeehub.repo.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TableService {
    private final RestaurantTableRepository repo;
    public TableService(RestaurantTableRepository repo){ this.repo = repo; }

    public List<RestaurantTable> listAll(){ return repo.findAll(); }

    public RestaurantTable create(RestaurantTable t){
        if (repo.existsByTableNumber(t.getTableNumber())) {
            throw new RuntimeException("Table number already exists!");
        }
        return repo.save(t);
    }

    public Optional<RestaurantTable> findById(Long id){ return repo.findById(id); }

    // lightweight availability: you might combine with booking checks (see BookingService)
    public RestaurantTable update(Long id, RestaurantTable updated) {
        return repo.findById(id).map(existing -> {
            existing.setTableNumber(updated.getTableNumber());
            existing.setSeatingCapacity(updated.getSeatingCapacity());
            existing.setLocationZone(updated.getLocationZone());
            existing.setIsAvailable(updated.getIsAvailable());
            existing.setTableType(updated.getTableType());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Table not found"));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Table not found");
        }
        repo.deleteById(id);
    }
}
