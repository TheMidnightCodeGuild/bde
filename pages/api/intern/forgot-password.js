import connectToDatabase from "@/lib/mongoose";
import Intern from "@/models/Intern";
import nodemailer from "nodemailer";

// Temporary storage for OTPs (this will be cleared on server restart)
const otpStore = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, otp, newPassword, step } = req.body;
  await connectToDatabase();
  
  // Step 1: Generate and send OTP
  if (step === "sendOTP") {
    try {
      const user = await Intern.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Intern not found" });
      }

      // Generate 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in memory with expiry
      otpStore.set(email, {
        otp: generatedOTP,
        expires: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });

      // Configure nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${generatedOTP}. Valid for 15 minutes.`
      });

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error sending OTP" });
    }
  }

  // Step 2: Verify OTP
  if (step === "verifyOTP") {
    try {
      const user = await Intern.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Intern not found" });
      }

      const otpData = otpStore.get(email);
      if (!otpData) {
        return res.status(400).json({ message: "No OTP found. Please request a new OTP" });
      }

      // Convert both OTPs to strings for comparison and trim any whitespace
      const submittedOTP = String(otp).trim();
      const storedOTP = String(otpData.otp).trim();

      console.log('Debug Info:', {
        submittedOTP,
        storedOTP,
        submittedType: typeof submittedOTP,
        storedType: typeof storedOTP,
        isMatch: submittedOTP === storedOTP,
        expiry: otpData.expires,
        isExpired: otpData.expires < new Date()
      });

      // Check if OTP matches and is not expired
      if (storedOTP !== submittedOTP) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (otpData.expires < new Date()) {
        otpStore.delete(email); // Clean up expired OTP
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Clear OTP after successful verification
      otpStore.delete(email);

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return res.status(500).json({ message: `Error verifying OTP: ${error.message}` });
    }
  }

  // Step 3: Update Password
  if (step === "updatePassword") {
    try {
      const result = await Intern.updateOne(
        { email },
        { 
          $set: { 
            password: newPassword  // Note: Remember to hash password in production
          } 
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "Password update failed" });
      }

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating password" });
    }
  }
}