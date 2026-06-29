/** Minimal valid PDF with a title line — used for seed placeholders until real files are uploaded. */
export function createPlaceholderPdf(title: string): Buffer {
  const safeTitle = title.replace(/[()\\]/g, " ").slice(0, 120);
  const content = `BT /F1 14 Tf 72 720 Td (${safeTitle}) Tj ET`;
  const objects = [
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
    "3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj",
    `4 0 obj<</Length ${content.length}>>stream\n${content}\nendstream\nendobj`,
    "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj",
  ];

  let body = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(body.length);
    body += obj + "\n";
  }

  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(body, "utf8");
}
