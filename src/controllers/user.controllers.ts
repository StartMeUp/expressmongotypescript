import { Response, Request, NextFunction } from "express";
import { response } from "../utils/functions";
import user from "../services/user.services";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await user.signup(req.body);
    res.status(201).json(response(true, "user successfully created", result));
  } catch (error) {
    next(error);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await user.signin(req.body);
    res
      .status(200)
      .json(response(true, "user successfully authenticated", result));
  } catch (error) {
    next(error);
  }
};

const account = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await user.account(req.body.user.token);
    res.status(200).json(response(true, "user account details", result));
  } catch (error) {
    next(error);
  }
};

export default { signup, signin, account };
