import { ITooltip, TooltipConfig } from "./types";
import { defaultCommonConfig } from "./defaults";

export class Tooltip implements ITooltip {
  private config: TooltipConfig;
  private tooltipElement: HTMLElement;
  private hideCallback: (e: MouseEvent) => void;
  constructor(config: TooltipConfig) {
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
    this.tooltipElement.classList.add("tooltip");
    this.tooltipElement.appendChild(
      document.createTextNode(this.config.description)
    );
    document.body.appendChild(this.tooltipElement);
  }

  private attachHideEvent() {
    const {
      outTrigger,
      element,
      callbacks: { onHide }
    } = this.config;
    this.hideCallback = () => {
      this.destroy();
      onHide && onHide();
    };
    element.addEventListener(outTrigger, this.hideCallback);
  }

  public destroy() {
    const { outTrigger, element } = this.config;
    document.body.removeChild(this.tooltipElement);
    element.removeEventListener(outTrigger, this.hideCallback);
    console.log("destroyed", this.config);
  }
}
