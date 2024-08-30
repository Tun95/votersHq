import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      isAccountVerified: user.isAccountVerified,
      role: user.role,
      region: user.region,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "2h",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
         return res
           .status(401)
           .send({ message: "Unauthorized: Invalid or expired token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "Forbidden: You do not have admin privileges" });
  }
};
