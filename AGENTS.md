# AGENTS.md — Portsmouth Joggers Website (`pjc.org.uk`)

## Vision & Core Philosophy
This site is a fast, clean, accessible, semantically rich static website built directly on native web standards. It uses **zero frameworks, zero build tools, and zero external runtime dependencies**. Every change must preserve its simplicity, semantic integrity, accessibility, and performance.

---

## 1. Architecture & File Structure
- **No build tools or frameworks:** Use only vanilla HTML5, CSS, and ES Modules. Never introduce npm packages, bundlers, CSS frameworks, or client-side routing libraries.
- **Directory-based URLs:** Every page lives in its own directory as `index.html` (e.g., `/groups/index.html` served as `/groups/`).
- **Internal links:** Always use root-relative paths with a trailing slash (e.g., `href="/groups/"`, `href="/races/pl5/"`) and open in the same tab. Never put `target="_blank"` on internal links or `mailto:` links.
- **External links:** Always use `target="_blank"` (with the leading underscore) and strip tracking parameters (such as `?fbclid=...`) from URLs. Never leave leading or trailing spaces inside `href` or `src` attributes.
- **Filenames:** All asset and directory names must be lowercase, ASCII, and hyphen-separated (e.g., `pl5-donations.avif`, `pjc-news-30-2026-spring.pdf`). Never use spaces or uppercase letters in filenames.

## 2. HTML5 Semantics & Validation
- **Clean document skeleton:** Follow the established HTML5 structure (omitting optional `<head>` and `<body>` tags). Every page must include:
  - `<!DOCTYPE html>` and `<html lang="en">`
  - `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `<link rel="stylesheet" href="/x/all.css">`, `<link rel="icon" href="/x/logo-pj.svg">`, `<link rel="manifest" href="/manifest.json">`
  - `<script src="/x/menu.js" type="module"></script>`
  - A page-accurate `<link rel="canonical" href="https://pjc.org.uk/<path>/">`
  - A unique, descriptive `<title>` and `<meta name="description" content="...">`
  - `<header>`, `<main><article>...</article></main>`, and `<footer>`
- **Strict heading hierarchy:**
  - Exactly one `<h1>` per page (inside `<article>`). The site title in `<header>` is `<p class="banner">`.
  - Do not skip heading levels (`<h1>` -> `<h2>` -> `<h3>`).
  - Wrap distinct topical blocks inside `<article>` in `<section>` elements.
- **Semantic element choice:**
  - **Portraits & Captioned Media:** Always use `<figure>` and `<figcaption>`.
  - **Key–Value Metadata (e.g., Race Info panels):** Always use `<dl>`, `<dt>`, and `<dd>`.
  - **Dates & Events:** Wrap event dates in `<time datetime="YYYY-MM-DD">`. Verify that the `datetime` attribute matches the human-readable date string so automatic past/next event highlighting works.
  - **Acronyms & Quotes:** Use `<abbr title="...">` for first-use acronyms and `<q>` for inline quotations.
- **Forbidden HTML patterns:**
  - **NEVER** use `<br>` or `<Br>` for vertical spacing between paragraphs, sections, list items, or grids. Use CSS `margin` or `gap`.
  - **NEVER** insert empty elements (`<div></div>`, `<figure></figure>`, `<p></p>`) as layout spacers.
  - **NEVER** use inline `style="..."` attributes in HTML.
  - Validate that all opened tags are properly nested and closed before committing.

## 3. CSS, Layout & Theming (`/x/`)
- **Core vs. Page-Specific Styles:**
  - Global tokens, themes, and shared components belong in `/x/` (`vars.css`, `colours.css`, `motion.css`, `style.css`, `menu.css`).
  - Styles needed by only one page belong in a `<style>` block in that page's `index.html` (or a co-located stylesheet like `groups/relativespeeds.css`). Do not leak page-specific `#id` selectors into `x/style.css`.
- **Design Tokens & Dark Mode:**
  - Always use CSS custom properties from `x/colours.css` and `x/vars.css` (`var(--page)`, `var(--text)`, `var(--col1)`, `var(--col2)`, `var(--fixedspace)`, `var(--curve)`).
  - Never hardcode hex/RGB colours in `x/style.css` or inline `<style>` blocks unless defining a semantic visualization palette (such as `relativespeeds.css`).
  - Test every colour combination in **both** Light Mode and Dark Mode (`@media (prefers-color-scheme: dark)`), ensuring at least **4.5:1 WCAG AA contrast** for normal text and **3:1** for large text/UI components.
- **Mobile-First Responsive Layouts:**
  - Base rules in `:root` and `x/style.css` target mobile (`<= 40rem`); desktop overrides live inside `@media screen and (width > 40rem)`.
  - Use `.cards` or `.sidebyside` for multi-column galleries. Never hardcode fixed pixel/em widths (like `width: 22em`) that overflow narrow mobile screens.
  - Never use `!important`—fix selector specificity instead.
  - Never remove focus outlines (`outline: none`) without providing a high-contrast `:focus-visible` indicator.

## 4. Images, Media & Performance
- **Dimensions & Aspect Ratios:**
  - Member/leader portraits must be cropped to **600×700px** (`6:7` aspect ratio) and saved at reasonable quality (`< 150 KB`).
  - Landscape/event photos must be sized appropriately for the `60em` max layout width (typically `800px`–`1080px` wide, never raw multi-megabyte camera originals).
- **Modern Formats & Fallbacks:**
  - For photographic banners and event photos, provide an `.avif` version alongside a `.jpg` fallback using `<picture><source srcset="...avif" type="image/avif"><img src="...jpg" ...></picture>`. Never put an `.avif` directly in `<img src="...">` without a fallback, and verify that fallback filenames match on case-sensitive filesystems.
- **Loading & CLS Prevention:**
  - Include explicit `width` and `height` attributes on `<img>` elements to reserve aspect-ratio space before load.
  - Do **not** put `loading="lazy"` on the primary above-the-fold image on a page; **do** put `loading="lazy"` on below-the-fold images.
- **Repository Hygiene:**
  - Publish documents as `.pdf` only—do not commit source `.docx` files or unreferenced image assets.

## 5. House Style & Copy Editing
- **Voice:** Write in the collective first-person plural (*"We"*, *"Our"*) representing Portsmouth Joggers Club as an inclusive, welcoming community for runners of all paces.
- **Formatting conventions:**
  - **Times:** `6:50 p.m.`, `7 p.m.`, `10:30 a.m.` (lowercase with periods and a space before `a.m.`/`p.m.`).
  - **Dates:** `1st April`, `27th December 2026` (plain text ordinals; do not use `<sup>`).
  - **Units:** `km` (lowercase, space before unit, e.g., `5 km`, `10 km`), `min/mile` and `min/km` for pace ranges (e.g., `8:30–9:00 min/mile (5:15–5:35 min/km)`).
  - **Headings:** Title Case for `<h1>` and `<h2>` headings; sentence case for FAQ-style headings (e.g., *"What is Couch to 5K?"*).
