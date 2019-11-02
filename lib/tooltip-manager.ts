import { ITooltipManager, TooltipGlobalConfig } from "./types";
import { Tooltip } from "./tooltip";
import { defaultConfig } from "./defaults";

export class TooltipManager implements ITooltipManager {
  private config: TooltipGlobalConfig;
  private tooltipsMap: Map<HTMLElement, Tooltip> = new Map();
  private openCallback: (e: MouseEvent) => void;
  constructor(config?: Partial<TooltipGlobalConfig>) {
    this.prepareConfig(config || {});
    this.init();
  }
  private prepareConfig(config: Partial<TooltipGlobalConfig>) {
    this.config = {
      ...defaultConfig,
      ...config
    };
  }
  private init() {
    this.attachOpenEvents();
  }

  private attachOpenEvents() {
    const {
      inTrigger,
      selectors,
      descriptionAttr,
      openDelay,
      ...tooltipCommonConfig
    } = this.config;
    this.openCallback = (e: MouseEvent) => {
      const element = this.generateMatchingElements(selectors).find(
        el => el === e.target
      );
      if (element && !this.tooltipsMap.has(element)) {
        const description = element.getAttribute(descriptionAttr);
        if (description) {
        }
        this.tooltipsMap.set(
          element,
          new Tooltip({
            element,
            description,
            ...tooltipCommonConfig,
            callbacks: { onHide: this.onHide(element) }
          })
        );
      }
    };

    window.addEventListener(this.getInTrigger(), this.openCallback);
  }

  private generateMatchingElements(
    selectors: string | string[]
  ): HTMLElement[] {
    return (Array.isArray(selectors) ? selectors : [selectors]).reduce(
      (arr, selector) => arr.concat([...document.querySelectorAll(selector)]),
      []
    );
  }
  private onHide(element: HTMLElement): () => void {
    return () => {
      this.tooltipsMap.delete(element);
    };
  }

  private getInTrigger(): string {
    const { inTrigger } = this.config;
    return inTrigger === "mouseenter" ? "mousemove" : inTrigger;
  }

  public destroy() {
    [...this.tooltipsMap.values()].forEach(tooltip => tooltip.destroy());
    this.tooltipsMap.clear();
    window.removeEventListener(this.getInTrigger(), this.openCallback);
  }
}
