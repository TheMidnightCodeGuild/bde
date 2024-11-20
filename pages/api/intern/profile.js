import { getIronSession } from "iron-session";
import connectToDatabase from '@/lib/mongoose';
import Intern from '../../../models/Intern';

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'bde-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the session
    const session = await getIronSession(req, res, sessionOptions);

    // Check if user is authenticated
    if (!session.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await connectToDatabase();

    const intern = await Intern.findById(session.user.id);

    if (!intern) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: intern });

  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
