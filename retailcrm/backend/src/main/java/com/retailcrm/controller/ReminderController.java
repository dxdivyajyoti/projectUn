package com.retailcrm.controller;

import com.retailcrm.dto.CreateReminderRequest;
import com.retailcrm.dto.ReminderDTO;
import com.retailcrm.model.User;
import com.retailcrm.service.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<List<ReminderDTO>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reminderService.list(user));
    }

    @PostMapping
    public ResponseEntity<ReminderDTO> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateReminderRequest req) {
        return ResponseEntity.status(201).body(reminderService.create(user, req));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ReminderDTO> complete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(reminderService.complete(user, id));
    }
}
