#!/usr/bin/env node
/*
 * Auto-refresh script for the Qi Teng academic homepage.
 * Runs on a schedule in GitHub Actions (or manually with `node scripts/refresh-data.mjs`).
 *
 * Data authority model:
 *  - Google Scholar is the authoritative source for BOTH the paper list
 *    (only Scholar-indexed works ever appear) and the headline metrics
 *    (Citations / h-index / i10-index). Scholar has no official API, so the
 *    public profile page is parsed; if that fails the previous snapshot stays.
 *  - OpenAlex supplements per-paper metadata (DOI, venue, volume/pages) and
 *    live citation counts for the Scholar-verified list.
 *  - Entries marked "verified: true" in site-data.js are user-confirmed and
 *    survive even if Scholar stops listing them (e.g. journal corrections).
 */
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const FILE = new URL("../assets/site-data.js", import.meta.url);
const SCHOLAR_USER = "D5kHbeAAAAAJ";
const ORCID = "0000-0003-3573-4146";
const MAILTO = "teqi159@gmail.com";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 64);

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": `homepage-sync (mailto:${MAILTO})` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function parseSiteData(code) {
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { timeout: 5000 });
  return sandbox.window.siteData;
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").trim();
}

async function fetchScholarPapers(user) {
  const papers = [];
  // Scholar's list can include a stray "Articles" section header row whose
  // anchor text reads "ArticlesDual Stage-Wise ..." — drop that noise.
  const isNoiseRow = (title, cites) =>
    /^Articles[A-Z]/.test(title) && cites === "";
  let start = 0;
  const pageSize = 100;
  for (let page = 0; page < 5; page += 1) {
    const html = await fetchText(
      `https://scholar.google.com/citations?user=${user}&hl=en&cstart=${start}&pagesize=${pageSize}`
    );
    const rows = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g)];
    if (!rows.length) break;
    for (const match of rows) {
      const row = match[1];
      const titleMatch = row.match(/class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/);
      if (!titleMatch) continue;
      const title = stripTags(titleMatch[1]);
      const grays = [...row.matchAll(/class="gs_gray">([\s\S]*?)<\/div>/g)].map(
        (m) => stripTags(m[1])
      );
      const citesMatch = row.match(/class="gsc_a_ac gs_ibl"[^>]*>([^<]*)</);
      const yearMatch = row.match(/class="gsc_a_h gsc_a_hc gs_ibl"[^>]*>([^<]*)</);
      papers.push({
        title,
        authors: grays[0] || "",
        venue: grays[1] || "",
        year: (yearMatch && yearMatch[1].trim()) || "",
        cites: (citesMatch && citesMatch[1].trim()) || ""
      });
    }
    if (rows.length < pageSize) break;
    start += pageSize;
  }
  return papers.filter((p) => !isNoiseRow(p.title, p.cites));
}

async function fetchScholarMetrics(user) {
  const html = await fetchText(
    `https://scholar.google.com/citations?user=${user}&hl=en&cstart=0&pagesize=100`
  );
  const cells = [
    ...html.matchAll(/<td class="gsc_rsb_std">([^<]+)<\/td>/g)
  ].map((m) => m[1].trim());
  return {
    citations: cells[0] || "",
    hIndex: cells[2] || "",
    i10Index: cells[4] || ""
  };
}

async function fetchOpenAlexWorks(orcid, mailto) {
  const author = await fetchJson(
    `https://api.openalex.org/authors/https://orcid.org/${orcid}?mailto=${encodeURIComponent(mailto)}`
  );
  const worksData = await fetchJson(
    `https://api.openalex.org/works?filter=author.id:${encodeURIComponent(author.id)}&per-page=200&sort=publication_date:desc&mailto=${encodeURIComponent(mailto)}`
  );
  return worksData.results || [];
}

function typeLabel(type) {
  if (!type) return "Journal article";
  const t = String(type).toLowerCase();
  if (t.includes("preprint")) return "Preprint";
  if (t.includes("review")) return "Review";
  return "Journal article";
}

async function main() {
  const code = readFileSync(FILE, "utf8");
  const data = parseSiteData(code);

  // 1) Scholar is authoritative. If Scholar is unreachable we keep the
  //    previous snapshot untouched and exit without writing anything.
  const [scholarPapers, metrics, openAlexWorks] = await Promise.all([
    fetchScholarPapers(SCHOLAR_USER),
    fetchScholarMetrics(SCHOLAR_USER),
    fetchOpenAlexWorks(ORCID, MAILTO)
  ]);

  const scholarNorm = new Set(scholarPapers.map((p) => normalize(p.title)));
  const byScholarTitle = new Map(
    scholarPapers.map((p) => [normalize(p.title), p])
  );

  // 2) Keep list = Scholar papers + previously verified entries.
  const nextPublications = [];
  const seen = new Set(); // normalized titles already rebuilt from Scholar
  const seenCombos = new Set(); // title|link combos already present

  for (const paper of scholarPapers) {
    const key = normalize(paper.title);
    if (seen.has(key)) continue;
    seen.add(key);

    const existing = data.publications.find(
      (p) => normalize(p.title) === key
    );
    const openAlex = openAlexWorks.find(
      (w) => normalize(w.title) === key
    );
    const doi = existing?.link?.includes("doi.org")
      ? existing.link
      : openAlex?.doi
        ? openAlex.doi
        : "";
    const source = openAlex?.primary_location?.source || {};
    const biblio = openAlex?.biblio || {};
    const volume = biblio.volume ? `Vol. ${biblio.volume}` : "";
    const pages = biblio.first_page
      ? `${biblio.first_page}-${biblio.last_page || ""}`
      : "";
    const details = [
      paper.venue || source.display_name || "",
      [volume, pages].filter(Boolean).join(", "),
      paper.year || openAlex?.publication_year || ""
    ]
      .filter(Boolean)
      .join(" · ")
      .trim();

    const rebuilt = {
      title: paper.title,
      authors:
        paper.authors ||
        (openAlex?.authorships || [])
          .slice(0, 12)
          .map((a) => a.author?.display_name)
          .filter(Boolean)
          .join(", ") ||
        "",
      venue: paper.venue || source.display_name || "",
      details,
      year: Number(paper.year) || openAlex?.publication_year || null,
      citations: Number(paper.cites) || openAlex?.cited_by_count || 0,
      link:
        existing?.link ||
        doi ||
        `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`,
      linkLabel: existing?.linkLabel || (doi ? "DOI" : "Scholar"),
      selected: existing?.selected === true,
      type: existing?.type || typeLabel(openAlex?.type),
      verified: true
    };
    nextPublications.push(rebuilt);
    seenCombos.add(`${normalize(rebuilt.title)}|${normalize(rebuilt.link)}`);
  }

  // Verified entries no longer listed by Scholar stay (e.g. corrections,
  // preprint/journal twin records, user-confirmed works Scholar has not
  // indexed yet) — as long as the title|link pair is not already present.
  for (const pub of data.publications) {
    if (pub.verified !== true) continue;
    const combo = `${normalize(pub.title)}|${normalize(pub.link)}`;
    if (seenCombos.has(combo)) continue;
    seenCombos.add(combo);
    nextPublications.push(pub);
  }

  data.publications = nextPublications;

  // 3) Headline metrics straight from the Scholar profile page.
  for (const metric of data.profile.metrics) {
    const next = {
      Citations: metrics.citations,
      "h-index": metrics.hIndex,
      "i10-index": metrics.i10Index
    }[metric.label];
    if (next) metric.value = next;
  }

  // 4) Freshness stamp.
  data.profile.updatedAt = new Date().toISOString().slice(0, 10);

  // 5) Write only when something changed.
  const next = `window.siteData = ${JSON.stringify(data, null, 2)};\n`;
  if (next === code) {
    console.log("no-change");
    return;
  }
  writeFileSync(FILE, next);
  console.log(
    `changed: ${scholarPapers.length} Scholar works, ${nextPublications.length} total, ` +
      `metrics ${metrics.citations}/${metrics.hIndex}/${metrics.i10Index}`
  );
}

main().catch((error) => {
  console.error(`refresh failed: ${error.message}`);
  process.exit(1);
});
