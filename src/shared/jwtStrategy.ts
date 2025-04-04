import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { userService } from "../features/user/user.service";

const SECRET_KEY = process.env.JWT_SECRET || "secretykey";

export const configureJwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_KEY,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userService.getUserById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );
};
