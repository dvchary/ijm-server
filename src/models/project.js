const mongoose = require("mongoose");
const masterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
  },
  category: {
    type: String,
  },
  image: { type: String },
  parentId: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Project", masterSchema);
