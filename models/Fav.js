const string = require("@hapi/joi/lib/types/string");
const mongoose = require("mongoose");

const FavSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  favs: [
    {
      name: String,
      description: String,
      link: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Fav", FavSchema);
