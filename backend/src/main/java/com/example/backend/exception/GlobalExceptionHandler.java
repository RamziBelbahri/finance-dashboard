package com.example.backend.exception;

import com.example.backend.exception.dto.ErrorResponse;
import com.example.backend.exception.dto.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unexpected error occurred: ", ex);
        ErrorResponse response = new ErrorResponse(500, "An unexpected error occurred", null);
        return ResponseEntity.internalServerError().body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {

        String paramName = exception.getName();
        Object rejectedValue = exception.getValue();

        String message = String.format(
                "Invalid value '%s' for parameter '%s'",
                rejectedValue,
                paramName
        );

        ErrorResponse response = new ErrorResponse(400, message, null);
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        log.error("Unexpected error occurred: ", ex);
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );

        ErrorResponse response = new ErrorResponse(400, "Validation failed", errors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        log.error("Unexpected error occurred: ", ex);
        ErrorResponse response =
                new ErrorResponse(
                        409,
                        ex.getMessage(),
                        null
                );

        return ResponseEntity.status(409).body(response);
    }
}
