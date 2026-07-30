package com.backend.pzm_iroute.service;

import com.backend.pzm_iroute.dto.TransactionValidationResult;
import com.backend.pzm_iroute.enums.TransactionStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;

@Service
public class TransactionValidationService {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter
                    .ofPattern("dd/MM/uuuu")
                    .withResolverStyle(ResolverStyle.STRICT);

    public TransactionValidationResult validate(
            String accountText,
            String amountText,
            String dateText
    ) {
        String account = normalize(accountText);
        String amountValue = normalize(amountText);
        String dateValue = normalize(dateText);

        if (account == null) {
            return rejected(
                    account,
                    null,
                    null,
                    "La cuenta es obligatoria"
            );
        }

        if (!account.matches("\\d{10}")) {
            return rejected(
                    account,
                    null,
                    null,
                    "La cuenta debe contener exactamente 10 dígitos"
            );
        }

        if (amountValue == null) {
            return rejected(
                    account,
                    null,
                    null,
                    "El monto es obligatorio"
            );
        }

        BigDecimal amount;

        try {
            amount = new BigDecimal(amountValue);
        } catch (NumberFormatException exception) {
            return rejected(
                    account,
                    null,
                    null,
                    "El monto debe ser un valor numérico"
            );
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return rejected(
                    account,
                    amount,
                    null,
                    "El monto debe ser mayor que cero"
            );
        }

        if (dateValue == null) {
            return rejected(
                    account,
                    amount,
                    null,
                    "La fecha es obligatoria"
            );
        }

        LocalDate transactionDate;

        try {
            transactionDate = LocalDate.parse(dateValue, DATE_FORMATTER);
        } catch (DateTimeParseException exception) {
            return rejected(
                    account,
                    amount,
                    null,
                    "La fecha debe tener el formato dd/MM/yyyy y ser válida"
            );
        }

        return new TransactionValidationResult(
                account,
                amount,
                transactionDate,
                TransactionStatus.PROCESADO,
                null
        );
    }

    private TransactionValidationResult rejected(
            String account,
            BigDecimal amount,
            LocalDate transactionDate,
            String reason
    ) {
        return new TransactionValidationResult(
                account,
                amount,
                transactionDate,
                TransactionStatus.RECHAZADA,
                reason
        );
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}