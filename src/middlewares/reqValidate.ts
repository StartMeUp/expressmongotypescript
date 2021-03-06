import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "./error.middleware";

interface MetadataObj {
  [key: string]: z.AnyZodObject;
}

const reqSchemas: MetadataObj = {
  "/user/signup": z.object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  "/user/signin": z.object({
    email: z.string().email(),
    password: z.string(),
  }),
};

const zodIssues = (issues: [{ path: string[] }]) => {
  let issuesList = "";
  issues.forEach((issue, i) => {
    issuesList += `${issue.path[0]}${issues.length - 1 === i ? "" : ", "}`;
  });
  return issuesList;
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const routes = Object.keys(reqSchemas);
  const path = req.originalUrl;

  if (routes.includes(path)) {
    const ReqSchema = reqSchemas[path];
    try {
      ReqSchema.parse(req.body);
      next();
    } catch (error) {
      console.log("Zod issue", error.issues);
      next(
        new CustomError(
          `Request Schema error at ${path}, Issues: ${zodIssues(error.issues)}`
        )
      );
    }
  } else {
    next();
  }
};

export default validate;
