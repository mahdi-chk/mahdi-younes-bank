package com.mahdiyounes.bank.dto;

import com.mahdiyounes.bank.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private Role role;
}