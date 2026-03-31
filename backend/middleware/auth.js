const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (token) {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.userId = decoded.userId;

    }

    // passport session user
    if (req.user && !req.userId) {
      req.userId = req.user._id;
    }

    next();

  } catch (err) {

    next();

  }

};

module.exports = authMiddleware;