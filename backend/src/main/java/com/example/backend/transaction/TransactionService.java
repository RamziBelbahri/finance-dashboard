package com.example.backend.transaction;

import com.example.backend.transaction.dto.CreateTransactionRequest;
import com.example.backend.transaction.dto.TransactionResponse;
import com.example.backend.user.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepo;

    TransactionService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(transaction.getId(), transaction.getAmount(), transaction.getDescription(), transaction.getTransactionDate(), transaction.getType());
    }

    public TransactionResponse createTransaction(CreateTransactionRequest request, User user) {
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setType(request.getType());
        transaction.setUser(user);

        Transaction saved = transactionRepo.save(transaction);
        return mapToResponse(saved);
    }
    public List<TransactionResponse> getUserTransactions(User user, TransactionType type) {

        List<Transaction> transactions;
        if(type != null) {
            transactions = transactionRepo.findByUserAndType(user, type);
        } else {
            transactions = transactionRepo.findByUser(user);
        }
        return transactions.stream().map(this::mapToResponse).toList();
    }

    public TransactionSummary getSummary(User user) {
        List<TransactionResponse> incomes = this.getUserTransactions(user, TransactionType.INCOME);
        List<TransactionResponse> expenses = this.getUserTransactions(user, TransactionType.EXPENSE);
        double totalIncome = incomes.stream().mapToDouble(transaction -> transaction.getAmount().doubleValue()).sum();
        double totalExpense = expenses.stream().mapToDouble(transaction -> transaction.getAmount().doubleValue()).sum();
        return new TransactionSummary(totalIncome, totalExpense, totalIncome - totalExpense);
    }
}
