// The two sample reports are fixed PDFs with the partner's own dates printed
// on the cover, the summary and every footer. Before they are shown, those
// spans are painted over and redrawn with the story's dates, so a demo months
// from now still reads as today. Janelle, 12 Sep: "the people in the company
// check a lot", so the reports follow the dates too.
//
// The spans and their boxes were read off the files once (PyMuPDF, 12 Sep):
// the same box on every page for the footer, one each for the cover and the
// summary. LiberationSans is metric-compatible with Helvetica, so the redraw
// sits where the original did.
//
// NO FRAME: dates and labels the partner's report already prints.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ReportKind = "prescreen" | "advanced";
export type ReportDates = { reportDate: string; assessmentDate: string };

type Span = { pages: "cover" | "summary" | "footers"; box: [number, number, number, number]; size: number; bold?: boolean; black?: boolean; label: string; which: keyof ReportDates };

// Boxes are PyMuPDF's: origin top-left, [x0, y0, x1, y1] in points.
const SPANS: Record<ReportKind, Span[]> = {
  prescreen: [
    { pages: "cover", box: [391.2, 786.3, 467.0, 797.2], size: 9.7, bold: true, black: true, label: "Date: ", which: "reportDate" },
    { pages: "summary", box: [308.1, 174.8, 386.5, 185.1], size: 10.2, label: "Date: ", which: "reportDate" },
    { pages: "footers", box: [463.9, 817.7, 559.1, 825.8], size: 7.2, label: "Assessment date: ", which: "assessmentDate" },
  ],
  advanced: [
    { pages: "cover", box: [391.2, 786.3, 467.0, 797.2], size: 9.7, bold: true, black: true, label: "Date: ", which: "reportDate" },
    { pages: "summary", box: [340.8, 204.1, 419.2, 214.3], size: 10.2, label: "Date: ", which: "reportDate" },
    { pages: "footers", box: [463.9, 807.2, 559.1, 815.3], size: 7.2, label: "Assessment date: ", which: "assessmentDate" },
  ],
};

const GREY = rgb(0x37 / 255, 0x41 / 255, 0x51 / 255);

export async function patchReport(bytes: Uint8Array, kind: ReportKind, dates: ReportDates): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  // The viewer's toolbar shows the title, not the object URL's id.
  doc.setTitle(kind === "prescreen" ? "Health Insights Assessment Report" : "Advanced Health Screen Report");
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();
  for (const span of SPANS[kind]) {
    const targets = span.pages === "cover" ? [pages[0]] : span.pages === "summary" ? [pages[1]] : pages.slice(1);
    const text = span.label + dates[span.which];
    const font = span.bold ? bold : regular;
    for (const page of targets) {
      const h = page.getHeight();
      const [x0, y0, x1, y1] = span.box;
      page.drawRectangle({ x: x0 - 2, y: h - y1 - 1, width: x1 - x0 + 6, height: y1 - y0 + 2, color: rgb(1, 1, 1) });
      page.drawText(text, { x: x0, y: h - y1 + span.size * 0.21, size: span.size, font, color: span.black ? rgb(0, 0, 0) : GREY });
    }
  }
  return doc.save();
}
