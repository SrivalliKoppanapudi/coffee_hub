package com.javabite.code.coffeehub.exp;

public class TableCapacityExceededException extends RuntimeException {
    public TableCapacityExceededException(String message) {
        super(message);
    }
}
