#!/usr/bin/env node
/*
 * Auto-refresh script for the Qi Teng academic homepage.
 * Runs on a schedule in GitHub Actions (or manually with `node scripts/refresh-data.mjs`).
 *
 * - Reads assets/site-data.js (the curated fallback dataset)
 * - Pulls the author + works from OpenAlex by ORCID
 * - Updates metrics, per-paper citation counts, and the updatedAt stamp
 * - Appends newly indexed works that are not yet in the curated list (non-featured)
 * - Rewrites assets/site-data.js only when something actually changed
 */
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const FILE = new URL("../assets/site-data.js", import.meta.url);
const MAILTO = "teqi159@gmail.com";
const ORCID = "0000-0003-3573-4146";
const MAX_APPEND = 30;

function parseSiteData(code) {
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { timeout: 5000 });
  return sandbox.window.siteData;
}

async function openAlexJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": `homepage-sync (mailto:${MAILTO})` }
  });
  if (!res.ok) throw new Error(`OpenAlex ${res.status} for ${url}`);
  return res.json();
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

  const author = await openAlexJson(
    `https://api.openalex.org/authors/https://orcid.org/${ORCID}?mailto=${encodeURIComponent(MAILTO)}`
  );
  const worksData = await openAlexJson(
    `https://api.openalex.org/works?filter=author.id:${encodeURIComponent(author.id)}&per-page=200&sort=publication_date:desc&mailto=${encodeURIComponent(MAILTO)}`
  );
  const works = (worksData.results || []).filter(
    (work) => work.title && work.publication_year
  );

  // 1) Live metrics snapshot.
  // OpenAlex author summary_stats has no total citation count, so we sum the
  // cited_by_count of the works returned by the works endpoint.
  const stats = author.summary_stats || {};
  const totalCitations = works.reduce(
    (sum, work) => sum + (work.cited_by_count || 0),
    0
  );
  const metricValue = {
    Citations: Number.isFinite(totalCitations) ? String(totalCitations) : null,
    "h-index": Number.isFinite(stats.h_index) ? String(stats.h_index) : null,
    "i10-index": Number.isFinite(stats.i10_index) ? String(stats.i10_index) : null
  };
  for (const metric of data.profile.metrics) {
    const next = metricValue[metric.label];
    if (next) metric.value = next;
  }

  // 2) Refresh citations/years for curated entries, matched by DOI.
  const byDoi = new Map();
  for (const work of works) {
    const doi = String(work.doi || "")
      .toLowerCase()
      .replace(/^https?:\/\/doi\.org\//, "");
    if (doi) byDoi.set(doi, work);
  }
  let matched = 0;
  for (const pub of data.publications) {
    const doi = String(pub.link || "")
      .toLowerCase()
      .replace(/^https?:\/\/doi\.org\//, "");
    const work = doi && byDoi.get(doi);
    if (work) {
      pub.citations = work.cited_by_count || pub.citations;
      pub.year = work.publication_year || pub.year;
      matched++;
    }
  }

  // 3) Append newest works missing from the curated list (non-featured).
  const known = new Set(
    data.publications.map((pub) => String(pub.link || "").toLowerCase())
  );
  const appended = [];
  for (const work of works) {
    if (appended.length >= MAX_APPEND) break;
    // Skip works without a real source (e.g. bare CNKI landing pages) —
    // they are not useful in the fallback archive.
    if (!work.primary_location?.source?.display_name) continue;
    const doi = String(work.doi || "")
      .toLowerCase()
      .replace(/^https?:\/\/doi\.org\//, "");
    const link = doi
      ? `https://doi.org/${doi}`
      : work.primary_location?.landing_page_url || work.doi || "#";
    if (known.has(link.toLowerCase())) continue;
    const authors =
      (work.authorships || [])
        .slice(0, 12)
        .map((a) => a.author?.display_name)
        .filter(Boolean)
        .join(", ") || "";
    appended.push({
      title: work.title,
      authors,
      venue: work.primary_location.source.display_name,
      details: String(work.publication_year),
      year: work.publication_year,
      citations: work.cited_by_count || 0,
      link,
      linkLabel: doi ? "DOI" : "Link",
      selected: false,
      type: typeLabel(work.type)
    });
  }
  data.publications.push(...appended);

  // 4) Freshness stamp.
  data.profile.updatedAt = new Date().toISOString().slice(0, 10);

  // 5) Serialize and write only when something changed.
  const next = `window.siteData = ${JSON.stringify(data, null, 2)};\n`;
  if (next === code) {
    console.log("no-change");
    return;
  }
  writeFileSync(FILE, next);
  console.log(
    `changed: ${matched} curated entries refreshed, ${appended.length} new works appended`
  );
}

main().catch((error) => {
  console.error(`refresh failed: ${error.message}`);
  process.exit(1);
});
