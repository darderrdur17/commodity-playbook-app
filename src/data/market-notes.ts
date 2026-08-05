export interface MarketNoteTopic {
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  title: string;
}

/** Career track + /starter-pack market note strip */
export const CAREER_MARKET_NOTE = {
  eyebrow: "Live · Every Monday",
  title: "The Market Note the Desk Actually Reads.",
  description:
    "Not a news digest. Each note covers one or two markets — an inventory signal, a freight move, a spread divergence — and tells you what it means commercially.",
  topics: [
    { title: "Crude Oil · EIA Inventory" },
    { title: "LNG · JKM / TTF Spread" },
    { title: "Freight · VLCC Rates" },
  ] satisfies MarketNoteTopic[],
};

/** Sales track market note strip */
export const SALES_MARKET_NOTE = {
  eyebrow: "Live · Every Tuesday Edition",
  title: "The Market Note on the Sales Edge.",
  description:
    "Not a news digest. Use it in your next conversation with your customer — and relate the context with them easier.",
  topics: [
    { tag: "Crude Oil", tagColor: "#2563eb", tagBg: "#dbeafe", title: "OPEC+ cut → Budget mood at major firms" },
    { tag: "Freight", tagColor: "#b45309", tagBg: "#fef3c7", title: "VLCC Rate Spike → Maritime tech opportunity window" },
    { tag: "LNG", tagColor: "#15803d", tagBg: "#dcfce7", title: "JKM/TTF Spread → What Asian desk buyers are weighing" },
    { tag: "Gas", tagColor: "#7c3aed", tagBg: "#ede9fe", title: "European Storage → Energy sector account timing" },
  ] satisfies MarketNoteTopic[],
};
