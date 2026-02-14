import { ExttLogo } from "./extt-logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="p-8">
        <ExttLogo />
      </div>
      <code className="mt-8 rounded bg-gray-200 px-4 py-2 font-mono text-sm">
        curl -fsSL https://extt.app/install | sh
      </code>
    </main>
  );
}
