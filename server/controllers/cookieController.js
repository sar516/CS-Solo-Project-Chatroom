const cookieController = {};

/**
 * setSSIDCookie - store the user id in a cookie
 */
cookieController.setSSIDCookie = (req, res, next) => {
  // write code here
  res.cookie('ssid', res.locals.user.ssid, {
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
  return next();
};

cookieController.clearSSIDCookie = (req, res, next) => {
  res.clearCookie('ssid');
  return next();
};

module.exports = cookieController;
