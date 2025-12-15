package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.dto.StatisticsResponse;
import com.mahdiyounes.bank.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@PreAuthorize("hasRole('AGENT_GUICHET')")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<StatisticsResponse> getStatistics() {
        StatisticsResponse stats = statisticsService.getStatistics();
        return ResponseEntity.ok(stats);
    }
}