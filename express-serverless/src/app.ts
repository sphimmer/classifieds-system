import { createConnection } from "typeorm";
import Container from "typedi";
import AWS from 'aws-sdk'
import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { UserRoutes } from "./routes/UserRoutes";
import { CategoryRoutes } from "./routes/CategoryRoutes";
import cookieSession from 'cookie-session';


const configure = async (): Promise<Application> => {
    const connection = await createConnection()
    var config = new AWS.Config({
      accessKeyId: process.env.AWS_ACCESS_CLIENT_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-east-1'
    });
    Container.set("connection", connection);
    Container.set("S3", new AWS.S3(config));
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header("Content-Type", 'application/json');
        next();
    });
    app.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
      }))
    
    app.use('/me', new UserRoutes().router);
    app.use('/categories', new CategoryRoutes().router);
    return app;
}

configure().then((app: Application) => {
    app.listen(process.env.PORT || 5000, () => {
        console.info('Express server listening on port ' + process.env.PORT || 5000 );
      });
});