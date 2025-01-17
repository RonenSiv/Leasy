import { GetServerSidePropsContext } from "next";
import { mockClient, User } from "@/mocks/mock-client-data";

export async function getServerSideAuth(
  context: GetServerSidePropsContext,
): Promise<User | null> {
  if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
    return mockClient;
  }

  const { req } = context;
  const token = req.cookies.authToken;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch("http://localhost:8080/api/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const user: User = await res.json();
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
  }
}
