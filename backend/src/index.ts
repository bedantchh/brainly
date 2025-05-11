import express, { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "./middleware";
import bcrypt from "bcrypt"

const app = express();
app.use(express.json());

const userLoginSchema = z.object({
  username: z.string().email(),
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
  const hashedPassword = await bcrypt.hash(password,4)
  try{
    
  const newUser = await UserModel.create({
    username,
    password: hashedPassword
  })
  return res.status(200).json({
    message: `welcome ${username}`,
  });
  }
  catch(err){
    console.error("signup error:",err)
    return res.status(500).json({
        message: "Internal server error."
    })
  }
});

app.post("/api/v1/signin", (req, res) => {});
app.post("/api/v1/content", (req, res) => {});
app.get("/api/v1/content", (req, res) => {});
app.delete("/api/v1/delete", (req, res) => {});

app.listen(3000);
