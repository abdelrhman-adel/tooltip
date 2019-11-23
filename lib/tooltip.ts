import { ITooltip, TooltipConfig } from "./types";
import { defaultCommonConfig } from "./defaults";

export class Tooltip implements ITooltip {
  private config: TooltipConfig;
  private tooltipElement: HTMLElement;
  private hideCallbacks: Map<HTMLElement, (e: MouseEvent) => void> = new Map();
  private timeouts: Map<HTMLElement, number> = new Map();
  constructor(config: TooltipConfig, private isManual?: boolean) {
    if (config.element && config.description) {
      this.prepareConfig(config);
      this.create();
      this.attachHideEvent();
    }
  }

  private prepareConfig(config: TooltipConfig) {
    this.config = {
      ...defaultCommonConfig,
      ...config
    };
    this.config.callbacks = this.config.callbacks || {};
  }
  private create() {
    this.createTooltipElement();
  }

  private createTooltipElement() {
    const { description, placement, additionalClass } = this.config;
    const textNode = document.createTextNode(description);

    const tooltipEl = document.createElement("div");
    tooltipEl.classList.add("tooltip");
    tooltipEl.appendChild(textNode);

    this.tooltipElement = document.createElement("div");
    this.tooltipElement.classList.add(
      "tooltip-container",
      `tooltip-${placement}`,
      additionalClass
    );
    this.tooltipElement.appendChild(tooltipEl);

    this.show();
  }

  private show() {
    this.tooltipElement.style.top = "-999999px";
    this.tooltipElement.style.left = "-999999px";
    document.body.appendChild(this.tooltipElement);
    this.calculateTooltipPosition();
  }

  private calculateTooltipPosition() {
    const {
      top,
      left,
      width,
      height
    } = this.config.element.getBoundingClientRect();
    const {
      height: toolTipHeight
    } = this.tooltipElement.getBoundingClientRect();
    const { scrollX, scrollY } = window;

    this.tooltipElement.style.left = `${scrollX + left + width / 2}px`;
    this.tooltipElement.style.top =
      this.config.placement === "top"
        ? `${scrollY + top - toolTipHeight}px`
        : `${scrollY + top + height}px`;
  }

  private attachHideEvent() {
    const {
      inTrigger,
      outTrigger,
      element,
      canHover,
      hideDelay,
      callbacks: { onHide }
    } = this.config;
    if (!this.isManual) {
      const hideCallbackFn = (el: HTMLElement) => ({
        relatedTarget
      }: MouseEvent) => {
        if (canHover && relatedTarget === this.tooltipElement) {
          return;
        }
        this.setTimeout(
          el,
          () => {
            this.destroy();
            onHide && onHide();
          },
          hideDelay || 0
        );
        if (hideDelay) {
          const clearFn = () => {
            this.clearTimeout();
            el.removeEventListener(inTrigger, clearFn);
          };
          el.addEventListener(inTrigger, clearFn);
        }
      };
      [element, this.tooltipElement].forEach(el => {
        const fn = hideCallbackFn(el);
        this.hideCallbacks.set(el, fn);
        el.addEventListener(outTrigger, fn);
      });
    }
  }
  private setTimeout(el: HTMLElement, fn: () => void, time: number) {
    this.clearTimeout();
    this.timeouts.set(el, window.setTimeout(fn, time));
  }
  private clearTimeout() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }

  public destroy() {
    if (!this.isManual) {
      const { outTrigger } = this.config;
      this.hideCallbacks.forEach((fn, el) =>
        el.removeEventListener(outTrigger, fn)
      );
    }
    document.body.removeChild(this.tooltipElement);
  }
}
