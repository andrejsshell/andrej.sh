import { promises as fs } from "node:fs";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 } as const;

async function readFont(name: string) {
  const file = path.join(process.cwd(), "assets", "fonts", name);
  const buf = await fs.readFile(file);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export async function loadOgFonts() {
  const [regular, italic, bold, boldItalic] = await Promise.all([
    readFont("STIX2Text-Regular.otf"),
    readFont("STIX2Text-Italic.otf"),
    readFont("STIX2Text-Bold.otf"),
    readFont("STIX2Text-BoldItalic.otf"),
  ]);
  return [
    { name: "STIX", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "STIX", data: italic, style: "italic" as const, weight: 400 as const },
    { name: "STIX", data: bold, style: "normal" as const, weight: 700 as const },
    {
      name: "STIX",
      data: boldItalic,
      style: "italic" as const,
      weight: 700 as const,
    },
  ];
}

export const ogColors = {
  bg: "#fbfaf7",
  ink: "#1a1a1a",
  ink2: "#2a2a2a",
  muted: "#6b6a64",
  mutedSoft: "#908f88",
  rule: "#c9c3b2",
} as const;
