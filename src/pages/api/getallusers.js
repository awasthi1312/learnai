import connectmongo from "@/middleware/db";
import User from "@/models/user"
const handler = async (req, res) => {
    if(req.method === 'GET') {
        try {
            const users = await User.find({}, '-password');
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
    return res.status(405).json({message: 'Method Not Allowed'});
}

export default connectmongo(handler);