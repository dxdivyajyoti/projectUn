package com.retailcrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDTO {

    private UUID id;
    private UUID customerId;
    private String customerName;
    private String note;
    private LocalDateTime dueDate;
    private Boolean completed;
    private LocalDateTime createdAt;
}
