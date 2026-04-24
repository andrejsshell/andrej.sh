import { ImageResponse } from "next/og";
import { loadOgFonts, ogColors, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Andrej Acevski — andrej.sh";

export default async function OG() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          padding: "96px",
          background: ogColors.bg,
          color: ogColors.ink,
          fontFamily: "STIX",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Andrej Acevski
        </div>
        <div
          style={{
            fontSize: 36,
            color: ogColors.ink2,
            lineHeight: 1.35,
            maxWidth: 960,
          }}
        >
          Software engineer and open source contributor. FCSE graduate.
          Building Kaneo, and small tools that make developers’ lives easier.
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
