import { Router } from "express";
import { verify } from "../controllers/Otp.controller.js";
import { generate } from "../controllers/Otp.controller.js";
import {register } from "../controllers/User.controller.js";
import { login } from "../controllers/User.controller.js";
import {verifyJwt} from "../middleware/auth.middleware.js";
import { logout } from "../controllers/User.controller.js";
import { refreshAccessToken } from "../controllers/User.controller.js";
import { addRoom,getAllRooms,fetchData} from "../controllers/Rooms.controller.js";
const router= Router();
router.route("/register").post(generate);
router.route("/auth").post(verify);
router.route("/details").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt,logout);
router.route("/refresh").post(refreshAccessToken);
router.route("/create").post(verifyJwt,addRoom);
router.route("/getAllRooms").get(verifyJwt,getAllRooms);
router.route("/room/:roomId").get(verifyJwt, fetchData);
export default router;