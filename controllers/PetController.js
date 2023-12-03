const Pet = require("../models/Pet");
const User = require("../models/User");

const ObjectId = require("mongoose").Types.ObjectId
// helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, color, weight } = req.body;

    const images = req.files;

    let avaible = true;

    // Validation
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
    res.status(200).json({ petsUser });
  }

  static async petAdoption(req,res){

    // get user
    const token = getToken(req)
    const user = getUserByToken(token)

    const petsAdoptedUser = await Pet.find({'adopted':user._id})
    
    res.status(200).json({petsAdoptedUser})

  }

  static async getPeById(req,res){

    const id = req.params.id

    if(!ObjectId.isValid(id)){
      res.status(400).json({message:"Id inválido!"})
      return
    }

    // Check if pet exists
    const pet = await Pet.findOne({_id:id})

    if(!pet){
      res.status(404).json({message:"Pet não encontrado"})
      return
    }

    res.status(200).json({pet})

  }


  static async removePetById(req,res){
    const id = req.params.id
    
    //Check if Id is valid
    if(!ObjectId.isValid(id)){
      res.status(422).json({message: " Id inválido! "})
      return
    }

    // Check if pet exists
    const pet = await Pet.findOne({_id:id})

    if(!pet){
      res.status(404).json({message:"Pet não encontrado"})
      return
    }

    //Check if user id logged in the Pet register
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id.toString()){
      res.status(422).json({
        message:'Houve um problema em processa a sua solicitação, tente novamente!'
      })
      return
    }
    
    await Pet.findByIdAndRemove(id)

    res.status(200).json({message: 'Pet Removido com sucesso!'})

  }

  static async updatePatch(req,res){
    const id = req.params.id

    const { name, age, weight, color, avaiable } = req.body

    const images = req.files
    
    const updatedData = {}

    // Check if pet exists
    const pet = await Pet.findOne({_id:id})

    if(!pet){
      res.status(404).json({message:"Pet não encontrado"})
      return
    }
     
    //Check if user id logged in the Pet register
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id.toString()){
      res.status(422).json({
        message:'Houve um problema em processa a sua solicitação, tente novamente!'
      })
      return
    }

    // Validation
    if (!name) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir o nome!" });
      return;
    } else {
      updatedData.name = name
    }

    if (!age) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir a idade!" });
      return;
    }else {
      updatedData.age = age
    } 

    if (!color) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir a cor!" });
      return;
    } else {
      updatedData.color = color
    }
    
    if (!weight) {
      res
        .status(422)
        .json({ message: "Por favor não se esqueça de inserir o peso!" });
      return;
    } else {
      updatedData.weight = weight
    }

    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }else{
      updatedData.images = []
      images.map((image)=>{
        updatedData.images.push(image.filename)
      })
    }

    await Pet.findByIdAndUpdate({message: 'Pet atualizado com sucesso!'})


  }

  
};
