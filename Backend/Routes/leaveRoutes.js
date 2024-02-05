var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var leaveController = require("../controller/leave_controller");

const app = express();
app.use(bodyParser.json());

router.post("/add_leave", leaveController.addLeave);

router.post("/approve/:id", leaveController.approveLeave);

router.post("/reject/:id", leaveController.rejectLeave);

router.get("/active_leaves", leaveController.getActiveLeaves);

router.get("/recommended_leaves", leaveController.getRecommendedLeaves);

router.post("/recommend/:id", leaveController.recommendLeave);

module.exports = router;
