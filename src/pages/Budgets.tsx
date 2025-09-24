import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import BudgetModal from '@/components/BudgetModal';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Budgets: React.FC = () => {
  const { budgets, getBudgetTotal, deleteBudget } = useBudget();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      toast({
        title: "Budget deleted",
        description: "The budget has been successfully deleted.",
      });
    }
  };

  const getBudgetStatus = (budget: any) => {
    const spent = getBudgetTotal(budget.id);
    const percentage = (spent / budget.limit) * 100;
    const remaining = budget.limit - spent;

    let statusColor = 'success';
    if (percentage >= 90) statusColor = 'destructive';
    else if (percentage >= 75) statusColor = 'warning';

    return { spent, percentage, remaining, statusColor };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getBudgetTotal(b.id), 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Budgets</h1>
          <p className="text-muted-foreground">Track and manage your spending across different categories</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-2xl">${totalBudget.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="text-2xl">${totalSpent.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardDescription>Remaining</CardDescription>
              <CardTitle className="text-2xl">${(totalBudget - totalSpent).toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Budget Button */}
        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const { spent, percentage, remaining, statusColor } = getBudgetStatus(budget);
            
            return (
              <Card key={budget.id} className="shadow-card border-0 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{budget.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(budget.startDate, 'MMM d')} - {format(budget.endDate, 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingBudget(budget.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">${spent.toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${
                        percentage >= 90 ? '[&>div]:bg-destructive' : 
                        percentage >= 75 ? '[&>div]:bg-warning' : 
                        '[&>div]:bg-success'
                      }`}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Limit</span>
                      <span className="font-medium">${budget.limit.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    percentage >= 90 ? 'bg-destructive-light' : 
                    percentage >= 75 ? 'bg-warning-light' : 
                    'bg-success-light'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {remaining >= 0 ? 'Remaining' : 'Over budget'}
                      </span>
                      <div className="flex items-center">
                        {remaining >= 0 ? 
                          <TrendingUp className="w-4 h-4 mr-1 text-success" /> : 
                          <TrendingDown className="w-4 h-4 mr-1 text-destructive" />
                        }
                        <span className="font-bold">
                          ${Math.abs(remaining).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/budgets/${budget.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card className="shadow-card border-0">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any budgets yet.</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        budgetId={editingBudget}
      />
    </div>
  );
};

export default Budgets;