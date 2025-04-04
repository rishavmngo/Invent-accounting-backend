import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secretykey";
class JWT {
  generateAccessToken(userId: number) {
    return jwt.sign(
      {
        id: userId,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      },
    );
  }

  generateRefreshToken(userId: number) {
    return jwt.sign(
      {
        id: userId,
      },
      SECRET_KEY,
      {
        expiresIn: "20d",
      },
    );
  }
}

export const jwtService = new JWT();
