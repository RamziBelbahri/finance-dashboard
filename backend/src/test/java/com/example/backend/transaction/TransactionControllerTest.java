package com.example.backend.transaction;

import com.example.backend.security.JwtService;
import com.example.backend.security.UserDetailsServiceImpl;
import com.example.backend.transaction.dto.TransactionResponse;
import com.example.backend.user.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest; // new package
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TransactionService transactionService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser
    void shouldReturnUserTransactions() throws Exception {
        TransactionResponse t1 = new TransactionResponse(1L, BigDecimal.valueOf(100.0),"Groceries", LocalDate.of(2026,1,1), TransactionType.EXPENSE);
        TransactionResponse t2 = new TransactionResponse(2L, BigDecimal.valueOf(250.0),"Salary", LocalDate.of(2026,1,2), TransactionType.INCOME);

        when(transactionService.getUserTransactions(Mockito.any(User.class))).thenReturn(List.of(t1, t2));
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].amount").value(100.0))
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[1].amount").value(250.0))
                .andExpect(jsonPath("$[1].description").value("Salary"));
    }

}