package com.retailcrm.dto;

import com.retailcrm.model.enums.CustomerTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private UUID id;
    private String fullName;
    private String phone;
    private String email;
    private LocalDate birthday;
    private CustomerTag tag;
    private String notes;
    private LocalDateTime lastVisited;
    private LocalDateTime createdAt;
}
