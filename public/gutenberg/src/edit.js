import { __ } from "@wordpress/i18n";
import { Fragment, useEffect, useRef, useState } from "@wordpress/element";
import {
  BlockControls,
  InspectorControls,
  MediaPlaceholder,
  MediaReplaceFlow,
} from "@wordpress/block-editor";
import {
  PanelBody,
  PanelRow,
  SelectControl,
  TextControl,
  ToggleControl,
  ToolbarGroup,
} from "@wordpress/components";

import {
  embedMode as embedModeEnum,
  viewMode,
  exitType,
} from "./optionNames.js";
import AdobeIcon from "./icon.js";

const DEFAULT_EMBED_MODE = embedModeEnum.sizedContainer;

const Edit = (props) => {
  const { className, setAttributes, clientId, isSelected } = props;
  const {
    pdfID,
    pdfURL,
    pdfEmbedAPIClientID,
    adobeAnalyticsReportSuiteID,
    blockID,
    embedMode,
    defaultViewMode,
    exitPDFViewerType,
    showDownloadPDF,
    showPrintPDF,
    dockPageControls,
    showAnnotationTools,
    showFullScreen,
    fullWindowEmbedModeCoversFullScreen,
    height,
    width,
    textFocus,
  } = props.attributes;

  const heightTextRef = useRef(null);
  const widthTextRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isSelected) {
      setIsFocused(false);
    }
  }, [isSelected]);
  
  useEffect(() => {
    if (textFocus === 'width') {  
      widthTextRef.current.focus()
    } else if (textFocus === 'height') {
      heightTextRef.current.focus()
    }
  }, [width, height]);

  useEffect(() => {
    // Get config options from admin settings only once
    if (!blockID) {
      setAttributes({
        pdfEmbedAPIClientID: adminSettings.client_id,
        adobeAnalyticsReportSuiteID: adminSettings?.adobe_analytics,
        blockID: clientId, // clientId is unique to each block
        embedMode: DEFAULT_EMBED_MODE,
        defaultViewMode: adminSettings.initial_page_view,
        exitPDFViewerType: adminSettings.exit_type,
        showDownloadPDF: !!adminSettings.enable_download,
        showPrintPDF: !!adminSettings.enable_print,
        dockPageControls: !!adminSettings.dock_controls,
        showAnnotationTools: !!adminSettings.enable_annotation_tools,
        showFullScreen: !!adminSettings.enable_full_screen,
        fullWindowEmbedModeCoversFullScreen: false,
        height: adminSettings.height,
        width: adminSettings.width,
      });
    }
  }, []);

  useEffect(() => {
    if (pdfID && (embedMode != embedModeEnum.lightbox)) {
      if ( window.AdobeDC ) {
        viewPDF(pdfURL, embedMode);
      } else {
        document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
          if (event.origin !== "https://documentcloud.adobe.com/") {
            return;
          }
          viewPDF(pdfURL, embedMode);          
        });
      }
    }
  }, [
    pdfID,
    pdfURL,
    pdfEmbedAPIClientID,
    adobeAnalyticsReportSuiteID,
    blockID,
    embedMode,
    defaultViewMode,
    exitPDFViewerType,
    showDownloadPDF,
    showPrintPDF,
    dockPageControls,
    showAnnotationTools,
    showFullScreen,
    fullWindowEmbedModeCoversFullScreen,
    height,
    width,
  ]);

  /*
  * Callback function to execute when mutations are observed
  * When moving a block WP removes and reinserts the node in the new position, removing the embedded PDF
  * If the node that has been reinserted is an Adobe PDF Embed API block it will call the API to reload the PDF
  */
  const mutationHandler = mutations => {
    if( mutations[1]?.["addedNodes"]?.[0]?.["childNodes"]?.[0]?.firstChild?.id === blockID ) {
      if ( window.AdobeDC ) {
        viewPDF(pdfURL, embedMode);
      } else {
        document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
          if (event.origin !== "https://documentcloud.adobe.com/") {
            return;
          }
          viewPDF(pdfURL, embedMode);          
        });
      }
    }
  };

  // Select the node that will be observed for mutations
  const targetNode = document.getElementsByClassName("block-editor-block-list__layout");
  // Options for the observer (which mutations to observe)
  const config = {
    childList: true,
  }
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(mutationHandler);
  // Start observing the target node for configured mutations
  if (targetNode[0]) {
    observer.observe(targetNode[0], config);
  }
  observer.disconnect;

  const onSelectPDF = (media) => {
    setAttributes({
      pdfID: media.id,
      pdfURL: media.url,
    });
  };

  // Define embed mode configs and div style (div that contains PDF)
  const embedModeConfigurations = {
    lightbox: {
      viewerConfigOptions: {
        defaultViewMode,
        exitPDFViewerType,
      },
      /**
       * Lightbox doesn't target a div but we still need the div to
       * render (so it's ready to be targeted if embed mode changes).
       */
      divStyle: {
        height: "0px",
        width: "0px",
      },
    },
    inLine: {
      viewerConfigOptions: {},
      divStyle: {
        width,
      },
    },
    fullWindow: {
      viewerConfigOptions: {
        focusOnRendering: false,
        defaultViewMode,
        showAnnotationTools,
      },
      divStyle: {
        fullScreen: {
          position: "fixed",
          width: "100%",
          height: "100%",
          top: "0px",
          left: "0px",
          zIndex: "1000",
          maxWidth: "none",
        },
        inPost: {
          height,
          width,
          maxWidth: "none",
        },
      },
    },
    sizedContainer: {
      viewerConfigOptions: {
        dockPageControls,
        showFullScreen,
      },
      divStyle: {
        height,
        width,
      },
    },
  };

  /**
   * Get mode-specific PDF viewer configuration.
   * @param {('LIGHT_BOX'|'IN_LINE'|'FULL_WINDOW'|'SIZED_CONTAINER')} embedMode
   * @returns PDF viewer (PDF Embed API) configuration object
   */
  const getEmbedModeViewerConfig = (embedMode) => {
    const commonConfigOptions = {
      embedMode,
      showDownloadPDF,
      showPrintPDF,
    };
    let embedModeConfig = {};

    if (embedMode === embedModeEnum.lightbox) {
      embedModeConfig = {
        ...commonConfigOptions,
        ...embedModeConfigurations.lightbox.viewerConfigOptions,
      };
    } else if (embedMode === embedModeEnum.inLine) {
      embedModeConfig = {
        ...commonConfigOptions,
        ...embedModeConfigurations.inLine.viewerConfigOptions,
      };
    } else if (embedMode === embedModeEnum.fullWindow) {
      embedModeConfig = {
        ...commonConfigOptions,
        ...embedModeConfigurations.fullWindow.viewerConfigOptions,
      };
    } else if (embedMode === embedModeEnum.sizedContainer) {
      embedModeConfig = {
        ...commonConfigOptions,
        ...embedModeConfigurations.sizedContainer.viewerConfigOptions,
      };
    }

    return embedModeConfig;
  };

  /**
   * Render PDF viewer in a specified div.
   *
   * The PDF Embed API renders the PDF in a div (for inline embed modes
   * Full Window, Sized Container, and In-Line).
   *
   * Keep each API request tied to one div using the block's unique
   * clientId (also used as the id of the target div), otherwise
   * multiple PDFs will target the same div (and override one another).
   * @param {String} pdfURL URI of PDF to be displayed
   * @param {('IN_LINE'|'FULL_WINDOW'|'SIZED_CONTAINER')} embedMode
   */
  const viewPDF = (pdfURL, embedMode) => {
    const adobeDCView = new AdobeDC.View({
      clientId: pdfEmbedAPIClientID,
      reportSuiteId: adobeAnalyticsReportSuiteID,
      divId: blockID, // div to render PDF in
    });

    const embedModeViewerConfig = getEmbedModeViewerConfig(embedMode);
    callPDFEmbedAPI(adobeDCView, pdfURL, embedModeViewerConfig);
  };

  const onLightboxButtonClick = (pdfURL) => {
    const adobeDCView = new AdobeDC.View({
      clientId: pdfEmbedAPIClientID,
      reportSuiteId: adobeAnalyticsReportSuiteID,
    });

    const lightboxViewerConfig = getEmbedModeViewerConfig(
      embedModeEnum.lightbox
    );

    callPDFEmbedAPI(adobeDCView, pdfURL, lightboxViewerConfig);
  };

  const callPDFEmbedAPI = (adobeDCView, pdfURL, viewerConfig) => {
      adobeDCView.previewFile(
        {
          content: {
            location: {
              url: pdfURL,
            },
          },
          metaData: {
            fileName: pdfURL.split("/").pop(),
          },
        },
        viewerConfig
      );
  };

  const onChangeEmbedMode = (value) => {
    setAttributes({ embedMode: value });
  };
  const onChangeFullWindowEmbedModeCoversFullScreen = (value) => {
    setAttributes({ fullWindowEmbedModeCoversFullScreen: value });
  };
  const onChangeHeight = (value) => {
    setAttributes({ height: value , textFocus: 'height' });
  };
  const onChangeWidth = (value) => {
    setAttributes({ width: value, textFocus: 'width' });
  };
  const onChangeDefaultViewMode = (value) => {
    setAttributes({ defaultViewMode: value });
  };
  const onChangeShowFullScreen = (value) => {
    setAttributes({ showFullScreen: value });
  };
  const onChangeDockPageControls = (value) => {
    setAttributes({ dockPageControls: value });
  };
  const onChangeExitPDFViewerType = (value) => {
    setAttributes({ exitPDFViewerType: value });
  };
  const onChangeShowAnnotationTools = (value) => {
    setAttributes({ showAnnotationTools: value });
  };
  const onChangeShowDownloadPDF = (value) => {
    setAttributes({ showDownloadPDF: value });
  };
  const onChangeShowPrintPDF = (value) => {
    setAttributes({ showPrintPDF: value });
  };

  const showHeightOption =
    embedMode === embedModeEnum.sizedContainer ||
    (embedMode === embedModeEnum.fullWindow &&
      !fullWindowEmbedModeCoversFullScreen);
  const showWidthOption =
    (embedMode === embedModeEnum.sizedContainer) ||
    (embedMode === embedModeEnum.inLine) ||
    (embedMode === embedModeEnum.fullWindow &&
      !fullWindowEmbedModeCoversFullScreen);
  const showDefaultViewOption =
    embedMode === embedModeEnum.lightbox ||
    embedMode === embedModeEnum.fullWindow;

  const DisplayOptions = () => (
    <PanelBody
      title={__("View Settings", "adobe-embedded-pdf-viewer")}
      initialOpen={true}
    >
      <PanelRow>
        <SelectControl
          label={__("Embed mode:", "adobe-embedded-pdf-viewer")}
          help={
            (embedMode === embedModeEnum.lightbox &&
              __(
                "Button that opens the PDF in a modal.",
                "adobe-embedded-pdf-viewer"
              )) ||
            (embedMode === embedModeEnum.inLine &&
              __(
                "Render all PDF pages in a column.",
                "adobe-embedded-pdf-viewer"
              )) ||
            (embedMode === embedModeEnum.fullWindow &&
              __(
                "Scroll through PDF pages in a window.",
                "adobe-embedded-pdf-viewer"
              )) ||
            (embedMode === embedModeEnum.sizedContainer &&
              __(
                "Flip through PDF pages in a container.",
                "adobe-embedded-pdf-viewer"
              ))
          }
          value={embedMode}
          onChange={onChangeEmbedMode}
          options={[
            {
              value: embedModeEnum.lightbox,
              label: __("Lightbox", "adobe-embedded-pdf-viewer"),
            },
            {
              value: embedModeEnum.inLine,
              label: __("In-Line", "adobe-embedded-pdf-viewer"),
            },
            {
              value: embedModeEnum.fullWindow,
              label: __("Full Window", "adobe-embedded-pdf-viewer"),
            },
            {
              value: embedModeEnum.sizedContainer,
              label: __("Sized Container", "adobe-embedded-pdf-viewer"),
            },
          ]}
        />
      </PanelRow>
      {embedMode === embedModeEnum.fullWindow && (
        <PanelRow>
          <ToggleControl
            label={__("Full screen", "adobe-embedded-pdf-viewer")}
            help={
              fullWindowEmbedModeCoversFullScreen
                ? __(
                    "PDF window fills entire screen.",
                    "adobe-embedded-pdf-viewer"
                  )
                : __(
                    "PDF window is embedded in post.",
                    "adobe-embedded-pdf-viewer"
                  )
            }
            checked={fullWindowEmbedModeCoversFullScreen}
            onChange={onChangeFullWindowEmbedModeCoversFullScreen}
          />
        </PanelRow>
      )}
      {showHeightOption && (
        <PanelRow>
          <TextControl
            ref={heightTextRef}
            label={__("Height", "adobe-embedded-pdf-viewer")}
            help={__("eg. 400px", "adobe-embedded-pdf-viewer")}
            value={height}
            onChange={onChangeHeight}
          />
        </PanelRow>
      )}
      {showWidthOption && (
        <PanelRow>
          <TextControl
            ref={widthTextRef}
            label={__("Width", "adobe-embedded-pdf-viewer")}
            help={__("eg. 500px", "adobe-embedded-pdf-viewer")}
            value={width}
            onChange={onChangeWidth}
          />
        </PanelRow>
      )}
      {showDefaultViewOption && (
        <PanelRow>
          <SelectControl
            label={__("Initial Page View:", "adobe-embedded-pdf-viewer")}
            help={
              (defaultViewMode === viewMode.fitPage &&
                __("Fit page height.", "adobe-embedded-pdf-viewer")) ||
              (defaultViewMode === viewMode.fitWidth &&
                __("Fit page width.", "adobe-embedded-pdf-viewer"))
            }
            value={defaultViewMode}
            onChange={onChangeDefaultViewMode}
            options={[
              {
                value: viewMode.fitPage,
                label: __("Fit Page", "adobe-embedded-pdf-viewer"),
              },
              {
                value: viewMode.fitWidth,
                label: __("Fit Width", "adobe-embedded-pdf-viewer"),
              },
            ]}
          />
        </PanelRow>
      )}
      {embedMode === embedModeEnum.sizedContainer && (
        <PanelRow>
          <ToggleControl
            label={__("Enable Full Screen View", "adobe-embedded-pdf-viewer")}
            help={
              showFullScreen
                ? __(
                    "Full Screen View is enabled.",
                    "adobe-embedded-pdf-viewer"
                  )
                : __(
                    "Full Screen View is disabled.",
                    "adobe-embedded-pdf-viewer"
                  )
            }
            checked={showFullScreen}
            onChange={onChangeShowFullScreen}
          />
        </PanelRow>
      )}
    </PanelBody>
  );

  const ControlOptions = () => (
    <PanelBody
      title={__("Control options", "adobe-embedded-pdf-viewer")}
      initialOpen={true}
    >
      {embedMode === embedModeEnum.sizedContainer && (
        <PanelRow>
          <ToggleControl
            label={__("Dock Page Controls", "adobe-embedded-pdf-viewer")}
            help={
              dockPageControls
                ? __(
                    "Page Controls are docked.",
                    "adobe-embedded-pdf-viewer"
                  )
                : __(
                    "Page Controls are floating.",
                    "adobe-embedded-pdf-viewer"
                  )
            }
            checked={dockPageControls}
            onChange={onChangeDockPageControls}
          />
        </PanelRow>
      )}
      {embedMode === embedModeEnum.lightbox && (
        <PanelRow>
          <SelectControl
            label={__("Exit type:", "adobe-embedded-pdf-viewer")}
            help={
              (exitPDFViewerType === exitType.close &&
                __("Close button in top right.", "adobe-embedded-pdf-viewer")) ||
              (exitPDFViewerType === exitType.return &&
                __("Back button in top left.", "adobe-embedded-pdf-viewer"))
            }
            value={exitPDFViewerType}
            onChange={onChangeExitPDFViewerType}
            options={[
              {
                value: exitType.close,
                label: __("Close", "adobe-embedded-pdf-viewer"),
              },
              {
                value: exitType.return,
                label: __("Return", "adobe-embedded-pdf-viewer"),
              },
            ]}
          />
        </PanelRow>
      )}
      {embedMode === embedModeEnum.fullWindow && (
        <PanelRow>
          <ToggleControl
            label={__("Annotation tools", "adobe-embedded-pdf-viewer")}
            help={
              showAnnotationTools
                ? __("Annotation tools are shown.", "adobe-embedded-pdf-viewer")
                : __(
                    "Annotation tools are hidden.",
                    "adobe-embedded-pdf-viewer"
                  )
            }
            checked={showAnnotationTools}
            onChange={onChangeShowAnnotationTools}
          />
        </PanelRow>
      )}
    </PanelBody>
  );

  const ExportOptions = () => (
    <PanelBody
      title={__("Export options", "adobe-embedded-pdf-viewer")}
      initialOpen={true}
    >
      <PanelRow>
        <ToggleControl
          label={__("Enable PDF Download", "adobe-embedded-pdf-viewer")}
          help={
            showDownloadPDF
              ? __("PDF Download is enabled.", "adobe-embedded-pdf-viewer")
              : __("PDF Download is disabled.", "adobe-embedded-pdf-viewer")
          }
          checked={showDownloadPDF}
          onChange={onChangeShowDownloadPDF}
        />
      </PanelRow>
      <PanelRow>
        <ToggleControl
          label={__("Enable Printing PDF", "adobe-embedded-pdf-viewer")}
          help={
            showPrintPDF
              ? __("Printing PDF is enabled.", "adobe-embedded-pdf-viewer")
              : __("Printing PDF is disabled.", "adobe-embedded-pdf-viewer")
          }
          checked={showPrintPDF}
          onChange={onChangeShowPrintPDF}
        />
      </PanelRow>
    </PanelBody>
  );

  const BlockOptionsSideBar = () => (
    <InspectorControls key="settings">
      <DisplayOptions />
      {!(embedMode === embedModeEnum.inLine) && <ControlOptions />}
      <ExportOptions />
    </InspectorControls>
  );

  const ReplacePDFBlockControl = () => (
    <BlockControls>
      <ToolbarGroup>
        <MediaReplaceFlow
          mediaURL={pdfURL}
          onSelect={onSelectPDF}
          accept=".pdf"
          allowedTypes={['application/pdf']}
        >
        </MediaReplaceFlow>
      </ToolbarGroup>
    </BlockControls>
  );

  return (
    <Fragment>
      {pdfID ? (
        <Fragment>
          {pdfID && <ReplacePDFBlockControl />}
          <BlockOptionsSideBar />
          {(embedMode === embedModeEnum.lightbox) ? (
            <div className={className}>
              <div
                className="wp-block-button__link rich-text"
                onClick={() => onLightboxButtonClick(pdfURL)}
              >
                {__("Open PDF", "adobe-embedded-pdf-viewer")}
              </div>
            </div>
          ) : (
            <div className={className}>
              <div
                id={blockID}
                style={
                  (!pdfID && { visibility: "hidden" }) ||
                  (embedMode === embedModeEnum.lightbox &&
                    embedModeConfigurations.lightbox.divStyle) ||
                  (embedMode === embedModeEnum.inLine &&
                    embedModeConfigurations.inLine.divStyle) ||
                  (embedMode === embedModeEnum.fullWindow &&
                    !fullWindowEmbedModeCoversFullScreen &&
                    embedModeConfigurations.fullWindow.divStyle.inPost) ||
                  (embedMode === embedModeEnum.fullWindow &&
                    fullWindowEmbedModeCoversFullScreen &&
                    embedModeConfigurations.fullWindow.divStyle.fullScreen) ||
                  (embedMode === embedModeEnum.sizedContainer &&
                    embedModeConfigurations.sizedContainer.divStyle)
                }
              />
              {!isFocused && (
                <div
                  className="block-library-embed__interactive-overlay"
                  onMouseUp={() => setIsFocused(true)}
                />
              )}
            </div>
          )}
        </Fragment>
      ) : (
        <div className={className}>
          <MediaPlaceholder
            icon={AdobeIcon}
            labels={{
              title: __("Adobe Embedded PDF Viewer", "adobe-embedded-pdf-viewer"),
              instructions: __(
                "Choose a PDF file from your Media Library.",
                "adobe-embedded-pdf-viewer",
              ),
            }}
            onSelect={onSelectPDF}
            onSelectUrl={onSelectPDF}
            accept=".pdf"
            allowedTypes={["application/pdf"]}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Edit;