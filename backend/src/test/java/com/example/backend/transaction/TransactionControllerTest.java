package com.example.backend.transaction;

import com.example.backend.security.JwtService;
import com.example.backend.security.UserDetailsServiceImpl;
import com.example.backend.transaction.dto.CreateTransactionRequest;
import com.example.backend.transaction.dto.TransactionResponse;
import com.example.backend.user.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest; // new package
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private ObjectMapper objectMapper;
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
        TransactionResponse t2 = new TransactionResponse();
        t2.setId(2L);
        t2.setAmount(BigDecimal.valueOf(250.0));
        t2.setDescription("Salary");
        t2.setTransactionDate(LocalDate.of(2026,1,2));
        t2.setType(TransactionType.INCOME);
        when(transactionService.getUserTransactions(Mockito.any(User.class))).thenReturn(List.of(t1, t2));
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].amount").value(100.0))
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[1].amount").value(250.0))
                .andExpect(jsonPath("$[1].description").value("Salary"));
    }

    @Test
    @WithMockUser
    void shouldCreateTransaction() throws Exception {
        CreateTransactionRequest request = new CreateTransactionRequest();
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setDescription("Groceries");
        request.setTransactionDate(LocalDate.of(2026,1,1));
        request.setType(TransactionType.EXPENSE);
        TransactionResponse response = new TransactionResponse(1L, BigDecimal.valueOf(100.0),"Groceries", LocalDate.of(2026,1,1), TransactionType.EXPENSE);
        when(transactionService.createTransaction(Mockito.any(CreateTransactionRequest.class), Mockito.any(User.class))).thenReturn(response);
        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(100.0))
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.transactionDate").value("2026-01-01"))
                .andExpect(jsonPath("$.type").value(TransactionType.EXPENSE.name()));
    }

    @Test
    @WithMockUser
    void shouldRejectInvalidTransaction() throws Exception {
        CreateTransactionRequest invalidRequest = new CreateTransactionRequest();
        invalidRequest.setDescription("Groceries");
        invalidRequest.setTransactionDate(LocalDate.of(2026,1,1));
        invalidRequest.setType(TransactionType.EXPENSE);

        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.amount").value("must not be null"))
                .andExpect(jsonPath("$.message").value("Validation failed"));

        invalidRequest.setAmount(BigDecimal.valueOf(-100.0));

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.amount").value("must be greater than 0"))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }
}