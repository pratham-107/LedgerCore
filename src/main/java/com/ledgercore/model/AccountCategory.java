package com.ledgercore.model;

public enum AccountCategory {
    // Assets
    CURRENT_ASSET,
    FIXED_ASSET,
    NON_CURRENT_ASSET,

    // Liabilities
    CURRENT_LIABILITY,
    LONG_TERM_LIABILITY,

    // Equity
    EQUITY,
    RETAINED_EARNINGS,

    // Revenue
    OPERATING_REVENUE,
    PRODUCT_SALES,
    SERVICE_REVENUE,
    OTHER_INCOME,

    // Expenses
    OPERATING_EXPENSE,
    SALARIES,
    RENT,
    UTILITIES,
    MARKETING,
    OFFICE_SUPPLIES,
    OTHER_EXPENSE
}
