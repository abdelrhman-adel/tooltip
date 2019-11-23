import { ITooltip, TooltipConfig } from "./types";
import { defaultCommonConfig } from "./defaults";

export class Tooltip implements ITooltip {
  private config: TooltipConfig;
  private tooltipElement: HTMLElement;
  private hideCallback: (e: MouseEvent) => void;
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
    const textNode = document.createTextNode(this.config.description);

    const tooltipEl = document.createElement("div");
    tooltipEl.classList.add("tooltip");
    tooltipEl.appendChild(textNode);

    this.tooltipElement = document.createElement("div");
    this.tooltipElement.classList.add(
      "tooltip-container",
      `tooltip-${this.config.placement}`
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
      outTrigger,
      element,
        canHover,
      callbacks: { onHide }
    } = this.config;
    if (!this.isManual) {
      this.hideCallback = ({relatedTarget }: MouseEvent) => {
        if(canHover && relatedTarget === this.tooltipElement){
          return;
        }
        this.destroy();
        onHide && onHide();
      };
      [element, this.tooltipElement].forEach(el =>
        el.addEventListener(outTrigger, this.hideCallback)
      );
    }
  }

  public destroy() {
    if (!this.isManual) {
      const { outTrigger, element } = this.config;
      [element, this.tooltipElement].forEach(el =>
        el.removeEventListener(outTrigger, this.hideCallback)
      );
    }
    document.body.removeChild(this.tooltipElement);
  }
}
