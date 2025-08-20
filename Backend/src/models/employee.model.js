import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, "Invalid mobile number"],
      required: true,
      unique: true,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
      required: true,
      unique: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      default: null,
    },
    doj: { type: Date, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
