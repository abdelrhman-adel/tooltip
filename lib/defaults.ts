import { CommonConfig, TooltipGlobalConfig } from "./types";

export const defaultCommonConfig: CommonConfig = {
  outTrigger: "mouseleave",
  openDelay: 0,
  hideDelay: 0,
  placement: "top",
  canHover: false,
  additionalClass: ""
};
export const defaultGlobalConfig: TooltipGlobalConfig = {
  ...defaultCommonConfig,
  selectors: "[has-tooltip]",
  descriptionAttr: "tooltip-content",
  inTrigger: "mouseenter"
};
