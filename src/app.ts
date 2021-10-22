import 'dotenv/config';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { router } from './routes';
import cors from 'cors';

const PORT = 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

export { httpServer, io, PORT };
