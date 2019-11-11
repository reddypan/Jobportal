const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: {type: String, required: true },
  role: {type: String, required: false },
  location: {type: String, required: false },
  about: { type: String, required: false },
  skills: {type: [ {
    skillname: {type: String, required: false },
    skillgrade: { type: String, required:false }
  }], required: false },
  workexperience: {type: [{
    jobtitle: {type: String, required:false },
    companyname: {type: String, required: false },
    companylocation: { type: String, required: false },
    startdate: { type: String, required: false },
    enddate: { type: String, required: false },
    jobdescription: { type: String, required: false },
  }], required: false},
  education: {type: [{
    degree: {type: String, required:false },
    schoolname: {type: String, required: false },
    schoollocation: { type: String, required: false },
    fieldofstudy: { type: String, required: false },
    grades: { type: String, required: false },
    startdate: { type: String, required: false },
    enddate: { type: String, required: false },
    description: { type: String, required: false },
  }], required: false},
  imagePath: { type: String, required: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
