import { Model } from "mongoose";
import { Request, Response } from "express";
import { User } from "../models/models";
import { IUser } from "../models/interfaces/IUser";
import { encryptPassword, generateJWT } from "../commons/utils/auth";

const bcrypt = require('bcrypt');

export class AuthController {
    model: Model<IUser>;
    
    constructor(model: Model<IUser>) {
        this.model = model;
    }

    #isUserValid(userDetails: IUser): boolean {
        const password: string | null = userDetails.password;
        const email: string | null = userDetails.email;

        const isValidUser: boolean = password !== null && !email !== null;

        return isValidUser;
    }

    #createUser = async (userDetails: IUser) => {
        try {
            const encryptedPassword = await encryptPassword(userDetails.password);

            const user = new User({
                name: userDetails.name,
                email: userDetails.email,
                password: encryptedPassword
            });
            const newUser = await user.save();

            return newUser;
        } catch (err) {
            console.log('failed to create user', err);
        }
    }

    register = async (req: Request, res: Response) => {
        try {
           if (!this.#isUserValid(req.body)) {
                res.status(500).json({ message: 'no password or email provided' });
            } else {
                const user = await this.model.findOne({
                    email: req.body.email
                });

                if (user) {
                    res.status(500).json({ message: 'this email is already in use. try to login' });
                } else {
                    const user = await this.#createUser(req.body);
                    
                    res.status(200).send(user);
                }
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            if (!this.#isUserValid(req.body)) {
                 res.status(500).json({ message: 'no password or email provided' });
             } else {
                 const user = await this.model.findOne({
                     email: req.body.email
                 });
 
                 if (!user) {
                     res.status(500).json({ message: 'bad email, try again' });
                 } else {
                     const match = bcrypt.compare(req.body.password, user.password);
                     
                     if (!match) {
                        res.status(500).send('wrong email or password');
                     } else {
                        const accessToken = await generateJWT(user._id);

                        res.status(200).send({ 'accessToken': accessToken });
                     }
                 }
             }
         } catch (err) {
             res.status(500).json({ message: err.message });
         }
    }
};

export const authController = new AuthController(User);
