import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBudget } from '@/contexts/BudgetContext';
import { toast } from '@/hooks/use-toast';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId?: string | null;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, budgetId }) => {
  const { budgets, addBudget, updateBudget } = useBudget();
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  useEffect(() => {
    if (budgetId) {
      const budget = budgets.find(b => b.id === budgetId);
      if (budget) {
        setName(budget.name);
        setLimit(budget.limit.toString());
        setStartDate(new Date(budget.startDate));
        setEndDate(new Date(budget.endDate));
      }
    } else {
      setName('');
      setLimit('');
      setStartDate(new Date());
      setEndDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    }
  }, [budgetId, budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !limit || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const limitAmount = parseFloat(limit);
    if (isNaN(limitAmount) || limitAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (budgetId) {
      updateBudget(budgetId, {
        name,
        limit: limitAmount,
        startDate,
        endDate,
      });
      toast({
        title: "Budget updated",
        description: "Your budget has been successfully updated.",
      });
    } else {
      addBudget({
        name,
        limit: limitAmount,
        startDate,
        endDate,
      });
      toast({
        title: "Budget created",
        description: "Your new budget has been successfully created.",
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{budgetId ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
          <DialogDescription>
            {budgetId ? 'Update your budget details' : 'Create a new budget to track your expenses'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name</Label>
              <Input
                id="name"
                placeholder="e.g., October 2024 - Groceries"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Limit Amount ($)</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                placeholder="500.00"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => startDate ? date < startDate : false}
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
              {budgetId ? 'Update' : 'Create'} Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetModal;