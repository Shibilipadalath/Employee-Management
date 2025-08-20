import mongoose from "mongoose"

const departmentSchema = mongoose.Schema({
  name: { type: String, required: true ,unique: true },
  description: { type: String },
});

export default mongoose.model("Department", departmentSchema);
