import { NextApiRequest, NextApiResponse } from "next";
import User from './../../../model/user';
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const resetPasswordToken = crypto.createHash("sha256").update(token as string).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
}
