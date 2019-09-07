/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  render: async (request, response) => {
    try {
      let data = await User.findOne({ id: request.session.userId });
      if (!data) {
        return response.notFound("The user was NOT found!");
      }

      response.view("pages/profile", { data });
    } catch (err) {
      response.serverError(err);
    }
  },
  find: async (req, res) => {
    try {
      let users = await User.find({
        where: { id: {'>': 0} } 
      });

      sails.sockets.broadcast("chat-channel", "user", { users });
      res.json(users);
    } catch (error) {
      res.serverError(error);
    }
  },
  refresh: async (req, res) => {
    try {
      let users = await User.find({
        where: { id: {'>': 0} } 
      });
      
      res.json(users);
    } catch (error) {
      res.serverError(error);
    }
  },
  update: async (req, res) => {
    try {
      let user = await User.findOne({ id: req.session.userId });
      const { id } = user;
      const { name, email, avatar, location, bio } = req.query;
      let updated = await User.update(user)
        .set({
          id: id,
          name: name,
          email: email,
          avatar: avatar,
          location: location,
          bio: bio
        })
        .fetch();
      res.redirect("/profile");
    } catch (error) {
      res.serverError(error);
    }
  }
};
