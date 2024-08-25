import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import { AuthenticatedRequest } from '../types/express';

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

export const createTask = async (req: Request, res: Response) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = (req as AuthenticatedRequest).user.id; // Type assertion here

  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = taskRepository.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user,
    });

    await taskRepository.save(task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id; // Type assertion here

  try {
    const tasks = await taskRepository.find({ where: { user: { id: userId } } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const task = await taskRepository.findOneBy({ id: Number(taskId) });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await taskRepository.save(task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await taskRepository.findOneBy({ id: Number(taskId) });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRepository.remove(task);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
