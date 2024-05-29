import { jwtVerify, SignJWT } from "jose";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);
export const sessionExpirationTime = 60;

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
