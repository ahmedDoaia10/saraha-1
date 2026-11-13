import express from "express";
import configService from "./config/config.service.js";
import { errorHandler } from "./common/index.js";
import { DBconnect } from "./database/connection.js";
import { authController , userController } from "./module/index.js";


const app = express();
let port = configService.port;


await DBconnect();



app.use(express.json());




app.use("/auth", authController);
app.use("/user", userController);


app.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));


app.use("{/*dummy}", (req, res, next) => {
  res.status(404).json({
    message: "Route notFound",
    route: req.params.dummy,
    method: req.method,
  });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}!`));
