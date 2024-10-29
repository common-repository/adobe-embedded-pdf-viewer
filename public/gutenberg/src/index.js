import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import {
  embedMode as embedModeEnum,
  viewMode,
  exitType,
} from "./optionNames.js";
import AdobeIcon from "./icon.js";
import Edit from "./edit.js";
import Save from "./save.js";

registerBlockType("pdf-embed-plugin-for-wp/embedded-pdf", {
  title: __("Adobe Embedded PDF Viewer", "adobe-embedded-pdf-viewer"),
  icon: AdobeIcon,
  category: "embed",

  attributes: {
    pdfID: {
      type: "number",
    },
    pdfURL: {
      type: "string",
    },
    pdfEmbedAPIClientID: {
      type: "string",
    },
    adobeAnalyticsReportSuiteID: {
      type: "string",
    },
    blockID: {
      type: "string",
      default: "",
    },
    embedMode: {
      enum: [
        embedModeEnum.lightbox,
        embedModeEnum.fullWindow,
        embedModeEnum.sizedContainer,
        embedModeEnum.inLine,
      ],
      default: embedModeEnum.lightbox,
    },
    defaultViewMode: {
      enum: [viewMode.fitPage, viewMode.fitWidth],
      default: viewMode.fitPage,
    },
    exitPDFViewerType: {
      enum: [exitType.close, exitType.return],
      default: exitType.close,
    },
    showDownloadPDF: {
      type: "boolean",
      default: true,
    },
    showPrintPDF: {
      type: "boolean",
      default: true,
    },
    dockPageControls: {
      type: "boolean",
      default: false,
    },
    showAnnotationTools: {
      type: "boolean",
      default: true,
    },
    showFullScreen: {
      type: "boolean",
      default: true,
    },
    fullWindowEmbedModeCoversFullScreen: {
      type: "boolean",
      default: false,
    },
    height: {
      type: "string",
      default: "400px",
    },
    width: {
      type: "string",
      default: "500px",
    },
  },

  edit: (props) => Edit(props),
  save: (props) => Save(props),
});