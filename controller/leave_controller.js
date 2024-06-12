var express = require("express");
var bodyParser = require("body-parser");

const models = require("../models/db");

const FacultyInfo = models.FacultyInfo;
const Leave = models.Leave;
const User = models.User;

const app = express();
app.use(bodyParser.json());

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465, // Use your email provider's SMTP port
  secure: true, // Use SSL/TLS
  secureConnection: false,
  auth: {
    user: "akashveshala007@gmail.com",
    pass: "lztewhgeyuiljaik",
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const loginPage = (req, res) => {
  res.render("login");
};

const facultyLoginPage = (req, res) => {
  res.render("facultyLogin");
};

const hodLoginPage = (req, res) => {
  res.render("hodlogin");
};

const deanLoginPage = (req, res) => {
  res.render("deanlogin");
};

const directorLoginPage = (req, res) => {
  res.render("directorlogin");
};

const usersData = async (req, res) => {
  Leave.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};


const facultyLogin = async (req, res) => {
  try {
    const { facultyId, username, password } = req.body;

    console.log("Received credentials:", {
      facultyId,
      username,
      password,
    });

    // Verify user credentials
    const user = await User.findOne({ username, facultyId });
    // const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user || password != user.password) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    res.redirect(`/leaves/faculty/${facultyId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const hodLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received credentials:", {
      username,
      password,
    });

    // Verify user credentials
    const user = await User.findOne({ username });
    // const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user || password != user.password) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    res.redirect(`/leaves/hod`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deanLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received credentials:", {
      username,
      password,
    });

    // Verify user credentials
    const user = await User.findOne({ username });
    // const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user || password != user.password) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    res.redirect(`/leaves/dean`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const directorLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received credentials:", {
      username,
      password,
    });

    // Verify user credentials
    const user = await User.findOne({ username });
    // const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user || password != user.password) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    res.redirect(`/leaves/director`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


const facultyHomePage = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;

    const facultyInfo = await FacultyInfo.findOne({ facultyId });
    console.log(facultyInfo);
    if (!facultyInfo) {
      return res
        .status(404)
        .json({ success: false, error: "Faculty not found" });
    }

    res.render("faculty", { facultyInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAddLeave = (req, res) => {
  res.render("addLeave");
};

const getLeaveHistory = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    // console.log(facultyId);
    const result = await Leave.find({ facultyId: facultyId });
    console.log(result);
    
    result.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));
    res.render("history", { result: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addLeave = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("File:", req.file);
  const {
    facultyId,
    facultyName,
    leaveType,
    reason,
    noOfDays,
    fromDate,
    toDate,
    remarks,
    prefix_fromDate,
    prefix_toDate,
    prefix_noOfDays,
    suffix_fromDate,
    suffix_toDate,
    suffix_noOfDays,
  } = req.body;

  const documentProof = req.file ? req.file.path : null; // Get the path of the uploaded file

  // Check if prefixes and suffixes are filled, otherwise set them to null
  const prefixFromDate = prefix_fromDate ? new Date(prefix_fromDate) : null;
  const prefixToDate = prefix_toDate ? new Date(prefix_toDate) : null;
  const prefixNoOfDays = prefix_noOfDays ? parseInt(prefix_noOfDays, 10) : null;
  const suffixFromDate = suffix_fromDate ? new Date(suffix_fromDate) : null;
  const suffixToDate = suffix_toDate ? new Date(suffix_toDate) : null;
  const suffixNoOfDays = suffix_noOfDays ? parseInt(suffix_noOfDays, 10) : null;

  try {
    const facultyInfo = await FacultyInfo.findOne({ facultyId });

    if (!facultyInfo) {
      throw new Error("Faculty information not found");
    }
  

    let availableLeaves = 0;
    // Determine available leaves based on the leave type
    if (leaveType === "HalfPay Leave") {
      availableLeaves = facultyInfo.availableHalfPayLeaves;
    } else if (leaveType === "Casual Leave") {
      availableLeaves = facultyInfo.availableCasualLeaves;
    } else if (leaveType === "Earned Leave") {
      availableLeaves = facultyInfo.availableEarnedLeaves;
    } else if (leaveType === "Special Earned Leave") {
      availableLeaves = facultyInfo.availableEarnedLeaves * 2;
    } else if (leaveType === "Special Casual Leave") {
      availableLeaves = facultyInfo.availableSpecialCasualLeaves;
    } else if (leaveType === "Paternity Leave") {
      availableLeaves = facultyInfo.availablePaternityLeaves;
    } else if (leaveType === "Maternity Leave") {
      availableLeaves = facultyInfo.availableMaternityLeaves;
    }

    // Check if available leaves are sufficient for the requested days
    if (availableLeaves < noOfDays) {
      // Show JavaScript alert with error message
      const errorMessage = `You have only ${availableLeaves} leaves available for ${leaveType}. Requested days (${noOfDays}) exceed available leaves.`;
      return res.send(`
        <script>
          alert('${errorMessage}');
          window.location.href = '/leaves/applyLeave'; // Redirect to leave application page
        </script>
      `);
    }
  
  // Perform validation based on leave type
  let isValid = true;
  let errorMessage = "";

  if (leaveType === "Casual Leave") {
    const totalDays =
      (parseInt(prefixNoOfDays) || 0) +
      parseInt(noOfDays) +
      (parseInt(suffixNoOfDays) || 0);

      console.log("noOfDays ", noOfDays);
      console.log("prefixNoOfDays ", prefixNoOfDays);
      console.log("suffixNoOfDays ", suffixNoOfDays);
      console.log("totalDays ", totalDays);
    if (totalDays > 9) {
      isValid = false;
      errorMessage =
        "Casual leave constraint is not satisfied. Total days exceed 9.";
    }
  } else if (leaveType === "Earned Leave" && parseInt(noOfDays) > 7) {
    isValid = false;
    errorMessage = "Earned leave should not exceed 7 days.";
  }

  if (!isValid) {
    // Show JavaScript alert with error message
    return res.send(`
      <script>
        alert('${errorMessage}');
        window.location.href = '/leaves/applyLeave'; // Redirect to leave application page
      </script>
    `);
  }

  // Proceed to save the leave request if validation passes
  const leaveData = {
    facultyId,
    facultyName,
    leaveType,
    leaveStatus: "active",
    reason,
    noOfDays,
    fromDate,
    toDate,
    remarks,
    prefix_fromDate,
    prefix_toDate,
    prefix_noOfDays,
    suffix_fromDate,
    suffix_toDate,
    suffix_noOfDays,
    documentProof, // Include documentProof in the leaveData object
  };

  console.log("Leave Type:", leaveType);
  console.log("Document Proof:", documentProof);

  // Add documentProof field only if leaveType is Special Casual Leave
  if (leaveType === "Special Casual Leave" && !documentProof) {
    // Show alert if document proof is required but not provided
    return res.send(`
    <script>
      alert('Document proof is mandatory for Special Casual Leave.');
      window.location.href = '/leaves/applyLeave'; // Redirect to leave application page
    </script>
  `);
  }

  if (leaveType === "Special Casual Leave" && documentProof) {
    leaveData.documentProof = documentProof;
  }

  const leave = new Leave(leaveData);

  try {
    await leave.save();
    console.log("Leave request submitted successfully");

    // Send email notification to HOD
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "aarushsingh335@gmail.com", 
        subject: "New Leave Request",
        text: `A new leave request has been added by ${facultyName}.`,
      });

      console.log("Email notification sent to HOD");
    } catch (error) {
      console.error("Error sending email notification to HOD:", error);
    }

    // Send email acknowledgment to faculty
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "veshala.akash@iiitg.ac.in", 
        subject: "Leave Request Submitted",
        text: "Your leave request has been submitted successfully.",
      });

      console.log("Email acknowledgment sent to faculty");
    } catch (error) {
      console.error("Error sending email acknowledgment to faculty:", error);
    }
    res.redirect(`/leaves/faculty/${facultyId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const hodRecommendLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leaveResult = await Leave.findOneAndUpdate(
      { _id: leaveId, leaveStatus: "active" },
      { $set: { leaveStatus: "hod_recommended" } },
      { new: true }
    );

    if (!leaveResult) {
      console.log("Leave not found");
      return res.status(404).json({
        success: false,
        error: "Leave not found",
      });
    }

    // Send email notification to Dean
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "aarushsingh335@gmail.com",
        subject: "Leave Recommended by HOD",
        text: `A leave request has been recommended by the HOD for review.`,
      });

      console.log("Email notification sent to Dean");
    } catch (error) {
      console.error("Error sending email notification to Dean:", error);
    }

    // Send email acknowledgment to faculty
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "veshala.akash@iiitg.ac.in",
        subject: "Leave Request Update",
        text: "Your leave request has been recommended by the HOD.",
      });

      console.log("Email acknowledgment sent to faculty");
    } catch (error) {
      console.error("Error sending email acknowledgment to faculty:", error);
    }

    console.log("Leave recommended by HOD successfully");
    res.redirect("/leaves/hod");
    // res.json({
    //   success: true,
    //   message: "Leave recommended by HoD successfully",
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deanRecommendLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leaveResult = await Leave.findOneAndUpdate(
      { _id: leaveId, leaveStatus: "hod_recommended" },
      { $set: { leaveStatus: "dean_recommended" } },
      { new: true }
    );

    if (!leaveResult) {
      console.log("Leave is not hod_recommended");
      return res.status(404).json({
        success: false,
        error: "Leave is not hod_recommended",
      });
    }

    // Send email notification to Director
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "aarushsingh335@gmail.com", 
        subject: "Leave Recommended by Dean",
        text: `A leave request has been recommended by the Dean for review.`,
      });

      console.log("Email notification sent to Director");
    } catch (error) {
      console.error("Error sending email notification to Director:", error);
    }

    // Send email acknowledgment to faculty
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "veshala.akash@iiitg.ac.in",
        subject: "Leave Request Update",
        text: "Your leave request has been recommended by the Dean.",
      });

      console.log("Email acknowledgment sent to faculty");
    } catch (error) {
      console.error("Error sending email acknowledgment to faculty:", error);
    }

    console.log("Leave recommended by Dean successfully");
    res.redirect("/leaves/dean");
    // res.json({
    //   success: true,
    //   message: "Leave recommended by Dean successfully",
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const directorApproveLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    // Check if leave is dean_recommended before approving
    const leaveResult = await Leave.findOneAndUpdate(
      {
        _id: leaveId,
        leaveStatus: "dean_recommended",
      },
      { $set: { leaveStatus: "approved", approvedAt: new Date() } },
      { new: true }
    );

    if (!leaveResult) {
      console.log("Leave is not dean_recommended");
      return res.status(404).json({
        success: false,
        error: "Leave is not dean_recommended",
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
    } else if (leave_type === "Special Earned Leave") {
      // For Special Earned Leave, every 2 days reduce 1 day from Earned Leave
      const daysToDeduct = Math.ceil(leaveResult.noOfDays / 2);
      updateObject = {
        $inc: { availableEarnedLeaves: -daysToDeduct },
      };
    } else if (leave_type === "Special Casual Leave") {
      updateObject = {
        $inc: { availableSpecialCasualLeaves: -leaveResult.noOfDays },
      };
    } else if (leave_type === "Paternity Leave") {
      updateObject = {
        $inc: { availablePaternityLeaves: -leaveResult.noOfDays },
      };
    } else if (leave_type === "Maternity Leave") {
      updateObject = {
        $inc: { availableMaternityLeaves: -leaveResult.noOfDays },
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
    // Send email acknowledgment to faculty
    try {
      await transporter.sendMail({
        from: "akashveshala007@gmail.com",
        to: "veshala.akash@iiitg.ac.in",
        subject: "Leave Request Update",
        text: "Your leave request has been successfully approved by the Director.",
      });

      console.log("Email acknowledgment sent to faculty");
    } catch (error) {
      console.error("Error sending email acknowledgment to faculty:", error);
    }
    res.redirect("/leaves/director");
    // res.json({ success: true, message: "Leave approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const directorRejectLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leaveResult = await Leave.findOneAndUpdate(
      { _id: leaveId, leaveStatus: { $ne: "rejected" } },
      { $set: { leaveStatus: "rejected", rejectedAt: new Date() } },
      { new: true }
    );

    if (leaveResult) {
      console.log("Leave rejected successfully");

      // Send email notification to faculty
      try {
        await transporter.sendMail({
          from: "akashveshala007@gmail.com",
          to: "veshala.akash@iiitg.ac.in",
          subject: "Leave Request Update",
          text: "Your leave request has been rejected by the Director.",
        });

        console.log("Email notification sent to faculty");
      } catch (error) {
        console.error("Error sending email notification to faculty:", error);
      }

      res.redirect("/leaves/director");
      // res.json({ success: true, message: "Leave rejected successfully" });
    } else {
      console.log("Leave not found or already rejected");
      res.status(404).json({
        success: false,
        error: "Leave not found or already rejected",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
const hodRejectLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leaveResult = await Leave.findOneAndUpdate(
      { _id: leaveId, leaveStatus: { $ne: "rejected" } },
      { $set: { leaveStatus: "rejected", rejectedAt: new Date() } },
      { new: true }
    );

    if (leaveResult) {
      console.log("Leave rejected successfully");

      // Send email notification to faculty
      try {
        await transporter.sendMail({
          from: "akashveshala007@gmail.com",
          to: "veshala.akash@iiitg.ac.in",
          subject: "Leave Request Update",
          text: "Your leave request has been rejected by the HOD.",
        });

        console.log("Email notification sent to faculty");
      } catch (error) {
        console.error("Error sending email notification to faculty:", error);
      }

      res.redirect("/leaves/hod");
      // res.json({ success: true, message: "Leave rejected successfully" });
    } else {
      console.log("Leave not found or already rejected");
      res.status(404).json({
        success: false,
        error: "Leave not found or already rejected",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
const deanRejectLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const leaveResult = await Leave.findOneAndUpdate(
      { _id: leaveId, leaveStatus: { $ne: "rejected" } },
      { $set: { leaveStatus: "rejected", rejectedAt: new Date() } },
      { new: true }
    );

    if (leaveResult) {
      console.log("Leave rejected successfully");

      // Send email notification to faculty
      try {
        await transporter.sendMail({
          from: "akashveshala007@gmail.com",
          to: "veshala.akash@iiitg.ac.in",
          subject: "Leave Request Update",
          text: "Your leave request has been rejected by the Dean.",
        });

        console.log("Email notification sent to faculty");
      } catch (error) {
        console.error("Error sending email notification to faculty:", error);
      }

      res.redirect("/leaves/dean");
      // res.json({ success: true, message: "Leave rejected successfully" });
    } else {
      console.log("Leave not found or already rejected");
      res.status(404).json({
        success: false,
        error: "Leave not found or already rejected",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
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

const getHODRecommendedLeaves = (req, res) => {
  Leave.find({ leaveStatus: "hod_recommended" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const getDeanRecommendedLeaves = (req, res) => {
  Leave.find({ leaveStatus: "dean_recommended" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const hodHomePage = (req, res) => {
  Leave.find({ leaveStatus: "active" })
    .then((result) => {
      res.render("hod", { activeLeaves: result });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const deanHomePage = (req, res) => {
  Leave.find({ leaveStatus: "hod_recommended" })
    .then((result) => {
      res.render("dean", { hodRecommendedLeaves: result });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const directorHomePage = (req, res) => {
  Leave.find({ leaveStatus: "dean_recommended" })
    .then((result) => {
      res.render("director", { deanRecommendedLeaves: result });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
};

module.exports = {
  addLeave,
  directorApproveLeave,
  getActiveLeaves,
  getHODRecommendedLeaves,
  getDeanRecommendedLeaves,
  hodRecommendLeave,
  deanRecommendLeave,
  hodHomePage,
  deanHomePage,
  hodRejectLeave,
  deanRejectLeave,
  directorRejectLeave,
  directorHomePage,
  loginPage,
  facultyLogin,
  facultyHomePage,
  facultyLoginPage,
  deanLogin,
  hodLogin,
  directorLogin,
  hodLoginPage,
  deanLoginPage,
  directorLoginPage,
  usersData,
  getAddLeave,
  getLeaveHistory,
};
