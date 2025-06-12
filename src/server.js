import cors from "cors";
import express from "express"
import router from "./router.js"

const app = express();

app.use(express.json());
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