import express from "express";
import authRoute from "./features/auth/auth.route";
import userRoute from "./features/user/user.route";
import { configureJwtStrategy } from "./shared/jwtStrategy";
import passport from "passport";
import morgan from "morgan";
import logger from "./shared/logger";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.use(express.json());

configureJwtStrategy(passport);
app.use(passport.initialize());

app.use("/auth", authRoute);
app.use("/user", passport.authenticate("jwt", { session: false }), userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
