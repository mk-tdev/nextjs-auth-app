import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        router.replace("/profile");
      }
    } else {
      try {
        const response = await fetch("/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          router.push("/");
        } else {
          const error = await response.json();
          console.error(error);
        }
      } catch (e) {
        console.error("Error occurred during sign up:", e);
      }
    }
  };

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="m-5">
        <h1 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form className="flex flex-col  gap-4" onSubmit={handleAuth}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              className="p-3 border border-gray-300 ring-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              className="p-3 border border-gray-300 ring-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <button
            type="button"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Switch to Sign Up" : "Switch to Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Auth;
