import {app} from "./app.js"
import {dbConnect} from "./db/index.js"
import dotenv from "dotenv";

dotenv.config();
dbConnect()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error",error)
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log(`MongoDb Connection failed || `,error);
})