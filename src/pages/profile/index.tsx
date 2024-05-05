import { getSession, useSession } from "next-auth/react";

export const getServerSideProps = async (context: any) => {
  console.log({ context });
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session) {
    return <div>You are not logged in.</div>;
  }

  return <div>Profile</div>;
};

export default Profile;
