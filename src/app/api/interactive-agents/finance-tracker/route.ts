import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'addExpense':
        // Simulate adding an expense
        const expense = {
          id: 'expense-123',
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date || new Date().toISOString()
        };
        return NextResponse.json({ 
          success: true, 
          expense,
          message: 'Expense added successfully'
        });

      case 'getExpenses':
        // Simulate getting expenses
        const expenses = [
          { id: 'exp-1', amount: 50, category: 'food', description: 'Lunch', date: '2024-01-15' },
          { id: 'exp-2', amount: 200, category: 'transport', description: 'Fuel', date: '2024-01-14' },
          { id: 'exp-3', amount: 1000, category: 'bills', description: 'Electricity', date: '2024-01-13' }
        ];
        return NextResponse.json({ 
          success: true, 
          expenses,
          message: 'Expenses retrieved successfully'
        });

      case 'getAnalytics':
        // Simulate getting financial analytics
        const analytics = {
          totalSpent: 1250,
          categoryBreakdown: {
            food: 200,
            transport: 300,
            bills: 750
          },
          monthlyTrend: 'decreasing'
        };
        return NextResponse.json({ 
          success: true, 
          analytics,
          message: 'Analytics retrieved successfully'
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 