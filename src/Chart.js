import { select } from "d3";
import { get } from "native-dash";
import { useFont } from "./utils/useFont";

export class Chart {
  constructor(opts) {
    this.el = opts.element;
    this.element = opts.element;
    this.title = opts.title;
    this.titleFontSize = opts.titleFontSize;
    this.font = get(opts, "font", 0);
    this.fillStyle = opts.fillStyle;
    this.tooltipFontSize = get(opts, "tooltipFontSize", "0.95rem");
    this.bowing = get(opts, "bowing", 0);
    this.simplification = get(opts, "simplification", 0.2);
    this.interactive = opts.interactive !== false;
    this.dataFormat = typeof opts.data === "object" ? "object" : "file";
  }

  setSvg() {
    this.svg = select(this.el)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("id", this.roughId)
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  resolveFont() {
    if (
      this.font === 0 ||
      this.font === undefined ||
      this.font.toString().toLowerCase() === "gaegu"
    ) {
      useFont("Gaegu");
      this.fontFamily = "Gaegu";
    } else if (this.font === 1 || this.font.toString().toLowerCase() === "indie flower") {
      useFont("Indie Flower");
      this.fontFamily = "Indie Flower";
    } else {
      this.fontFamily = this.font;
    }
  }
}
