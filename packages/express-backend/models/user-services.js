import mongoose from "mongoose";
import userModel from "./user.js";
import dotenv from "dotenv";

// Load .env only in local dev (Azure uses App Settings)
if (process.env.NODE_ENV !== "production") {
    dotenv.config(); // looks for .env in the current working directory
}

// Read the URI from Azure App Settings or a local .env
const uri = process.env.MONGODB_URI || process.env.CUSTOMCONNSTR_MONGODB_URI;

if (!uri) {
    console.error("❌ Missing MongoDB URI! Define MONGODB_URI (or CUSTOMCONNSTR_MONGODB_URI on Azure).");
}

mongoose.set("strictQuery", true);
// (optional) turn off noisy logs in prod
if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
}

mongoose
    .connect(uri) // Mongoose 7+ does not need useNewUrlParser/useUnifiedTopology
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((error) => console.error("❌ MongoDB connection error:", error.message));



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