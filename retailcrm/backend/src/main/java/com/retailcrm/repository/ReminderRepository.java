package com.retailcrm.repository;

import com.retailcrm.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {

    List<Reminder> findByUserIdAndCompletedFalseOrderByDueDateAsc(UUID userId);

    List<Reminder> findByUserIdOrderByDueDateAsc(UUID userId);

    List<Reminder> findByUserIdAndDueDateBeforeAndCompletedFalse(UUID userId, LocalDateTime before);

    Optional<Reminder> findByIdAndUserId(UUID id, UUID userId);

    long countByUserIdAndCompletedFalse(UUID userId);
}
