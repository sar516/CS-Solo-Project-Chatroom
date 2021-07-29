Sessions = require('../models/sessionModel');

sessionController = {};

sessionController.createSession = async (req, res, next) => {
  try {
    const session = await Sessions.create({ cookieId: res.locals.user.ssid });
    return next();
  } catch (err) {
    return next({
      log: `sessionController.createSession: ERROR:  ${err}`,
      message: {
        err: 'sessionController.createSession: ERROR: Check server logs for details',
      },
    });
  }
};

sessionController.verifySession = async (req, res, next) => {
  try {
    const ssid = req.cookies.ssid ? req.cookies.ssid : '';
    const session = await Sessions.findOne({ cookieId: ssid });
    const validSession = session ? true : false;
    if (validSession) return next();
    else return res.status(400).json({ notValidSession: true });
  } catch (err) {
    return next({
      log: `sessionController.verifySession: ERROR:  ${err}`,
      message: {
        err: 'sessionController.verifySession: ERROR: Check server logs for details',
      },
    });
  }
};

sessionController.updateSession = async (req, res, next) => {
  try {
    const ssid = req.cookies.ssid;
    const session = await Sessions.findOneAndUpdate(
      { cookieId: ssid },
      { createdAt: Date.now() },
      { upsert: true }
    );
    return next();
  } catch (err) {
    return next({
      log: `sessionController.updateSession: ERROR:  ${err}`,
      message: {
        err: 'sessionController.updateSession: ERROR: Check server logs for details',
      },
    });
  }
};

sessionController.endSession = async (req, res, next) => {
  try {
    const ssid = req.cookies.ssid;
    const session = await Sessions.findOneAndRemove({ cookieId: ssid });
    return next();
  } catch (err) {
    return next({
      log: `sessionController.endSession: ERROR:  ${err}`,
      message: {
        err: 'sessionController.endSession: ERROR: Check server logs for details',
      },
    });
  }
};

module.exports = sessionController;
