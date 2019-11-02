export type InTrigger = "mouseenter" | "click";
export type OutTrigger = "mouseleave" | "click";

export interface config {
  // tooltip placement either on top or bottom of element
  placement: "top" | "bottom";
  outTrigger: OutTrigger;

  hideDelay: number;

  canHover: boolean;

  additionalClass: string;
}
export interface TooltipGlobalConfig extends config {
  selectors: string | string[];
  descriptionAttr: string;
  inTrigger: InTrigger;
  openDelay: number;
}

export interface TooltipConfig extends config {
  element: HTMLElement;
  description: string;
  callbacks: TooltipCallbacks;
}

export interface TooltipCallbacks {
  onHide: () => void;
}

export interface ITooltip {
  destroy: () => void;
}
export interface ITooltipManager {
  destroy: () => void;
}
