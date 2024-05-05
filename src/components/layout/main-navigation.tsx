import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const MainNavigation = () => {
  const { data: session, status } = useSession();

  const logoutHandler = async () => {
    await signOut();
  };

  return (
    <header>
      <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between">
        <ul className="flex space-x-4">
          <li className="hover:text-gray-400 ">
            <Link href="/">Home</Link>
          </li>

          {session && (
            <>
              <li className="hover:text-gray-400 ">
                <Link href="/profile">Profile</Link>
              </li>
            </>
          )}
        </ul>
        {session && (
          <ul>
            <li className="hover:text-gray-400 ">
              {/* <Link href="/logout">Logout</Link> */}
              <button onClick={logoutHandler} className="hover:text-gray-400">
                Logout
              </button>
            </li>
          </ul>
        )}
        {!session && (
          <ul>
            <li className="hover:text-gray-400 ">
              <Link href="/auth">Login/Sign Up</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainNavigation;
