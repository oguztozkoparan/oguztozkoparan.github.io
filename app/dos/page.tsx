import DOSTerminal from "../../components/dos-terminal";

export const metadata = {
  title: "DOS Terminal - Oguz Tozkoparan",
  description:
    "Interactive DOS-like command-line interface with retro styling and modern functionality.",
};

export default function DOSPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <DOSTerminal />
    </div>
  );
}
