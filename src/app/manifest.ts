import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Good Dog",
    short_name: "Good Dog",
    description:
      "A friendly daily dog-training coach for ordinary UK dog owners. Short, practical, reward-based activities.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f6f2",
    theme_color: "#2f6f5e",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
