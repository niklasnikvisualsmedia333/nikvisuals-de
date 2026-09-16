export type SmsVideo = {
  id: string;
  displayTitle: { de: string; en: string };
  thumbnail: string;
};

// Keep the homepage bundle independent from the full 34-video archive.
export const smsVideos: SmsVideo[] = [
  {
    id: "8Nb_wHCHVk8",
    displayTitle: { de: "SMS group Campus-Eröffnung", en: "SMS group campus opening" },
    thumbnail: "videos/8Nb_wHCHVk8.webp",
  },
  {
    id: "WR4BBw6HSGc",
    displayTitle: { de: "SMS group Schwertransport", en: "SMS group heavy transport" },
    thumbnail: "videos/WR4BBw6HSGc.webp",
  },
  {
    id: "WwuJh_wi3dE",
    displayTitle: { de: "Behind the Scenes: SMS group", en: "Behind the scenes: SMS group" },
    thumbnail: "videos/WwuJh_wi3dE.webp",
  },
];
