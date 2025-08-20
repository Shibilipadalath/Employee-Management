const mongoose = require("mongoose");

const designationSchema = mongoose.Schema({
  name: { type: String, require: true },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departmetns",
    require: true,
  },
  description: { type: String },
});

export default mongoose.model("Designations", designationSchema);
