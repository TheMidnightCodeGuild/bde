import { getIronSession } from "iron-session";
import connectToDatabase from '@/lib/mongoose';
import Complaint from '../../models/Complaint';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);

  if (!session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await connectToDatabase();

  try {
    const complaint = await Complaint.create({
      intern: session.user.username,
      title: req.body.title,
      description: req.body.description,
      createdAt: new Date()
    });
    
    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
