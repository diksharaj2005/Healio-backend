import jwt from "jsonwebtoken";

// user auth middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;  

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;

    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
