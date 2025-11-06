package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.entity.RestaurantTable;
import com.javabite.code.coffeehub.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin
public class TableController {
    private final TableService tableService;
    public TableController(TableService ts){ this.tableService = ts; }

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> listAll(){ return ResponseEntity.ok(tableService.listAll()); }



    @PreAuthorize("hasAnyRole('ADMIN','WAITER')")
    @PostMapping
    public ResponseEntity<RestaurantTable> create(@RequestBody RestaurantTable t){
        return ResponseEntity.ok(tableService.create(t));
    }



    @PreAuthorize("hasAnyRole('ADMIN','WAITER')")
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> update(@PathVariable Long id, @RequestBody RestaurantTable t){
        return ResponseEntity.ok(tableService.update(id, t));
    }


    @PreAuthorize("hasAnyRole('ADMIN','WAITER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        tableService.delete(id);
        return ResponseEntity.noContent().build();
    }


//    // seed sample tables
//    @PostMapping("/seed")
//    public ResponseEntity<List<RestaurantTable>> seed(){
//        if(tableService.listAll().isEmpty()){
//            tableService.create(RestaurantTable.builder().tableNumber(1).seatingCapacity(2).locationZone("Window").isAvailable(true).tableType("REGULAR").build());
//            tableService.create(RestaurantTable.builder().tableNumber(2).seatingCapacity(4).locationZone("Garden").isAvailable(true).tableType("VIP").build());
//            tableService.create(RestaurantTable.builder().tableNumber(3).seatingCapacity(6).locationZone("Indoor").isAvailable(true).tableType("REGULAR").build());
//        }
//        return ResponseEntity.ok(tableService.listAll());
//    }
}
