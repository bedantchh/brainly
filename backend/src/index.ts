import express, { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "./db";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { connect } from "./db";
connect();

const app = express();
app.use(express.json());
const Secret = process.env.JWT_SECRET as string;

const userLoginSchema = z.object({
  username: z.string().email().max(50),
  password: z.string().min(6),
});

app.post("/api/v1/signup", async (req: any, res: any) => {
  const user = userLoginSchema.safeParse(req.body);
  if (!user.success) {
    return res.status(400).json({
      message: "Invalid Input",
      error: user.error.format(),
    });
  }
  const { username, password } = user.data;
  const hashedPassword = await bcrypt.hash(password, 4);
  try {
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: `welcome ${username}`,
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

app.post("/api/v1/signin", async (req: any, res: any) => {
  try {
    const user = userLoginSchema.safeParse(req.body);
    if (!user.success) {
      return res.status(400).json({
        message: "Invalid Inputs",
      });
    }
    const { username, password } = user.data;
    const existingUser = await UserModel.findOne({
      username,
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const pwMatch = await bcrypt.compare(password, existingUser.password);
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        Secret
      );
      if(!pwMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
      res.json({ token: token });
    }
  } catch (err) {
    console.error("signin error:", err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});
app.post("/api/v1/content", (req, res) => {});
app.get("/api/v1/content", (req, res) => {});
app.delete("/api/v1/delete", (req, res) => {});

app.listen(3000);
