import mongoose from "mongoose";

type ConnectionObject = {
  isConntected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async ():Promise<void> => {
  if (connection.isConntected) {
    console.log("Already connected to DB")
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
    });
    connection.isConntected = db.connections[0].readyState;
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Connection Error", error);

    process.exit(1);
  }
};

export default dbConnect;