import { TooltipManager } from "../lib";

const manager = new TooltipManager({openDelay: 1000});

// manually display a tooltip
let manualTooltip: HTMLElement;
document.querySelector("[toggle-tooltip]").addEventListener("click", () => {
  if (manualTooltip) {
    manager.hide(manualTooltip);
    manualTooltip = undefined;
  } else {
    manualTooltip = manager.show({
      element: document.querySelector("[with-manual-tooltip]"),
      description: "manual tooltip"
    });
  }
});
