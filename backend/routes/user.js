const express = require("express");

const UserController = require("../controllers/user");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", UserController.getUser);

router.put("/:id", checkAuth, UserController.addUserExperience);

router.put("/updateexperience/:id", checkAuth, UserController.updateUserExperience);

router.get("/workexperiences/:userId/:experienceId", UserController.getExperience);

router.delete("/deleteexperience/:userId/:experienceId", UserController.deleteExperience);

router.put("/education/:id", checkAuth, UserController.addUserEducation);

router.put("/updateeducation/:id", checkAuth, UserController.updateUserEducation);

router.get("/education/:userId/:educationId", UserController.getEducation);

router.delete("/deleteeducation/:userId/:educationId", UserController.deleteEducation);

module.exports = router;
