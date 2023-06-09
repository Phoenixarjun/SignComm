const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type : String
    },
    email:{
        type : String
    },
    password:{
        type : String
    }
},{timeStamp:true})

const User = mongoose.model('user',userSchema)
module.exports = User