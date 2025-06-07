class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        Error=[],
        stack
    ){
        super(message)
        this.statusCode=statusCode,
        this.data=null
        this.success=false
        this.Error=Error
        
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }   
    }
    
}

export {ApiError}