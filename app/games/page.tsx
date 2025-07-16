import GameHub from "../../components/game-hub";

export const metadata = {
  title: "Mini Games - Oguz Tozkoparan",
  description:
    "Interactive mini-games featuring modern design and engaging gameplay. Test your skills with our collection of browser-based games.",
};

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <GameHub />
    </div>
  );
}
