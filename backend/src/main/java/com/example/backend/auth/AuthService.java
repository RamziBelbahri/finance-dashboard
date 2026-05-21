package com.example.backend.auth;

import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepo;

    public AuthService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public void register(RegisterRequest registerRequest) {
        if (userRepo.findByEmail(registerRequest.getEmail()) == null) {
            User user = new User(registerRequest.getEmail(),registerRequest.getPassword());
            userRepo.save(user);
        };
    }

}
