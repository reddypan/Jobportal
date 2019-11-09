const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  salary: { type: String, required: true },
  jobType: { type: String, required: true },
  requiredSkills: { type: String, required: true },
  companyName: { type: String, required: true },
  imagePath: { type: String, required: true },
  companyDescription: { type: String, required: true },
  location: { type: String, required: true },
  createdOn: { type: String, required: true },
  endsOn: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
