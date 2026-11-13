import { userModel } from "../../database/model/index.js";




export const updateUser = async (userData, data) => {
  
  let user = await userModel.findByIdAndUpdate(userData._id, data);

  return user;
};

