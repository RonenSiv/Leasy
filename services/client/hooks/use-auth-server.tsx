import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@/auth/get-serverside-auth";

export function withAuthServerSideProps<P extends object>(
  getServerSidePropsFunc?: GetServerSideProps<P>,
) {
  return async (context: GetServerSidePropsContext) => {
    const user = await getServerSideAuth(context);

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      if ("props" in result) {
        return {
          props: {
            ...result.props,
            user,
          },
        };
      }
      return result;
    }

    return { props: { user } };
  };
}
