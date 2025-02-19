import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to hold employees fetched from the backend
  const [employees, setEmployees] = useState([]);
  // State to track whether we are editing an employee (by index)
  const [editingIndex, setEditingIndex] = useState(null);
  // State for the employee form data
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    name: '',
    address: '',
    salary: ''
  });

  // 1. Fetch employees from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error fetching employees:', err));
  }, []);

  // 2. Handle input changes in the form
  const handleChange = (e) => {
    setEmployeeForm({
      ...employeeForm,
      [e.target.name]: e.target.value
    });
  };

  // 3. Add a new employee or update an existing one
  const handleAddEmployee = () => {
    // Basic validations
    if (employeeForm.employeeId.trim() === '') {
      alert("Please enter employee's ID.");
      return;
    }
    if (employeeForm.name.trim() === '') {
      alert("Please enter employee's name.");
      return;
    }
    if (employeeForm.address.trim() === '') {
      alert("Please enter employee's address.");
      return;
    }
    if (parseFloat(employeeForm.salary) <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    // If we're adding a new employee (not editing)
    if (editingIndex === null) {
      fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      })
        .then(res => res.json())
        .then(newEmployee => {
          // Append the new employee to the list
          setEmployees([...employees, newEmployee]);
        })
        .catch(err => console.error('Error adding employee:', err));
    } else {
      // Updating an existing employee
      const employeeToUpdate = employees[editingIndex];
      fetch(`http://localhost:5000/employees/${employeeToUpdate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      })
        .then(res => res.json())
        .then(updatedEmployee => {
          const updatedEmployees = [...employees];
          updatedEmployees[editingIndex] = updatedEmployee;
          setEmployees(updatedEmployees);
          setEditingIndex(null);
        })
        .catch(err => console.error('Error updating employee:', err));
    }

    // Clear the form fields after submission
    setEmployeeForm({
      employeeId: '',
      name: '',
      address: '',
      salary: ''
    });
  };

  // 4. Prepare the form for editing an employee
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEmployeeForm(employees[index]);
  };

  // 5. Delete an employee
  const handleDelete = (index) => {
    const employeeToDelete = employees[index];
    fetch(`http://localhost:5000/employees/${employeeToDelete._id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        const updatedEmployees = employees.filter((_, i) => i !== index);
        setEmployees(updatedEmployees);
      })
      .catch(err => console.error('Error deleting employee:', err));
  };

  return (
    <div className="App">
      <h1>Employee Management System</h1>
      <div className="form-container">
        <h2>{editingIndex === null ? 'Add Employee' : 'Edit Employee'}</h2>
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={employeeForm.employeeId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={employeeForm.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={employeeForm.address}
          onChange={handleChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employeeForm.salary}
          onChange={handleChange}
        />
        <button onClick={handleAddEmployee}>
          {editingIndex === null ? 'Save' : 'Update'}
        </button>
      </div>
      <div className="employee-list">
        <h2>Employees</h2>
        <ul>
          {employees.map((emp, index) => (
            <li key={emp._id || index}>
              <span>
                {emp.name} - {emp.address} - {emp.salary}
              </span>
              <button onClick={() => handleEdit(index)}>Edit</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
