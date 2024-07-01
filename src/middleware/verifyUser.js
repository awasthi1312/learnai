import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Authorization denied, Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid User, Login Again" });
    }
};

export default verifyUser;