"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSignInClick = () => {
    signIn("google");
  };

  const handleSignOutClick = () => {
    signOut();
  };

  return (
    <nav className="bg-teal-100 dark:bg-teal-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={handleMenuClick}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          {session ? (
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    href={"/"}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    href={"/profile/" + session?.user?.id}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={"/hobbies/" + session?.user?.id}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Hobbies
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {session ? (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                onClick={handleSignOutClick}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                onClick={handleSignInClick}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${isOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="border-t border-gray-700 pt-4 pb-3">
          {session ? (
            <>
              <Link href={"/"}>Home</Link>

              <Link
                href={"/profile/" + session?.user?.id}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex cursor-pointer flex-col gap-8 px-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={session?.user?.image as string}
                        alt={session?.user?.name as string}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {session?.user?.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {session?.user?.email}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={"/hobbies/" + session?.user?.id}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Hobbies
              </Link>
            </>
          ) : (
            <div className="space-y-1 px-2 pt-2 pb-3">
              <button
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={handleSignInClick}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
