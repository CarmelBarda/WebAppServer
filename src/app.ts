import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import BaseRouter from "./routes/index";

dotenv.config();

const initApp = async (): Promise<Express> => {
  try {

    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
    const db = mongoose.connection;
    const app = express();

    /************************************************************************************
                                    Set basic express settings
     ***********************************************************************************/

    app.use(cors());
    // app.use(express.json({ limit: "10mb" }));
    // app.use(express.urlencoded({ limit: "10mb", extended: true }));

    // Add APIs
    app.use("/api", BaseRouter);

    db.once("open", () =>
      console.log("Connected to Database")
    );
    db.on("error", (error) => 
      console.error(error)
    );

    app.get('/', (req, res) => {
      res.send('Hello World');  
    });

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
};
export default initApp;