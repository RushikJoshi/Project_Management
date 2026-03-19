    import mongoose from 'mongoose'

    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/PMS';

    const connectDB = async () => {
        try {
            const conn = await mongoose.connect(mongoURI);

            console.log("Database connected successfully ", conn.connection.host);
        }
        catch(error){
            console.log("Databse Connection failed", error.message);
        }
    }

    export default connectDB;