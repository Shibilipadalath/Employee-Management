import express from "express";
import multer from "multer";
import { addEmployee, getEmployees, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addEmployee);
router.get("/", getEmployees);
router.put("/:id", upload.single("image"), updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
