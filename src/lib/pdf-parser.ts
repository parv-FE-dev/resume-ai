export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // pdf-parse@1.1.1 tries to read a test PDF on require() — bypass by importing the lib directly
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse/lib/pdf-parse.js");
  const data = await pdfParse(buffer);
  return data.text;
}
