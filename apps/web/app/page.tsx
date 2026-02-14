import { ExttLogo } from "./extt-logo";
import { CopyButton } from "./copy-button";

export default function Home() {
  const installCmd = "curl -fsSL https://extt.app/install | sh";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="p-8">
        <ExttLogo />
      </div>
      <div className="mt-8 flex items-center rounded bg-gray-200 pl-4 pr-2 py-2 font-mono text-sm">
        <code>{installCmd}</code>
        <CopyButton text={installCmd} />
      </div>
    </main>
  );
}
