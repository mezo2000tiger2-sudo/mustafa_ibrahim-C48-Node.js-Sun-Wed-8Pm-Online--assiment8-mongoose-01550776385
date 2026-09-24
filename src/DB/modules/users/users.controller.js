import { Router } from "express";
import { deleteUser, getUser, signIn, signUp, updateUser } from "./user.service.js";

const userRouter  = Router()
export default userRouter;

userRouter.post('/signup',signUp)
userRouter.post('/signin',signIn)
userRouter.patch('/update/:id',updateUser)
userRouter.delete('/:id',deleteUser)
userRouter.get('/:id',getUser)
