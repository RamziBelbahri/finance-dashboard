package com.example.backend.transaction;

import com.example.backend.transaction.dto.CreateTransactionRequest;
import com.example.backend.transaction.dto.TransactionResponse;
import com.example.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public TransactionResponse createTransaction(@AuthenticationPrincipal User user, @Valid @RequestBody CreateTransactionRequest request) {
        return this.transactionService.createTransaction(request, user);
    }

    @GetMapping
    public List<TransactionResponse> getUserTransactions(@AuthenticationPrincipal User user) {
        return this.transactionService.getUserTransactions(user);
    }
}
