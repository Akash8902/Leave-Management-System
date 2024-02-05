const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

const leaveSchema = new mongoose.Schema(
  {
    facultyId: { type: String, required: true },
    facultyName: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ["HalfPay Leave", "Earned Leave", "Casual Leave"],
      required: true,
    },
    leaveStatus: {
      type: String,
      enum: ["approved", "rejected", "active", "recommended"],
      default: "active",
    },
    reason: { type: String, required: true },
    noOfDays: { type: Number, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

const Leave = mongoose.model('leave',leaveSchema);

const facultyInfoSchema = new mongoose.Schema({
  facultyId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  availableHalfPayLeaves: { type: Number, required: true },
  availableEarnedLeaves: { type: Number, required: true },
  availableCasualLeaves: { type: Number, required: true },
});

const FacultyInfo = mongoose.model("FacultyInfo", facultyInfoSchema);


module.exports = {
  FacultyInfo,
  Leave
};