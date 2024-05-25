import { jwtVerify, SignJWT } from "jose";
import { sessionExpirationTime } from "@/app/model/auth/session-management";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

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
