export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    const { extractTextFromPDF } = await import("@/lib/pdf-parser");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromPDF(buffer);

    if (!text.trim()) {
      return Response.json(
        { error: "Could not extract text from PDF. The file may be image-based." },
        { status: 422 }
      );
    }

    return Response.json({ text });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return Response.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
