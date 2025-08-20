import mongoose from "mongoose"

const departmentSchema = mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String },
});

export default mongoose.model("Departments", departmentSchema);
