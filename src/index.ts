import express from "express";
import cors from "cors";
import authRoute from "./features/auth/auth.route";
import userRoute from "./features/user/user.route";
import partyRoute from "./features/party/party.route";
import transactionRoute from "./features/transaction/transaction.route";
import inventoryRoute from "./features/inventory/inventory.route";
import invoiceRoute from "./features/invoice/invoice.route";
import { configureJwtStrategy } from "./shared/jwtStrategy";
import passport from "passport";
import morgan from "morgan";
import logger from "./shared/logger";
import { errorHandler } from "./shared/errorHandler.error";

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

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

//routes
app.use("/auth", authRoute);

app.use("/user", passport.authenticate("jwt", { session: false }), userRoute);

app.use("/party", passport.authenticate("jwt", { session: false }), partyRoute);

app.use(
  "/transaction",
  passport.authenticate("jwt", { session: false }),
  transactionRoute,
);

app.use(
  "/inventory",
  passport.authenticate("jwt", { session: false }),
  inventoryRoute,
);

app.use(
  "/invoice",
  passport.authenticate("jwt", { session: false }),
  invoiceRoute,
);

//error handler middleware
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
