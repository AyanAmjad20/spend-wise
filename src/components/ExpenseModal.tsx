import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBudget } from '@/contexts/BudgetContext';
import { toast } from '@/hooks/use-toast';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId?: string | null;
  defaultBudgetId?: string;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, expenseId, defaultBudgetId }) => {
  const { budgets, expenses, addExpense, updateExpense } = useBudget();
  const [budgetId, setBudgetId] = useState(defaultBudgetId || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [spentAt, setSpentAt] = useState<Date | undefined>(new Date());

  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Education', 'Subscription', 'Other'];

  useEffect(() => {
    if (expenseId) {
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        setBudgetId(expense.budgetId);
        setAmount(expense.amount.toString());
        setDescription(expense.description);
        setCategory(expense.category || '');
        setSpentAt(new Date(expense.spentAt));
      }
    } else {
      setBudgetId(defaultBudgetId || budgets[0]?.id || '');
      setAmount('');
      setDescription('');
      setCategory('');
      setSpentAt(new Date());
    }
  }, [expenseId, expenses, defaultBudgetId, budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!budgetId || !amount || !description || !spentAt) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (expenseId) {
      updateExpense(expenseId, {
        budgetId,
        amount: amountValue,
        description,
        category: category || undefined,
        spentAt,
      });
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
      });
    } else {
      addExpense({
        budgetId,
        amount: amountValue,
        description,
        category: category || undefined,
        spentAt,
      });
      toast({
        title: "Expense added",
        description: "Your expense has been successfully added.",
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{expenseId ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {expenseId ? 'Update your expense details' : 'Record a new expense'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Select value={budgetId} onValueChange={setBudgetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map(budget => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Weekly grocery shopping"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Spent</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !spentAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {spentAt ? format(spentAt, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={spentAt}
                      onSelect={setSpentAt}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {expenseId ? 'Update' : 'Add'} Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;