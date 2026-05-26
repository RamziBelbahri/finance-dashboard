package com.example.backend.auth;

import com.example.backend.security.JwtService;
import com.example.backend.transaction.Transaction;
import com.example.backend.transaction.TransactionRepository;
import com.example.backend.transaction.TransactionType;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthorizationTransactionTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void userShouldOnlyAccessTheirTransactions() throws Exception {
        User userA = new User("a@test.com", "password1");
        User userB = new User("b@test.com", "password2");

        userRepository.save(userA);
        userRepository.save(userB);

        Transaction t1 = new Transaction();
        t1.setDescription("User A Transaction");
        t1.setUser(userA);
        t1.setTransactionDate(LocalDate.of(2026,1,1));
        t1.setAmount(BigDecimal.valueOf(100.0));
        t1.setType(TransactionType.EXPENSE);
        transactionRepository.save(t1);

        Transaction t2 = new Transaction();
        t2.setDescription("User B Transaction");
        t2.setUser(userB);
        t2.setTransactionDate(LocalDate.of(2026,1,2));
        t2.setAmount(BigDecimal.valueOf(200.0));
        t2.setType(TransactionType.INCOME);
        transactionRepository.save(t2);

        String token = jwtService.generateToken(userA.getUsername());

        mockMvc.perform(get("/api/transactions")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].description").value("User A Transaction"))
                .andExpect(jsonPath("$[0].amount").value(BigDecimal.valueOf(100.0)))
                .andExpect(jsonPath("$[0].transactionDate").value("2026-01-01"))
                .andExpect(jsonPath("$[0].type").value("EXPENSE"));

    }

}
