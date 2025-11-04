import mongoose from "mongoose";
import userModel from "./user.js";
import dotenv from "dotenv";
import path from "path"


// Load .env file variables
dotenv.config({ path: path.resolve("../../.env") });
console.log("Mongo URI:", process.env.MONGODB_URI);

mongoose.set("debug", true);
mongoose.set('strictQuery', true); // or false

// Use your .env variable instead of hardcoding it
const uri = process.env.MONGODB_URI;

mongoose

    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected!'))
    .catch((error) => console.error("❌ MongoDB connection error:", error));



// User functions
function getUsers(name, job) {
    let promise;
    if (name === undefined && job === undefined) {
        promise = userModel.find();
    } else if (name && !job) {
        promise = findUserByName(name);
    } else if (job && !name) {
        promise = findUserByJob(job);
    }
    return promise;
}

function findUserById(id) {
    return userModel.findById(id);
}

function findUserByIdAndDeleteIt(id) {
    return userModel.findByIdAndDelete(id);
}

function addUser(user) {
    const userToAdd = new userModel(user);
    const promise = userToAdd.save();
    return promise;
}

function findUserByName(name) {
    return userModel.find({ name: name });
}

function findUserByJob(job) {
    return userModel.find({ job: job });
}

function findUserByNameAndJob(name, job) {
    return userModel.find({ name: name, job: job });
}

export default {
    addUser,
    getUsers,
    findUserById,
    findUserByName,
    findUserByJob,
    findUserByNameAndJob,
    findUserByIdAndDeleteIt
};