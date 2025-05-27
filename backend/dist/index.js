"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_2 = require("./db");
const middleware_1 = require("./middleware");
(0, db_2.connect)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const Secret = process.env.JWT_SECRET;
const userLoginSchema = zod_1.z.object({
    username: zod_1.z.string().email().max(50),
    password: zod_1.z.string().min(6),
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = userLoginSchema.safeParse(req.body);
    if (!user.success) {
        return res.status(400).json({
            message: "Invalid Input",
            error: user.error.format(),
        });
    }
    const { username, password } = user.data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 4);
    try {
        const newUser = yield db_1.UserModel.create({
            username,
            password: hashedPassword,
        });
        return res.status(200).json({
            message: `welcome ${username}`,
        });
    }
    catch (err) {
        console.error("signup error:", err);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = userLoginSchema.safeParse(req.body);
        if (!user.success) {
            return res.status(400).json({
                message: "Invalid Inputs",
            });
        }
        const { username, password } = user.data;
        const existingUser = yield db_1.UserModel.findOne({
            username,
        });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        else {
            const pwMatch = yield bcrypt_1.default.compare(password, existingUser.password);
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id,
            }, Secret);
            if (!pwMatch) {
                return res.status(401).json({
                    message: "Invalid credentials",
                });
            }
            res.json({ token: token });
        }
    }
    catch (err) {
        console.error("signin error:", err);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMIddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = req.body.link;
        const title = req.body.title;
        // const tags = req.body.tags;
        const userId = req.userId;
        yield db_1.ContentModel.create({
            link,
            title,
            userId,
            tags: [],
        });
        res.status(200).json({
            message: "Content added succesfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal sever error",
        });
    }
}));
app.get("/api/v1/content", middleware_1.userMIddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const content = yield db_1.ContentModel.findOne({
            userId,
        }).populate("userId", "username");
        if (!content) {
            res.status(401).json({
                message: "no content found",
            });
        }
        res.status(200).json({ content });
    }
    catch (error) {
        res.status(500).json({
            message: "server error",
        });
    }
}));
app.delete("/api/v1/delete", middleware_1.userMIddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.body.contentId;
        yield db_1.ContentModel.findOneAndDelete({
            contentId,
            userId: req.userId,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
}));
app.listen(3000);
