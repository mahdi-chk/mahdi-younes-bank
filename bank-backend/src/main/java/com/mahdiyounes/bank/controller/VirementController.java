package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.dto.VirementRequest;
import com.mahdiyounes.bank.dto.VirementResponse;
import com.mahdiyounes.bank.service.VirementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/virements")
@PreAuthorize("hasRole('CLIENT')")
public class VirementController {

    @Autowired
    private VirementService virementService;

    @PostMapping
    public ResponseEntity<VirementResponse> effectuerVirement(@Valid @RequestBody VirementRequest request) {
        VirementResponse response = virementService.effectuerVirement(request);
        return ResponseEntity.ok(response);
    }
}