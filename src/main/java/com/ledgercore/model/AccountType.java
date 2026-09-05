package com.ledgercore.model;

public enum AccountType {
    ASSET,
    LIABILITY,
    EQUITY,
    REVENUE,
    EXPENSE;

    /**
     * Determines the normal balance side of this account type.
     * ASSET and EXPENSE accounts normally have DEBIT balances (increase on debit, decrease on credit).
     * LIABILITY, EQUITY, and REVENUE accounts normally have CREDIT balances (increase on credit, decrease on debit).
     */
    public boolean isNormalDebit() {
        return this == ASSET || this == EXPENSE;
    }
}
