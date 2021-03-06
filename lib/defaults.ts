import { CommonConfig, TooltipGlobalConfig } from "./types";

export const defaultCommonConfig: CommonConfig = {
  inTrigger: "mouseenter",
  outTrigger: "mouseleave",
  placement: "top",
  canHover: false,
  additionalClass: ""
};
export const defaultGlobalConfig: TooltipGlobalConfig = {
  ...defaultCommonConfig,
  selectors: "[has-tooltip]",
  descriptionAttr: "tooltip-content",
};
