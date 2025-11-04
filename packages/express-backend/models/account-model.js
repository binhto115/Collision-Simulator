// /models/account-model.js
// defines "accounts" collection in MongoDB Atlas cluster
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { versionKey: false } // removes __v
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
