package com.retailcrm.repository;

import com.retailcrm.model.Interaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, UUID> {

    Page<Interaction> findByCustomerIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Interaction i " +
           "WHERE i.customer.user.id = :userId AND i.createdAt > :since")
    BigDecimal sumRevenueByUserSince(@Param("userId") UUID userId, @Param("since") LocalDateTime since);

    long countByCustomerUserIdAndCreatedAtAfter(UUID userId, LocalDateTime since);
}
