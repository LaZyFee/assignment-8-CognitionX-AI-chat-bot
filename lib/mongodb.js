import mongoose from 'mongoose';

export async function dbConnect() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        return conn;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}