//This utility fucntion is workers like a wraaper to reduces boilerplate code by removing the need to manually wrap handlers in try-catch blocks and it make code more readable and cleaner

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next)).catch((err) =>
             next(err)
         );
     };
 };
 
 export { asyncHandler };
 