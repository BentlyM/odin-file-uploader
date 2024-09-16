import { Request, Response, NextFunction } from 'express';

// Middleware function to log method and action
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.originalUrl;
  
  // Log the method and action directory (URL)
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  
  // Proceed to the next middleware or route handler
  next();
};

export default loggerMiddleware;
