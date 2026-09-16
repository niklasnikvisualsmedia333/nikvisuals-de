import type { Language } from './site';

export type ReviewSource = 'google' | 'video';

export type Review = {
  id: string;
  name: string;
  roleOrCompany?: string;
  projectContext?: string;
  stars: 5;
  quote: Record<Language, string>;
  exactQuote: boolean;
  source: ReviewSource;
  sourceUrl?: string;
  featured: boolean;
};

const googleProfile = 'https://share.google/c0i784b5nSzpTO6LF';

export const reviews: Review[] = [
  {
    id: 'lapstore', name: 'LapStore GmbH', roleOrCompany: 'Refurbished IT-Hardware', projectContext: 'Produkt-Content & B2B', stars: 5,
    quote: {
      de: 'Top Zusammenarbeit mit NikVisuals! Freundlich, professionell, die Arbeitsweise effizient, genau auf unsere Bedürfnisse zugeschnitten und das Endergebnis hat unsere Erwartungen übertroffen. Wir freuen uns schon auf die zukünftige Projekte!',
      en: 'LapStore highlights the friendly, professional and efficient collaboration, work tailored to its needs and a result that exceeded expectations.',
    }, exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'cord-boschen', name: 'Cord Boschen', roleOrCompany: 'LapStore GmbH', projectContext: 'Produktvideos & Content', stars: 5,
    quote: {
      de: 'Cord Boschen hebt die individuelle Beratung und eine Umsetzung hervor, die auf die konkreten Anforderungen von LapStore abgestimmt war.',
      en: 'Cord Boschen highlights individual advice and delivery tailored to LapStore’s specific requirements.',
    }, exactQuote: false, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'frank-vorlaender', name: 'Frank Vorländer', roleOrCompany: 'Vorländer Sanitär · Heizung · Solar', projectContext: 'Imagefilm', stars: 5,
    quote: {
      de: 'NikVisuals Media hat für unseren Heizungs - und Sanitärbetrieb einen Imagefilm gedreht. Alles verlief total unkompliziert und professionell !!! NikVisuals ist auf jeden Fall absolut weiterzuempfehlen !! Gerne wieder :)',
      en: 'Frank Vorländer describes the image-film production as straightforward and professional and strongly recommends the collaboration.',
    }, exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'joern-muellers', name: 'Jörn Müllers', projectContext: 'Videoproduktion', stars: 5,
    quote: {
      de: 'Die Zusammenarbeit hat dank der strukturierten und kreativen Arbeit von NikVisuals sehr reibungslos funktioniert! Das Team hat jederzeit gute Ideen für die Umsetzung mit eingebracht und hochwertige Videoprodukte erstellt :)',
      en: 'Jörn Müllers highlights a smooth process, structured and creative work, practical ideas and high-quality video results.',
    }, exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'kristina-burazin', name: 'Kristina Burazin', projectContext: 'Imagefilm & Website-Fotografie', stars: 5,
    quote: {
      de: 'Immer wieder gerne! Das war jetzt meine 2 Zusammenarbeit und ich bin sehr zufrieden! Super nettes professionelles Team und toller Image Film und Webseiten Bilder!!!',
      en: 'After a second collaboration, Kristina Burazin praises the professional team, the image film and the website photography.',
    }, exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'steffen-kellermann', name: 'Steffen Kellermann', roleOrCompany: 'Bezirksschornsteinfeger & Energieberater', projectContext: 'Videoproduktion', stars: 5,
    quote: {
      de: 'Steffen Kellermann hebt die strukturierte, entspannte Begleitung hervor. Auch ohne Erfahrung mit Videoproduktion wusste er jederzeit, was als Nächstes passiert. Das Ergebnis übertraf seine Erwartungen deutlich.',
      en: 'Steffen Kellermann highlights the structured, relaxed guidance. Even without production experience, he always knew what would happen next, and the result clearly exceeded his expectations.',
    }, exactQuote: false, source: 'video', sourceUrl: 'https://www.youtube.com/watch?v=3AwzEKP8DTU', featured: true,
  },
  {
    id: 'kerstin-broh', name: 'Kerstin Broh', roleOrCompany: 'Tourismus & Stadtmarketing · Stadt Hilchenbach', projectContext: 'Content & Veröffentlichung', stars: 5,
    quote: {
      de: 'Kerstin Broh beschreibt die Zusammenarbeit als professionell, reibungslos und termintreu. Die abgestimmte Veröffentlichung sorgte zusätzlich für starke organische Reichweite und regionale Medienresonanz.',
      en: 'Kerstin Broh describes the work as professional, smooth and on schedule. Coordinated publishing also led to strong organic reach and regional media coverage.',
    }, exactQuote: false, source: 'video', sourceUrl: 'https://www.youtube.com/watch?v=DZSGpVBBo10', featured: true,
  },
  {
    id: 'yvonne-strasser', name: 'Yvonne Straßer', roleOrCompany: 'Siegerland Center', projectContext: 'Videoproduktion', stars: 5,
    quote: {
      de: 'Yvonne Straßer hebt die unkomplizierte Abstimmung, die professionelle Umsetzung und das Ergebnis der gemeinsamen Videoproduktion hervor.',
      en: 'Yvonne Straßer highlights the straightforward coordination, professional production and the final video result.',
    }, exactQuote: false, source: 'video', sourceUrl: 'https://www.youtube.com/watch?v=2DHytVUR2Fc', featured: true,
  },
  {
    id: 'dierk-stamer', name: 'Dierk Stamer', projectContext: 'Oldtimer-Treffen & Ausfahrt', stars: 5,
    quote: {
      de: 'Dierk Stamer entschied sich nach dem Vergleich verschiedener Showreels für NikVisuals. Er hebt die verlässliche Begleitung und die filmische Dokumentation des Oldtimer-Treffens am Edersee hervor.',
      en: 'After comparing several showreels, Dierk Stamer chose NikVisuals and highlights the reliable support and film documentation of the classic-car event at Lake Edersee.',
    }, exactQuote: false, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'erik-van-den-bril', name: 'Erik Van den Bril', roleOrCompany: 'Vesprima', projectContext: 'Video-Feedback', stars: 5,
    quote: { de: 'Absolut empfehlenswert!', en: 'Erik Van den Bril recommends the collaboration without reservation.' },
    exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'leander-solms', name: 'Leander Solms', projectContext: 'Einblick in die Medienproduktion', stars: 5,
    quote: {
      de: 'Letzte Woche durfte ich mal einen eintägigen Einblick bei NikVisuals Media bekommen und ich hätte nicht gedacht wie viel man noch tun muss, außer dem filmen. Alles in allem hat der Tag sehr viel Spaß gemacht und ich würde es nochmal machen.',
      en: 'Leander Solms describes an insightful day with NikVisuals and was surprised by how much work happens beyond filming itself.',
    }, exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'thorsten-becker', name: 'Thorsten Becker', projectContext: 'G2FNH Edersee Tour 2022', stars: 5,
    quote: { de: 'Top Bilder und Videos von der #G2FNH Edersee Tour 2022, bin begeistert', en: 'Thorsten Becker was impressed by the photos and videos from the 2022 G2FNH Edersee tour.' },
    exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'smd-1206', name: 'SMD 1206', projectContext: 'G2FNH Edersee Tour', stars: 5,
    quote: { de: 'Er hat unsere #G2FNH Ausfahrt zur Staumauer Überfahrt am Edersee videotechnisch festgehalten. Danke für die schönen Aufnahmen!', en: 'SMD 1206 thanks NikVisuals for documenting the G2FNH drive across the Edersee dam.' },
    exactQuote: true, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'sylvia-paul', name: 'Sylvia Paul', projectContext: 'Musikvideo „Tempo machen“', stars: 5,
    quote: {
      de: 'Sylvia Paul beschreibt die Zusammenarbeit am inklusiven Musikvideo „Tempo machen“ als engagiert und professionell und zeigt sich vom Ergebnis begeistert.',
      en: 'Sylvia Paul describes the work on the inclusive music video “Tempo machen” as committed and professional and was delighted with the result.',
    }, exactQuote: false, source: 'google', sourceUrl: googleProfile, featured: true,
  },
  {
    id: 'tobias-wurm', name: 'Tobias Wurm', projectContext: 'Auftragsproduktion', stars: 5,
    quote: {
      de: 'Tobias Wurm hebt die freundliche, kompetente und zuverlässige Zusammenarbeit hervor. Wünsche und Änderungen wurden im Projekt unkompliziert aufgenommen und umgesetzt.',
      en: 'Tobias Wurm highlights the friendly, capable and reliable collaboration. Requests and changes were incorporated without unnecessary friction.',
    }, exactQuote: false, source: 'google', sourceUrl: googleProfile, featured: true,
  },
];

export const featuredReviews = reviews.filter((review) => review.featured);
