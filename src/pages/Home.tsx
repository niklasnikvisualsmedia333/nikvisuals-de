import React, { type FormEvent, useEffect, useRef, useState } from "react";
import { content, links, type Language, type Project } from "../content/site";
import { smsVideos } from "../content/smsVideos";
import { internshipVideos, type InternshipVideo } from "../content/internshipVideos";
import { Arrow } from "../components/Arrow";
import { PlayIcon } from "../components/PlayIcon";
import { ThemeIcon } from "../components/ThemeIcon";
import { SocialIcon } from "../components/SocialIcon";
import { CopyEmailButton } from "../components/CopyEmailButton";
import { SiteFooter } from "../components/SiteFooter";
import { useMediaConsent } from "../components/MediaConsent";
import { featuredReviews, type Review } from "../content/reviews";
const ids = ["leistungen", "arbeiten", "bewertungen", "ueber-mich"];
const responsiveImages: Record<string, { width: number; height: number; srcSet: string }> = {
  "lapstore.jpg": { width: 1280, height: 720, srcSet: "lapstore-480.webp 480w, lapstore-800.webp 800w" },
  "tmp-tech-talk.webp": { width: 2048, height: 1365, srcSet: "tmp-tech-talk-480.webp 480w, tmp-tech-talk-800.webp 800w" },
};
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
const contactWebhook = "https://n8n.srv1037647.hstgr.cloud/webhook/nikvisuals-website-contact";
type ContactState = "idle" | "submitting" | "success" | "error";
function ContactForm({ lang }: { lang: Language }) {
  const c = content[lang], [state, setState] = useState<ContactState>("idle"), [validationError, setValidationError] = useState(false), statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (state === "success" || state === "error") statusRef.current?.focus(); }, [state]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidationError(true);
      setState("error");
      form.reportValidity();
      return;
    }
    if (state === "submitting") return;
    setValidationError(false);
    setState("submitting");
    const data = new FormData(form), params = new URLSearchParams(window.location.search), controller = new AbortController(), timeout = window.setTimeout(() => controller.abort(), 14000);
    const payload = {
      name: String(data.get("name") || ""), email: String(data.get("email") || ""), company: String(data.get("company") || ""), message: String(data.get("message") || ""), language: lang,
      landingPage: window.location.href, referrer: document.referrer || "", privacyAccepted: data.get("privacyAccepted") === "on", privacyVersion: "2026-09", formVersion: "nikvisuals-contact-v1", submittedAt: new Date().toISOString(), website: String(data.get("website") || ""),
      utmSource: params.get("utm_source") || "", utmMedium: params.get("utm_medium") || "", utmCampaign: params.get("utm_campaign") || "", utmContent: params.get("utm_content") || "", utmTerm: params.get("utm_term") || "",
    };
    try {
      const response = await fetch(contactWebhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
      let result: unknown;
      try { result = await response.json(); } catch { throw new Error("Invalid response"); }
      if (!response.ok || !result || typeof result !== "object" || (result as { ok?: unknown }).ok !== true) throw new Error("Submission rejected");
      form.reset();
      setState("success");
    } catch { setState("error"); } finally { window.clearTimeout(timeout); }
  };
  return (
    <form className="contact-form" noValidate onSubmit={submit} aria-busy={state === "submitting"}>
      {state === "success" && <p className="form-success" role="status" aria-live="polite" tabIndex={-1} ref={statusRef}>{c.form.success}</p>}
      {state === "error" && <p className="form-error" role="alert" tabIndex={-1} ref={statusRef}>{validationError ? c.form.error : <>{c.form.submitError} <a href={links.email}>info@nikvisuals.de</a>.</>}</p>}
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
      <div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
      <label className="consent"><input name="privacyAccepted" type="checkbox" required /><span>{c.form.consentBefore}<a href={import.meta.env.BASE_URL + "datenschutz/"}>{c.form.privacy}</a>{c.form.consentAfter}</span></label>
      <p className="form-privacy-note">
        {c.form.note + " "}
        <a href={import.meta.env.BASE_URL + "datenschutz/"}>{lang === "de" ? "Datenschutz" : "Privacy notice"}</a>.
      </p>
      <div className="form-action">
        <button className="button button-accent" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? c.form.submitting : c.form.submit}
          <Arrow diagonal />
        </button>
      </div>
    </form>
  );
}
function InternshipVideoCard({ video, lang }: { video: InternshipVideo; lang: Language }) {
  const { playVideo } = useMediaConsent();
  const base = import.meta.env.BASE_URL;
  const open = (trigger: HTMLElement) => playVideo({ id: video.id, title: video.title[lang], trigger });
  return (
    <article className="video-card">
      <div className="video-thumb">
        <img src={base + "images/" + video.thumbnail} alt="" width="640" height="360" loading="lazy" decoding="async" />
        <button className="play" type="button" aria-label={lang === "de" ? `${video.title.de} hier ansehen` : `Watch ${video.title.en}`} onClick={(event) => open(event.currentTarget)}>
          <PlayIcon />
        </button>
      </div>
      <div className="video-card-body">
        <p className="video-category">{lang === "de" ? "Praktikum · NikVisuals" : "Internship · NikVisuals"}</p>
        <h3>{video.title[lang]}</h3>
        <p className="video-summary">{lang === "de" ? "Einblick aus einem Praktikum bei NikVisuals." : "An insight from an internship at NikVisuals."}</p>
        <div className="video-actions">
          <button className="video-open" type="button" onClick={(event) => open(event.currentTarget)}><PlayIcon />{lang === "de" ? "Hier ansehen" : "Watch here"}</button>
          <a className="video-open" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer"><SocialIcon platform="youtube" />{lang === "de" ? "Auf YouTube ansehen" : "Watch on YouTube"}</a>
        </div>
      </div>
    </article>
  );
}
function Internships({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false);
  return (
    <section id="praktikum" className="internships" aria-labelledby="internships-title">
      <div className="wrap internships-layout">
        <div>
          <p className="eyebrow">{lang === "de" ? "Praktikum & Mitarbeit" : "Internships & opportunities"}</p>
          <h2 id="internships-title">{lang === "de" ? "Praktikum bei NikVisuals." : "Internships at NikVisuals."}</h2>
        </div>
        <div className="internships-copy">
          <p>{lang === "de" ? "Praktika passen am besten ab etwa acht Wochen. Remote oder hybrid ist je nach Aufgabe möglich. Initiativbewerbungen sind ausdrücklich willkommen – zum Beispiel für Content- und Videoproduktion, Marketing & Research, AI-/Prozess-Themen oder Business Development." : "Internships work best from around eight weeks onwards. Remote or hybrid setups are possible depending on the role. Unsolicited applications are explicitly welcome – for example in content and video production, marketing and research, AI/process topics or business development."}</p>
          <p className="internships-note">{lang === "de" ? "Interesse? Schicken Sie mir Ihren Lebenslauf per E-Mail und nennen Sie kurz Ihren gewünschten Zeitraum und den Bereich, in dem Sie mitarbeiten möchten. Wenn Sie bereits eigene Arbeiten, Projekte oder ein Portfolio haben, schicken Sie gerne direkt einen Link dazu mit." : "Interested? Send me your CV by email and briefly mention your preferred timeframe and the area you would like to work in. If you already have work samples, projects or a portfolio, feel free to include a link."}</p>
          <div className="email-line internships-email"><a className="email" href={links.email}>info@nikvisuals.de</a><CopyEmailButton lang={lang} /></div>
          <button className="text-link internship-toggle" type="button" aria-expanded={open} aria-controls="internship-video-gallery" onClick={() => setOpen((value) => !value)}>{open ? lang === "de" ? "Einblicke schließen" : "Hide internship experiences" : lang === "de" ? "Einblicke aus Praktika ansehen" : "See internship experiences"}<Arrow /></button>
        </div>
        {open && <div id="internship-video-gallery" className="internship-gallery" aria-live="polite"><div className="videos-grid">{internshipVideos.map((video) => <InternshipVideoCard key={video.id} video={video} lang={lang} />)}</div></div>}
      </div>
    </section>
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
    logo: "lapstore-logo-tight.webp",
    width: 660,
    height: 228,
    href: "https://www.lapstore.de/",
    scale: 1.06,
    surface: "light",
  },
  {
    name: "SMS group",
    logo: "sms-group-logo.png",
    width: 1598,
    height: 221,
    href: "https://www.sms-group.com/",
    scale: 1.04,
    surface: "light",
  },
  {
    name: "Stadt Hilchenbach",
    logo: "hilchenbach-logo.png",
    width: 1000,
    height: 828,
    href: "https://hilchenbach.de/",
    scale: 1.38,
    surface: "light",
  },
  {
    name: "IHK Siegen",
    logo: "ihk-siegen-logo.png",
    width: 794,
    height: 236,
    href: "https://www.ihk-siegen.de/",
    scale: 1.08,
    surface: "light",
  },
  {
    name: "Startpunkt57",
    logo: "startpunkt57-logo.svg",
    width: 437,
    height: 78,
    href: "https://www.startpunkt57.de/",
    scale: 1.24,
    surface: "light",
  },
  {
    name: "Entrepreneurship Center Universität Siegen",
    logo: "entrepreneurship-center-logo.png",
    width: 1827,
    height: 436,
    href: "https://www.uni-siegen.de/ec",
    scale: 1.08,
    surface: "dark",
  },
  {
    name: "Siegerland Center",
    logo: "siegerland-center-logo.svg",
    width: 498,
    height: 470,
    href: "https://siegerlandcenter.de/",
    scale: 1.22,
    surface: "light",
  },
  {
    name: "Reifen Thomas",
    logo: "reifen-thomas-logo.png",
    width: 567,
    height: 307,
    href: "https://www.reifenthomas.de/",
    scale: 1.08,
    surface: "dark",
  },
  {
    name: "Vorländer Sanitär · Heizung · Solar",
    logo: "vorlaender-logo.svg",
    width: 2500,
    height: 648,
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
  itemSelector?: string,
) {
  const pauseUntil = useRef(0),
    hovered = useRef(false),
    focused = useRef(false),
    externalPause = useRef(paused),
    manual = useRef(false),
    moveByRef = useRef<(direction: -1 | 1) => void>(() => {});
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
      initialized = false,
      active = false,
      position = 0,
      last = performance.now(),
      lastWidth = 0,
      autoUntil = 0,
      navigationTimer: number | undefined;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const recenter = () => {
      const start = m.offsetLeft, width = m.offsetWidth, left = v.scrollLeft;
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
    const syncToCanonical = () => {
      const width = m.offsetWidth, start = m.offsetLeft;
      if (!width) return;
      if (!initialized || Math.abs(lastWidth - width) > 1) {
        position = start;
        v.scrollLeft = position;
        position = v.scrollLeft;
        lastWidth = width;
        initialized = true;
      } else {
        position = v.scrollLeft;
      }
    };
    const onScroll = () => {
      if (initialized && performance.now() >= autoUntil) {
        position = recenter() ?? v.scrollLeft;
      }
    };
    const moveBy = (direction: -1 | 1) => {
      if (!itemSelector) return;
      syncToCanonical();
      position = recenter() ?? v.scrollLeft;
      const items = Array.from(v.querySelectorAll<HTMLElement>(itemSelector));
      if (!items.length) return;
      const current = items.reduce((closest, item, index) => Math.abs(item.offsetLeft - v.scrollLeft) < Math.abs(items[closest].offsetLeft - v.scrollLeft) ? index : closest, 0);
      const target = items[current + direction];
      if (!target) return;
      manual.current = true;
      pause();
      autoUntil = performance.now() + 800;
      v.scrollTo({ left: target.offsetLeft, behavior: reduced.matches ? "auto" : "smooth" });
      if (navigationTimer) window.clearTimeout(navigationTimer);
      navigationTimer = window.setTimeout(() => {
        manual.current = false;
        position = recenter() ?? v.scrollLeft;
      }, reduced.matches ? 0 : 800);
    };
    moveByRef.current = moveBy;
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
    const tick = (now: number) => {
      frame = 0;
      if (!active || document.hidden) return;
      const elapsed = Math.min(32, now - last);
      last = now;
      if (
        initialized &&
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
      if (active && !document.hidden) frame = requestAnimationFrame(tick);
    };
    let resizeObserver: ResizeObserver | undefined;
    const attach = () => {
      v.addEventListener("scroll", onScroll, { passive: true });
      for (const event of ["pointerdown", "touchstart"]) v.addEventListener(event, onStart, { passive: true });
      v.addEventListener("wheel", onWheel, { passive: true });
      for (const event of ["pointerup", "touchend", "pointercancel"]) v.addEventListener(event, onEnd, { passive: true });
      v.addEventListener("mouseenter", onEnter); v.addEventListener("mouseleave", onLeave);
      v.addEventListener("focusin", onFocusIn); v.addEventListener("focusout", onFocusOut);
    };
    const detach = () => {
      v.removeEventListener("scroll", onScroll);
      for (const event of ["pointerdown", "touchstart"]) v.removeEventListener(event, onStart);
      v.removeEventListener("wheel", onWheel);
      for (const event of ["pointerup", "touchend", "pointercancel"]) v.removeEventListener(event, onEnd);
      v.removeEventListener("mouseenter", onEnter); v.removeEventListener("mouseleave", onLeave);
      v.removeEventListener("focusin", onFocusIn); v.removeEventListener("focusout", onFocusOut);
    };
    const activate = () => {
      if (active) return;
      active = true;
      requestAnimationFrame(() => {
        if (!active) return;
        syncToCanonical();
        resizeObserver = new ResizeObserver(syncToCanonical);
        resizeObserver.observe(v); resizeObserver.observe(m);
        attach();
        last = performance.now();
        if (!document.hidden && !frame) frame = requestAnimationFrame(tick);
      });
    };
    const deactivate = () => {
      active = false;
      cancelAnimationFrame(frame); frame = 0;
      resizeObserver?.disconnect(); resizeObserver = undefined;
      detach();
    };
    const viewportObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) activate(); else deactivate();
    }, { rootMargin: "250px 0px" });
    viewportObserver.observe(v);
    const onVisibilityChange = () => {
      if (!document.hidden && active && !frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      deactivate();
      if (navigationTimer) window.clearTimeout(navigationTimer);
      moveByRef.current = () => {};
      viewportObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [speed, itemSelector]);
  return { pause, moveBy: (direction: -1 | 1) => moveByRef.current(direction) };
}
function CollaborationStrip({ lang }: { lang: Language }) {
  const viewport = useRef<HTMLDivElement>(null),
    main = useRef<HTMLDivElement>(null),
    { pause, moveBy } = useSeamlessCarousel(viewport, main, 0.052, false, ".collaboration-logo");
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
            width={x.width}
            height={x.height}
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
        <div className="logo-controls" aria-label={lang === "de" ? "Kundenlogos steuern" : "Control client logos"} onMouseEnter={() => pause()} onFocus={() => pause()}>
          <button className="review-control prev" type="button" aria-label={lang === "de" ? "Vorheriges Kundenlogo" : "Previous client logo"} onClick={() => moveBy(-1)}><Arrow /></button>
          <button className="review-control" type="button" aria-label={lang === "de" ? "Nächstes Kundenlogo" : "Next client logo"} onClick={() => moveBy(1)}><Arrow /></button>
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
  const image = responsiveImages[project.image];
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
          srcSet={image ? image.srcSet.split(", ").map((source) => `${import.meta.env.BASE_URL}images/${source}`).join(", ") : undefined}
          sizes={image ? "(max-width: 560px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 48px), 50vw" : undefined}
          alt={project.alt}
          width={image?.width || 1280}
          height={image?.height || 800}
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
    items = smsVideos;
  return (
    <article className="project-card sms-card" data-selected-project>
      <div className="project-media">
        <img
          src={import.meta.env.BASE_URL + "images/sms-group-event.webp"}
          srcSet={`${import.meta.env.BASE_URL}images/sms-group-event-480.webp 480w, ${import.meta.env.BASE_URL}images/sms-group-event-800.webp 800w`}
          sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 48px), 50vw"
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
            width="1598"
            height="221"
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
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
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
      image: "ihk-workshop-2026-presenting-screen.webp",
      de: "Präsentation im IHK-Workshop",
      en: "Presentation during an IHK workshop",
    },
    {
      image: "ihk-workshop-2026-presenting-portrait.webp",
      de: "Vortrag im IHK-Workshop",
      en: "Presenting during an IHK workshop",
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
          src={base + "images/ihk-workshop-2026-presenting-card.webp"}
          srcSet={`${base}images/ihk-workshop-2026-presenting-card-480.webp 480w, ${base}images/ihk-workshop-2026-presenting-card-800.webp 800w`}
          sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 48px), 50vw"
          alt={
            lang === "de"
              ? "Niklas Brüne bei einem Workshop der IHK Siegen."
              : "Niklas Brüne leading an IHK Siegen workshop."
          }
          width="1600"
          height="900"
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
function BehindTheScenes({ lang }: { lang: Language }) {
  const viewport = useRef<HTMLDivElement>(null), main = useRef<HTMLDivElement>(null);
  const pauseUntil = useRef(0);
  const [paused, setPaused] = useState(false), [pauseRevision, setPauseRevision] = useState(0);
  const base = import.meta.env.BASE_URL;
  const items = [
    { image: "production-bts-konekt-event-rig.webp", de: "Eventproduktion mit Kamera-Rig", en: "Event production with camera rig" },
    { image: "production-bts-konekt-event-wide.webp", de: "Kameraarbeit in größerer Eventproduktion", en: "Camera work on a larger event production" },
    { image: "production-bts-vorlaender-team.webp", de: "Kameraarbeit mit dem Vorländer-Team", en: "Camera work with the Vorländer team" },
    { image: "production-bts-konekt-camera-operator.webp", de: "Kameraoperator bei einer Eventproduktion", en: "Camera operator on an event production" },
    { image: "production-bts-salon-gimbal.webp", de: "Gimbal-Setup bei einer Kundenproduktion", en: "Gimbal setup on a client production" },
    { image: "production-bts-lemonaid-tabletop.webp", de: "Tabletop- und Produktproduktion", en: "Tabletop and product production" },
  ];
  const pauseForInteraction = () => { pauseUntil.current = performance.now() + 5200; };
  const moveSlide = (direction: -1 | 1) => {
    const node = viewport.current, canonical = main.current;
    if (!node || !canonical) return;
    const width = canonical.offsetWidth, start = canonical.offsetLeft;
    if (width && node.scrollLeft < start) node.scrollLeft += width;
    if (width && node.scrollLeft >= start + width) node.scrollLeft -= width;
    const slides = Array.from(node.querySelectorAll<HTMLElement>(".bts-set figure"));
    if (!slides.length) return;
    const current = slides.reduce((closest, slide, index) => Math.abs(slide.offsetLeft - node.scrollLeft) < Math.abs(slides[closest].offsetLeft - node.scrollLeft) ? index : closest, 0);
    const target = slides[current + direction];
    if (!target) return;
    pauseForInteraction();
    setPauseRevision((revision) => revision + 1);
    node.scrollTo({ left: target.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = viewport.current, canonical = main.current;
    if (!node || !canonical) return;
    let timeout: number | undefined;
    let settleTimer: number | undefined;
    let visible = false;
    let initialized = false;
    const sets = () => Array.from(node.querySelectorAll<HTMLElement>(".bts-set"));
    const recenter = () => {
      const width = canonical.offsetWidth, start = canonical.offsetLeft;
      if (!width) return;
      if (node.scrollLeft < start) node.scrollLeft += width;
      if (node.scrollLeft >= start + width) node.scrollLeft -= width;
    };
    const initialize = () => {
      if (initialized) return;
      if (node.scrollLeft <= 1) node.scrollLeft = canonical.offsetLeft;
      recenter();
      initialized = true;
    };
    const schedule = () => {
      if (timeout) window.clearTimeout(timeout);
      if (!visible || paused || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const wait = Math.max(0, pauseUntil.current - performance.now());
      timeout = window.setTimeout(() => {
        if (!visible || paused || document.hidden) return;
        recenter();
        const slides = Array.from(canonical.querySelectorAll<HTMLElement>("figure"));
        const nextSet = sets()[2];
        if (!slides.length || !nextSet) return;
        const current = slides.reduce((closest, slide, index) => Math.abs(slide.offsetLeft - node.scrollLeft) < Math.abs(slides[closest].offsetLeft - node.scrollLeft) ? index : closest, 0);
        const next = current === slides.length - 1 ? nextSet.querySelector<HTMLElement>("figure") : slides[current + 1];
        if (next) node.scrollTo({ left: next.offsetLeft, behavior: "smooth" });
        if (settleTimer) window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(recenter, 700);
        schedule();
      }, wait || 4900);
    };
    const onScroll = () => {
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(recenter, 700);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestAnimationFrame(() => { initialize(); schedule(); });
      else if (timeout) window.clearTimeout(timeout);
    }, { rootMargin: "0px" });
    const onVisibilityChange = () => { if (!document.hidden) schedule(); };
    observer.observe(node);
    node.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { if (timeout) window.clearTimeout(timeout); if (settleTimer) window.clearTimeout(settleTimer); observer.disconnect(); node.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, [paused, pauseRevision]);
  const previousLabel = lang === "de" ? "Vorheriges Behind-the-scenes-Bild" : "Previous behind-the-scenes image";
  const nextLabel = lang === "de" ? "Nächstes Behind-the-scenes-Bild" : "Next behind-the-scenes image";
  return <section className="bts section"><div className="wrap"><div className="bts-heading"><div><p className="eyebrow">Behind the scenes</p><h2>{lang === "de" ? "Produktion in der Praxis." : "Production behind the scenes."}</h2></div><p>{lang === "de" ? "Von kompakten Content-Produktionen bis zu Corporate- und Eventdrehs: Je nach Projekt arbeite ich mit professionellem Kamera-, Audio- und Rigging-Equipment sowie spezialisierten Freelancern und Projektteams." : "From compact content productions to corporate and event shoots, each project uses professional camera, audio and rigging equipment alongside specialist freelancers and project teams where useful."}</p></div><div className="bts-controls" aria-label={lang === "de" ? "Behind-the-scenes-Bilder steuern" : "Control behind-the-scenes images"}><button className="review-control prev" type="button" aria-label={previousLabel} onClick={() => moveSlide(-1)}><Arrow /></button><button className="review-control" type="button" aria-label={nextLabel} onClick={() => moveSlide(1)}><Arrow /></button></div><div className="bts-window" ref={viewport} tabIndex={0} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onPointerDown={pauseForInteraction} onTouchStart={pauseForInteraction} onWheel={pauseForInteraction}><div className="bts-track">{[0, 1, 2].map((setIndex) => <div className="bts-set" key={setIndex} ref={setIndex === 1 ? main : undefined} aria-hidden={setIndex !== 1 || undefined}>{items.map((item) => <figure key={`${item.image}-${setIndex}`}><img src={base + "images/" + item.image} alt={setIndex === 1 ? lang === "de" ? item.de : item.en : ""} width="1600" height={item.image.includes("lemonaid") ? "900" : "1066"} loading="lazy" decoding="async" /><figcaption>{lang === "de" ? item.de : item.en}</figcaption></figure>)}</div>)}</div></div></div></section>;
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
      { rootMargin: "0px" },
    );
    o.observe(n);
    return () => o.disconnect();
  }, []);
  const title =
      lang === "de" ? "Ausgewählte Videoarbeiten" : "Selected video work",
    copy =
      lang === "de"
        ? "Medienproduktion bleibt Teil meiner praktischen Umsetzung. Im Video-Archiv finden Sie ausgewählte Corporate-, Imagefilm-, Produkt-, Event-, Drohnen- und Testimonial-Arbeiten."
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
  onPlayVideo,
}: {
  review: Review;
  lang: Language;
  clone: boolean;
  expanded: boolean;
  onToggle?: () => void;
  onPlayVideo?: (review: Review, trigger: HTMLElement) => void;
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
      <div className="review-card-actions">
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
        {review.testimonialVideoId && !clone && onPlayVideo && <button type="button" className="review-video-link" onClick={(event) => onPlayVideo(review, event.currentTarget)}>{lang === "de" ? "Video-Feedback ansehen" : "Watch video testimonial"}</button>}
      </div>
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
          onPlayVideo={(current, trigger) => playVideo({ id: current.testimonialVideoId!, title: current.name, trigger })}
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
              srcSet={`${base}images/niklas-working-desk-office-480.webp 480w, ${base}images/niklas-working-desk-office-768.webp 768w`}
              sizes="100vw"
            />
            <img
              className="hero-image"
              src={base + "images/niklas-speaking-desk-office-1440.webp"}
              srcSet={`${base}images/niklas-speaking-desk-office-960.webp 960w, ${base}images/niklas-speaking-desk-office-1440.webp 1440w`}
              sizes="(max-width: 767px) 100vw, 72vw"
              alt={
                lang === "de"
                  ? "Niklas Brüne bei der Arbeit am Schreibtisch."
                  : "Niklas Brüne working at a desk."
              }
              width="1440"
              height="960"
              loading="eager"
              fetchPriority="high"
              decoding="async"
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
        <BehindTheScenes lang={lang} />
        <Reviews lang={lang} />
        <section id="ueber-mich" className="about section">
          <div className="wrap about-grid">
            <figure className="about-media">
              <img
                src={base + "images/niklas-current-profile.webp"}
                srcSet={`${base}images/niklas-current-profile-480.webp 480w, ${base}images/niklas-current-profile-800.webp 800w`}
                sizes="(max-width: 900px) 280px, 420px"
                alt={c.aboutAlt}
                width="1800"
                height="1800"
                loading="lazy"
                decoding="async"
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
        <Internships lang={lang} />
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
      <SiteFooter lang={lang} isHome />
    </>
  );
}
