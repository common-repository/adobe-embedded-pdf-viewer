import { __ } from "@wordpress/i18n";

const Save = (props) => {
  const { className } = props;
  const {
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
  } = props.attributes;

  /**
   * Return div, even if no PDF URL is provided
   * onclick and onload are added as a string for WP to be able to add it to the html element
   */
  return (
    <div className={className}>
      {pdfURL && embedMode === "LIGHT_BOX" && (
        <button
          class="wp-block-button__link rich-text"
          onclick={`new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', reportSuiteId: '${
            adobeAnalyticsReportSuiteID || false
          }' })
            .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
              embedMode: '${embedMode}',
              defaultViewMode: '${defaultViewMode}',
              exitPDFViewerType: '${exitPDFViewerType}',
              showDownloadPDF: ${showDownloadPDF},
              showPrintPDF: ${showPrintPDF},
            });`}
        >
          {__("Open PDF", "adobe-embedded-pdf-viewer")}
        </button>
      )}
      {pdfURL &&
        embedMode === "FULL_WINDOW" &&
        !fullWindowEmbedModeCoversFullScreen && (
          <div id={blockID} style={{ height, width }}>
            <iframe
              onload={`if( window.AdobeDC ) {
                new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: '${blockID}', reportSuiteId: '${
                  adobeAnalyticsReportSuiteID || false
                }' })
                .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                  embedMode: '${embedMode}',
                  defaultViewMode: '${defaultViewMode}',
                  showDownloadPDF: ${showDownloadPDF},
                  showPrintPDF: ${showPrintPDF},
                  showAnnotationTools: ${showAnnotationTools},
                });
              } else {
                document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
                  if (event.window !== document.parent || event?.origin && event.origin !== 'https://documentcloud.adobe.com/') {
                    return;
                  }
                  new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: '${blockID}', reportSuiteId: '${
                    adobeAnalyticsReportSuiteID || false
                  }' })
                  .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                    embedMode: '${embedMode}',
                    defaultViewMode: '${defaultViewMode}',
                    showDownloadPDF: ${showDownloadPDF},
                    showPrintPDF: ${showPrintPDF},
                    showAnnotationTools: ${showAnnotationTools},
                  });
                });
              }`}
            />
          </div>
        )}
      {pdfURL &&
        embedMode === "FULL_WINDOW" &&
        fullWindowEmbedModeCoversFullScreen && (
          <div
            id="full-window-pdf"
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              top: "0px",
              left: "0px",
              zIndex: "999999",
            }}
          >
            <iframe
              onload={`if( window.AdobeDC ) {
                  new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: 'full-window-pdf', reportSuiteId: '${
                    adobeAnalyticsReportSuiteID || false
                  }' })
                  .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                    embedMode: '${embedMode}',
                    defaultViewMode: '${defaultViewMode}',
                    showDownloadPDF: ${showDownloadPDF},
                    showPrintPDF: ${showPrintPDF},
                    showAnnotationTools: ${showAnnotationTools},
                  });
                } else {
                  document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
                    if (event.window !== document.parent || event?.origin && event.origin !== 'https://documentcloud.adobe.com/') {
                      return;
                    }
                    new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: 'full-window-pdf', reportSuiteId: '${
                      adobeAnalyticsReportSuiteID || false
                    }' })
                    .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                      embedMode: '${embedMode}',
                      defaultViewMode: '${defaultViewMode}',
                      showDownloadPDF: ${showDownloadPDF},
                      showPrintPDF: ${showPrintPDF},
                      showAnnotationTools: ${showAnnotationTools},
                    });
                  });
                }`}
          />
          </div>
        )}
      {pdfURL && embedMode === "IN_LINE" && (
        <div id={blockID} style={{ width }}>
          <iframe
            onload={`if( window.AdobeDC ) {
                new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: '${blockID}', reportSuiteId: '${
                  adobeAnalyticsReportSuiteID || false
                }' })
                .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                  embedMode: '${embedMode}',
                  showDownloadPDF: ${showDownloadPDF},
                  showPrintPDF: ${showPrintPDF},
                });
              } else {
                document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
                  if (event.window !== document.parent || event?.origin && event.origin !== 'https://documentcloud.adobe.com/') {
                    return;
                  }
                  new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: '${blockID}', reportSuiteId: '${
                    adobeAnalyticsReportSuiteID || false
                  }' })
                    .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                      embedMode: '${embedMode}',
                      showDownloadPDF: ${showDownloadPDF},
                      showPrintPDF: ${showPrintPDF},
                    });
                  });
                }`}
          />
        </div>
      )}
      {pdfURL && embedMode === "SIZED_CONTAINER" && (
        <div id={blockID} style={{ height, width }}>
          <iframe
            onload={`if( window.AdobeDC ) {
              new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: '${blockID}', reportSuiteId: '${
                adobeAnalyticsReportSuiteID || false
              }' })
              .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                embedMode: '${embedMode}',
                showDownloadPDF: ${showDownloadPDF},
                showPrintPDF: ${showPrintPDF},
                dockPageControls: ${dockPageControls},
                showFullScreen: ${showFullScreen},
              });
            } else {
              document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
                if (event.window !== document.parent || event?.origin && event.origin !== 'https://documentcloud.adobe.com/') {
                  return;
                }
                new AdobeDC.View({ clientId: '${pdfEmbedAPIClientID}', divId: '${blockID}', reportSuiteId: '${
                  adobeAnalyticsReportSuiteID || false
                }' })
                .previewFile({ content: { location: { url: '${pdfURL}' } }, metaData: { fileName: '${pdfURL}'.split("/").pop() } }, {
                  embedMode: '${embedMode}',
                  showDownloadPDF: ${showDownloadPDF},
                  showPrintPDF: ${showPrintPDF},
                  dockPageControls: ${dockPageControls},
                  showFullScreen: ${showFullScreen},
                });
              });
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Save;