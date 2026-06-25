const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    // Check Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Save user info in request
            req.user = await User.findById(decoded.userId).select("-password");

            next();
        } catch (error) {
            return res.status(401).json({
                message: "Invalid Token"
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "No Token Provided"
        });
    }
};

module.exports = protect;