import { NextFunction, Request, Response } from "express";
import { Auth } from "../helper/Auth";

export default async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        await Auth.verifyAuth(req);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error); // Log the error for debugging
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}
