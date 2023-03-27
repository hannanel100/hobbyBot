import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Title from "./Title";
import Loader from "./Loader";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useRouter();
  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSignInClick = () => {
    signIn("google");
  };

  const handleSignOutClick = () => {
    signOut({ callbackUrl: "/" });
  };
  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Hobbies",
      href: "/hobbies/" + session?.user.id,
    },
    {
      name: "Profile",
      href: "/profile/" + session?.user.id,
    },
  ];
  return (
    <nav className="flex items-center justify-between bg-teal-100 dark:bg-teal-800">
      <div className="flex flex-grow-0 self-start">
        <Image
          src="/logo_transparent.png"
          width={100}
          height={100}
          alt="logo"
        />

        <Title />
      </div>
      <div className="flex flex-col">
        <div className="ml-auto max-w-7xl flex-1 px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 flex-col items-center justify-between sm:flex-row">
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-teal-400 hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                    {links.map((link) => (
                      <Link
                        href={link.href}
                        key={link.name}
                        className={`${
                          pathname === link.href
                            ? "bg-teal-700 text-teal-50"
                            : ""
                        } rounded-md  px-3 py-2 text-sm font-medium`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {status === "authenticated" ? (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  className="rounded-md bg-teal-900 px-3 py-2 text-sm font-medium text-teal-50"
                  onClick={handleSignOutClick}
                >
                  Sign out
                </button>
              </div>
            ) : status === "loading" ? (
              <Loader size="sm" />
            ) : (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  className="rounded-md bg-teal-900 px-3 py-2 text-sm font-medium text-white"
                  onClick={handleSignInClick}
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } flex-1 transition-all sm:hidden`}
          id="mobile-menu"
        >
          <div className="border-t border-teal-700 pt-4 pb-3">
            {session ? (
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.name}
                    className={`pl-3 ${
                      pathname === link.href
                        ? "mr-2 rounded-md bg-teal-700 px-3 py-2 text-teal-50"
                        : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name !== "Profile" ? (
                      link.name
                    ) : (
                      <div className="flex cursor-pointer flex-col gap-8">
                        <div className="flex items-center gap-2">
                          <div className="">
                            <div className=" font-medium leading-none">
                              {session?.user?.name}
                            </div>
                            <div className="text-sm font-medium leading-none text-teal-700 dark:text-teal-400">
                              {session?.user?.email}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Image
                              className="hidden h-10 w-10 rounded-full md:block"
                              src={session?.user?.image as string}
                              alt={session?.user?.name as string}
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                ))}

                <button
                  className="rounded-md pl-3  text-left"
                  onClick={handleSignOutClick}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-2 pt-2 pb-3">
                <button
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-teal-300 hover:bg-teal-700 hover:text-white"
                  onClick={handleSignInClick}
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
