package com.backend.pzm_iroute.util;

import java.util.regex.Pattern;

public final class FileNameValidator {

    private static final Pattern FILE_NAME_PATTERN =
            Pattern.compile("^transactions_\\d{8}\\.csv$");

    private FileNameValidator() {
    }

    public static boolean isValid(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return false;
        }

        return FILE_NAME_PATTERN.matcher(fileName).matches();
    }
}