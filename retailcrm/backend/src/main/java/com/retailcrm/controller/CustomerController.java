package com.retailcrm.controller;

import com.retailcrm.dto.CreateCustomerRequest;
import com.retailcrm.dto.CustomerDTO;
import com.retailcrm.dto.UpdateCustomerRequest;
import com.retailcrm.model.User;
import com.retailcrm.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> list(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(customerService.list(user, page, tag));
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateCustomerRequest req) {
        return ResponseEntity.status(201).body(customerService.create(user, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> get(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(customerService.get(user, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCustomerRequest req) {
        return ResponseEntity.ok(customerService.update(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        customerService.delete(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDTO>> search(
            @AuthenticationPrincipal User user,
            @RequestParam String q) {
        return ResponseEntity.ok(customerService.search(user, q));
    }
}
