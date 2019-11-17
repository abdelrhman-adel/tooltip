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
    console.log("created", this.config);
  }

  private createTooltipElement() {
    this.tooltipElement = document.createElement("div");
    this.tooltipElement.classList.add(
      "tooltip",
      `tooltip--${this.config.placement}`
    );
    this.tooltipElement.appendChild(
      document.createTextNode(this.config.description)
    );
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
      callbacks: { onHide }
    } = this.config;
    if (!this.isManual) {
      this.hideCallback = () => {
        this.destroy();
        onHide && onHide();
      };
      element.addEventListener(outTrigger, this.hideCallback);
    }
  }

  public destroy() {
    document.body.removeChild(this.tooltipElement);
    if (!this.isManual) {
      const { outTrigger, element } = this.config;
      element.removeEventListener(outTrigger, this.hideCallback);
    }
    console.log("destroyed", this.config);
  }
}
