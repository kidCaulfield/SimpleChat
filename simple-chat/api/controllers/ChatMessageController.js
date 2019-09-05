/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  postMessage: async (request, response) => {
    // Make sure this is a socket request (not traditional HTTP)
    if (!request.isSocket) {
      return response.badRequest();
    }

    try {
      let user = await User.findOne({ email: "johnnie86@gmail.com" });
      console.log('user: ', user);
      console.log('request.body.message: ', request.body.message);
      let msg = await ChatMessage.create({
        message: request.body.message,
        createdBy: user.id
      }).fetch();
      console.log('msg: ', msg);
      if (!msg.id) {
        throw new Error("Message processing failed!");
      }
      msg.createdBy = user.id;
      ChatMessage.publish(msg);
    } catch (err) {
      return response.serverError(err);
    }

    return response.ok();
  }
};

