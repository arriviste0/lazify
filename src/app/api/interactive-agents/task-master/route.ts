import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'createTask':
        // Simulate creating a task
        const task = {
          id: 'task-123',
          title: data.title,
          description: data.description,
          priority: data.priority || 'medium',
          dueDate: data.dueDate,
          status: 'pending'
        };
        return NextResponse.json({ 
          success: true, 
          task,
          message: 'Task created successfully'
        });

      case 'updateTask':
        // Simulate updating a task
        const updatedTask = {
          id: data.taskId,
          title: data.title,
          status: data.status,
          priority: data.priority
        };
        return NextResponse.json({ 
          success: true, 
          task: updatedTask,
          message: 'Task updated successfully'
        });

      case 'getTasks':
        // Simulate getting tasks
        const tasks = [
          { id: 'task-1', title: 'Complete project proposal', priority: 'high', status: 'in-progress' },
          { id: 'task-2', title: 'Review code changes', priority: 'medium', status: 'pending' },
          { id: 'task-3', title: 'Schedule team meeting', priority: 'low', status: 'completed' }
        ];
        return NextResponse.json({ 
          success: true, 
          tasks,
          message: 'Tasks retrieved successfully'
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