"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const session = useSession();
  return (
    <div className="navbar bg-neutral">
      <div className="navbar-start">
        <Link href={"/"}>
          <button className="btn btn-ghost text-xl text-white">
            TODO LIST
          </button>
        </Link>
      </div>

      <div className="navbar-end">
        {!session.data ? (
          <>
            <Link href={"login"}>
              <button className="btn bg-[#D7DDE4] mr-2"> LOGIN </button>
            </Link>
            <Link href={"signup"}>
              <button className="btn bg-[#D7DDE4] mr-2"> SignUP </button>
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  width={50}
                  height={50}
                  alt="Tailwind CSS Navbar component"
                  src={
                    session?.data?.user?.image ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
