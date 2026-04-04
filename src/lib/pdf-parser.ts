export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid build-time issues with canvas dependencies
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdf = require("pdf-parse") as (
    buffer: Buffer
  ) => Promise<{ text: string }>;
  const data = await pdf(buffer);
  return data.text;
}
