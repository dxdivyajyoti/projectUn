package com.retailcrm.controller;

import com.retailcrm.dto.InteractionDTO;
import com.retailcrm.model.User;
import com.retailcrm.service.InteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/customers/{customerId}/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @PostMapping
    public ResponseEntity<InteractionDTO> create(
            @AuthenticationPrincipal User user,
            @PathVariable UUID customerId,
            @Valid @RequestBody InteractionDTO dto) {
        return ResponseEntity.status(201).body(interactionService.create(user, customerId, dto));
    }

    @GetMapping
    public ResponseEntity<Page<InteractionDTO>> list(
            @AuthenticationPrincipal User user,
            @PathVariable UUID customerId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(interactionService.listByCustomer(user, customerId, page));
    }
}
