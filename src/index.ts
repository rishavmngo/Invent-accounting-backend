import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
