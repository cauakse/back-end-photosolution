import cors from "cors";
import express from "express"
import router from "./router.js"

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://photo-solution.vercel.app',
    'https://photo-solution-git-main.vercel.app',
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(router);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})