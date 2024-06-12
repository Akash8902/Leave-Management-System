var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var leaveController = require("../controller/leave_controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


const app = express();
app.use(bodyParser.json());

router.get("/usersdata", leaveController.usersData);

router.get("/login", leaveController.loginPage);

router.get("/facultyLogin", leaveController.facultyLoginPage);

router.get("/hodLogin", leaveController.hodLoginPage);

router.get("/deanLogin", leaveController.deanLoginPage);

router.get("/directorLogin", leaveController.directorLoginPage);

router.post("/facultyLogin", leaveController.facultyLogin);

router.post("/hodLogin", leaveController.hodLogin);

router.post("/deanLogin", leaveController.deanLogin);

router.post("/directorLogin", leaveController.directorLogin);

router.get("/faculty/:facultyId", leaveController.facultyHomePage);

router.get("/applyLeave", leaveController.getAddLeave);

router.get("/leaveHistory/:facultyId", leaveController.getLeaveHistory);

router.post(
  "/add_leave",
  upload.single("documentProof"),
  leaveController.addLeave
);

router.post("/approve/:id", leaveController.directorApproveLeave);

router.post("/reject/:id", leaveController.directorRejectLeave);

router.get("/active_leaves", leaveController.getActiveLeaves);

router.get("/hod", leaveController.hodHomePage);

router.get("/dean", leaveController.deanHomePage);

router.get("/director", leaveController.directorHomePage);

router.get("/hod_recommended", leaveController.getHODRecommendedLeaves);

router.get("/dean_recommended", leaveController.getDeanRecommendedLeaves);

router.post("/hod_recommend/:id", leaveController.hodRecommendLeave);

router.post("/dean_recommend/:id", leaveController.deanRecommendLeave);

router.post("/hod_reject/:id", leaveController.hodRejectLeave);

router.post("/dean_reject/:id", leaveController.deanRejectLeave);

module.exports = router;
