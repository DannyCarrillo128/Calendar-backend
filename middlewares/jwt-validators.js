const { request, response } = require('express');
const jwt = require('jsonwebtoken')

const validateJWT = (req = request, res = response, next) => {

  const token = req.header('x-token');
  
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Token not found.'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_SEED);

    // The necessary data is added to the request to generate a new token.
    req.uid = payload.uid;
    req.name = payload.name;
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      ok: false,
      message: 'Invalid token.'
    });
  }

  next();

};

module.exports = { validateJWT };
