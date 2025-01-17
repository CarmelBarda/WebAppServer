import { Model } from "mongoose";
import { Request, Response } from "express";
import { User } from "../models/models";
import { IUser } from "../models/interfaces/IUser";
import jwt from "jsonwebtoken";
import { encryptPassword, generateJWTAccessToken, generateJWTRefreshToken, verifyToken } from "../commons/utils/auth";

const bcrypt = require('bcrypt');

export class AuthController {
    model: Model<IUser>;
    
    constructor(model: Model<IUser>) {
        this.model = model;
    }

    #isUserValid(userDetails: IUser): boolean {
        const password: string | null = userDetails.password;
        const email: string | null = userDetails.email;

        const isValidUser: boolean = !!password && !!email;

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
            throw new Error(err);
        }
    }

    register = async (req: Request, res: Response) => {
        try {
           if (!this.#isUserValid(req.body)) {
                res.status(400).json({ message: 'no password or email provided' });
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
                     res.status(401).json({ message: 'bad email, try again' });
                 } else {
                    const match = await bcrypt.compare(req.body.password, user.password);
                     
                    if (!match) {
                        res.status(401).send('wrong email or password');
                    } else {
                        const accessToken = await generateJWTAccessToken(user._id);
                        const refreshToken = await generateJWTRefreshToken(user._id);

                        if(user.tokens == null) user.tokens = [refreshToken];
                        else user.tokens.push(refreshToken);

                        await user.save();

                        res.status(200).send({ 
                            'accessToken': accessToken,
                            'refreshToken': refreshToken
                        });
                    }
                 }
             }
         } catch (err) {
             res.status(500).json({ message: err.message });
         }
    }

    refreshToken = async (req: Request, res: Response) => {
        const authHeaders = req.headers['authorization'];
        const token = authHeaders && authHeaders.split(' ')[1];
            verifyToken(token, process.env.REFRESH_TOKEN_SECRET, async (err: any, user: { _id: string}) => {
                if(err) res.status(403).send('invalid request');
                else {
                    const userId = user._id;
                    try {
                        const user = await this.model.findById(userId);
        
                        if (!user) {
                            res.status(401).send({ message: 'User not found' });
                        } else {
                            const accessToken = await generateJWTAccessToken(user._id);
                            const refreshToken = await generateJWTRefreshToken(user._id);
        
                            user.tokens[user.tokens.indexOf(token)] = refreshToken;
                            await user.save();
                            res.status(200).send({ 
                                'accessToken': accessToken, 
                                'refreshToken': refreshToken 
                            });
                        }
                    } catch (err) {
                        res.status(500).json({ message: err.message });
                    }
                }
                
            });
    }

    logout = async (req: Request, res: Response) => {
        const authHeaders = req.headers['authorization'];
        const token = authHeaders && authHeaders.split(' ')[1];
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err: any, user: IUser) => {
                if(err) {
                    res.status(403).json({ message: 'invalid request' });
                } else {
                    const userId = user._id;

                    try {
                        const user = await this.model.findById(userId);
        
                        if (!user) {
                            res.status(403).json('invalid request');
                        }  else {
                            user.tokens.splice(user.tokens.indexOf(token), 1);
                            await user.save();
                            res.status(200).json({ message: 'logged out' });
                        }
                    } catch (err) {
                        res.status(403).json({ message: err.message });
                    } 
                }

            });
    }
};

export const authController = new AuthController(User);
