import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog'



app.get('/', (req: Request, res: Response) => {
  res.send('this is a typescript app');
});

// require some authentication or something probably 
app.get('/testDB', async (req: Request, res: Response) => {
  await client.connect();
  console.log("Successfully Connected to Server");
  const db = client.db(dbName);
  const collection = db.collection("test");
  const elements = await collection.find({}).toArray()
  console.log(elements);
  
  res.status(201).send("testDB successful");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});