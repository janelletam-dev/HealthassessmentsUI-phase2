// Your next steps, on FHM: the Corporate Advanced Health Screen
// introduction on its own page. PM, 10 Sep: "remove the next steps section
// from the report page and make it as a separate page (link for this is
// red/amber report -> reviewer notes)".
//
// It wears the partner's own Introduction page: the info-mark banner, the
// content, the video below it, and the sticky bar with Back and Book
// Appointment. Janelle, 11 Sep: "add a header as well the Info icon and
// Introduction as this one is from FHM themselves", "the next or book
// appointment at the bottom sticky pattern should be shown and followed".
//
// NO FRAME. The reference is the partner's screenshot of 11 Sep.

import { FhmShell } from "./fhm-chrome.tsx";
import { NextStepExplainer } from "./fhm-results.tsx";
import { IntroductionTitle, StickyBar, BackLink, PrimaryButton } from "./fhm-booking.tsx";
import { MockVideo } from "./mock-video.tsx";

export function NextStepsPage({ onBack, onBook }: { onBack: () => void; onBook: () => void }) {
  return (
    <FhmShell
      title={<IntroductionTitle />}
      footer={<StickyBar><BackLink label="Back to your results" onClick={onBack} /><PrimaryButton label="Book Appointment" onClick={onBook} /></StickyBar>}
    >
      <NextStepExplainer />
      {/* PM, 10 Sep: a mock video on "Full health assessment recommended and
          next steps page". Below the content: Janelle, 11 Sep, "the contents
          should be this, you could put the video at the bottom". */}
      <MockVideo title="What happens at a Corporate Advanced Health Screen" duration="1 min" />
    </FhmShell>
  );
}
