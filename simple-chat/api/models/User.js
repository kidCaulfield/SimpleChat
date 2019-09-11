/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true
    },

    email: {
      type: "string",
      required: true,
      unique: true
    },

    avatar: {
      type: "string",
      required: true
    },

    location: {
      type: "string",
      required: false,
      defaultsTo: ""
    },

    bio: {
      type: "string",
      required: false,
      defaultsTo: ""
    },

    online: {
      type: "boolean",
      defaultsTo: false
    }
  }
};
