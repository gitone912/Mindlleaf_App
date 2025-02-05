import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createTaskApi, updateTaskCompletionApi, getTodaysTasksApi } from '../../api/actionTasks.Api';

interface Task {
  task_id: string;  // Changed from taskId
  user_id: string;  // Changed from userId
  task_name: string; // Changed from taskName
  is_completed: boolean;
  completed_at: string | null;
  completion_points: number;
  date: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: { userId: string; taskName: string; completion_points: number }) => {
    const response = await createTaskApi(taskData);
    return response.task;
  }
);

export const updateTaskCompletion = createAsyncThunk(
  'tasks/updateTaskCompletion',
  async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
    const response = await updateTaskCompletionApi(taskId, isCompleted);
    return { taskId, ...response };
  }
);

export const getTodaysTasks = createAsyncThunk(
  'tasks/getTodaysTasks',
  async (userId: string) => {
    const response = await getTodaysTasksApi(userId);
    return response.tasks;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })
      .addCase(updateTaskCompletion.fulfilled, (state, action) => {
        const task = state.tasks.find(t => t.task_id === action.payload.taskId); // Updated to use task_id
        if (task) {
          task.is_completed = true;
          task.completed_at = new Date().toISOString();
        }
      })
      .addCase(getTodaysTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  },
});

export default taskSlice.reducer;
