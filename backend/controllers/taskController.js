const Task = require('../models/Task');

// Create Task
const createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
