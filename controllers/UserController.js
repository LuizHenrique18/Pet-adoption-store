const User = require('../models/User')

const bcrypt = require('bcrypt')
const jtw = require('jsonwebtoken')

// Helpers
const createToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController{
    static async register(req,res){

        const {name, email, phone, password, confirmpassword} = req.body

        if(!name){
            res.status(422).json({message:'O nome é obrigatório'})
            return
        }
    
        if(!email){
            res.status(422).json({message:'O email é obrigatório'})
            return
        }
        if(!phone){
            res.status(422).json({message:'O telefone é obrigatório'})
            return
        }
        if(!password){
            res.status(422).json({message:'A senha é obrigatório'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message:'A confirmção da senha é obrigatório'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message:'As senhas não são iguais, tente novamente!'})
            return
        }

         // Check if user exists 
         const userExists = await User.findOne({email:email})
        
         if(userExists){
             res.status(422).json({message:'Esse email já foi cadastrado! Tente um outro email.'})
         }
       
        // Cript the password
        const salt = await bcrypt.genSalt(12) 
        const passwordHash = await bcrypt.hash(password, salt)

        // Create the user
        const user = new User({
            name,
            email,
            phone,
            password:passwordHash,
        }
        )
        try{
            const newUser = await user.save()
            await createToken(newUser,req,res)
        }
        catch(err){
            res.status(500).json({message:'Deu bosta'})
        }
    }

    static async login(req,res){
        const {email, password} = req.body

        const user = await User.findOne({email:email})

        if(!user){
            res.status(422).json({message:'Esse email não existe! Se você não tem uma conta, faço o cadastro!'})
            return
        }

        // Compare password
        let comparePassword = await bcrypt.compare(password, user.password)

        if(!comparePassword){
            res.status(422).json({message:'A senha está incorreta, tente novamente!'})
            return
        }

        try{
            createToken(user, req, res)
        }catch(err){
            res.json({err})
        }
    }

    static async checkToken(req,res){

        let currentUser

        console.log(req.headers.authorization)

        if(req.headers.authorization){
            
            const token = getToken(req)
            const decoded = jtw.verify(token, 'secretreserve12345')

            currentUser = await User.findById(decoded.id)
            
            currentUser.password = undefined

        }else{

            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserId(req,res){

        const id = req.params.id
        
        const user = await User.findById(id).select("-password")

        if(!user){
            res.status(422).json({
                message:'Usuário não encontrado'
            })
            return
        }

        res.status(200).json({user})
    }

    static async editUser(req,res){
        const id = req.params.id

        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword, image} = req.body

        
        //Check if user exists
        if(!user){
            res.status(400).json({message:'Usuário não encontrado!'})
            return
        }
        //Validation User

        if(!name){
            res.status(422).json({message:'O nome é obrigatório'})
            return
        }
    
        user.name = name

        if(!email){
            res.status(422).json({message:'O email é obrigatório'})
            return
        }

        const userExists = await User.findOne({email:email})
        if(user.email === email && userExists){
            res.status(422).json({message:'Esse email já está em uso, utilize outro!'})
            return
        }
        user.email = email

        if(!phone){
            res.status(422).json({message:'O telefone é obrigatório!'})
            return
        }
        user.phone = phone

        if(password && !confirmpassword){
            res.status(422).json({message:'Preencha a confirmação de senha!'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message:'As senhas são diferentes'})
            return

        }else if(password === confirmpassword && password != null){
            // Cript the password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }

        try{

            await User.findOneAndUpdate(
                {id:user._id},
                {$set:user},
                {new:true}
                )
            res.status(201).json({message:'Dados atualizados com sucesso'})
        }catch(err){
            res.status(500).json({message:`${err}Erro ao atualizar os dados!`})
        }
    }

} 