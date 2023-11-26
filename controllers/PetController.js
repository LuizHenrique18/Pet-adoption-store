const Pet = require("../models/Pet");
const User = require("../models/User");

// helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, color, weight } = req.body;

    const images = req.files;

    let avaible = true;

    if (!name) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir o nome!" });
      return;
    }

    if (!age) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir a idade!" });
      return;
    }
    if (!color) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir a cor!" });
      return;
    }
    if (!weight) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir o peso!" });
      return;
    }

    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }

    //get a pet owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    //Images
    let imagesFileName = [];
    images.map((image) => {
      imagesFileName.push(image.filename);
    });

    // create a pet

    let pet = new Pet({
      name,
      age,
      weight,
      color,
      avaible,
      images: imagesFileName,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        image: user.image,
      },
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "Pet cadastrado com sucesso!", newPet });
    } catch (err) {
      res.status(422).json(err);
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({ pets: pets });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const petsUser = await Pet.find({ 'user._id': user._id }).sort(
      "-createdAt"
    );

    const userName = await User.find({ '_id': user._id });
    console.log("AQUI", userName);
    console.log("AQUI", petsUser);
    res.status(200).json({ petsUser });
  }
};
