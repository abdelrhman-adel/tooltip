import { ITooltipManager, TooltipConfig, TooltipGlobalConfig } from "./types";
import { Tooltip } from "./tooltip";
import { defaultGlobalConfig } from "./defaults";

export class TooltipManager implements ITooltipManager {
  private config: TooltipGlobalConfig;
  private tooltipsMap: Map<HTMLElement, Tooltip> = new Map();
  private pendingElements: Set<HTMLElement> = new Set();
  private openCallback: (e: MouseEvent) => void;
  constructor(config?: Partial<TooltipGlobalConfig>) {
    this.prepareConfig(config || {});
    this.init();
  }
  private prepareConfig(config: Partial<TooltipGlobalConfig>) {
    this.config = {
      ...defaultGlobalConfig,
      ...config
    };
  }
  private init() {
    this.attachOpenEvents();
  }

  private attachOpenEvents() {
    const {
      selectors,
      descriptionAttr,
      openDelay,
      ...tooltipCommonConfig
    } = this.config;
    const { outTrigger} = tooltipCommonConfig;
    this.openCallback = (e: MouseEvent) => {
      const element = this.generateMatchingElements(selectors).find(
        el => el === e.target
      );
      const description = element && element.getAttribute(descriptionAttr);
      if (
        element &&
        !this.pendingElements.has(element) &&
        !this.tooltipsMap.has(element) &&
        description
      ) {
        this.pendingElements.add(element);
        const timeout = setTimeout(() => {
          this.tooltipsMap.set(
            element,
            new Tooltip({
              element,
              description,
              ...tooltipCommonConfig,
              callbacks: { onHide: this.onHide(element) }
            })
          );
          this.pendingElements.delete(element);
        }, openDelay || 0);
        if (openDelay) {
          const clearFn = () => {
            clearTimeout(timeout);
            this.pendingElements.delete(element);
            element.removeEventListener(outTrigger, clearFn);
          };
          element.addEventListener(outTrigger, clearFn);
        }
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

  public show(config: TooltipConfig): HTMLElement {
    const { element, description } = config;
    if (element && description && !this.tooltipsMap.has(element)) {
      this.tooltipsMap.set(element, new Tooltip(config, true));
    }
    return element;
  }

  public hide(element: HTMLElement): void {
    const tooltip: Tooltip = this.tooltipsMap.get(element);
    if (tooltip) {
      tooltip.destroy();
      this.tooltipsMap.delete(element);
    }
  }

  public destroy(): void {
    [...this.tooltipsMap.values()].forEach(tooltip => tooltip.destroy());
    this.tooltipsMap.clear();
    window.removeEventListener(this.getInTrigger(), this.openCallback);
  }
}
