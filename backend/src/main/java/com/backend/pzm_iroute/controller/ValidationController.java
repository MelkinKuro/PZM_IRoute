package com.backend.pzm_iroute.controller;

import com.backend.pzm_iroute.dto.TransactionValidationResult;
import com.backend.pzm_iroute.service.TransactionValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/validation")
public class ValidationController {

    private final TransactionValidationService validationService;

    public ValidationController(
            TransactionValidationService validationService
    ) {
        this.validationService = validationService;
    }

    @GetMapping("/transaction")
    public ResponseEntity<TransactionValidationResult> validateTransaction(
            @RequestParam(required = false) String account,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String date
    ) {
        TransactionValidationResult result =
                validationService.validate(account, amount, date);

        return ResponseEntity.ok(result);
    }
}