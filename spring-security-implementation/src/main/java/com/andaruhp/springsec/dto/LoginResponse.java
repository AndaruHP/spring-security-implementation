package com.andaruhp.springsec.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;

    public LoginResponse(String accessToken, String username) {
        this.accessToken = accessToken;
        this.username = username;
    }
}
