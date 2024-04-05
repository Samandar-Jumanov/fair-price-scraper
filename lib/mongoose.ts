import mongoose from "mongoose";



let dbConnected = false ;


export const connectDb = async () =>{
    await mongoose.set("strictQuery" , true );

    if(dbConnected) return console.log("Database connected");

    try {

        await mongoose.connect(process.env.MONGO_URI as string )
        dbConnected = true;
        console.log("Database connected")

    }catch( err : any ){
          throw new Error(`MongoDbConnection : ${err.message}`)
    }
}