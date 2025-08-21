import Employee from "../models/employee.model.js";
// import fs from "fs";
// import path from "path";

// Add Employee
export const addEmployee = async (req, res) => {
  try {
    const { name, gender, dob, address, mobile, email, departmentId, designationId, doj } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Employee image is required" });
    }

    // Check if mobile or email already exists
    const existing = await Employee.findOne({
    $or: [{ mobile }, { email }]
    });
    if (existing) {
    return res.status(400).json({ message: "Mobile or email already exists" });
    }


    const employee = await Employee.create({
      name,
      gender,
      dob,
      address,
      mobile,
      email,
      departmentId,
      designationId,
      doj,
      image: req.file.filename,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List Employees 
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("departmentId", "name")
      .populate("designationId", "name");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, dob, address, mobile, email, departmentId, designationId, doj } = req.body;

    const updateData = { name, gender, dob, address, mobile, email, departmentId, designationId, doj };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const existing = await Employee.findOne({
    $or: [{ mobile }, { email }],
    _id: { $ne: id } 
    });
    if (existing) {
    return res.status(400).json({ message: "Mobile or email already exists" });
    }


    const updated = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
