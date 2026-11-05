import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = "Tejas Thind: Management Engineering and AI at the University of Waterloo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for the home page: dark, the name large, one line of context.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #1b1840 0%, #5a3a78 48%, #e0875f 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05 }}>{SITE_NAME}</div>
        <div style={{ marginTop: 20, fontSize: 36, opacity: 0.85 }}>
          Management Engineering + AI at the University of Waterloo
        </div>
      </div>
    ),
    size,
  );
}
