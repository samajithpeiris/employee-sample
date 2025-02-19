const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employees';

mongoose.connect(MONGO_URI, {
  // These options can be removed if you’re using Node.js Driver 4.x
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


// Define the Employee schema and model
const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  address: String,
  salary: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

// RESTful Endpoints

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new employee
app.post('/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
