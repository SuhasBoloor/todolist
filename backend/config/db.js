const mongoose = require("mongoose")

const connectDB = async () => {
    if(!process.env.DB_URL){
        console.log("Add env you fool")
        return
    }

    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log(`Connection established bitch ${conn.connection.host}`)
    } catch (error) {
        console.error(`[DB] Connection Failed: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB