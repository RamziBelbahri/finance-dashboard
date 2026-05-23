package com.example.backend.transaction.dto;

import com.example.backend.transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;
    private TransactionType type;

    public TransactionResponse(Long id, BigDecimal amount, String description, LocalDate transactionDate, TransactionType type) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }
}
