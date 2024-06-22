import User from "../../../models/user";
import connectmongo from "../../../middleware/db";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { username, email, password, firstName, lastName } = req.body;
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the new user
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName
            });

            return res.status(201).json({
                message: "User created successfully", user: {
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}

export default connectmongo(handler);
