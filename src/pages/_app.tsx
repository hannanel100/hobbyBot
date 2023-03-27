import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import Head from "next/head";
import { PageLayout } from "~/components/Layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>HobbyBot</title>
        <meta
          name="description"
          content="An Ai powered app to find you your next hobby"
        />
        <link rel="icon" href="/icon.png" />
      </Head>
      <SessionProvider session={session}>
        <PageLayout>
          <main className="flex h-full flex-col">
            <Navbar />
            <div className="h-full pt-4 ">
              <Component {...pageProps} />
            </div>
          </main>
        </PageLayout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
