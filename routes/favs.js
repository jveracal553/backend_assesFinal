const router = require("express").Router();
const User = require("../models/User");
const Fav = require("../models/Fav");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const validaToken = require("../routes/validate-token");

const schemaFavorite = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  favs: Joi.array().items({
    name: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().required(),
  }),
});

router.post("/create", async (req, res) => {
  const { name, favs } = req.body;
  const email = req.email;

  try {
    const user = await User.findOne({ email });
    //funcion que guarda los favoritos
    const fav = new Fav({
      name,
      favs,
    });
    const favSaved = await fav.save();
    const favId = favSaved._id;
    const favArray = [...user.favsId, favId];
    const userUpdated = await User.findOneAndUpdate(
      { email },
      { favsId: favArray },
      { new: true }
    );
    res.status(200).json({
      message: "Fav created",
      userUpdated,
      favSaved,
    });
  } catch (e) {
    res.status(500).send({
      message: "Something wrong",
    });
  }
});

router.get("/getFavs", async (req, res) => {
  const email = req.email;
  console.log(email);

  try {
    const user = await User.findOne({ email }).populate("favsId");
    res.status(203).json({
      message: "Favs found",
      favs: user.favsId,
    });
  } catch (e) {
    res.status(400).json({
      message: "Fav not found",
    });
  }
});

router.get("/:id", async (req, res) => {
  const email = req.email;
  const { id } = req.params;

  //   funcion que verifica si el id le pertenece al usuario
  const user = await User.findOne({ email });
  const idList = user.favsId;

  if (!idList.includes(id)) {
    res.status(400).json({
      message: "id doesn't belong to user",
    });
  } else {
    //funcion que busca dentro del email la lista con el id
    const Favs = await Fav.findById(id);
    res.status(200).json({
      message: "Favs found by id with a correct user",
      Favs,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const email = req.email;
  const { id } = req.params;
  //funcion que busca dentro del email la lista con el id y la elimina
  const user = await User.findOne({ email });
  const idList = user.favsId;

  if (!idList.includes(id)) {
    res.status(400).json({
      message: "id doesn't belong to user",
    });
  } else {
    //funcion que busca dentro del email la lista con el id
    const Favs = await Fav.findByIdAndDelete(id);
    const favArray = idList.filter((x) => x.toString() !== id);
    console.log(favArray);
    const userUpdated = await User.findOneAndUpdate(
      { email },
      { favsId: favArray },
      { new: true }
    );
    res.status(200).json({
      message: "Favs deleted by id with a correct user",
      "Favs deleted": Favs,
    });
  }
});

module.exports = router;
