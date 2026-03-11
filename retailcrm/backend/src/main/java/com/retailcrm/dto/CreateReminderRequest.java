package com.retailcrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReminderRequest {

    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    private String note;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;
}
