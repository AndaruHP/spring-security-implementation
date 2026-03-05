package com.andaruhp.springsec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {

    @GetMapping("/providers")
    public ResponseEntity<Map<String, Object>> loginOptions() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Available login options");

        Map<String, String> providers = new HashMap<>();
        providers.put("google", "/oauth2/authorization/google");
        providers.put("github", "/oauth2/authorization/github");
        providers.put("local", "Use POST /api/auth/login with username/password");

        response.put("providers", providers);
        return ResponseEntity.ok(response);
    }
}
