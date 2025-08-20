import Designation from "../models/designation.model.js";
import Employee from "../models/employee.model.js";

// Add designation
export const addDesignation = async (req, res) => {
  try {
    const { name, departmentId, description } = req.body;

    const existing = await Designation.findOne({ name, departmentId });
    if (existing) {
      return res.status(400).json({ message: "Designation already exists in this department" });
    }

    const designation = await Designation.create({ name, departmentId, description });
    res.status(201).json(designation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get designations (with optional department filter)
export const getDesignations = async (req, res) => {
  try {
    const { departmentId } = req.query;
    const filter = departmentId ? { departmentId } : {};
    const designations = await Designation.find(filter).populate("departmentId", "name");
    res.json(designations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update designation
export const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentId, description } = req.body;

    const existing = await Designation.findOne({ name, departmentId, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ message: "Designation already exists in this department" });
    }

    const updated = await Designation.findByIdAndUpdate(
      id,
      { name, departmentId, description },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete designation
export const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.updateMany({ designationId: id }, { $set: { designationId: null } });

    const deleted = await Designation.findByIdAndDelete(id);
    res.json({ message: "Designation deleted and employees updated", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
