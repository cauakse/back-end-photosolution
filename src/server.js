import cors from "cors";
import express from "express"
import router from "./router.js"
import bodyParser from 'body-parser';

const app = express();

// Aumentar limite de payload
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(router);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})