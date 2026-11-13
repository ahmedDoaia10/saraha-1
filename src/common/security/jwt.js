import jwt from "jsonwebtoken";
import configService from "../../config/config.service.js";
import { TokenTypeEnum } from "../enums/tokenType.enum.js";
import { RoleEnum } from "../enums/role.enum.js";


export const createTokens = ({payload = {}, options = {} , role = RoleEnum.USER}) => {
  let secrets = getRoleSecret(role)
 let accessToken = createToken({
  role,
  payload,
  options: {
    ...options , expiresIn : configService.JWT_ACCESS_EXP
  },
  secret : secrets.access
});

  let refreshToken = createToken({
    role,
    payload,
    options: {
      ...options , expiresIn : configService.JWT_REFRESH_EXP
    },
    secret : secrets.refresh
  });

  return { accessToken , refreshToken };
};


const getSecret = ({tokenType = TokenTypeEnum.ACCESS , role = RoleEnum.USER}) => { 
  let secrets = getRoleSecret(role)
  return tokenType == TokenTypeEnum.REFRESH ? secrets.refresh : secrets.access
};


const getRoleSecret = (role) => {
  let secrets;
  switch (role) {
    case RoleEnum.ADMIN:
    secrets = {
      access : configService.JWT_ACCESS_ADMIN_SECRET,
      refresh : configService.JWT_REFRESH_ADMIN_SECRET
    }
    break
    default:
     secrets = {
      access : configService.JWT_ACCESS_USER_SECRET,
      refresh : configService.JWT_REFRESH_USER_SECRET
    }
    break
  }
  return secrets
};

export const createToken = ({payload = {}, options = {}, secret = configService.JWT_SECRET}) => {
 
  return jwt.sign(payload, secret, options)
};


export const verifyToken = ({ token, tokenType = TokenTypeEnum.ACCESS}) => {
  let {aud} = jwt.decode(token) ;
  return jwt.verify(token, getSecret({ tokenType , role : aud[0]}));
};
