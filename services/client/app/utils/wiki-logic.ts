// @ts-ignore
import rake from "rake-js";
import wiki from "wikipedia";

interface WikiSummary {
  title: string;
  summary: string;
}

interface WikiLink {
  matchedPhrase: string;
  link: string;
  summary: string;
}

async function checkSubPhrase(sp: string): Promise<WikiSummary | null> {
  try {
    let page;
    try {
      page = await wiki.page(sp, { autoSuggest: false });
    } catch {
      page = await wiki.page(sp, { autoSuggest: true });
    }

    let summaryData = await page.summary();
    let finalTitle = (summaryData.title || "").trim();

    if (finalTitle.toLowerCase() === "undefined") {
      return null;
    }

    const finalSummary = summaryData.description || summaryData.extract;
    return {
      title: finalTitle,
      summary: finalSummary || "No summary available.",
    };
  } catch (err) {
    return null;
  }
}

async function findBestWikiLink(fullKeyword: string): Promise<WikiLink | null> {
  const cleanKeyword = fullKeyword.replace(/[^\w\s]+$/g, "").trim(); // remove trailing punctuation
  if (!cleanKeyword) return null;

  const words = cleanKeyword.split(/\s+/); // split by whitespace
  if (!words.length) return null;

  const subPhrases = [];
  for (let size = words.length; size > 0; size--) {
    for (let start = 0; start + size <= words.length; start++) {
      subPhrases.push(words.slice(start, start + size).join(" "));
    }
  }

  const checkResults = await Promise.all(
    subPhrases.map(async (sp) => {
      const res = await checkSubPhrase(sp);
      return { sp, data: res };
    }),
  );

  for (let i = 0; i < subPhrases.length; i++) {
    const { sp, data } = checkResults[i];
    if (data) {
      const encoded = encodeURIComponent(sp.replace(/\s/g, "_"));
      return {
        matchedPhrase: sp,
        link: `https://en.wikipedia.org/wiki/${encoded}`,
        summary: data.summary,
      };
    }
  }
  return null;
}

function linkifyContent(summary: string, matchedKeywords: WikiLink[]): string {
  if (!summary) return "";

  const tokens = summary.split(" ");
  const mkData = matchedKeywords.map((mk) => ({
    ...mk,
    phraseTokens: mk.matchedPhrase.toLowerCase().split(/\s+/),
    phraseLength: mk.matchedPhrase.split(/\s+/).length,
  }));
  mkData.sort((a, b) => b.phraseLength - a.phraseLength);

  let result = "";
  let i = 0;

  while (i < tokens.length) {
    let matched = false;
    for (const mk of mkData) {
      const { phraseTokens, link, summary: s } = mk;
      const plength = phraseTokens.length;

      if (i + plength <= tokens.length) {
        let match = true;
        for (let j = 0; j < plength; j++) {
          const tokenLower = tokens[i + j].toLowerCase().replace(/[^\w]/g, "");
          const phraseTokenLower = phraseTokens[j].replace(/[^\w]/g, "");
          if (tokenLower !== phraseTokenLower) {
            match = false;
            break;
          }
        }
        if (match) {
          const originalSlice = tokens.slice(i, i + plength).join(" ");
          result += `<a href="${link}" title="${s}" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300">${originalSlice}</a> `;
          i += plength;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      result += tokens[i] + " ";
      i++;
    }
  }

  return result.trim();
}

export async function enhanceContent(summary: string): Promise<string> {
  const rawKeywords = rake(summary);
  const filtered = rawKeywords.filter((kw: string) => kw.trim() !== "");
  const bestLinks = await Promise.all(
    filtered.map((kw: string) => findBestWikiLink(kw)),
  );
  const uniqueResults: WikiLink[] = [];
  const seen = new Set<string>();
  for (const item of bestLinks) {
    if (item && !seen.has(item.link)) {
      uniqueResults.push(item);
      seen.add(item.link);
    }
  }
  return linkifyContent(summary, uniqueResults);
}
