import express, { json, Request, Response } from "express";
import { z } from "zod";
import { ContentModel, LinkModel, UserModel } from "./db";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { connect } from "./db";
import { userMIddleWare } from "./middleware";
import { random } from "./utils";
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
      if (!pwMatch) {
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
app.post("/api/v1/content", userMIddleWare, async (req: Request, res) => {
  try {
    const link = req.body.link;
    const title = req.body.title;
    // const tags = req.body.tags;
    const userId = req.userId;
    await ContentModel.create({
      link,
      title,
      userId,
      tags: [],
    });

    res.status(200).json({
      message: "Content added succesfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal sever error",
    });
  }
});
app.get("/api/v1/content", userMIddleWare, async (req, res) => {
  try {
    const userId = req.userId;
    const content = await ContentModel.findOne({
      userId,
    }).populate("userId", "username");
    if (!content) {
      res.status(401).json({
        message: "no content found",
      });
    }
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
});
app.delete("/api/v1/delete", userMIddleWare, async (req, res) => {
  try {
    const contentId = req.body.contentId;
    await ContentModel.findOneAndDelete({
      contentId,
      userId: req.userId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/api/v1/share", userMIddleWare, async (req, res) => {
  try {
    const share = req.body.share;
    if (share) {
      let hash = random(8);
      await LinkModel.create({
        userId: req.userId,
        hash,
      });
      res.status(201).json({
        message: "Sharing is enabled",
        hash: hash,
      });
    } else {
      await LinkModel.deleteOne({
        userId: req.userId,
      });
      res.status(201).json({
        message: "sharing is disabled",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  try {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
      hash,
    });
    if(!link){
      res.status(411).json({
        message: "Link not found"
      })
      return
    }
    //userID
    const content = await ContentModel.find({
      userId: link.userId
    })
    const user = await UserModel.findOne({
      _id: link.userId
    })
    if(!user){
      res.status(411).json({
        message: "user not found"
      })
      return
    }
    res.status(200).json({
      username: user.username,
      content: content
    })
  } catch (error) {
    res.status(500).json({
      message: "server error"
    })
  }
});

app.listen(3000);
