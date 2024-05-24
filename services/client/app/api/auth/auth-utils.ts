import { jwtVerify, SignJWT } from "jose";
import { sessionExpirationTime } from "@/app/api/auth/session-management";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionExpirationTime} sec from now`)
    .sign(key);
};

export const decrypt = async (input: string) => {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
};
