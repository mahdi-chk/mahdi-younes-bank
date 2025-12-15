package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.dto.ChangePasswordRequest;
import com.mahdiyounes.bank.dto.LoginRequest;
import com.mahdiyounes.bank.dto.LoginResponse;
import com.mahdiyounes.bank.dto.MessageResponse;
import com.mahdiyounes.bank.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        MessageResponse response = authService.changePassword(request);
        return ResponseEntity.ok(response);
    }
}