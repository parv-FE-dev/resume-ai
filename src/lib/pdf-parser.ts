export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // pdf-parse@1.1.1 uses a default export
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}
