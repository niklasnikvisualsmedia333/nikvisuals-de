import type { Language } from './site';

export type InternshipVideo = {
  id: string;
  title: Record<Language, string>;
  thumbnail: string;
};

// Separate from the 34-video portfolio archive: these are internship/career insights.
export const internshipVideos: InternshipVideo[] = [
  { id: 'YBKWRVq8sGM', title: { de: 'Video- & Fotoproduktion: Praktikum bei NikVisuals', en: 'Video and photo production internship' }, thumbnail: 'internships/YBKWRVq8sGM.webp' },
  { id: 'jGzVRJDaDu4', title: { de: 'Business Development Praktikum', en: 'Business development internship' }, thumbnail: 'internships/jGzVRJDaDu4.webp' },
  { id: '01bz0IA-YV0', title: { de: 'Praktikum in Medienproduktion & Marketing', en: 'Media production and marketing internship' }, thumbnail: 'internships/01bz0IA-YV0.webp' },
  { id: 'sg-ftfKm4wM', title: { de: 'Praktikum bei NikVisuals', en: 'An internship at NikVisuals' }, thumbnail: 'internships/sg-ftfKm4wM.webp' },
  { id: 'w0y8nuyZkHw', title: { de: 'Ein Tag als Praktikant', en: 'A day as an intern' }, thumbnail: 'internships/w0y8nuyZkHw.webp' },
  { id: 'aNgkK6kAB4M', title: { de: 'Arbeiten im Praktikum – auch unterwegs', en: 'Internship work while travelling' }, thumbnail: 'internships/aNgkK6kAB4M.webp' },
  { id: '5MXS-PU7vEg', title: { de: 'Marie über ihr Praktikum', en: 'Marie on her internship' }, thumbnail: 'internships/5MXS-PU7vEg.webp' },
  { id: 'slaLdlLGJfQ', title: { de: 'So läuft ein Praktikum ab', en: 'How an internship works' }, thumbnail: 'internships/slaLdlLGJfQ.webp' },
];
