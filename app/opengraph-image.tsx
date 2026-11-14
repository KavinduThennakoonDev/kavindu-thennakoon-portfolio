import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#09090B",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 100% 100%, rgba(56,189,248,0.22), transparent 45%)",
          color: "#F4F4F5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#A1A1AA", letterSpacing: 6 }}>
          <div style={{ width: 56, height: 2, background: "#38BDF8" }} />
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>KAVINDU</div>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95, color: "#C7C8FB" }}>
            THENNAKOON.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>{siteConfig.roles[0]}</div>
            <div style={{ color: "#A1A1AA" }}>{`${siteConfig.roles[1]} · ${siteConfig.location}`}</div>
          </div>
          <div style={{ color: "#A1A1AA", fontSize: 22 }}>{`github.com/${siteConfig.social.github.username}`}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
