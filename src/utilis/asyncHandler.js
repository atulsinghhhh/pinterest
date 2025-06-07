
//  for handler the async error if error occurs it automatically goes to catch block
export const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=> next(error))
    }
}