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
const middleware_1 = require("./middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const userLoginSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
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
        const newUser = yield middleware_1.UserModel.create({
            username,
            password: hashedPassword
        });
        return res.status(200).json({
            message: `welcome ${username}`,
        });
    }
    catch (err) {
        console.error("signup error:", err);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
}));
app.post("/api/v1/signin", (req, res) => { });
app.post("/api/v1/content", (req, res) => { });
app.get("/api/v1/content", (req, res) => { });
app.delete("/api/v1/delete", (req, res) => { });
app.listen(3000);
