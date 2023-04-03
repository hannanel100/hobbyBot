import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Loader from "~/components/Loader";

export default function Error() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && session) {
      void router.push("/");
    }
  }, [status, session, router]);

  return (
    <main>
      <div className="mx-4 flex flex-col gap-8 sm:mx-auto sm:max-w-2xl">
        <Card>
          <p className="text-center text-xl">
            You are not logged in. Please sign in to continue
          </p>
        </Card>
        {status === "loading" ? (
          <Button disabled>
            <Loader size="sm" />
          </Button>
        ) : (
          <Button onClick={() => void signIn("google")}>Sign in</Button>
        )}
      </div>
    </main>
  );
}
