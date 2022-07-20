const jwt = require('jsonwebtoken');

const vaidateToken = (req, res) => {
  const [prefix, token] = req.headers["authorization"].split(" ");
  try {
    return jwt.verify(token, process.env.jwt_secret_key);
  } catch (err) {
    res.status(401).send('unauthorized');
    return false;
  }
};

module.exports = vaidateToken;