import { getIronSession } from "iron-session";
import connectToDatabase from '@/lib/mongoose';
import Complaint from '../../models/Complaint';

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'bde-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the session
    req.session = await getIronSession(req, res, sessionOptions);

    if (!req.session.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await connectToDatabase();

    const complaint = await Complaint.create({
      intern: req.session.user.email, // Use email instead of username
      title: req.body.title,
      description: req.body.description,
      createdAt: new Date()
    });
    
    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(400).json({ success: false, message: error.message });
  }
}
