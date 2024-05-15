import { Router } from "express";
import userController from "./user.controller";

const router = Router()

router.route("/").get(userController.healthCheck)
router.route('/register').post(userController.userRegister);
router.route('/login').post(userController.userLogin);
router.route('/logout').delete(userController.userLogin);



export default router