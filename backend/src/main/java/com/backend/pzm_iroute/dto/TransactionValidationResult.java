package com.backend.pzm_iroute.dto;

import com.backend.pzm_iroute.enums.TransactionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionValidationResult(
        String account,
        BigDecimal amount,
        LocalDate transactionDate,
        TransactionStatus status,
        String rejectionReason
) {

    public boolean isValid() {
        return status == TransactionStatus.PROCESADO;
    }
}