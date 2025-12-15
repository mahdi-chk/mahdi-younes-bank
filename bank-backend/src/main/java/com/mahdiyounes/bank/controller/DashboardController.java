package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.dto.CompteClientResponse;
import com.mahdiyounes.bank.dto.DashboardResponse;
import com.mahdiyounes.bank.dto.OperationResponse;
import com.mahdiyounes.bank.dto.PageResponse;
import com.mahdiyounes.bank.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('CLIENT')")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Récupérer la liste des comptes du client connecté
     */
    @GetMapping("/mes-comptes")
    public ResponseEntity<List<CompteClientResponse>> getMesComptes() {
        List<CompteClientResponse> comptes = dashboardService.getMesComptes();
        return ResponseEntity.ok(comptes);
    }

    /**
     * Récupérer le dashboard par défaut (compte le plus récemment utilisé)
     */
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardDefault() {
        DashboardResponse dashboard = dashboardService.getDashboardDefault();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Récupérer le dashboard d'un compte spécifique
     */
    @GetMapping("/{rib}")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable String rib) {
        DashboardResponse dashboard = dashboardService.getDashboard(rib);
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Récupérer les opérations d'un compte avec pagination
     */
    @GetMapping("/{rib}/operations")
    public ResponseEntity<PageResponse<OperationResponse>> getOperations(
            @PathVariable String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<OperationResponse> operations = dashboardService.getOperations(rib, page, size);
        return ResponseEntity.ok(operations);
    }
}