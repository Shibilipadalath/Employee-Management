import Department from "../models/department.model.js";
import Employee from "../models/employee.model.js";
import Designation from "../models/designation.model.js";


//adding department
export const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = new Department({ name, description });
    await department.save();

    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//list all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingDepartment = await Department.findOne({ name, _id: { $ne: id } });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    //deleting designations
    await Designation.deleteMany({ departmentId: id });

    // unlinking employees
    await Employee.updateMany(
      { departmentId: id },
      { $set: { departmentId: null, designationId: null } }
    );

    //deleting department
    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({
      message: "Department deleted. Linked designations removed. Employees unlinked."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};