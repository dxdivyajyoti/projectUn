package com.retailcrm.service;

import com.retailcrm.dto.DashboardSummaryDTO;
import com.retailcrm.dto.SegmentDTO;
import com.retailcrm.model.User;
import com.retailcrm.model.enums.CustomerTag;
import com.retailcrm.repository.CustomerRepository;
import com.retailcrm.repository.InteractionRepository;
import com.retailcrm.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CustomerRepository customerRepository;
    private final InteractionRepository interactionRepository;
    private final ReminderRepository reminderRepository;

    public DashboardSummaryDTO getSummary(User user) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        long totalCustomers = customerRepository.countByUserId(user.getId());
        long newThisMonth = customerRepository.countByUserIdAndCreatedAtAfter(user.getId(), startOfMonth);
        long interactionsThisMonth = interactionRepository.countByCustomerUserIdAndCreatedAtAfter(user.getId(), startOfMonth);
        BigDecimal revenueThisMonth = interactionRepository.sumRevenueByUserSince(user.getId(), startOfMonth);
        long pendingReminders = reminderRepository.countByUserIdAndCompletedFalse(user.getId());

        return DashboardSummaryDTO.builder()
                .totalCustomers(totalCustomers)
                .newCustomersThisMonth(newThisMonth)
                .totalInteractionsThisMonth(interactionsThisMonth)
                .revenueThisMonth(revenueThisMonth)
                .pendingReminders(pendingReminders)
                .build();
    }

    public List<SegmentDTO> getSegments(User user) {
        return Arrays.stream(CustomerTag.values())
                .map(tag -> SegmentDTO.builder()
                        .tag(tag)
                        .count(customerRepository.countByUserIdAndTag(user.getId(), tag))
                        .build())
                .toList();
    }
}
