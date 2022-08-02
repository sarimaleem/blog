import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api/api.json";
import type { WithId, Document } from "mongodb";
import bodyParser from "body-parser";
import showdown from "showdown";
import path from "path";
import parse from "node-html-parser";
import fs from "fs";
import { log } from "console";

dotenv.config();

// Set up express
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "../frontend")));
console.log(path.join(__dirname, "../frontend"));

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

enum Visibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

interface Post extends WithId<Document> {
    _id: ObjectId;
    html: string;
    text: string;
    title: string;
    date: Date;
    visibility: Visibility;
    tags: [string];
}

interface BlogPostRequest {
    text: string;
    visibility: Visibility;
    tags: [string];
}

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../frontend", "home.html"));
});

app.get("/test", (_req: Request, res: Response) => {
    const text: string = fs
        .readFileSync("./frontend/template.html")
        .toString("utf-8");
    const template = parse(text);
    const body = template.getElementsByTagName("body")[0];
    const test = parse("<h2>Server is up</h2>");
    body.appendChild(test);
    res.send(template.innerHTML);
});

// require some authentication or something probably
app.get("/testDB", async (_req: Request, res: Response) => {
    const collection = db.collection("test");
    const elements = await collection.find({}).toArray();
    res.status(201).send(elements);
});

app.get("/post/all", async (_req: Request, res: Response) => {
    console.log("This method was called");
    const posts = db.collection("posts");
    const data = await posts.find().toArray();
    console.log(data);
    return res.send(data);
})

app.get("/testHTML", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../frontend", "template.html"));
});

app.post("/post/:title", async (req: Request, res: Response) => {
    const posts = db.collection("posts");
    const body = req.body as BlogPostRequest;
    console.log(body);

    if (
        body.text === undefined ||
        body.tags === undefined ||
        body.visibility === undefined
    ) {
        return res.status(400).send("missing data");
    }

    const dbInsert: Post = {
        _id: new ObjectId(),
        title: req.params.title,
        text: body.text,
        html: converter.makeHtml(body.text),
        date: new Date(),
        visibility: body.visibility,
        tags: body.tags,
    };

    if ((await posts.findOne({ title: req.params.title })) !== null) {
        return res.status(409).send("Page already exists");
    }

    posts.insertOne(dbInsert);
    return res.status(204).send("Post Successfully Created");
});

app.get("/post/:title", async (req: Request, res: Response) => {
    console.log("get post request");

    const posts = db.collection("posts");
    const post: Post = (await posts.findOne({
        title: req.params.title,
    })) as Post;

    if (post === null) {
        return res.send("page not found");
    }

    const templateString: string = fs
        .readFileSync("./frontend/template.html")
        .toString("utf-8");
    const template = parse(templateString);
    const body = template.getElementsByTagName("body")[0];
    const content = parse(post.html);
    body.appendChild(content);
    return res.send(template.innerHTML);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
