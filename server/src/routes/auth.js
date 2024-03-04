import { Router } from "express";
import { verify } from "../controllers/Otp.controller.js";
import { generate } from "../controllers/Otp.controller.js";
import {register } from "../controllers/User.controller.js";
import { login } from "../controllers/User.controller.js";

const router= Router();
router.route("/register").post(generate);
router.route("/auth").post(verify);
router.route("/details").post(register);
router.route("/login").post(login);
export default router;