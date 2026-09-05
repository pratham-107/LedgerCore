import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("ledgercore_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock in-memory state for initial demo or offline mode
let mockAccounts = [
  {
    accountId: "acc_1",
    accountNumber: "ACC-2024-001",
    name: "Cash on Hand",
    type: "ASSET",
    category: "CURRENT_ASSET",
    currency: "USD",
    balance: 66500.0,
    isActive: true,
  },
  {
    accountId: "acc_2",
    accountNumber: "ACC-2024-002",
    name: "Silicon Valley Bank (Checking)",
    type: "ASSET",
    category: "CURRENT_ASSET",
    currency: "USD",
    balance: 50000.0,
    isActive: true,
  },
  {
    accountId: "acc_3",
    accountNumber: "ACC-2024-003",
    name: "Accounts Payable",
    type: "LIABILITY",
    category: "CURRENT_LIABILITY",
    currency: "USD",
    balance: 8000.0,
    isActive: true,
  },
  {
    accountId: "acc_4",
    accountNumber: "ACC-2024-004",
    name: "Founders Equity",
    type: "EQUITY",
    category: "EQUITY",
    currency: "USD",
    balance: 75000.0,
    isActive: true,
  },
  {
    accountId: "acc_5",
    accountNumber: "ACC-2024-005",
    name: "SaaS Subscription Revenue",
    type: "REVENUE",
    category: "PRODUCT_SALES",
    currency: "USD",
    balance: 50600.0,
    isActive: true,
  },
  {
    accountId: "acc_6",
    accountNumber: "ACC-2024-006",
    name: "Engineering Salaries",
    type: "EXPENSE",
    category: "SALARIES",
    currency: "USD",
    balance: 8000.0,
    isActive: true,
  },
  {
    accountId: "acc_7",
    accountNumber: "ACC-2024-007",
    name: "Office Rent & Utilities",
    type: "EXPENSE",
    category: "RENT",
    currency: "USD",
    balance: 8000.0,
    isActive: true,
  },
  {
    accountId: "acc_8",
    accountNumber: "ACC-2024-008",
    name: "Corporate Tax",
    type: "EXPENSE",
    category: "OTHER_EXPENSE",
    currency: "USD",
    balance: 8650.0,
    isActive: true,
  },
];

let mockTransactions = [
  {
    transactionId: "TXN-2024-001",
    description: "Apple Inc - Enterprise License",
    totalAmount: 11460.0,
    currency: "EUR",
    status: "POSTED",
    reference: "INV-20230189",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    entries: [
      {
        entryId: "ENT-001",
        accountId: "acc_2",
        accountNumber: "ACC-2024-002",
        accountName: "Silicon Valley Bank",
        type: "DEBIT",
        amount: 11460.0,
        runningBalance: 61460.0,
      },
      {
        entryId: "ENT-002",
        accountId: "acc_5",
        accountNumber: "ACC-2024-005",
        accountName: "SaaS Subscription Revenue",
        type: "CREDIT",
        amount: 11460.0,
        runningBalance: 62060.0,
      },
    ],
  },
  {
    transactionId: "TXN-2024-002",
    description: "WeWork - Monthly Office Rent",
    totalAmount: 1150.0,
    currency: "USD",
    status: "POSTED",
    reference: "RENT-JUN",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    entries: [
      {
        entryId: "ENT-003",
        accountId: "acc_7",
        accountNumber: "ACC-2024-007",
        accountName: "Office Rent & Utilities",
        type: "DEBIT",
        amount: 1150.0,
        runningBalance: 9150.0,
      },
      {
        entryId: "ENT-004",
        accountId: "acc_1",
        accountNumber: "ACC-2024-001",
        accountName: "Cash on Hand",
        type: "CREDIT",
        amount: 1150.0,
        runningBalance: 65350.0,
      },
    ],
  },
  {
    transactionId: "TXN-2024-003",
    description: "Jon Doe - Payroll Settlement",
    totalAmount: 5980.0,
    currency: "USD",
    status: "POSTED",
    reference: "PAYROLL-2024-06",
    createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
    entries: [
      {
        entryId: "ENT-005",
        accountId: "acc_6",
        accountNumber: "ACC-2024-006",
        accountName: "Engineering Salaries",
        type: "DEBIT",
        amount: 5980.0,
        runningBalance: 13980.0,
      },
      {
        entryId: "ENT-006",
        accountId: "acc_2",
        accountNumber: "ACC-2024-002",
        accountName: "Silicon Valley Bank",
        type: "CREDIT",
        amount: 5980.0,
        runningBalance: 55480.0,
      },
    ],
  },
];

export const api = {
  // Auth
  async login(email, password) {
    try {
      const res = await client.post("/auth/login", { email, password });
      localStorage.setItem("ledgercore_token", res.data.accessToken);
      localStorage.setItem("ledgercore_user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      // Fallback mock login for preview
      const role = email.includes("admin")
        ? "ADMIN"
        : email.includes("accountant")
          ? "ACCOUNTANT"
          : "VIEWER";
      const mockUser = { userId: "usr_" + Date.now(), email, role };
      const mockToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem("ledgercore_token", mockToken);
      localStorage.setItem("ledgercore_user", JSON.stringify(mockUser));
      return { accessToken: mockToken, user: mockUser };
    }
  },

  async register(email, password, role) {
    try {
      const res = await client.post("/auth/register", {
        email,
        password,
        role,
      });
      return res.data;
    } catch (err) {
      return {
        userId: "usr_" + Date.now(),
        email,
        role,
        createdAt: new Date().toISOString(),
      };
    }
  },

  // Accounts
  async getAccounts() {
    try {
      const res = await client.get("/api/v1/accounts?size=100");
      return res.data.content || res.data;
    } catch (err) {
      return mockAccounts;
    }
  },

  async createAccount(data) {
    try {
      const res = await client.post("/api/v1/accounts", data);
      return res.data;
    } catch (err) {
      const newAcc = {
        accountId: "acc_" + (mockAccounts.length + 1),
        accountNumber: `ACC-2024-${String(mockAccounts.length + 1).padStart(3, "0")}`,
        name: data.name,
        type: data.type,
        category: data.category,
        currency: data.currency || "USD",
        balance: Number(data.openingBalance) || 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      mockAccounts.unshift(newAcc);
      return newAcc;
    }
  },

  // Transactions
  async getTransactions() {
    try {
      const res = await client.get("/api/v1/transactions?size=50");
      return res.data.content || res.data;
    } catch (err) {
      return mockTransactions;
    }
  },

  async createTransaction(data) {
    try {
      const res = await client.post("/api/v1/transactions", data);
      return res.data;
    } catch (err) {
      const total = data.entries.reduce(
        (sum, e) => (e.type === "DEBIT" ? sum + Number(e.amount) : sum),
        0,
      );
      const newTxn = {
        transactionId:
          "TXN-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        description: data.description,
        totalAmount: total,
        currency: data.currency || "USD",
        status: "POSTED",
        reference: data.reference || "REF-" + Date.now(),
        createdAt: new Date().toISOString(),
        entries: data.entries.map((e, idx) => {
          const acc = mockAccounts.find(
            (a) =>
              a.accountId === e.accountId || a.accountNumber === e.accountId,
          );
          return {
            entryId: "ENT-" + (idx + 1),
            accountId: e.accountId,
            accountNumber: acc?.accountNumber || e.accountId,
            accountName: acc?.name || "Account",
            type: e.type,
            amount: Number(e.amount),
            runningBalance:
              (acc?.balance || 0) +
              (e.type === "DEBIT" ? Number(e.amount) : -Number(e.amount)),
          };
        }),
      };
      mockTransactions.unshift(newTxn);
      return newTxn;
    }
  },

  async reverseTransaction(transactionId) {
    try {
      const res = await client.post(
        `/api/v1/transactions/${transactionId}/reverse`,
      );
      return res.data;
    } catch (err) {
      const txn = mockTransactions.find(
        (t) => t.transactionId === transactionId,
      );
      if (txn) {
        txn.status = "REVERSED";
        txn.reversedAt = new Date().toISOString();
        txn.reversalTransactionId = "TXN-rev-" + Date.now();
      }
      return { originalTransactionId: transactionId, status: "REVERSED" };
    }
  },

  // Reports
  async getPnl(
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
  ) {
    try {
      const res = await client.get(
        `/api/v1/reports/pnl?year=${year}&month=${month}`,
      );
      return res.data;
    } catch (err) {
      return {
        period: `${year}-${String(month).padStart(2, "0")}`,
        currency: "USD",
        revenue: {
          total: 50600.0,
          breakdown: [
            { category: "PRODUCT_SALES", amount: 45000.0 },
            { category: "SERVICE_REVENUE", amount: 5600.0 },
          ],
        },
        expenses: {
          total: 24650.0,
          breakdown: [
            { category: "SALARIES", amount: 8000.0 },
            { category: "RENT", amount: 8000.0 },
            { category: "OTHER_EXPENSE", amount: 8650.0 },
          ],
        },
        netIncome: 25950.0,
        margin: 51.28,
      };
    }
  },

  async getBalanceSheet() {
    try {
      const res = await client.get("/api/v1/reports/balance-sheet");
      return res.data;
    } catch (err) {
      return {
        asOf: new Date().toISOString().split("T")[0],
        assets: { current: 116500.0, fixed: 8500.0, total: 125000.0 },
        liabilities: { current: 8000.0, longTerm: 42000.0, total: 50000.0 },
        equity: 75000.0,
        balanced: true,
      };
    }
  },
};
