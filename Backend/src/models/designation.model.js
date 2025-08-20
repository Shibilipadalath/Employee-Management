import mongoose from "mongoose"

const designationSchema = mongoose.Schema({
  name: { type: String, required: true },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null,
  },
  description: { type: String },
});

export default mongoose.model("Designation", designationSchema);
