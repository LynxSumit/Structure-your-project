import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";
import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone"
import { schema } from "./schema/schema.js";
import {graphqlHTTP} from "express-graphql"
import mongoose from "mongoose";
import colors from "colors";


dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;




const app = express();
app.use(cors({ origin: " * ", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: " * ", credentials: true }));
app.use(morgan("dev"));
app.use("/graphql", graphqlHTTP({
    schema : schema,
    graphiql : process.env.NODE_ENV === "DEVELOPMENT"
}))

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// your routes here

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);


mongoose.connect(process.env.MONGO_URI, {
    dbName : "projectize"
   }).then((result) => {
       console.log("Connected to MongoDB " + result.connection.name.bgCyan.underline)
       app.listen(port, () =>
           console.log(`Server is working on Port ${port} in ${envMode} " Mode.`.cyan.bold)
         );
       
   }).catch((err) => {
       console.log(err)
       
   })