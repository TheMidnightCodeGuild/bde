import { withSessionRoute } from "@/lib/session";
import connectToDatabase from "@/lib/mongoose";
import Intern from "../../../models/Intern";
import bcrypt from "bcryptjs";

export default withSessionRoute(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const internId = req.session.user.id;

    await connectToDatabase();

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, intern.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    intern.password = hashedPassword;
    await intern.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in change password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
