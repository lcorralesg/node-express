import mongoose  from "mongoose"    

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://mongodb:27017/login_google',{
        }).then(db => console.log('Database is connected'));
    } catch (error) {
        console.log(error);
    }
}