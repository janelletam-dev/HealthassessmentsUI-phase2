// The reports, dated for today, as object URLs for the viewers. Patched once
// per kind and kept for the session.

import { useEffect, useState } from "react";
import prescreenUrl from "../assets/portal/health-insights-pre-screen-report.pdf";
import advancedUrl from "../assets/portal/advanced-health-assessment-report.pdf";
import { patchReport, type ReportKind } from "./dated-report-core.ts";
export type { ReportKind } from "./dated-report-core.ts";
import { SUBMITTED, APPOINTMENT, ADVANCED_REPORT, dmy } from "./demo-dates.ts";

const cache: Partial<Record<ReportKind, Promise<string>>> = {};

export function datedReportUrl(kind: ReportKind): Promise<string> {
  cache[kind] ??= (async () => {
    const bytes = new Uint8Array(await (await fetch(kind === "prescreen" ? prescreenUrl : advancedUrl)).arrayBuffer());
    const dates = kind === "prescreen"
      ? { reportDate: dmy(SUBMITTED), assessmentDate: dmy(SUBMITTED) }
      : { reportDate: dmy(ADVANCED_REPORT), assessmentDate: dmy(APPOINTMENT) };
    const patched = await patchReport(bytes, kind, dates);
    return URL.createObjectURL(new Blob([new Uint8Array(patched).buffer as ArrayBuffer], { type: "application/pdf" }));
  })();
  return cache[kind]!;
}

export function useDatedReport(kind: ReportKind): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);
  useEffect(() => { let live = true; datedReportUrl(kind).then((u) => { if (live) setUrl(u); }); return () => { live = false; }; }, [kind]);
  return url;
}
