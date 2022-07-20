import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api/api.json";
import type { WithId, Document } from "mongodb";

dotenv.config();

// Set up express
const app: Express = express();
// const port = process.env.PORT;
const port = 3000; // fix this later lol
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// connect database
client.connect();
const dbName = "blog";
const db = client.db(dbName);

interface Post extends WithId<Document> {
  _id: ObjectId;
  html: string;
  title: string;
}

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.get("/", (req: Request, res: Response) => {
  res.send("this is a typescript app");
});

// require some authentication or something probably
app.get("/testDB", async (req: Request, res: Response) => {
  const collection = db.collection("test");
  const elements = await collection.find({}).toArray();
  res.status(201).send(elements);
});

app.post("/publicPost", (req: Request, res: Response) => {
  // convert markdown to html
  // IDK the actual status
  res.status(204).send("Created Successfully");
});

app.get("/post/:post", async (req: Request, res: Response) => {
  const collection = db.collection("posts");
  const post: Post = await collection.findOne({title: req.params.post,}) as Post ?? 
    {
      _id: new ObjectId(),
      html: "page not found",
      title: "page not found",
    };

  res.send(post.html);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
