const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { json } = require('express');

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const newUser = {
      username: username,
      password: password,
    };
    // console.log(newUser);
    const result = await Users.create(newUser); //.lean().populate();;
    res.locals.user = {
      username: result.username,
      ssid: JSON.parse(JSON.stringify(result._id)),
      loggedIn: true,
    };
    return next();
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ username: '', dupe: true });
    return next({
      log: `userController.createUser: ERROR:  ${err}`,
      message: {
        err: 'userController.createUser: ERROR: Check server logs for details',
      },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  try {
    console.log('starting verification');
    const { username, password } = req.body;
    const currentUser = await Users.findOne({
      username: username,
    });
    // const x = JSON.stringify(currentUser._id);
    // console.log(currentUser.username);
    console.log('user verifiing');
    if (currentUser) {
      const isValid = await bcrypt.compare(password, currentUser.password);
      if (isValid) {
        res.locals.user = {
          username: currentUser.username,
          ssid: JSON.parse(JSON.stringify(currentUser._id)),
          loggedIn: true,
        };
        return next();
      } else {
        return res.status(200).json({ loggedIn: false, userDNE: false });
      }
    } else return res.status(200).json({ loggedIn: false, userDNE: true });
  } catch (err) {
    return next({
      log: `userController.verifyUser: ERROR:  ${err}`,
      message: {
        err: 'userController.verifyUser: ERROR: Check server logs for details',
      },
    });
  }
};

userController.findUserBySSID = async (req, res, next) => {
  try {
    const ssid = req.cookies.ssid ? req.cookies.ssid : '';
    const user = await Users.findById(ssid);
    if (user) {
      res.locals.user = { username: user.username, loggedIn: true, ssid: ssid };
      return next();
    } else return res.status(400).json({ username: undefined });
  } catch (err) {
    return next({
      log: `userController.findUserBySSID: ERROR:  ${err}`,
      message: {
        err: 'userController.findUserBySSID: ERROR: Check server logs for details',
      },
    });
  }
};

module.exports = userController;
