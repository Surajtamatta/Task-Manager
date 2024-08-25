"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const database_1 = require("../config/database");
const Task_1 = require("../entities/Task");
const User_1 = require("../entities/User");
const taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user.id; // Type assertion here
    try {
        const user = yield userRepository.findOneBy({ id: userId });
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
        yield taskRepository.save(task);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // Type assertion here
    try {
        const tasks = yield taskRepository.find({ where: { user: { id: userId } } });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    try {
        const task = yield taskRepository.findOneBy({ id: Number(taskId) });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        yield taskRepository.save(task);
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const task = yield taskRepository.findOneBy({ id: Number(taskId) });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        yield taskRepository.remove(task);
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map