export type InTrigger = "mouseenter" | "click";
export type OutTrigger = "mouseleave" | "click";

export interface CommonConfig {
  // tooltip placement either on top or bottom of element
  placement?: "top" | "bottom";
  outTrigger?: OutTrigger;
  openDelay?: number;
  hideDelay?: number;
  canHover?: boolean;
  additionalClass?: string;
}
export interface TooltipGlobalConfig extends CommonConfig {
  selectors: string | string[];
  descriptionAttr: string;
  inTrigger: InTrigger;
}

export interface TooltipConfig extends CommonConfig {
  element: HTMLElement;
  description: string;
  callbacks?: TooltipCallbacks;
}

export interface TooltipCallbacks {
  onHide?: () => void;
}

export interface ITooltip {
  destroy: () => void;
}
export interface ITooltipManager {
  show: (config: TooltipConfig) => HTMLElement;
  hide: (element: HTMLElement) => void;
  destroy: () => void;
}
