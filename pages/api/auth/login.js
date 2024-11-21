import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongoose';
import Intern from '../../../models/Intern';
import { getIronSession } from "iron-session";

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
        
        await connectToDatabase();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const intern = await Intern.findOne({ email });

        if (!intern) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(password, intern.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Save user to session
        req.session.user = {
            id: intern._id,
            email: intern.email
        };
        await req.session.save();

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: intern._id.toString(),
                name: intern.name,
                email: intern.email,
                teamName: intern.TeamName,
                teamLeader: intern.teamLeader
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
