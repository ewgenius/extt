import { ExttLogo } from "./extt-logo";
import { CopyButton } from "./copy-button";

export default function Home() {
  const installCmd = "curl -fsSL https://extt.app/install | sh";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-8">
        <ExttLogo />
      </div>
      <h1 className="mb-4 text-2xl font-bold">Extt - Notetaking for Humans and Agents</h1>
      <p className="mb-4 max-w-md text-gray-500">
        A fast, simple, and agent-ready notes application for managing markdown files.
      </p>
      <p className="mb-8 text-sm font-semibold text-blue-500">
        Desktop app is coming soon.
      </p>
      <div className="flex items-center rounded bg-gray-200 pl-4 pr-2 py-2 font-mono text-sm">
        <code>{installCmd}</code>
        <CopyButton text={installCmd} />
      </div>
      <footer className="absolute bottom-4 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Extt. All rights reserved.
      </footer>
    </main>
  );
}
