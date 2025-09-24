import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Budget {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  limit: number;
  createdAt: Date;
}

export interface Expense {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
  category?: string;
  spentAt: Date;
  receipt?: string;
  createdAt: Date;
}

interface BudgetContextType {
  budgets: Budget[];
  expenses: Expense[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getBudgetExpenses: (budgetId: string) => Expense[];
  getBudgetTotal: (budgetId: string) => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Groceries - November 2024',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      limit: 500,
      createdAt: new Date('2024-11-01'),
    },
    {
      id: '2',
      name: 'Entertainment',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      limit: 200,
      createdAt: new Date('2024-11-01'),
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      budgetId: '1',
      amount: 85.50,
      description: 'Weekly grocery shopping',
      category: 'Food',
      spentAt: new Date('2024-11-05'),
      createdAt: new Date('2024-11-05'),
    },
    {
      id: '2',
      budgetId: '1',
      amount: 42.30,
      description: 'Fruits and vegetables',
      category: 'Food',
      spentAt: new Date('2024-11-08'),
      createdAt: new Date('2024-11-08'),
    },
    {
      id: '3',
      budgetId: '2',
      amount: 15.99,
      description: 'Netflix subscription',
      category: 'Subscription',
      spentAt: new Date('2024-11-01'),
      createdAt: new Date('2024-11-01'),
    },
  ]);

  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...budget } : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    setExpenses(expenses.filter(e => e.budgetId !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, ...expense } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const getBudgetExpenses = (budgetId: string) => {
    return expenses.filter(e => e.budgetId === budgetId);
  };

  const getBudgetTotal = (budgetId: string) => {
    return getBudgetExpenses(budgetId).reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <BudgetContext.Provider value={{
      budgets,
      expenses,
      addBudget,
      updateBudget,
      deleteBudget,
      addExpense,
      updateExpense,
      deleteExpense,
      getBudgetExpenses,
      getBudgetTotal,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};