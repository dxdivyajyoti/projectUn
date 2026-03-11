package com.retailcrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private long totalCustomers;
    private long newCustomersThisMonth;
    private long totalInteractionsThisMonth;
    private BigDecimal revenueThisMonth;
    private long pendingReminders;
}
