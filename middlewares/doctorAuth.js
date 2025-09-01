import jwt from "jsonwebtoken";

const doctorAuth = async (req, res, next) => {
  try {
    const dToken = req.headers.dtoken;  

    if (!dToken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);

 
    if (!req.body) req.body = {};
    req.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default doctorAuth;
