package com.example.backend.auth;

import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.user.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "Registered";
    }
}
