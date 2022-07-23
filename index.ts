import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api/api.json";
import type { WithId, Document } from "mongodb";
import bodyParser from "body-parser";
import showdown from "showdown";

dotenv.config();

// Set up express
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded());
app.use(bodyParser.text({ type: "text/markdown" }));
app.use(bodyParser.json());

// set up mongo
const url = "mongodb://localhost:27017"; // maybe fix this? I think it might matter if the url is exposed
const client = new MongoClient(url);
client.connect();
const dbName = "blog";
const db = client.db(dbName);

// set up showdown
const converter = new showdown.Converter();

interface Post extends WithId<Document> {
  _id: ObjectId;
  html: string;
  text: string;
  title: string;
}

interface BlogPostRequest {
  title: string;
  text: string;
  // author: string;
  // tags: Array<string>;
}

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.get("/", (req: Request, res: Response) => {
  res.send("home page will go here at one point");
});

// require some authentication or something probably
app.get("/testDB", async (req: Request, res: Response) => {
  const collection = db.collection("test");
  const elements = await collection.find({}).toArray();
  res.status(201).send(elements);
});

app.post("/post", (req: Request, res: Response) => {
  // if(req.headers["content-type"] !== "text/markdown") {
  //   res.status(415).send("Content Type must be text markdown in HTML header")
  // }
  const posts = db.collection("posts");
  const postRequest = req.body as BlogPostRequest;
  const dbInsert: Post = {
    _id: new ObjectId(),
    title: postRequest.title,
    text: postRequest.text,
    html: converter.makeHtml(postRequest.text),
  };

  // TODO add exists check

  if (postRequest == null) {
    res.status(404).send("Something Wrong");
  }

  posts.insertOne(dbInsert);

  res.status(204).send(req.body);
});

app.get("/post/:post", async (req: Request, res: Response) => {
  console.log("Post Request");
  
  const posts = db.collection("posts");
  const post: Post = (await posts.findOne({
    title: req.params.post,
  })) as Post;

  if (post === null) {
    res.send("page not found");
  }

  res.send(post.html);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
