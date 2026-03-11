package com.retailcrm.service;

import com.retailcrm.dto.CreateReminderRequest;
import com.retailcrm.dto.ReminderDTO;
import com.retailcrm.model.Customer;
import com.retailcrm.model.Reminder;
import com.retailcrm.model.User;
import com.retailcrm.repository.CustomerRepository;
import com.retailcrm.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final CustomerRepository customerRepository;

    public List<ReminderDTO> list(User user) {
        return reminderRepository.findByUserIdAndCompletedFalseOrderByDueDateAsc(user.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public ReminderDTO create(User user, CreateReminderRequest req) {
        Customer customer = customerRepository.findByIdAndUserId(req.getCustomerId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Reminder reminder = Reminder.builder()
                .customer(customer)
                .user(user)
                .note(req.getNote())
                .dueDate(req.getDueDate())
                .completed(false)
                .build();

        reminder = reminderRepository.save(reminder);
        return toDTO(reminder);
    }

    @Transactional
    public ReminderDTO complete(User user, UUID id) {
        Reminder reminder = reminderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));

        reminder.setCompleted(true);
        reminder = reminderRepository.save(reminder);
        return toDTO(reminder);
    }

    private ReminderDTO toDTO(Reminder r) {
        return ReminderDTO.builder()
                .id(r.getId())
                .customerId(r.getCustomer().getId())
                .customerName(r.getCustomer().getFullName())
                .note(r.getNote())
                .dueDate(r.getDueDate())
                .completed(r.getCompleted())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
