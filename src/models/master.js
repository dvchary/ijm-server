const mongoose = require("mongoose");
const masterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
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

module.exports = mongoose.model("Master", masterSchema);
