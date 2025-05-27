"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMIddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Secret = process.env.JWT_SECRET;
const userMIddleWare = (req, res, next) => {
    const headers = req.headers["authorization"];
    const decoded = jsonwebtoken_1.default.verify(headers, Secret);
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            "message": "Invalid credentials"
        });
    }
};
exports.userMIddleWare = userMIddleWare;
