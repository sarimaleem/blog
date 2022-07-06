import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from './api/api.json';


dotenv.config();

// Set up express
const app: Express = express();
// const port = process.env.PORT;
const port = 3000; // fix this later lol
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// connect database 
client.connect();
const dbName = 'blog'
const db = client.db(dbName);


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {explorer: true})
);


app.get('/', (req: Request, res: Response) => {
  res.send('this is a typescript app');
});

// require some authentication or something probably 
app.get('/testDB', async (req: Request, res: Response) => {
  const collection = db.collection("test");
  const elements = await collection.find({}).toArray()
  res.status(201).send(elements);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});