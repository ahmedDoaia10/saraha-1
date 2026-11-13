import { exceptions, HashEnum, myCompare, myHash } from "../../common/index.js";
import { encryption } from "../../common/security/encryption.js";
import { createTokens } from "../../common/security/jwt.js";
import { ConflictException } from "../../common/utils/exceptions.js";
import configService from "../../config/config.service.js";
import { userModel } from "../../database/model/index.js";

export const signup = async (data) => {
  let exists = await userModel.findOne({ email: data.email });
  if (exists) exceptions.ConflictException("User already exists");
  data.password = await myHash({plainText: data.password,lib: HashEnum.argon,});
  data.phone = encryption(data.phone);
  let user = await userModel.create(data);
  return user;
};


export const login = async ({ email, password }) => {
  let user = await userModel.findOne({ email });
  if (!user) exceptions.NotFoundException("User not found");
  let matchPassword = await myCompare({plainText: password, encrypted: user.password, lib: HashEnum.argon,});
  if (!matchPassword) exceptions.NotFoundException("User not found");

  let tokens = createTokens({
  options: {subject: user.id, issuer: "ahmed", audience: [user.role]
  },
  role: user.role
});

  return tokens;
};




export const rotateToken = (user , payload) =>{
  let accessIAT = payload.iat *1000;
  let accessEXPIn = configService.JWT_ACCESS_EXP *1000;
  let accessEXPAt = accessEXPIn + accessIAT ;
  let currentTime = Date.now()

  if(currentTime < accessEXPAt){
    ConflictException("Access Token Still Valid");
  }

  let {accessToken} = createTokens({
      options : { subject: user.id , issuer: "ahmed" ,  audience: ["admin", "user"] },
       
    });

  return {
    accessEXPAt,
    currentTime

  };
};
