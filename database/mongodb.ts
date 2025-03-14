import mongoose from "mongoose"

if(!Bun.env.DATABASE_URL){
    throw new Error("DATABASE URL MISSING")
}

const connecToDatabase = async () => {
    try {
        await mongoose.connect(Bun.env.DATABASE_URL || "")
        console.log("Connected to Database");
        
    } catch (error) {
        console.error("Error connecting to database", error)
        process.exit(1)
    }
}

export default connecToDatabase