/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var hdate = require('human-date');

module.exports = {
  onConnect: async (req, res) => {
    sails.sockets.join(req, "chat-channel");

    return res.ok();
  },
  postMessage: async (request, response) => {
    // Make sure this is a socket request (not traditional HTTP)
    if (!request.isSocket) {
      return response.badRequest();
    }

    try {
      let user = await User.findOne({ id: request.session.userId });
      let msg = await ChatMessage.create({
        message: request.body.message,
        createdBy: user.id
      }).fetch();

      user = await User.findOne({ id: msg.createdBy });
      
      let time = hdate.prettyPrint(new Date(), { showTime: true })
      msg.createdBy = user
      msg.createdAt = time
      
      if (!msg.id) {
        throw new Error("Message processing failed!");
      }
      sails.sockets.broadcast("chat-channel", "channel", { msg });
    } catch (err) {
      return response.serverError(err);
    }

    return response.ok();
  },
  render: (request, response) => {
    return response.view("pages/chatroom");
  }
};
