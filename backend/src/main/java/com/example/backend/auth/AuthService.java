package com.example.backend.auth;

import com.example.backend.auth.dto.AuthResponse;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.exception.dto.UserAlreadyExistsException;
import com.example.backend.security.JwtService;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail(), password = registerRequest.getPassword();

        if (userRepo.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(email, encodedPassword);
        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail(), password = loginRequest.getPassword();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        boolean isPasswordValid = passwordEncoder.matches(password, user.getPassword());

        if(!isPasswordValid) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

}
