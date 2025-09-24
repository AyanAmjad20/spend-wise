import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, Filter, Receipt } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ExpenseModal from '@/components/ExpenseModal';
import { toast } from '@/hooks/use-toast';

const BudgetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { budgets, getBudgetExpenses, getBudgetTotal, deleteExpense } = useBudget();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);

  const budget = budgets.find(b => b.id === id);
  const expenses = getBudgetExpenses(id || '');
  const totalSpent = getBudgetTotal(id || '');

  if (!budget) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="shadow-card border-0">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Budget not found</p>
            <Link to="/budgets">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Budgets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const percentage = (totalSpent / budget.limit) * 100;
  const remaining = budget.limit - totalSpent;

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
      toast({
        title: "Expense deleted",
        description: "The expense has been successfully deleted.",
      });
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Food': return 'success';
      case 'Transport': return 'warning';
      case 'Bills': return 'destructive';
      case 'Entertainment': return 'default';
      case 'Subscription': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/budgets" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Budgets
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">{budget.name}</h1>
          <p className="text-muted-foreground flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {format(budget.startDate, 'MMM d, yyyy')} - {format(budget.endDate, 'MMM d, yyyy')}
          </p>
        </div>

        {/* Summary Card */}
        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget Limit</p>
                  <p className="text-2xl font-bold">${budget.limit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {remaining >= 0 ? 'Remaining' : 'Over Budget'}
                  </p>
                  <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ${Math.abs(remaining).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.min(percentage, 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-3 ${
                    percentage >= 90 ? '[&>div]:bg-destructive' : 
                    percentage >= 75 ? '[&>div]:bg-warning' : 
                    '[&>div]:bg-success'
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {expenses.length > 0 ? (
          <Card className="shadow-card border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {format(expense.spentAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {expense.description}
                          {expense.receipt && (
                            <Receipt className="w-4 h-4 ml-2 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {expense.category && (
                          <Badge variant={getCategoryColor(expense.category) as any}>
                            {expense.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingExpense(expense.id);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card border-0">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No expenses recorded yet.</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Expense
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        expenseId={editingExpense}
        defaultBudgetId={id}
      />
    </div>
  );
};

export default BudgetDetail;