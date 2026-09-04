// Every screen change starts at the top.
//
// Phase changes swap the whole screen but the window keeps its scroll, so a
// new screen could open wherever the last one was left. Janelle, 4 Sep: "can
// you set the view so that the scroll is always at the top? when we change
// screens?". One hook, keyed on whatever a component considers its screen:
// the app's phase, a flow's step, a portal tab.

import { useEffect } from "react";

export function useScrollTop(...screenKeys: unknown[]) {
  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, screenKeys);
}
