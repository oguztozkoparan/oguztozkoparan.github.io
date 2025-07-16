import ThemeToggleShowcase from "../../components/theme-toggle-showcase"

export default function ThemeShowcasePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <ThemeToggleShowcase />
    </div>
  )
}
