const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  try {
    const token = req.cookies.token;  
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decode = jwt.verify(token, 'hululu');
    req.user = decode;  
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authentication;
