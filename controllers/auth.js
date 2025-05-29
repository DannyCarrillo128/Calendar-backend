const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');
const User = require('../models/User');

// ----------------------------------------------------------------
//                             Sign up                             
// ----------------------------------------------------------------
const signUp = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    
    if (user) {
      res.status(400).json({
        ok: false,
        message: 'User already exists.'
      });
    }
    
    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Something went wrong.'
    });
  }

};

// ----------------------------------------------------------------
//                             Sign in                             
// ----------------------------------------------------------------
const signIn = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    
    if (!user) {
      res.status(400).json({
        ok: false,
        message: 'User does not exists.'
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'User does not exists.'
      });
    }

    const token = await generateJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Something went wrong.'
    });
  }

};

// ----------------------------------------------------------------
//                             Renew token                         
// ----------------------------------------------------------------
const renewToken = async (req = request, res = response) => {

  const { uid, name } = req;

  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid, name, token
  });

}

module.exports = { signIn, signUp, renewToken };
