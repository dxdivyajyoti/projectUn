package com.retailcrm.controller;

import com.retailcrm.dto.DashboardSummaryDTO;
import com.retailcrm.dto.SegmentDTO;
import com.retailcrm.model.User;
import com.retailcrm.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> summary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getSummary(user));
    }

    @GetMapping("/segments")
    public ResponseEntity<List<SegmentDTO>> segments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getSegments(user));
    }
}
