import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { cloudUpload } from "../utils/cloudinary.js";
const options = {
    httpOnly: true,
    secure: true,
    sameSite:"none",

};
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.genereateAccessTokens();
        const refreshToken = user.genereateRefreshTokens();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const findUser = await User.findOne({ username });
        if (findUser) {
            return res.json({
                msg: "Username already exists, please choose another username",
                status: false,
            });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        if (!newUser) {
            return res.json({
                msg: "Error creating new user, please try again.",
                status: false,
            });
        }
        const findUser2 = await User.findOne({ username });
        const accessToken = findUser2.genereateAccessTokens();
        const refreshToken = findUser2.genereateRefreshTokens();
        findUser2.refreshToken = refreshToken;
        findUser2.save({ validateBeforeSave: false });

        delete newUser.password;
        const refinduser = await User.findOne({ username }).select(
            "-password -refreshToken",
        );
        const user = {
            id: refinduser._id,
            avatar: refinduser.avatar,
            username: refinduser.username,
            email: refinduser.email,
        };
        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ msg: "New User Created", status: true, user: user });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const findUser = await User.findOne({ username });
        console.log("login attempt");
        if (!findUser) {
            return res.json({
                msg: "User not found",
                status: false,
            });
        }
        const checkPassword = bcrypt.compareSync(password, findUser.password);
        if (!checkPassword) {
            return res.json({
                msg: "Invaid Username or password",
                status: false,
            });
        }
        const accessToken = findUser.genereateAccessTokens();
        const refreshToken = findUser.genereateRefreshTokens();
        findUser.refreshToken = refreshToken;
        await findUser.save({ validateBeforeSave: false });

        delete findUser.password;
        const loggedInUser = await User.findById(findUser._id).select(
            "-password -refreshToken",
        );
        const send_user = {
            id: loggedInUser._id,
            username: loggedInUser.username,
            email: loggedInUser.email,
            avatar: loggedInUser.avatar,
        };
        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                msg: "User Logged In",
                user: send_user,
                status: true,
            });
    } catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    const incomingAccessToken = req.cookies?.accessToken;
    const decodedToken = await jwt.verify(
        incomingAccessToken,
        process.env.ACCESS_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken",
    );
    if (!user) {
        return res.json({
            msg: "Unauthorised request",
            status: false,
        });
    }
    user.refreshToken = "";
    await user.save({ validateBeforeSave: false });

    return res.clearCookie("accessToken").clearCookie("refreshToken").json({
        msg: "User Logged Out",
        status: true,
        user: req.user,
    });
};

export const refreshAccessToken = async (req, res, next) => {
    const incomingRefreshToken = await req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
        return res.json({ msg: "Unauthorised request", status: false });
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        const findUser = await User.findById(decodedToken?._id);
        if (!findUser) {
            return res.json({ msg: "Invalid Refresh Token", status: false });
        }
        if (incomingRefreshToken !== findUser.refreshToken) {
            return res.json({ msg: "Login Expired", status: false });
        }
        const accessToken = findUser.genereateAccessTokens();
        const refreshToken = findUser.genereateRefreshTokens();
        findUser.refreshToken = refreshToken;
        await findUser.save({ validateBeforeSave: false });
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                msg: "Access Token Refreshed",
            });
    } catch (error) {
        next(error);
    }
};

export const uploadAvatar = async (req, res, next) => {
    try {
        const avatarPath = req.file?.path;
        if (!avatarPath) {
            return res.json({
                msg: "No file found",
                status: false,
            });
        }

        const avatar = await cloudUpload(avatarPath);
        if (!avatar.url) {
            return res.json({
                msg: "Error in uploading the image",
                status: false,
            });
        }
        const setUser = await User.findByIdAndUpdate(
            req.body?.id,
            { $set: { avatar: avatar.url } },
            { new: true },
        ).select("-password");
        const user = {
            id: setUser._id,
            username: setUser.username,
            email: setUser.email,
            avatar: setUser.avatar,
        };
        return res.json({
            msg: "Avatar updated succesfully",
            status: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { newUsername, username, password } = req.body;
        const findUser = await User.findOne({ username });
        if (!findUser) {
            return res.json({ msg: "Error finding user", status: false });
        }
        findUser.username = newUsername;
        if (password) {
            const hashedPass = bcrypt.hashSync(password, 10);
            findUser.password = hashedPass;
        }
        await findUser.save({ validateBeforeSave: false });
        const loggedInUser = await User.findOne({ username: newUsername }).select(
            "-password -refreshToken",
        );
        const send_user = {
            id: loggedInUser._id,
            username: loggedInUser.username,
            email: loggedInUser.email,
            avatar: loggedInUser.avatar,
        };
        if (!loggedInUser) {
            return res.json({
                msg: "Error finding new User",
                status: false,
            });
        }

        return res.json({
            msg: "User info updated",
            status: true,
            user: send_user,
        });
    } catch (error) {
        next(error);
    }
};
