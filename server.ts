import express, { Request, Response, Application } from "express";
import dotEnv from "dotenv";
import { DBConnectionUtil } from "./database/connections/DBConnectionUtil";
import productRouter from "./Routes/productsRoute";
import categoryRouter from "./Routes/categoryRoute";
import userRouter from "./Routes/usersRoute";



const app: Application = express();
dotEnv.config({ path: "./.env" });

const port: number | undefined | string = process.env.PORT || 5555;
const databaseUrl: string | undefined = process.env.MONGO_DB_CLOUD_URL;
const databaseName: string | undefined = process.env.DATABASE_NAME;



//Get Data
app.get("/", (request: Request, response: Response) => {
  response.status(200);
  response.json({
    msg: "Welcome to Express JS",
  });
});

// Configure express to read form data
app.use(express.json());

// Routing Configuration
app.use("/product", productRouter)
app.use("/category", categoryRouter)
app.use("/users", userRouter)


//run application
if (port && databaseName && databaseUrl) {
  app.listen(Number(port), () => {
    // Db connection from DButils
    DBConnectionUtil.connectToMongoDB(databaseUrl, databaseName)
      .then((response) => {
        if (response) {
          console.log("connected to DB");

        }
      })
      .catch((error) => {
        console.error("Connection Failed !", error);
        process.exit(0);
      });
    console.log(`Express server is Started at ${port}`);
  });
}
