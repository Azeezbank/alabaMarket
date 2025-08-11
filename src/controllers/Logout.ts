import { Response, Request } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";


export const Logout = async (req: AuthRequest, res: Response) => {
  // If using cookies:
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });

  return res.json({ message: "Logged out successfully" });
};