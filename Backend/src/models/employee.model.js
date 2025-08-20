import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], require: true },
    dob: { type: Date, require: true },
    address: { type: String, require: true },
    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, "Invalid mobile number"],
      require: true,
      unique: true,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
      require: true,
      unique: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      require: true,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designations",
      require: true,
    },
    doj: { type: Date, require: true },
    image: { type: String, require: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employees", employeeSchema);
