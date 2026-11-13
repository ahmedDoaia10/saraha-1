import { Router } from "express";
import { response, RoleEnum, TokenTypeEnum } from "../../common/index.js";
import * as us from "./user.service.js";
import { auth, authorization } from "../../common/middleware/index.js";

export const userController = Router();
    


userController.get("/profile", auth({tokenType : TokenTypeEnum.ACCESS}), async (req, res, next) => {
  response({
    res, data: req.user, message: "User Fetched"});
});



userController.get("/admin-profile", auth({ tokenType: TokenTypeEnum.ACCESS }), authorization([RoleEnum.ADMIN]), async (req, res, next) => {
  response({
    res, data: req.user, message: "User Fetched"});
});




userController.patch("/update-user", auth({}) , async (req, res, next) => {
  let user = await us.updateUser(req.user);
  response({
    res, data: user, message: "User Updated in"});
});

