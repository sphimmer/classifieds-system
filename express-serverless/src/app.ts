import { createConnection } from "typeorm";
import Container from "typedi";
import AWS from 'aws-sdk'
import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { UserRoutes } from "./routes/UserRoutes";
import { CategoryRoutes } from "./routes/CategoryRoutes";

import { AuthRoutes } from "./routes/AuthRoutes";
import cookieParser from "cookie-parser";
import { ListingRoutes } from "./routes/ListingRoutes";
import { LocationRoutes } from "./routes/LocationRoutes";


const configure = async (): Promise<Application> => {
  const connection = await createConnection()
  
  var config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_CLIENT_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-east-1'
  });
  Container.set("connection", connection);
  try{
    await connection.runMigrations();

  } catch(error){
    console.error(error);
  }
  Container.set("S3", new AWS.S3(config));
  const app = express();
  app.use('*', cors({origin:'http://localhost:3000', credentials: true ,allowedHeaders: ['Location', 'Content-Type'], methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS']}));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.header("Content-Type", 'application/json');
    next();
  });
  app.use(cookieParser(process.env.COOKIE_KEY))

  app.use('/me', new UserRoutes().router);
  app.use('/categories', new CategoryRoutes().router);
  app.use('/auth', new AuthRoutes().router)
  app.use('/listings', new ListingRoutes().router);
  app.use('/locations', new LocationRoutes().router);
  return app;
}

configure().then((app: Application) => {
  app.listen(process.env.PORT || 5000, () => {
    console.info('Express server listening on port ' + process.env.PORT || 5000);
  });
});