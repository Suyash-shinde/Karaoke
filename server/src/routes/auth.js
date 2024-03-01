import { Router } from "express";
import { verify } from "../controllers/Otp.controller.js";
import { generate } from "../controllers/Otp.controller.js";

const router= Router();
router.route("/register").post(generate);
router.route("/auth").post(verify);
export default router;