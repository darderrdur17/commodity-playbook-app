/**
 * Builds src/data/case-studies-details.json — full bodies for all 10 published cases.
 * Case 04 is extracted from Elite Pack HTML; others authored to match index cards + playbook style.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SHARED = path.join(ROOT, "..", "CommodityPlaybook - Shared Folder");

function strip(s) {
  return s
    .replace(/<span class="key-term">/g, "**")
    .replace(/<\/span>/g, "**")
    .replace(/<em>/g, "*")
    .replace(/<\/em>/g, "*")
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCase04() {
  const html = fs.readFileSync(
    path.join(SHARED, "Elite Pack/case-study-07.html"),
    "utf8"
  );
  const sections = [];
  for (const part of html.split(/<div class="cs-section[^"]*" id="/).slice(1)) {
    const id = part.match(/^([^"]+)/)?.[1];
    const label = part.match(/cs-section-label">([^<]+)/)?.[1];
    const title = part.match(/cs-h2">([^<]+)/)?.[1];
    if (!id || !label || id === "selftest") continue;
    const paragraphs = [];
    let pm;
    const pRe = /<p class="cs-p">([\s\S]*?)<\/p>/g;
    while ((pm = pRe.exec(part))) {
      const t = strip(pm[1]);
      if (t) paragraphs.push(t);
    }
    const thesis = part.match(/db-thesis">([\s\S]*?)<\/div>/)?.[1];
    if (thesis) paragraphs.push(`**Revised thesis:** "${strip(thesis)}"`);
    part.match(/db-actions[\s\S]*?<\/ul>/)?.[0]
      ?.match(/<li>[\s\S]*?<\/li>/g)
      ?.forEach((li) => {
        const t = strip(li);
        if (t.length > 5) paragraphs.push(`▸ ${t}`);
      });
    part.match(/<div class="os-event">([\s\S]*?)<\/div>\s*(?=<div class="os-event)/g)?.forEach((ev) => {
      const day = ev.match(/os-day">([^<]+)/)?.[1];
      const text = ev.match(/os-text">([\s\S]*?)<\/div>/)?.[1];
      if (day && text) paragraphs.push(`**${day}** — ${strip(text)}`);
    });
    part.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0]
      ?.match(/<tr>[\s\S]*?<\/tr>/g)
      ?.slice(1)
      ?.forEach((tr) => {
        const cells = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => strip(c[1]));
        if (cells[0]) paragraphs.push(`**${cells[0]}:** ${cells.slice(1).filter(Boolean).join(" · ")}`);
      });
    part.match(/<div class="lesson-card[^"]*">([\s\S]*?)<\/div>\s*(?=<div class="lesson-card)/g)?.forEach((lc) => {
      const lt = lc.match(/lc-title">([^<]+)/)?.[1];
      const lx = lc.match(/lc-text">([^<]+)/)?.[1];
      if (lt) paragraphs.push(`**${lt}** — ${lx || ""}`);
    });
    const desk = part.match(/dl-quote">([^<]+)/)?.[1];
    if (desk) paragraphs.push(`*"${strip(desk)}"*`);
    sections.push({ id, label: label.trim(), title: (title || "").trim(), paragraphs });
  }
  return sections;
}

/** Standard 7-section structure helper */
function cs(sections) {
  return sections;
}

const DETAILS = {
  "the-inventory-divergence": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "Three Bullish Draws. Brent Barely Moves.",
      paragraphs: [
        "Wednesday, 10:30am New York. The EIA prints a crude inventory draw of 4.2 million barrels — the third consecutive bullish surprise versus consensus. Cushing draws 1.1mb. Gulf Coast gasoline stocks fall to a five-month low. On the face of it, the physical balance is tightening.",
        "Brent trades $82.40 at the print, ticks to $82.65 within twenty minutes, and closes the session at $82.10. The move is noise, not signal. Three weeks of draws and flat price has the desk asking a harder question: is the physical market leading, or is it already priced in?",
        "The crude analyst pulls the forward curve. M1/M2 is in mild backwardation — supportive, but not screaming tightness. Prompt Dubai differentials are firm but unchanged from last week. The physical data is bullish. The price response is not.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "When Inventory Data and Price Diverge",
      paragraphs: [
        "Inventory draws matter — but only when they change the marginal buyer's behaviour or force a repositioning that isn't already in the market. Three mechanisms explain divergence:",
        "**1. Anticipation.** If the market expected draws and was already long, the print confirms rather than surprises. Broker flow after the release shows more profit-taking than new buying.",
        "**2. Offsetting supply.** While US inventories fall, floating storage in the Atlantic Basin has risen 8mb over the same three weeks. The global picture is mixed, not uniformly tight.",
        "**3. Financial overlay.** Managed money net long in ICE Brent remains elevated. The EIA release becomes a liquidity event for funds to lighten — not add — exposure.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "What the Desk Cross-Checked",
      paragraphs: [
        "EIA draw: −4.2mb vs −2.8mb consensus — bullish.",
        "Cushing: −1.1mb — supportive for WTI structure but Brent desk cares about Atlantic balances.",
        "Floating storage (Kpler): +8mb WoW in US Gulf and NW Europe — bearish offset.",
        "Refinery runs: US at 89.2% — high but flat; no run-cut signal yet.",
        "Broker post-EIA flow: 62% of volume was long liquidation in the first hour.",
        "Conclusion: the draw is real locally but not globally decisive. Price action says the market knew.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Hold, Add, or Cut the Long?",
      paragraphs: [
        "The desk holds 1.8mb net long Brent exposure, 75% hedged. Thesis: Atlantic tightness accelerates in Q2 as refinery maintenance ends.",
        "**Revised call:** Physical draws validate the medium-term thesis but do not justify adding at this level. Reduce open exposure by 200kb via paper sales; keep physical cargo programme unchanged.",
        "▸ Sell 200,000 bbl ICE Brent at $82.55 — open exposure down from 450kb to 250kb.",
        "▸ No new physical procurement — wait for either price confirmation above $84 or a fourth draw with simultaneous floating storage draw.",
        "▸ Set alert: if M1/M2 backwardation steepens 40¢+ without flat price moving, reconsider add.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "The Draws Continued. Price Lagged.",
      paragraphs: [
        "**Week 1** — Fourth EIA draw (−3.8mb). Brent range-bound $81.80–$83.10.",
        "**Week 2** — Floating storage begins to draw (−4mb). Dubai diff firms $0.15. Brent breaks $84.",
        "**Week 3** — OPEC commentary reinforces cuts. Brent $85.40. Original thesis plays out — six weeks late on timing.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "Cost of Being Right Too Early",
      paragraphs: [
        "**Physical long (hedged 1.35mb):** +$2.1M as price eventually rose.",
        "**Reduced open exposure (200kb sale @ $82.55):** missed +$2.85/bbl upside = −$0.57M opportunity cost.",
        "**Unhedged 250kb:** +$0.75M on rally from $82 to $85.",
        "**Net vs. holding full open exposure:** +$0.4M better risk-adjusted outcome — avoided drawdown in weeks 1–2 when price dipped to $80.90.",
        "*\"The inventory told the truth. The market's reaction told you when it cared.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Confirmation is not catalyst** — Three draws without price response means the information is in the price.",
        "**Global balance beats single-region data** — US draws plus rising floating storage is a mixed signal.",
        "**Broker flow is real-time truth** — Post-EIA liquidation told the story before the close.",
        "**Thesis and timing are separate** — Right on direction, wrong on entry timing is still expensive.",
      ],
    },
  ]),

  "the-cargo-diversion-window": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "JKM Opens $4.40 Above TTF. The Vessel Is Loading.",
      paragraphs: [
        "09:15 Singapore time. An LNG cargo is mid-load at Atlantic LNG in Trinidad — 3.4 TBTU, originally nominated for Thames Gas Terminal in the UK. Loading is 60% complete. Laycan closes in 18 hours.",
        "An unplanned outage at a major Japanese LNG receiving terminal removes 1.2mtpa of demand for six weeks. JKM spot jumps $1.80/mmbtu overnight. The JKM/TTF spread opens at $4.40/mmbtu — the widest in eleven months.",
        "The commercial analyst runs the numbers on a diversion to Yokohama instead of Thames. The desk has four hours before the nomination window closes.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "The LNG Diversion Calculation",
      paragraphs: [
        "Diversion netback = destination sale price − original sale price − incremental freight − canal fees − demurrage risk − credit/counterparty cost − operational penalties.",
        "JKM premium must exceed rerouting cost **and** the desk must have buyer credit at the new destination. A spread that looks open on paper closes when freight spikes or the buyer cannot take early delivery.",
        "Time constraint: changing destination mid-load requires terminal confirmation, revised ADP, and often a replacement cargo for the original buyer.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "The Arb Worksheet",
      paragraphs: [
        "Original UK netback: NBP equivalent $11.20/mmbtu.",
        "Yokohama netback at current JKM: $15.85/mmbtu.",
        "Gross spread: $4.65/mmbtu × 3.4 TBTU ≈ $15.8M before costs.",
        "Incremental freight (Trinidad→Japan vs Trinidad→UK): +$1.1M.",
        "Canal / routing premium: +$0.4M.",
        "UK buyer replacement cargo cost: +$2.2M.",
        "Net uplift vs original programme: ~$12.1M — arb open.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Divert — With a Hedge",
      paragraphs: [
        "**Decision:** Divert to Yokohama. Secure Japanese utility counterparty with existing master agreement. Buy UK replacement cargo from US Gulf for Thames delivery.",
        "▸ Nomination amended 11:40am — 2h 25m before window close.",
        "▸ Sell 40% of JKM exposure via swap — lock diversion uplift against JKM reversal risk.",
        "▸ Ops team coordinates ADP change with vessel master and both terminals.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "Spread Normalised. Diversion Still Paid.",
      paragraphs: [
        "JKM/TTF spread compresses to $2.10 over the following ten days as replacement supply reaches Japan. The desk's locked swap cost $0.9M but protected against sharper reversal.",
        "UK replacement cargo delivered on time — no demurrage. Original buyer relationship preserved at a premium for flexibility.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "Where the Money Came From",
      paragraphs: [
        "**Location differential capture:** +$12.1M gross.",
        "**Incremental freight & replacement:** −$3.7M.",
        "**JKM hedge (swap):** −$0.9M.",
        "**Net P&L on diversion:** +$7.5M.",
        "**vs. original UK programme:** +$7.5M incremental to desk.",
        "*\"Optionality in the cargo contract is worth more than you think — until the day you need it in four hours.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Destination flexibility is P&L** — FOB seller optionality has measurable value.",
        "**Speed beats precision** — A good decision in 3 hours beats a perfect one in 8.",
        "**Replace the chain** — Diverting without solving the original buyer breaks relationships.",
        "**Hedge the spread, not just flat price** — JKM exposure after diversion is a new risk.",
      ],
    },
  ]),

  "crack-spread-compression": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "Crude Up $6. Products Lag. Crack Collapses.",
      paragraphs: [
        "A geopolitical escalation sends Brent from $78 to $84 in five sessions — a $6/bbl move driven by supply fear. Gasoline and gasoil futures rise $3.20 and $2.80 respectively. The 3-2-1 crack spread compresses from $28/bbl to $14/bbl.",
        "Refinery margin alerts flash across the desk's dashboard. Two European refineries in the desk's network signal run-rate cuts of 5–8% for the coming month.",
        "The crude book is long flat price. The products book is short cracks. The question: is compression complete, or is there another leg?",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "Crack Spreads as a Refinery Signal",
      paragraphs: [
        "The crack spread proxies refinery margin. When crude rises faster than products, refiners face margin squeeze and cut runs — which eventually reduces product supply and can re-widen cracks.",
        "Desks trade cracks independently of flat price: long crude / short products = short crack. Short crude / long products = long crack.",
        "Geopolitical crude spikes often overshoot product demand response — compression is common; the trade is timing the re-widening.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "What Pointed to Further Compression",
      paragraphs: [
        "Forward curve: prompt backwardation in crude but products in mild contango — demand not keeping pace.",
        "US driving data: flat WoW — no demand surge to justify product rally.",
        "Asian export margins: gasoil E/W spread soft — export economics weakening.",
        "Refinery intelligence: 3 European plants confirming maintenance pulls forward.",
        "Desk positioning: consensus long cracks from earlier quarter — crowded.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Add Short Crack Exposure",
      paragraphs: [
        "**Thesis:** Compression continues 2–3 weeks until run cuts bite product supply.",
        "▸ Increase short 3-2-1 crack by 15kbpd equivalent via ICE gasoil and Brent futures.",
        "▸ Reduce naked long crude by 20% — geopolitical premium vulnerable to headline reversal.",
        "▸ Set stop if crack re-widens below $18 on sustained run-cut confirmation.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "Cracks Hit $11 Before Recovery",
      paragraphs: [
        "Crack compresses to $11/bbl over twelve sessions. Refinery run cuts announced at scale. Products eventually rally on supply fears — crack recovers to $22 by month-end.",
        "Desk exits short crack at $13 — before full recovery but after bulk of move.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**Short crack position (15kbpd equiv, 18 days):** +$1.95M.",
        "**Reduced crude long (partial):** −$0.4M missed upside on final $2 rally.",
        "**Net desk outcome:** +$1.55M vs. flat crack position.",
        "*\"Geopolitical events buy crude first. Products follow when refiners bleed.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Crude and products are different trades** — Flat price bullish does not mean crack bullish.",
        "**Refinery response is the mechanism** — Watch run rates, not just headlines.",
        "**Crowding kills** — When everyone is long cracks, compression hurts twice.",
        "**Take profit on spread trades** — Crack recovery can be sharp; don't need the last dollar.",
      ],
    },
  ]),

  "when-the-dollar-spoke-first": extractCase04(),

  "asian-utility-stocks-led-jkm-by-three-weeks": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "Utilities Sell Off. JKM Hasn't Moved Yet.",
      paragraphs: [
        "The cross-asset analyst flags a pattern: Tokyo Electric (9501) and Korea Electric Power (015760) have fallen 12% and 9% over three weeks — capex guidance cuts and lower procurement outlooks in earnings calls.",
        "JKM spot is still $12.40/mmbtu, down only $0.30 from its recent high. The LNG desk is long 8 prompt cargoes worth of exposure.",
        "Hypothesis: equity markets are front-running lower industrial and utility gas demand. JKM will follow.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "Equity as a Leading Indicator for LNG",
      paragraphs: [
        "Northeast Asian utilities are the marginal buyers of spot LNG. When their equity prices fall on reduced earnings guidance, it often reflects anticipated lower fuel procurement — not yet visible in spot gas.",
        "Lag is typically 2–4 weeks: equity → guidance → procurement cuts → spot price.",
        "Cross-asset surveillance is not academic — it compresses reaction time on the LNG desk.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "The Cross-Asset Screen",
      paragraphs: [
        "9501 / KEPCO: −12% / −9% over 21 sessions vs Nikkei −2%.",
        "JKM: −2% over same period — divergence.",
        "Japan power demand data: industrial load −3% YoY.",
        "JKM forward curve: prompt premium eroding in broker quotes.",
        "Desk positioning: peer desks still net long JKM per broker survey.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Cut Long Before Consensus",
      paragraphs: [
        "▸ Reduce JKM long by 60% via swaps at $12.35.",
        "▸ Add small short overlay on TTF-JKM spread narrowing.",
        "▸ Physical cargoes unchanged — contractual; paper adjusted for view.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "JKM Softens Three Weeks Later",
      paragraphs: [
        "JKM falls to $10.80 over the following month. Utility procurement cuts confirmed in trade press. Desk covered short swap at $11.20.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**JKM swap reduction + short overlay:** +$2.1M.",
        "**Physical cargoes (unchanged):** −$0.8M on lower spot into delivery.",
        "**Net vs. unhedged long:** +$1.3M better outcome.",
        "*\"The equity market reads the procurement meeting before the gas market does.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Cross-asset screens belong on commodity desks** — Especially for demand-driven markets like LNG.",
        "**Leading indicators have lags** — Three weeks is normal; patience required after positioning.",
        "**Separate physical from paper** — Can't cancel cargoes; can hedge the view.",
        "**Earnings calls are market data** — Capex and procurement language moves markets.",
      ],
    },
  ]),

  "iron-ore-to-crude-the-chinese-demand-chain": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "Steel Output Falls. Crude Hasn't Noticed.",
      paragraphs: [
        "Chinese steel production falls for the third consecutive month. Dalian iron ore futures down 14% over eight weeks. Crude imports remain robust — Brent holds $83.",
        "The macro analyst on the crude desk builds the chain: steel → construction → diesel demand → crude runs → crude imports.",
        "Historical lag: iron ore weakness leads crude demand softness by 6–8 weeks.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "The Chinese Industrial Demand Chain",
      paragraphs: [
        "China is the largest marginal consumer of crude growth. Industrial activity proxies — steel, cement, copper — lead oil demand indicators.",
        "Iron ore is among the cleanest signals: linked to property and infrastructure, which drive diesel and bitumen consumption.",
        "The trade is not instant — refiners maintain runs until product stocks build.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "Leading Indicators Flashing",
      paragraphs: [
        "Iron ore (Dalian front month): −14% over 8 weeks.",
        "Steel output (NBS): −3.2% MoM third consecutive decline.",
        "China crude imports: still +4% YoY — lagging indicator.",
        "Shandong independent refinery runs: beginning to ease −2%.",
        "IEA demand revision: not yet published — desk ahead of official data.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Reposition Six Weeks Early",
      paragraphs: [
        "▸ Reduce China-exposed crude length by 30% via Brent swaps.",
        "▸ Add put spread on Brent $82/$76 for Q2 — low premium, high convexity.",
        "▸ Monitor Shandong run rates weekly as confirmation trigger.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "IEA Confirms. Price Softens.",
      paragraphs: [
        "Six weeks later IEA cuts China demand growth 180kbpd. Brent drifts to $76. Shandong runs down 8% from peak.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**Brent swap reduction:** +$1.4M.",
        "**Put spread:** +$0.85M.",
        "**Net vs. unchanged long:** +$2.25M.",
        "*\"Iron ore is crude demand with a six-week delay — if you know where to look.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Macro chains are tradable** — Map physical leading indicators to your book.",
        "**Official data lags** — Desk intelligence beats IEA by weeks.",
        "**Independent refiners are the canary** — Shandong teapots adjust before majors.",
        "**Convex hedges for timing uncertainty** — Spreads and options when lag is variable.",
      ],
    },
  ]),

  "vlcc-rate-spike-the-arb-that-almost-wasnt": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "$2.80/bbl Net Margin. Then Freight Moved.",
      paragraphs: [
        "A MEG–China crude arb shows $2.80/bbl net margin after Dubai diff, freight, and port costs. Desk begins fixture process for a VLCC — standard 48–72 hour window to secure vessel.",
        "Saudi Arabia announces unexpected liftings increase. VLCC spot rates in MEG jump from WS 42 to WS 58 in four sessions — 38% rise.",
        "By the time fixture confirmations return, net margin is $0.15/bbl — below desk hurdle. Arb dead.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "Freight as the Arb Gatekeeper",
      paragraphs: [
        "Location arbs are binary: open or closed. Freight is often the swing factor — a $1/bbl arb can disappear with a WS 10 move on a VLCC.",
        "Fixture speed matters: the desk that locked freight yesterday captures margin; today's desk pays the spike.",
        "Seasonal and event-driven freight moves are predictable in direction but not always in timing.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "Warning Signs Missed",
      paragraphs: [
        "Saudi export programme: +400kbpd rumoured in trade press 48h before official guidance.",
        "VLCC prompt list tightening: 3 vessels fixed in MEG in 24h — unusual pace.",
        "Baltic TD3T forward curve: prompt premium building.",
        "Competitor desk: rumoured to have pre-fixed 2 vessels at WS 43.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Pass on the Arb",
      paragraphs: [
        "**Decision:** No fixture at WS 57. Margin insufficient. Alternative: sell Dubai diff into strength rather than arb the cargo.",
        "▸ Lock in differential sale at +$1.85/bbl Dubai vs benchmark — captures part of arb without freight risk.",
        "▸ Flag freight desk to monitor WS 50 as re-entry level.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "Competitor Captured $1.8M",
      paragraphs: [
        "Rival desk that fixed at WS 43 captured full $2.80/bbl on 2mb cargo ≈ $1.8M after costs.",
        "Freight normalises to WS 48 three weeks later — arb reopens but without cargo slot.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**Diff sale (no freight):** +$0.6M.",
        "**Missed full arb:** opportunity cost −$1.2M vs competitor.",
        "**Lesson cost:** process change implemented — freight pre-alert on Saudi export rumours.",
        "*\"The arb isn't the spread. It's the spread minus the vessel you don't have yet.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Fixture speed is edge** — Pre-fixture intelligence and faster approval chains matter.",
        "**Freight moves first** — Watch lists and Baltic forwards before committing cargoes.",
        "**Partial capture beats zero** — Diff sale when full arb closes.",
        "**Someone always got there earlier** — Ask why.",
      ],
    },
  ]),

  "locking-freight-before-the-rate-spike": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "February Fixtures. April Spike.",
      paragraphs: [
        "February: VLCC time charters available at $38,000/day for 6-month terms. Seasonal low — post-Chinese New Year lull. Desk charters three VLCCs for physical programme coverage through Q2.",
        "April: MEG export surge and Atlantic pull tighten prompt tonnage. Spot hits $56,000/day.",
        "Desk holds time charters while market spikes — freight becomes revenue line, not just cost.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "Freight as P&L, Not Just Cost",
      paragraphs: [
        "Time charter = fixed freight cost. When spot exceeds TC rate, charterer can relet at profit or values implicit discount on own cargoes.",
        "Seasonal patterns in VLCC: Q1 lows, Q2/Q3 tightness around OPEC flows and Atlantic draws.",
        "Integrating freight book with commodity book is standard at major houses.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "Why February Was the Window",
      paragraphs: [
        "TD3T seasonal chart: 5-year average shows Feb trough, Apr peak.",
        "OPEC guidance: steady exports Q1, seasonal demand pick-up Q2.",
        "Fleet utilisation: 88% in Feb vs 94% historical April average.",
        "Desk cargo programme: confirmed Q2 liftings needing coverage.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Lock Three TCs in the Low",
      paragraphs: [
        "▸ Fix 3 × VLCC TC @ $38,000/day × 180 days.",
        "▸ Assign two to own cargo programme; keep one flexible for relet.",
        "▸ No spot exposure — all Q2 freight need covered.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "Spot Spikes. Relet Captures Spread.",
      paragraphs: [
        "April spot $56,000/day. Desk relets third vessel at $52,000/day — captures $14,000/day spread vs TC cost for 90 days.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**TC vs spot saving on 2 vessels (own use):** +$1.94M vs April spot fixture equivalent.",
        "**Relet profit (1 vessel):** +$1.26M.",
        "**Total freight P&L contribution:** +$3.2M.",
        "*\"Everyone pays freight. The desk that owns the cheap freight owns the arb.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Seasonality is tradable** — VLCC rates have predictable annual patterns.",
        "**TC is a position** — Not just operations — it's a freight view.",
        "**Relet optionality** — Don't assign every TC to own cargoes if spot can rally.",
        "**Align freight and commodity books** — One P&L, two levers.",
      ],
    },
  ]),

  "australian-lng-train-trip-3-hours-to-position": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "Outage at 9:47am. Position by 12:30pm.",
      paragraphs: [
        "Unplanned trip at a major Australian LNG train removes ~4 cargoes over three weeks from the market. Announcement hits at 9:47am Singapore time.",
        "JKM prompt jumps $0.60/mmbtu in thirty minutes. Atlantic replacement cargoes must be evaluated — US Gulf and Trinidad candidates.",
        "Desk has 3 hours before broker market clears the best replacement slots.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "Supply Disruption Response Protocol",
      paragraphs: [
        "Magnitude: 4 cargoes ≈ 13.6 TBTU — meaningful for prompt Asian balance.",
        "Duration: 3 weeks — affects prompt, not annual contract structure.",
        "Response: long prompt JKM, evaluate short-term diversions from Atlantic, check storage levels at key Asian terminals.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "Real-Time Assessment",
      paragraphs: [
        "Lost production: 4 cargoes × 3.4 TBTU.",
        "Asian storage: Japan/Korea at 72% — not full, can absorb but at premium.",
        "Atlantic FOB netback vs JKM: US Gulf cargo $1.40/mmbtu discount to JKM post-freight.",
        "Vessel availability: 2 prompt slots US→Asia, 1 Trinidad.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Long JKM + Secure One Replacement Cargo",
      paragraphs: [
        "▸ Buy JKM swaps 12 TBTU prompt at $13.10.",
        "▸ Fix US Gulf cargo FOB + freight to Japan — capture Atlantic→Pacific arb.",
        "▸ Sell partial TTF exposure — Asian premium over Europe widens.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "JKM Rallies $1.40 Over Two Weeks",
      paragraphs: [
        "JKM peaks $14.50. Replacement cargo delivers at premium. Spread normalises as Australian train restarts on schedule.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**JKM swaps:** +$1.68M.",
        "**Physical replacement cargo:** +$0.95M.",
        "**TTF hedge:** +$0.32M.",
        "**Total disruption P&L:** +$2.95M.",
        "*\"Supply disruptions reward the desk that has done the work before the outage — vessel lists, buyer contacts, swap lines.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Pre-built playbooks** — Outage response in hours, not days.",
        "**Paper first, physical second** — Swaps for speed; cargoes for basis.",
        "**Atlantic backup** — US Gulf is the swing supplier for Asian shocks.",
        "**Duration matters** — 3-week outage trades prompt, not annual.",
      ],
    },
  ]),

  "the-warm-winter-that-moved-ttf": cs([
    {
      id: "setup",
      label: "01 · The Setup",
      title: "3°C Above Normal for Six Weeks",
      paragraphs: [
        "European temperatures run 3°C above seasonal norm for six consecutive weeks. Heating degree days collapse. TTF holds €38/MWh — desk suspects lag.",
        "Weather workflow integrated with storage data: EU gas storage injection rates rising — bearish.",
        "Desk builds short TTF view 11 days before consensus catches up.",
      ],
    },
    {
      id: "framework",
      label: "02 · The Framework",
      title: "Weather as a Commodity Signal",
      paragraphs: [
        "Gas demand is temperature-elastic. Warm winters reduce heating load 15–25% vs normal — storage fills faster, prompt price softens.",
        "Seasonal deviation must be tracked early: ECMWF 14-day vs 30-year norm.",
        "Combine with LNG send-out and storage — weather alone is insufficient.",
      ],
    },
    {
      id: "signals",
      label: "03 · Market Signals",
      title: "The Weather + Storage Dashboard",
      paragraphs: [
        "HDD deviation: −22% vs 10-year norm.",
        "EU storage: +3.2% WoW fill rate vs seasonal average.",
        "LNG send-out: declining at UK and Dutch terminals.",
        "TTF forward curve: prompt still elevated vs coal-switch economics.",
        "Broker consensus: still neutral — desk contrarian.",
      ],
    },
    {
      id: "decision",
      label: "04 · The Decision",
      title: "Short TTF Prompt",
      paragraphs: [
        "▸ Sell TTF M1 swaps 50 GWh/day equivalent at €38.20.",
        "▸ Add calendar spread short prompt / long Q3 — seasonality unwind.",
        "▸ Stop if HDD normalises 2 weeks consecutive.",
      ],
    },
    {
      id: "outcome",
      label: "05 · What Happened Next",
      title: "TTF Falls 18% Over Four Weeks",
      paragraphs: [
        "Warm weather persists. Storage fills to 92%. TTF M1 €31.20. Analyst houses downgrade Q1 demand.",
      ],
    },
    {
      id: "pl",
      label: "06 · P&L Attribution",
      title: "P&L Breakdown",
      paragraphs: [
        "**TTF M1 short:** +€4.2M equivalent.",
        "**Calendar spread:** +€1.1M.",
        "**Total:** +€5.3M (~$5.7M).",
        "*\"Weather is the most reliable seasonal signal in gas — if you measure deviation early enough.\"*",
      ],
    },
    {
      id: "lessons",
      label: "07 · Key Lessons",
      title: "Four Things This Case Teaches",
      paragraphs: [
        "**Build weather workflows** — HDD deviation dashboards are desk infrastructure.",
        "**Storage confirms weather** — Injection rate validates the signal.",
        "**Consensus lags weather** — 10–14 day edge available.",
        "**Stops on regime change** — Two weeks of normal temps ends the trade.",
      ],
    },
  ]),
};

fs.writeFileSync(
  path.join(ROOT, "src/data/case-studies-details.json"),
  JSON.stringify(DETAILS, null, 2)
);

console.log("Built case studies:", Object.keys(DETAILS).length);
for (const [slug, sections] of Object.entries(DETAILS)) {
  console.log(`  ${slug}: ${sections.length} sections`);
}
