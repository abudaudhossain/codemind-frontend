/** Approximate GitHub Linguist colors for common languages. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  R: "#198CE7",
  Dockerfile: "#384d54",
  Markdown: "#083fa1",
};

export function getLanguageColor(language: string | null | undefined): string {
  if (!language || language === "Unknown") return "oklch(0.7 0.02 255)";
  return LANGUAGE_COLORS[language] ?? "oklch(0.62 0.08 250)";
}
