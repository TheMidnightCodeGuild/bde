import connectToDatabase from '@/lib/mongoose';
import Intern from '../../../models/Intern';
import { withSessionRoute } from "@/lib/session";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { NoOfClients, MeetingsScheduled } = req.body;
    const newCall = {
      Date: new Date(),
      NoOfClients: parseInt(NoOfClients),
      MeetingsScheduled: parseInt(MeetingsScheduled)
    };

    const intern = await Intern.findOneAndUpdate(
      { email: req.session.user.email },
      { $push: { calls: newCall } },
      { new: true }
    );

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    res.status(200).json({ 
      message: 'Call added successfully',
      call: newCall
    });
  } catch (error) {
    console.error('Error in add-call:', error);
    res.status(500).json({ message: 'Error adding call data' });
  }
}

export default withSessionRoute(handler);