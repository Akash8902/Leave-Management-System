const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  facultyId: { type: Number, required: true },
  facultyName: { type: String, required: true },
  leaveType: { type: String, required: true },
  leaveStatus: { type: String, default: "active" },
  reason: { type: String, required: true },
  noOfDays: { type: Number, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  remarks: { type: String },
  prefix_fromDate: { type: Date },
  prefix_toDate: { type: Date },
  prefix_noOfDays: { type: Number },
  suffix_fromDate: { type: Date },
  suffix_toDate: { type: Date },
  suffix_noOfDays: { type: Number },
  documentProof: { type: String }, // Path to the uploaded document proof
});

const Leave = mongoose.model("Leave", leaveSchema);


const facultyInfoSchema = new mongoose.Schema({
  facultyId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  availableHalfPayLeaves: { type: Number, required: true },
  availableEarnedLeaves: { type: Number, required: true },
  availableCasualLeaves: { type: Number, required: true },
  availableSpecialCasualLeaves: { type: Number, required: true }, 
  availableMaternityLeaves: { type: Number, required: true }, 
  availablePaternityLeaves: { type: Number, required: true }, 
});

const FacultyInfo = mongoose.model("FacultyInfo", facultyInfoSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  facultyId: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  FacultyInfo,
  Leave,
  User,
};
