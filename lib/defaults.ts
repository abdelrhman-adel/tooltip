import { TooltipGlobalConfig } from "./types";

export const defaultConfig: TooltipGlobalConfig = {
  selectors: "[has-tooltip]",
  descriptionAttr: "tooltip-content",
  inTrigger: "mouseenter",
  outTrigger: "mouseleave",
  openDelay: 0,
  hideDelay: 0,
  placement: "top",
  canHover: false,
  additionalClass: ""
};
