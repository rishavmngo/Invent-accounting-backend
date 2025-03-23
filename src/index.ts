import express from "express";
import authRoute from "./features/auth/auth.route";
import userRoute from "./features/user/user.route";
import { errorHandler } from "./shared/errorHandler.error";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);

// app.get("/", async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query("select name from test where id=1");
//
//     console.log(result.rows[0]);
//     res.send(result.rows[0]);
//     return;
//   } catch (error) {
//     console.log(error);
//   }
//   res.send("Express + TypeScript Server is running!");
// });

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
