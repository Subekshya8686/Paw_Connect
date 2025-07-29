const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey123";

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

// function authorizeRole(role) {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(403).send("Access Denied: Inssufficient Permissions");
//     }
//     next();
//   };
// }

function authorizeRole(role) {
  return (req, res, next) => {
    console.log(role);
    console.log(req.user);
    // Check if req.user exists and has the role property
    if (!req.user || !req.user.role) {
      return res.status(403).send("Access Denied: No Role Found");
    }

    // Check if the user has the required role
    if (req.user.role !== role) {
      return res.status(403).send("Access Denied: Insufficient Permissions");
    }

    next(); // User is authorized, proceed to the next middleware or route handler
  };
}

module.exports = { authenticateToken, authorizeRole };
