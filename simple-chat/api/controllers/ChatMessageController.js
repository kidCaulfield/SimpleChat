/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
      if (!msg.id) {
        throw new Error("Message processing failed!");
      }
      sails.sockets.broadcast("chat-channel", "channel", { msg });
      return response.ok();
    } catch (err) {
      return response.serverError(err);
    }

    return response.ok();
  },
  render: (request, response) => {
    return response.view("pages/chatroom");
  }
};
