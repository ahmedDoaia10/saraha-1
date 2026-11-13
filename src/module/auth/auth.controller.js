import { Router } from "express";
import { response, TokenTypeEnum } from "./../../common/index.js";
import * as as from "./auth.service.js";
import { auth } from "../../common/middleware/index.js";
export const authController = Router();
    

authController.post("/signup", async (req, res, next) => {
  let user = await as.signup(req.body);

  response({
    res,
    data: user,
    message: "User Created",
    status: 201,
  });
});




authController.post("/login", async (req, res, next) => {
  let user = await as.login(req.body);

  response({
    res,
    data: user,
    message: "User Logged In",
  });
});




authController.post("/rotate-token", auth({ tokenType: TokenTypeEnum.REFRESH }), async (req, res, next) => {
  console.log("USER:", req.user);
console.log("PAYLOAD:", req.payload);
  let tokens = await as.rotateToken(req.user , req.payload);
  response({
    res,
    data: tokens,
    message: "Token Rotated",
  });
});
