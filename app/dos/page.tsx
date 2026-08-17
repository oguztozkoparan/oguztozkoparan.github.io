import type { Metadata } from "next";
import DOSTerminal from "@/components/dos-terminal";

export const metadata: Metadata = {
  title: "DOS Terminal",
  description:
    "An interactive DOS-style terminal in the browser — virtual file system, tab completion and command history.",
  alternates: { canonical: "/dos" },
};

export default function DOSPage() {
  return <DOSTerminal />;
}
