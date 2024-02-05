var express = require("express");
var bodyParser = require("body-parser");

const models = require("../models/db");

const FacultyInfo = models.FacultyInfo;
const Leave = models.Leave;

const app = express();
app.use(bodyParser.json());

const addLeave = (req, res) => {
  const {
    facultyId,
    facultyName,
    leaveType,
    reason,
    noOfDays,
    fromDate,
    toDate,
  } = req.body;

  const leave = new Leave({
    facultyId,
    facultyName,
    leaveType,
    leaveStatus: "active",
    reason,
    noOfDays,
    fromDate,
    toDate,
  });

  leave
    .save()
    .then((result) => {
      console.log("Leave request submitted successfully");
      res.json({
        success: true,
        message: "Leave request submitted successfully",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });
};

const recommendLeave = (req, res) => {
  const leaveId = req.params.id;

  Leave.findOneAndUpdate(
    { _id: leaveId, leaveStatus: { $ne: "recommended" } },
    { $set: { leaveStatus: "recommended"} },
    { new: true }
  )
    .then((result) => {
      if (result) {
        console.log("Leave recommended successfully");
        res.json({ success: true, message: "Leave recommended successfully" });
      } else {
        console.log("Leave not found or already recommended");
        res.status(404).json({
          success: false,
          error: "Leave not found or already recommended",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });
};

const approveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    // Check if leave is recommended before approving
    const leaveResult = await Leave.findOneAndUpdate(
      {
        _id: leaveId,
        leaveStatus: { $ne: "approved" },
        leaveStatus: "recommended",
      },
      { $set: { leaveStatus: "approved", approvedAt: new Date() } },
      { new: true }
    );

    if (!leaveResult) {
      console.log("Leave not found, already approved, or not recommended");
      return res.status(404).json({
        success: false,
        error: "Leave not found, already approved, or not recommended",
      });
    }

    const faculty_id = leaveResult.facultyId;
    const leave_type = leaveResult.leaveType;

    console.log(faculty_id);
    console.log(leave_type);

    // Preparing the update object based on leave_type
    let updateObject = {};
    if (leave_type === "HalfPay Leave") {
      updateObject = {
        $inc: { availableHalfPayLeaves: -leaveResult.noOfDays },
      };
    } else if (leave_type === "Casual Leave") {
      updateObject = {
        $inc: { availableCasualLeaves: -leaveResult.noOfDays },
      };
    } else if (leave_type === "Earned Leave") {
      updateObject = {
        $inc: { availableEarnedLeaves: -leaveResult.noOfDays },
      };
    }

    const facultyResult = await FacultyInfo.findOneAndUpdate(
      { facultyId: faculty_id },
      updateObject,
      { new: true }
    );

    if (!facultyResult) {
      console.log("Faculty not found");
      return res
        .status(404)
        .json({ success: false, error: "Faculty not found" });
    }

    console.log("Leave approved successfully");
    res.json({ success: true, message: "Leave approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const rejectLeave = (req, res) => {
  const leaveId = req.params.id;

  Leave.findOneAndUpdate(
    { _id: leaveId, leaveStatus: { $ne: "rejected" } },
    { $set: { leaveStatus: "rejected", rejectedAt: new Date() } },
    { new: true }
  )
    .then((result) => {
      if (result) {
        console.log("Leave rejected successfully");
        res.json({ success: true, message: "Leave rejected successfully" });
      } else {
        console.log("Leave not found or already rejected");
        res.status(404).json({
          success: false,
          error: "Leave not found or already rejected",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });
};

const getActiveLeaves = (req, res) => {
  Leave.find({ leaveStatus: "active" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const getRecommendedLeaves = (req, res) => {
  Leave.find({ leaveStatus: "recommended" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

module.exports = {
  addLeave,
  approveLeave,
  rejectLeave,
  getActiveLeaves,
  getRecommendedLeaves,
  recommendLeave,
};
