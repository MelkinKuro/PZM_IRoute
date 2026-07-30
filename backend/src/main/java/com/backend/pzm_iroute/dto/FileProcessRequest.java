package com.backend.pzm_iroute.dto;

import jakarta.validation.constraints.NotBlank;

public record FileProcessRequest(

        @NotBlank(message = "El nombre del archivo es obligatorio")
        String fileName
) {
}