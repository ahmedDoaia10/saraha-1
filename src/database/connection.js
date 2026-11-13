import mongoose from "mongoose";
import configService from "../config/config.service.js";

export const DBconnect = async () => {
  try {
    await mongoose.connect(configService.DB_URI);
    await mongoose.syncIndexes();
    console.log("DB Connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

