import User from "../../../models/user";
import connectmongo from "../../../middleware/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, profilePicture: user.profilePicture},
                process.env.JWT_SECRET,
                { noTimestamp: true }
            );

            return res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}

export default connectmongo(handler);
