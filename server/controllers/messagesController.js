const Messages = require('../models/messageModel');

const messagesController = {};

messagesController.getMessages = async (req, res, next) => {
  try {
    const recentMessages = await Messages.find(
      {},
      'createdBy createdAt message',
      { sort: '-createdAt', limit: 20 }
    );
    if (recentMessages) {
      res.locals.messages = recentMessages;
      return next();
    } else throw 'Unable to retrieve messages';
  } catch (err) {
    return next({
      log: `messagesController.getMessages: ERROR:  ${err}`,
      message: {
        err: 'messagesController.getMessages: ERROR: Check server logs for details',
      },
    });
  }
};

messagesController.postMessage = async (req, res, next) => {
  try {
    const { createdBy, createdAt, message } = req.body;
    const newMessage = {
      createdBy: createdBy,
      createdAt: createdAt,
      message: message,
    };
    const result = await Messages.create(newMessage);
    if (result) {
      res.locals.message = result;
      return next();
    } else throw 'Unable to post message';
  } catch (err) {
    return next({
      log: `messagesController.postMessage: ERROR:  ${err}`,
      message: {
        err: 'messagesController.postMessage: ERROR: Check server logs for details',
      },
    });
  }
};

messagesController.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.body;
    const msg = await Messages.findByIdAndRemove(id);
    if (msg) return next();
    else throw 'message does not exist';
  } catch (err) {
    return next({
      log: `messagesController.deleteMessage: ERROR:  ${err}`,
      message: {
        err: 'messagesController.deleteMessage: ERROR: Check server logs for details',
      },
    });
  }
};

messagesController.updateMessage = async (req, res, next) => {
  try {
    const { message, id } = req.body;
    const newMessage = await Messages.findByIdAndUpdate(
      id,
      { message: message },
      { new: true }
    );
    if (newMessage) {
      res.locals.message = newMessage;
      return next();
    } else return res.status(400).send('unable to edit');
  } catch (err) {
    return next({
      log: `messagesController.updateMessage: ERROR:  ${err}`,
      message: {
        err: 'messagesController.updateMessage: ERROR: Check server logs for details',
      },
    });
  }
};

module.exports = messagesController;
