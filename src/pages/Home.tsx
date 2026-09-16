import React, { type FormEvent, useEffect, useRef, useState } from "react";
import { content, links, type Language, type Project } from "../content/site";
import { videos } from "../content/videos";
import { Arrow } from "../components/Arrow";
import { PlayIcon } from "../components/PlayIcon";
import { ThemeIcon } from "../components/ThemeIcon";
import { SocialIcon } from "../components/SocialIcon";
import { useMediaConsent } from "../components/MediaConsent";
import { featuredReviews, type Review } from "../content/reviews";
const ids = ["leistungen", "arbeiten", "bewertungen", "ueber-mich"];
function ThemeToggle({ lang }: { lang: Language }) {
  const c = content[lang],
    [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(
    () =>
      setTheme(
        localStorage.getItem("nikvisuals-theme") === "light" ? "light" : "dark",
      ),
    [],
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nikvisuals-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f7f5ef" : "#131419");
  }, [theme]);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={next === "dark" ? c.darkMode : c.lightMode}
      onClick={() => setTheme(next)}
    >
      <ThemeIcon light={theme === "dark"} />
    </button>
  );
}
function ContactForm({ lang }: { lang: Language }) {
  const c = content[lang],
    [error, setError] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setError(true);
      form.reportValidity();
      return;
    }
    setError(false);
    const data = new FormData(form),
      body = [
        `${c.form.name}: ${data.get("name")}`,
        `${c.form.email}: ${data.get("email")}`,
        `${c.form.company}: ${data.get("company") || "—"}`,
        "",
        `${c.form.message}:`,
        String(data.get("message")),
      ].join("\n");
    window.location.href = `mailto:info@nikvisuals.de?subject=${encodeURIComponent("Projektanfrage NikVisuals")}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="contact-form" noValidate onSubmit={submit}>
      {error && (
        <p className="form-error" role="alert">
          {c.form.error}
        </p>
      )}
      <div className="form-grid">
        <label>
          {c.form.name}
          <span>*</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          {c.form.email}
          <span>*</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          {c.form.company}
          <input name="company" autoComplete="organization" />
        </label>
        <label className="form-message">
          {c.form.message}
          <span>*</span>
          <textarea name="message" required rows={5} />
        </label>
      </div>
      <p className="form-privacy-note">
        {lang === "de" ? "Beim Klick wird eine E-Mail in deinem E-Mail-Programm vorbereitet. Hinweise zur Verarbeitung findest du im " : "Clicking prepares an email in your email program. Details on processing are available in the "}
        <a href={import.meta.env.BASE_URL + "datenschutz/"}>{lang === "de" ? "Datenschutz" : "Privacy notice"}</a>.
      </p>
      <div className="form-action">
        <button className="button button-accent" type="submit">
          {c.form.submit}
          <Arrow diagonal />
        </button>
        <span className="form-note">{c.form.note}</span>
      </div>
    </form>
  );
}
function CopyEmailButton({ lang }: { lang: Language }) {
  const c = content[lang],
    [copied, setCopied] = useState(false);
  return (
    <button
      className="copy-email"
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText("info@nikvisuals.de");
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? c.copied : c.copy}
    </button>
  );
}
function Career({ lang }: { lang: Language }) {
  const c = content[lang];
  return (
    <section className="timeline-section section">
      <div className="wrap career-layout">
        <div className="career-intro">
          <p className="eyebrow">
            {lang === "de" ? "Werdegang" : "Background"}
          </p>
          <h2>
            {lang === "de"
              ? "Praxis, Studium & Unternehmertum."
              : "Practice, studies & entrepreneurship."}
          </h2>
          <p>
            {lang === "de"
              ? "Seit 2021 verbinde ich mit NikVisuals praktische Projekte mit Studium und unternehmerischer Arbeit. Medien und Marketing bilden meinen operativen Hintergrund; heute liegt mein Fokus stärker auf AI, Growth und Business Development."
              : "Since 2021, I have combined practical projects through NikVisuals with my studies and entrepreneurial work. Media and marketing are my operational foundation; today my focus is increasingly on AI, growth and business development."}
          </p>
        </div>
        <ol className="timeline is-visible">
          {c.timeline.map((x: any) => (
            <li key={x.year}>
              <span>{x.year}</span>
              <div>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
const collaborations = [
  {
    name: "LapStore",
    logo: "lapstore-logo-web.webp",
    href: "https://www.lapstore.de/",
    scale: 1.62,
    surface: "light",
  },
  {
    name: "SMS group",
    logo: "sms-group-logo.png",
    href: "https://www.sms-group.com/",
    scale: 1.04,
    surface: "light",
  },
  {
    name: "Stadt Hilchenbach",
    logo: "hilchenbach-logo.png",
    href: "https://hilchenbach.de/",
    scale: 1.38,
    surface: "light",
  },
  {
    name: "IHK Siegen",
    logo: "ihk-siegen-logo.png",
    href: "https://www.ihk-siegen.de/",
    scale: 1.08,
    surface: "light",
  },
  {
    name: "Startpunkt57",
    logo: "startpunkt57-logo.svg",
    href: "https://www.startpunkt57.de/",
    scale: 1.24,
    surface: "light",
  },
  {
    name: "Entrepreneurship Center Universität Siegen",
    logo: "entrepreneurship-center-logo.png",
    href: "https://www.uni-siegen.de/ec",
    scale: 1.08,
    surface: "dark",
  },
  {
    name: "Siegerland Center",
    logo: "siegerland-center-logo.svg",
    href: "https://siegerlandcenter.de/",
    scale: 1.22,
    surface: "light",
  },
  {
    name: "Reifen Thomas",
    logo: "reifen-thomas-logo.png",
    href: "https://www.reifenthomas.de/",
    scale: 1.08,
    surface: "dark",
  },
  {
    name: "Vorländer Sanitär · Heizung · Solar",
    logo: "vorlaender-logo.svg",
    href: "https://www.baeder-heizung.com/",
    scale: 1.12,
    surface: "light",
  },
];
function useSeamlessCarousel(
  viewport: React.RefObject<HTMLDivElement | null>,
  main: React.RefObject<HTMLDivElement | null>,
  speed: number,
  paused = false,
) {
  const pauseUntil = useRef(0),
    hovered = useRef(false),
    focused = useRef(false),
    externalPause = useRef(paused),
    manual = useRef(false);
  useEffect(() => {
    externalPause.current = paused;
  }, [paused]);
  const pause = (duration = 4200) => {
    pauseUntil.current = performance.now() + duration;
  };
  useEffect(() => {
    const v = viewport.current,
      m = main.current;
    if (!v || !m) return;
    let frame = 0,
      last = performance.now(),
      initialized = false,
      position = 0,
      autoUntil = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const recenter = () => {
      const start = m.offsetLeft,
        width = m.offsetWidth,
        left = v.scrollLeft;
      if (!width) return null;
      if (left < start) {
        v.scrollLeft = left + width;
        return v.scrollLeft;
      }
      if (left >= start + width) {
        v.scrollLeft = left - width;
        return v.scrollLeft;
      }
      return null;
    };
    const init = requestAnimationFrame(() => {
      position = m.offsetLeft;
      v.scrollLeft = position;
      position = v.scrollLeft;
      initialized = true;
    });
    const onScroll = () => {
      if (initialized && performance.now() >= autoUntil) {
        position = recenter() ?? v.scrollLeft;
      }
    };
    const onStart = () => {
      manual.current = true;
      pause();
    };
    const onEnd = () => {
      manual.current = false;
      pause(1400);
    };
    const onWheel = () => pause();
    const onEnter = () => {
      hovered.current = true;
    };
    const onLeave = () => {
      hovered.current = false;
      pause(1000);
    };
    const onFocusIn = () => {
      focused.current = true;
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!v.contains(event.relatedTarget as Node)) {
        focused.current = false;
        pause(1000);
      }
    };
    v.addEventListener("scroll", onScroll, { passive: true });
    for (const event of ["pointerdown", "touchstart"])
      v.addEventListener(event, onStart, { passive: true });
    v.addEventListener("wheel", onWheel, { passive: true });
    for (const event of ["pointerup", "touchend", "pointercancel"])
      v.addEventListener(event, onEnd, { passive: true });
    v.addEventListener("mouseenter", onEnter);
    v.addEventListener("mouseleave", onLeave);
    v.addEventListener("focusin", onFocusIn);
    v.addEventListener("focusout", onFocusOut);
    const tick = (now: number) => {
      const elapsed = Math.min(32, now - last);
      last = now;
      const rect = v.getBoundingClientRect(),
        visible = rect.bottom > 0 && rect.top < innerHeight;
      if (
        initialized &&
        visible &&
        !document.hidden &&
        !reduced.matches &&
        !externalPause.current &&
        !hovered.current &&
        !focused.current &&
        !manual.current &&
        now > pauseUntil.current
      ) {
        position += elapsed * speed;
        autoUntil = now + 40;
        v.scrollLeft = position;
        const wrapped = recenter();
        if (wrapped !== null) position = wrapped;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(init);
      v.removeEventListener("scroll", onScroll);
      for (const event of ["pointerdown", "touchstart"])
        v.removeEventListener(event, onStart);
      v.removeEventListener("wheel", onWheel);
      for (const event of ["pointerup", "touchend", "pointercancel"])
        v.removeEventListener(event, onEnd);
      v.removeEventListener("mouseenter", onEnter);
      v.removeEventListener("mouseleave", onLeave);
      v.removeEventListener("focusin", onFocusIn);
      v.removeEventListener("focusout", onFocusOut);
    };
  }, [speed]);
  return { pause };
}
function CollaborationStrip({ lang }: { lang: Language }) {
  const viewport = useRef<HTMLDivElement>(null),
    main = useRef<HTMLDivElement>(null);
  useSeamlessCarousel(viewport, main, 0.052);
  const set = (clone: boolean, canonical = false, key: string) => (
    <div
      key={key}
      className="logo-set"
      aria-hidden={clone || undefined}
      ref={canonical ? main : undefined}
      data-carousel-set={canonical ? "canonical" : "clone"}
    >
      {collaborations.map((x) => {
        const img = (
          <img
            src={import.meta.env.BASE_URL + "images/" + x.logo}
            alt={clone ? "" : x.name}
            loading="lazy"
            decoding="async"
            style={{ "--logo-scale": x.scale } as React.CSSProperties}
          />
        );
        return clone ? (
          <div className="collaboration-logo" key={x.name}>
            <span className={`logo-plate logo-surface-${x.surface}`}>
              {img}
            </span>
          </div>
        ) : (
          <a
            className="collaboration-logo"
            href={x.href}
            target="_blank"
            rel="noreferrer"
            key={x.name}
          >
            <span className={`logo-plate logo-surface-${x.surface}`}>
              {img}
            </span>
          </a>
        );
      })}
    </div>
  );
  return (
    <section className="collaboration">
      <div className="wrap">
        <div className="collaboration-head">
          <div>
            <p className="eyebrow">
              {lang === "de"
                ? "Ausgewählte Zusammenarbeit"
                : "Selected collaborations"}
            </p>
            <div className="proof-stats">
              <strong>
                {lang === "de"
                  ? "50+ Kunden aus KMU & Corporate"
                  : "50+ clients across SMEs & corporate"}
              </strong>
              <span>
                {lang === "de"
                  ? "Mehrere Millionen digitale Aufrufe mit Kundencontent"
                  : "Several million digital views from client content"}
              </span>
            </div>
          </div>
        </div>
        <div
          className="logo-window"
          ref={viewport}
          tabIndex={0}
          data-seamless-carousel="logos"
        >
          <div className="logo-loop">
            {set(true, false, "previous")}
            {set(false, true, "canonical")}
            {set(true, false, "next")}
          </div>
        </div>
      </div>
    </section>
  );
}
function ProjectCard({ project, c }: { project: Project; c: any }) {
  const style = {
    "--image-position": project.imagePosition,
    "--mobile-image-position": project.mobileImagePosition,
    "--image-scale": project.imageScale,
    "--mobile-image-scale": project.mobileImageScale,
  } as React.CSSProperties;
  const inner = (
    <>
      <div className="project-media">
        <img
          src={import.meta.env.BASE_URL + "images/" + project.image}
          alt={project.alt}
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
          style={style}
        />
        {project.logo && project.organization !== "LapStore" && (
          <span className="project-logo-badge">
            <img
              className="project-logo"
              src={import.meta.env.BASE_URL + "images/" + project.logo}
              alt=""
            />
          </span>
        )}
      </div>
      <p className="project-type">{project.title}</p>
      <h3>{project.organization}</h3>
      <p>{project.text}</p>
      {project.href && (
        <span className="card-link">
          {project.linkType === "video" ? c.video : c.project}
          <Arrow diagonal />
        </span>
      )}
    </>
  );
  return project.href ? (
    <a
      className="project-card"
      data-selected-project
      href={project.href}
      target="_blank"
      rel="noreferrer"
    >
      {inner}
    </a>
  ) : (
    <article className="project-card" data-selected-project>
      {inner}
    </article>
  );
}
function SmsCase({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false),
    { playVideo } = useMediaConsent(),
    items = ["8Nb_wHCHVk8", "WR4BBw6HSGc", "WwuJh_wi3dE"].map(
      (id) => videos.find((v) => v.id === id)!,
    );
  return (
    <article className="project-card sms-card" data-selected-project>
      <div className="project-media">
        <img
          src={import.meta.env.BASE_URL + "images/sms-group-event.webp"}
          alt="SMS group event"
          width="1280"
          height="800"
          loading="lazy"
        />
        <span className="project-logo-badge">
          <img
            className="project-logo"
            src={import.meta.env.BASE_URL + "images/sms-group-logo.png"}
            alt=""
          />
        </span>
      </div>
      <p className="project-type">Corporate Media</p>
      <h3>SMS group</h3>
      <p>
        {lang === "de"
          ? "SMS group ist ein internationaler Maschinen- und Anlagenbauer für die Metallindustrie. Für das Unternehmen entstanden wiederholt Corporate-, Industrie- und Eventproduktionen mit komplexer Abstimmung."
          : "SMS group is an international plant and mechanical engineering company for the metals industry. I have repeatedly produced corporate, industrial and event media for the company, involving complex coordination."}
      </p>
      <button
        className="card-link project-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {lang === "de" ? "Videos ansehen" : "View videos"}
        <Arrow />
      </button>
      {open && (
        <div className="sms-videos">
          {items.map((v) => (
            <article className="sms-video" key={v.id}>
              <img
                src={import.meta.env.BASE_URL + "images/" + v.thumbnail}
                alt=""
              />
              <div>
                <strong>{v.displayTitle[lang]}</strong>
                <div>
                  <button
                    onClick={(e) =>
                      playVideo({
                        id: v.id,
                        title: v.displayTitle[lang],
                        trigger: e.currentTarget,
                      })
                    }
                  >
                    <PlayIcon />
                    {lang === "de" ? "Hier ansehen" : "Watch here"}
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SocialIcon platform="youtube" />
                    YouTube
                    <Arrow diagonal />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </article>
  );
}
function WorkshopCase({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false),
    base = import.meta.env.BASE_URL;
  const items = [
    {
      image: "ihk-workshop-2026-presenting-wide.webp",
      de: "Workshop bei der IHK Siegen",
      en: "Workshop at IHK Siegen",
    },
    {
      image: "ihk-workshop-2026-presenting-screen.webp",
      de: "Präsentation im IHK-Workshop",
      en: "Presentation during an IHK workshop",
    },
    {
      image: "ihk-workshop-2026-participant-support.webp",
      de: "Praktische Unterstützung im Workshop",
      en: "Practical support during a workshop",
    },
    {
      image: "niklas-bschool-workshop-facilitation.webp",
      de: "Workshop-Facilitation im Business-Kontext",
      en: "Workshop facilitation in a business context",
    },
    {
      image: "niklas-speaking-entrepreneurship-talk-screenshot.webp",
      de: "Vortrag zu Selbstständigkeit und Entrepreneurship im Kreuzsaal",
      en: "Talk on self-employment and entrepreneurship at Kreuzsaal",
    },
  ];
  return (
    <article className="project-card workshop-card" data-selected-project>
      <div className="project-media">
        <img
          src={base + "images/ihk-workshop-2026-presenting-wide.webp"}
          alt={
            lang === "de"
              ? "Niklas Brüne bei einem Workshop der IHK Siegen."
              : "Niklas Brüne leading an IHK Siegen workshop."
          }
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="project-type">Workshops</p>
      <h3>
        {lang === "de" ? "IHK Siegen & Unternehmen" : "IHK Siegen & companies"}
      </h3>
      <p>
        {lang === "de"
          ? "Ich bin Referent für die IHK Siegen und habe außerdem individuelle Workshops für Unternehmen durchgeführt. Je nach Kontext geht es um digitale Kommunikation, Social Media, Content, Short-Form-Video und praktische Medienproduktion – ebenso wie um Vorträge zu Selbstständigkeit und Entrepreneurship."
          : "I speak for IHK Siegen and have also run individual workshops for companies. Depending on the context, topics include digital communication, social media, content, short-form video and practical media production, as well as talks on self-employment and entrepreneurship."}
      </p>
      <button
        className="card-link project-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open
          ? lang === "de"
            ? "Einblicke schließen"
            : "Hide workshop impressions"
          : lang === "de"
            ? "Einblicke ansehen"
            : "View workshop impressions"}
        <Arrow />
      </button>
      {open && (
        <div className="workshop-gallery">
          {items.map((item) => (
            <figure key={item.image}>
              <img
                src={base + "images/" + item.image}
                alt={lang === "de" ? item.de : item.en}
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
              />
              <figcaption>{lang === "de" ? item.de : item.en}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}
function AmbientMedia({ lang }: { lang: Language }) {
  const ref = useRef<HTMLElement>(null),
    [ready, setReady] = useState(false),
    base = import.meta.env.BASE_URL;
  useEffect(() => {
    const n = ref.current,
      save = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData;
    if (!n || save || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true);
          o.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    o.observe(n);
    return () => o.disconnect();
  }, []);
  const title =
      lang === "de" ? "Ausgewählte Videoarbeiten" : "Selected video work",
    copy =
      lang === "de"
        ? "Medienproduktion bleibt Teil meiner praktischen Umsetzung. Im Video-Archiv findest du ausgewählte Corporate-, Imagefilm-, Produkt-, Event-, Drohnen- und Testimonial-Arbeiten."
        : "Media production remains part of my hands-on work. The video archive includes selected corporate, image-film, product, event, drone and testimonial projects.";
  return (
    <section ref={ref} className="ambient-media section" data-ambient-media>
      <div className="wrap">
        <div className="ambient-frame">
          {ready ? (
            <video
              muted
              autoPlay
              loop
              playsInline
              preload="none"
              poster={base + "images/media-loop-desktop-poster.webp"}
            >
              <source
                media="(max-width: 700px)"
                src={base + "images/media-loop-mobile.mp4"}
              />
              <source src={base + "images/media-loop-desktop.mp4"} />
            </video>
          ) : (
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet={base + "images/media-loop-mobile-poster.webp"}
              />
              <img
                src={base + "images/media-loop-desktop-poster.webp"}
                alt=""
                width="1280"
                height="720"
                loading="lazy"
              />
            </picture>
          )}
          <div className="ambient-copy">
            <p className="eyebrow">Media &amp; Production</p>
            <h2>{title}</h2>
            <p>{copy}</p>
            <a
              className="text-link"
              href={base + (lang === "en" ? "en/videos/" : "videos/")}
            >
              {lang === "de"
                ? "Ausgewählte Videos ansehen"
                : "View selected videos"}
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
function ReviewCard({
  review,
  lang,
  clone,
  expanded,
  onToggle,
}: {
  review: Review;
  lang: Language;
  clone: boolean;
  expanded: boolean;
  onToggle?: () => void;
}) {
  const text = review.quote[lang],
    long = text.length > 185,
    quoted = review.exactQuote && lang === "de";
  return (
    <article className={"review-card" + (expanded ? " is-expanded" : "")}>
      <b
        className="review-stars"
        aria-label={lang === "de" ? "5 von 5 Sternen" : "5 out of 5 stars"}
      >
        ★★★★★
      </b>
      <p
        className={
          !expanded && long ? "review-quote is-clamped" : "review-quote"
        }
      >
        {quoted ? "“" : ""}
        {text}
        {quoted ? "”" : ""}
      </p>
      {long && !clone && (
        <button
          type="button"
          className="review-more"
          aria-expanded={expanded}
          onClick={onToggle}
        >
          {expanded
            ? lang === "de"
              ? "Weniger anzeigen"
              : "Show less"
            : lang === "de"
              ? "Mehr lesen"
              : "Read more"}
        </button>
      )}
      <span className="review-context">{review.projectContext}</span>
      <footer>
        <strong>{review.name}</strong>
        {review.roleOrCompany && <span>{review.roleOrCompany}</span>}
        <small>
          {review.source === "google"
            ? lang === "de"
              ? "Google-Bewertung"
              : "Google review"
            : lang === "de"
              ? "Video-Feedback"
              : "Video testimonial"}
        </small>
      </footer>
    </article>
  );
}
function Reviews({ lang }: { lang: Language }) {
  const c = content[lang],
    viewport = useRef<HTMLDivElement>(null),
    main = useRef<HTMLDivElement>(null),
    [expanded, setExpanded] = useState<string | null>(null),
    { pause } = useSeamlessCarousel(viewport, main, 0.014, expanded !== null),
    { playVideo } = useMediaConsent();
  const set = (clone: boolean, canonical = false, key: string) => (
    <div
      key={key}
      className="review-set"
      aria-hidden={clone || undefined}
      ref={canonical ? main : undefined}
      data-carousel-set={canonical ? "canonical" : "clone"}
    >
      {featuredReviews.map((review) => (
        <ReviewCard
          review={review}
          lang={lang}
          clone={clone}
          expanded={!clone && expanded === review.id}
          onToggle={() => {
            pause();
            setExpanded(expanded === review.id ? null : review.id);
          }}
          key={review.id}
        />
      ))}
    </div>
  );
  const move = (direction: number) => {
    pause();
    const card = main.current?.querySelector<HTMLElement>(".review-card");
    viewport.current?.scrollBy({
      left: direction * ((card?.offsetWidth || 340) + 16),
      behavior: "smooth",
    });
  };
  const feedback = [
    [
      "ObgIseEQ0ME",
      "Kerstin Broh",
      lang === "de"
        ? "Tourismus & Stadtmarketing · Stadt Hilchenbach"
        : "Tourism & city marketing · Stadt Hilchenbach",
    ],
    [
      "BDR6sHFXoiI",
      "Frank Vorländer",
      lang === "de"
        ? "Inhaber · Sanitär- und Heizungsbetrieb"
        : "Owner · Plumbing and heating company",
    ],
    ["oE9I8w93pvc", "Yvonne Straßer", "Siegerland Center"],
    [
      "wFaeFX5gxeA",
      "Steffen Kellermann",
      lang === "de"
        ? "Bezirksschornsteinfeger & Sachverständiger für Energieberatung"
        : "District chimney sweep & energy consultant",
    ],
  ];
  return (
    <section id="bewertungen" className="proof section">
      <div className="wrap">
        <div className="proof-heading">
          <div>
            <p className="eyebrow">{c.proofLabel}</p>
            <h2>{c.proofTitle}</h2>
          </div>
          <div className="rating">
            <b>★★★★★</b>
            <strong>{c.rating}</strong>
            <span>{c.reviews}</span>
          </div>
        </div>
        <p className="proof-note">
          {lang === "de"
            ? "Ausgewählte Kundenstimmen aus Google-Bewertungen und Video-Feedback."
            : "Selected client feedback from Google reviews and video testimonials."}
        </p>
        <div className="review-controls">
          <button
            className="review-control prev"
            onClick={() => move(-1)}
            aria-label={
              lang === "de" ? "Vorherige Bewertung" : "Previous review"
            }
          >
            <Arrow />
          </button>
          <button
            className="review-control"
            onClick={() => move(1)}
            aria-label={lang === "de" ? "Nächste Bewertung" : "Next review"}
          >
            <Arrow />
          </button>
        </div>
        <div
          className="review-window"
          ref={viewport}
          tabIndex={0}
          data-seamless-carousel="reviews"
        >
          <div className="review-track">
            {set(true, false, "previous")}
            {set(false, true, "canonical")}
            {set(true, false, "next")}
          </div>
        </div>
        <a
          className="text-link review-link"
          href="https://share.google/c0i784b5nSzpTO6LF"
          target="_blank"
          rel="noreferrer"
        >
          {c.reviewCta}
          <Arrow />
        </a>
        <div className="feedback-list">
          <p>{c.videoFeedbackLabel}</p>
          {feedback.map(([id, name, role]) => (
            <div className="feedback-item" key={id}>
              <button
                onClick={(e) =>
                  playVideo({ id, title: name, trigger: e.currentTarget })
                }
              >
                <span>
                  <strong>{name}</strong>
                  <small>{role}</small>
                </span>
                <PlayIcon />
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${name} — YouTube`}
              >
                <SocialIcon platform="youtube" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Home({ lang }: { lang: Language }) {
  const c = content[lang],
    base = import.meta.env.BASE_URL,
    [menu, setMenu] = useState(false),
    { openSettings } = useMediaConsent(),
    situations =
      lang === "de"
        ? [
            "Recherche, Dokumentation oder Informationsübertragung wiederholt sich im Team und bindet qualifizierte Arbeitszeit.",
            "Ein Markt, Segment oder Angebot wirkt interessant, aber die Entscheidung basiert noch zu stark auf Annahmen.",
            "Es gibt viele einzelne Content-Aktivitäten, aber noch kein klares System für Research, Erstellung und Distribution.",
          ]
        : [
            "Research, documentation or information transfer keeps repeating across the team and takes up skilled time.",
            "A market, segment or offer looks promising, but the decision still relies too heavily on assumptions.",
            "There are many separate content activities, but no clear system for research, production and distribution yet.",
          ];
  const services = c.services.map((s: any, i: number) =>
    i !== 2
      ? s
      : lang === "de"
        ? {
            ...s,
            text: "Ich strukturiere Marketing und Content von der Strategie bis zur Umsetzung – einschließlich Content-Produktion für Social Media, Short-Form-Video und ausgewählte B2B- und Unternehmensformate.",
            tags: [
              "Marketingstrategie",
              "Content-Systeme",
              "Content-Produktion",
            ],
            details: [
              "Marketingstrategie und Prioritäten strukturieren",
              "Content- und Social-Media-Systeme effizient organisieren",
              "Content-Produktion für Social Media, Short-Form-Video und ausgewählte Unternehmensformate",
              "AI-gestützte Research- und Content-Prozesse sinnvoll einsetzen",
            ],
          }
        : {
            ...s,
            text: "I structure marketing and content from strategy through delivery, including hands-on production for social media, short-form video and selected B2B and corporate formats.",
            tags: [
              "Marketing strategy",
              "Content systems",
              "Content production",
            ],
            details: [
              "Structure marketing strategy and priorities",
              "Organise content and social-media systems efficiently",
              "Produce content for social media, short-form video and selected corporate formats",
              "Use AI-supported research and content processes where they add value",
            ],
          },
  );
  const lapstore = {
      ...c.business[2],
      text:
        lang === "de"
          ? "LapStore ist ein Anbieter für refurbished IT-Hardware. Die Zusammenarbeit umfasst langjährige Produkt-Content-Arbeit; später kamen Wettbewerbsanalyse, B2B-Strategie und Business-Development-Themen hinzu."
          : "LapStore supplies refurbished IT hardware. Our work spans long-term product content, later joined by competitor analysis, B2B strategy and business-development topics.",
    },
    home = base + (lang === "en" ? "en/" : ""),
    hub = base + (lang === "en" ? "en/links/" : "links/"),
    archive = base + (lang === "en" ? "en/videos/" : "videos/");
  return (
    <>
      <a href="#main" className="skip-link">
        {c.skip}
      </a>
      <header className="header">
        <div className="wrap header-inner">
          <a href={home} className="brand">
            nikvisuals<span className="brand-mark">.</span>
          </a>
          <nav className="desktop-nav">
            {c.nav.slice(0, 4).map((n: string, i: number) => (
              <a href={"#" + ids[i]} key={n}>
                {n}
              </a>
            ))}
            <a href={hub}>{c.nav[4]}</a>
          </nav>
          <div className="header-end">
            <ThemeToggle lang={lang} />
            <nav className="languages" aria-label={c.language}>
              <a href={base}>DE</a>
              <span>/</span>
              <a href={base + "en/"}>EN</a>
            </nav>
            <a className="header-contact" href="#kontakt">
              {c.contactNav}
              <Arrow diagonal />
            </a>
            <button
              className="menu-toggle"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? c.close : c.menu}
              <span>{menu ? "−" : "+"}</span>
            </button>
          </div>
          <nav className="mobile-nav" hidden={!menu}>
            {c.nav.slice(0, 4).map((n: string, i: number) => (
              <a href={"#" + ids[i]} key={n}>
                {n}
                <Arrow />
              </a>
            ))}
            <a href={hub}>
              {c.nav[4]}
              <Arrow />
            </a>
            <a href="#kontakt">
              {c.contactNav}
              <Arrow />
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <picture>
            <source
              media="(max-width: 560px)"
              srcSet={base + "images/niklas-working-desk-office.webp"}
            />
            <img
              className="hero-image"
              src={base + "images/niklas-speaking-desk-office.webp"}
              alt={
                lang === "de"
                  ? "Niklas Brüne bei der Arbeit am Schreibtisch."
                  : "Niklas Brüne working at a desk."
              }
            />
          </picture>
          <div className="hero-shade" />
          <div className="wrap hero-layout">
            <div className="hero-copy">
              <p className="hero-kicker">nikvisuals</p>
              <h1>
                <span>AI, Growth &amp; Marketing</span>
                <span className="hero-line-two">
                  {lang === "de" ? "für ambitionierte" : "for ambitious"}
                </span>
                <span className="hero-b2b">
                  {lang === "de" ? "B2B-Unternehmen." : "B2B companies."}
                </span>
              </h1>
              <p className="hero-intro">{c.intro}</p>
              <div className="hero-actions">
                <a href="#kontakt" className="button button-accent">
                  {c.cta}
                  <Arrow diagonal />
                </a>
                <a href="#arbeiten" className="text-link">
                  {c.workCta}
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id="leistungen" className="focus section">
          <div className="wrap">
            <div className="section-top">
              <p className="eyebrow">{c.serviceLabel}</p>
              <h2>{c.serviceTitle}</h2>
            </div>
            <div className="focus-list">
              {services.map((s: any, i: number) => (
                <details className="focus-row" key={s.name}>
                  <summary>
                    <span className="focus-index">0{i + 1}</span>
                    <h3>{s.name}</h3>
                    <p>{s.text}</p>
                    <ul>
                      {s.tags.map((t: string) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <Arrow diagonal />
                  </summary>
                  <div className="focus-detail">
                    <p className="situation">
                      <strong>
                        {lang === "de"
                          ? "Typische Situation"
                          : "Typical situation"}
                      </strong>
                      {situations[i]}
                    </p>
                    <ul>
                      {s.details.map((d: string) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <Career lang={lang} />
        <CollaborationStrip lang={lang} />
        <section id="arbeiten" className="work section">
          <div className="wrap">
            <div className="work-heading">
              <div>
                <p className="eyebrow">{c.workLabel}</p>
                <h2>{c.workTitle}</h2>
              </div>
              <p>{c.workIntro}</p>
            </div>
            <div className="project-grid">
          <SmsCase lang={lang} />
          <WorkshopCase lang={lang} />
              <ProjectCard project={lapstore} c={c} />
              <ProjectCard project={c.business[3]} c={c} />
            </div>
          </div>
        </section>
        <AmbientMedia lang={lang} />
        <Reviews lang={lang} />
        <section id="ueber-mich" className="about section">
          <div className="wrap about-grid">
            <figure className="about-media">
              <img
                src={base + "images/niklas-current-profile.webp"}
                alt={c.aboutAlt}
              />
              <figcaption>{c.aboutCaption}</figcaption>
            </figure>
            <div className="about-copy">
              <p className="eyebrow">{c.aboutLabel}</p>
              <h2>{c.aboutTitle}</h2>
              <p>{c.about}</p>
              <p>
                {lang === "de"
                  ? "NikVisuals ist founder-led. Je nach Projekt ergänze ich die Umsetzung mit spezialisierten Freelancern und Partnern aus meinem Netzwerk. Bei größeren Medienproduktionen habe ich Projektteams mit bis zu sechs Personen geführt."
                  : "NikVisuals is founder-led. Depending on the project, I bring in specialist freelancers and partners from my network. For larger media productions, I have led project teams of up to six people."}
              </p>
              <p className="about-signal">{c.aboutSignal}</p>
            </div>
          </div>
        </section>
        <section id="kontakt" className="contact section">
          <div className="wrap contact-grid">
            <div className="contact-intro">
              <p className="eyebrow">{c.contactLabel}</p>
              <h2>
                {c.contactTitle}
                <span>.</span>
              </h2>
              <p>{c.contactText}</p>
              <div className="email-line">
                <a className="email" href={links.email}>
                  info@nikvisuals.de
                </a>
                <CopyEmailButton lang={lang} />
              </div>
            </div>
            <ContactForm lang={lang} />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <a className="brand" href={home}>
              nikvisuals<span className="brand-mark">.</span>
            </a>
            <div className="socials">
              {links.socials
                .filter((x) => x.platform !== "facebook")
                .map((x) => (
                  <a
                    className="social-link"
                    href={x.href}
                    target="_blank"
                    rel="noreferrer"
                    key={x.label}
                  >
                    <span>
                      <SocialIcon platform={x.platform} />
                      {x.label}
                    </span>
                  </a>
                ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>{c.preview}</span>
            <a href={archive}>{lang === "de" ? "Videos" : "Video work"}</a>
            <a href={base + "impressum/"}>{lang === "de" ? "Impressum" : "Imprint"}</a>
            <a href={base + "datenschutz/"}>{lang === "de" ? "Datenschutz" : "Privacy"}</a>
            <button className="media-settings" onClick={openSettings}>
              {lang === "de" ? "Medien-Einstellungen" : "Media settings"}
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
