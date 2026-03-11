package com.retailcrm.dto;

import com.retailcrm.model.enums.InteractionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionDTO {

    private UUID id;

    @NotNull(message = "Interaction type is required")
    private InteractionType type;

    private String note;
    private BigDecimal amount;
    private UUID customerId;
    private LocalDateTime createdAt;
}
