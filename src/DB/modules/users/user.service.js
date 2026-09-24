import { Types } from "mongoose";
import usersModel from "../../models/users.model.js";

export async function signUp(req , res){
    try {
        const {name , email , password , age , phone } = req.body;
    const user = await usersModel.insertOne({name , email , password , age , phone });
    res.status(201).json({message: "User created successfully", user});
    } catch (error) {
        res.status(500).json({message: "error", error: error.message});
    }

}
export async function signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await usersModel.findOne({ email, password });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      res.status(200).json({ message: "User signed in successfully", user });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  export async function updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, age, phone } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "User id is required in query params" });
      }
  
      if (email) {
        const existingUser = await usersModel.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use" });
        }
      }
  
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (email !== undefined) updateFields.email = email;
      if (age !== undefined) updateFields.age = age;
      if (phone !== undefined) updateFields.phone = phone;
  
      const updatedUser = await usersModel.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User id is required in query params" });
    }

    const deletedUser = await usersModel.findByIdAndDelete(new Types.ObjectId(id));

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
}

  export async function getUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User id is required in query params" });
    }

    const foundUser = await usersModel.findByIdAndDelete(new Types.ObjectId(id));

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found successfully", user: foundUser });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
}