import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongoose';
import Intern from '../../../models/Intern';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();

        const { name, username, mobile, email, password, referalCode, teamName, teamLeader } = req.body;

        // Validate required fields
        if (!name || !username || !mobile || !email || !password || !teamName || !teamLeader) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if email already exists
        const existingIntern = await Intern.findOne({ email });
        if (existingIntern) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Check if username already exists
        const existingUsername = await Intern.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new intern
        const intern = await Intern.create({
            name,
            username,
            mobile,
            email,
            password,
            referalCode,
            TeamName: teamName,
            teamLeader
        });

        return res.status(201).json({
            message: 'Registration successful',
            user: {
                id: intern._id,
                name: intern.name,
                email: intern.email,
                teamName: intern.TeamName,
                teamLeader: intern.teamLeader
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
