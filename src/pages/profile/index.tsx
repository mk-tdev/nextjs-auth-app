import { getSession, useSession } from "next-auth/react";

export const getServerSideProps = async (context: any) => {
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
  console.log(session);
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }
  // if (!session) {
  //   return <div>You are not logged in.</div>;
  // }

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!oldPassword || !newPassword) {
      console.error("Old password or new password is missing");
      return;
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Password changed successfully:", data);
      } else {
        console.error("Error changing password:", data);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="m-5">
      <h1>Your Profile</h1>

      <p>Welcome, {session?.user?.email}!</p>

      <section className="my-5">
        <h2 className="text-2xl font-bold mb-4">Change password</h2>

        <form className="flex flex-col  gap-4" onSubmit={handlePasswordChange}>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              placeholder="oldPassword"
              className="p-3 border border-gray-300 ring-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="newPassword"
              className="p-3 border border-gray-300 ring-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Proceed
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
