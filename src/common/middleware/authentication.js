import { userModel } from "../../database/model/index.js";
import { exceptions, TokenTypeEnum } from "../index.js";
import { verifyToken } from "../security/jwt.js";

export const auth = ({ tokenType = TokenTypeEnum.ACCESS }) => {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      exceptions.BadRequestException("Token Not Provided");
    }

    let payload = verifyToken({ 
      token,
      tokenType 
      
    });

    req.user = await userModel.findById(payload.sub);
    req.payload = payload;
    next();
  };
};
