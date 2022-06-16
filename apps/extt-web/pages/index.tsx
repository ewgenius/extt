import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  ChangeEventHandler,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

const States = [
  "text",
  "Text",
  "eTxt",
  "exTt",
  "extT",
  "extt",
  "extt",
  "extt",
  "extT",
  "exTt",
  "eTxt",
  "Text",
  "text",
  "text",
];

const Logo = () => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const i = setTimeout(() => setFrame((frame + 1) % States.length), 300);
    return () => clearTimeout(i);
  }, [frame]);

  return <span className="mt-8 text-4xl">{States[frame]}</span>;
};

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const setEmailHandler: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setEmail(value);

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "failure"
  >("idle");

  useEffect(() => {
    if (localStorage.getItem("extt:subscribed") === "true") {
      setStatus("success");
    }
  }, []);

  const submit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setStatus("sending");

      fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })
        .then(() => {
          setStatus("success");
          localStorage.setItem("extt:subscribed", "true");
        })
        .catch(() => {
          setStatus("failure");
        });
    },
    [email]
  );

  if (status === "success") {
    return (
      <div className="mt-32 mb-16 text-center text-sm text-stone-600">
        <p>Thanks for subscription!</p>
        <p>You&apos;ll get notified when we have some updates</p>
      </div>
    );
  }

  return (
    <form className="mt-32 mb-16" onSubmit={submit}>
      <p className="text-sm">Subscribe to get notified about updates:</p>
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          className="flex-grow rounded-lg bg-stone-900 text-sm text-stone-100"
          type="email"
          placeholder="email"
          value={email}
          disabled={status === "sending"}
          onChange={setEmailHandler}
        />
        <button
          type="submit"
          disabled={!email || status === "sending"}
          className="inline-flex items-center rounded-lg border border-stone-500 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-100 shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-stone-600 disabled:hover:bg-stone-900"
        >
          subscribe
        </button>
      </div>
    </form>
  );
};

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Extt</title>
        <meta name="description" content="Simple note editor app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container prose prose-stone mx-auto flex max-w-2xl flex-grow flex-col items-center justify-center px-4 py-16 dark:prose-invert">
        <Image alt="logo" width={128} height={128} src="/icon.png" />
        <Logo />
        <p className="text-sm opacity-50">coming soon...</p>

        <SubscribeForm />
      </main>

      <footer className="container mx-auto max-w-2xl p-4 text-xs opacity-50">
        Copyright © 2022 extt.app
      </footer>
    </div>
  );
};

export default Home;
