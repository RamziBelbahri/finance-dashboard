package com.example.backend.transaction;

import com.example.backend.transaction.dto.CreateTransactionRequest;
import com.example.backend.transaction.dto.TransactionResponse;
import com.example.backend.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Captor
    ArgumentCaptor<Transaction> transactionCaptor;

    @Mock
    private TransactionRepository transactionRepo;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void shouldCreateTransaction() {
        User user = new User();
        CreateTransactionRequest request = new CreateTransactionRequest();
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setDescription("Groceries");
        request.setType(TransactionType.EXPENSE);

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(1L);
        savedTransaction.setAmount(BigDecimal.valueOf(100.0));
        savedTransaction.setDescription("Groceries");
        savedTransaction.setType(TransactionType.EXPENSE);
        savedTransaction.setUser(user);
        when(transactionRepo.save(any(Transaction.class))).thenReturn(savedTransaction);

        TransactionResponse result = transactionService.createTransaction(request, user);

        assertEquals(BigDecimal.valueOf(100.0), result.getAmount());
        assertEquals("Groceries", result.getDescription());
        assertEquals(TransactionType.EXPENSE, result.getType());
    }

    @Test
    void shouldAssignUserToTransaction() {
        User user = new User();
        CreateTransactionRequest request = new CreateTransactionRequest();
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setDescription("Groceries");
        request.setType(TransactionType.EXPENSE);

        when(transactionRepo.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        transactionService.createTransaction(request, user);

        verify(transactionRepo).save(transactionCaptor.capture());
        Transaction saved = transactionCaptor.getValue();
        assertEquals(user, saved.getUser());
    }

    @Test
    void shouldReturnUserTransactions() {
        User user = new User();
        Transaction t1 = new Transaction();
        t1.setId(1L);
        t1.setAmount(BigDecimal.valueOf(100.0));
        t1.setDescription("A");
        t1.setTransactionDate(LocalDate.parse("2023-05-12"));
        t1.setType(TransactionType.EXPENSE);

        Transaction t2 = new Transaction();
        t2.setId(2L);
        t2.setAmount(BigDecimal.valueOf(200.0));
        t2.setDescription("B");
        t2.setTransactionDate(LocalDate.parse("2023-05-13"));
        t2.setType(TransactionType.INCOME);

        List<Transaction> mockList = List.of(t1, t2);
        when(transactionRepo.findByUser(user)).thenReturn(mockList);
        List<TransactionResponse> result = transactionService.getUserTransactions(user);

        assertThat(result)
                .hasSize(mockList.size())
                .extracting("id", "amount", "description", "transactionDate", "type")
                .containsExactly(
                        tuple(1L, BigDecimal.valueOf(100.0), "A", LocalDate.parse("2023-05-12"), TransactionType.EXPENSE),
                        tuple(2L, BigDecimal.valueOf(200.0), "B", LocalDate.parse("2023-05-13"), TransactionType.INCOME)
                );
    }
}
