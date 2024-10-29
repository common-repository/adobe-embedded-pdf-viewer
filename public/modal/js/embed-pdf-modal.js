/**
 * Apply options from anchor tag data-* attributes to the PDF viewer
 * config, overriding defaults set in the admin settings panel.
 * @param {Object}       config         PDF viewer configuration.
 * @param {DOMStringMap} dataAttributes PDF link anchor tag attributes.
 */
function applyDataAttributesToViewerConfig(config, dataAttributes) {
  if (dataAttributes?.fit === "horizontal") {
    config.defaultViewMode = "FIT_WIDTH";
  } else if (dataAttributes?.fit === "vertical") {
    config.defaultViewMode = "FIT_PAGE";
  }

  if (dataAttributes?.exitType === "close") {
    config.exitPDFViewerType = "CLOSE";
  } else if (dataAttributes?.exitType === "return") {
    config.exitPDFViewerType = "RETURN";
  }

  if (dataAttributes?.downloadButton === "show") {
    config.showDownloadPDF = true;
  } else if (dataAttributes?.downloadButton === "hide") {
    config.showDownloadPDF = false;
  }

  if (dataAttributes?.printButton === "show") {
    config.showPrintPDF = true;
  } else if (dataAttributes?.printButton === "hide") {
    config.showPrintPDF = false;
  }

  if (dataAttributes?.dockControls === "dock") {
    config.dockPageControls = true;
  } else if (dataAttributes?.dockControls === "undock") {
    config.dockPageControls = false;
  }
}

/**
 * Create object used to configure the PDF modal's UI.
 * @param {Object} link Anchor tag object; may include data attributes.
 * @returns Configuration object for PDF modal.
 */
function getPDFModalConfiguration(link) {
  // Get defaults from admin settings
  const viewerConfig = {
    embedMode: "LIGHT_BOX",
    defaultViewMode: adminSettings.initial_page_view,
    exitPDFViewerType: adminSettings.exit_type,
    showDownloadPDF: !!adminSettings.enable_download,
    showPrintPDF: !!adminSettings.enable_print,
  };

  // Override defaults with data attributes
  applyDataAttributesToViewerConfig(viewerConfig, link.dataset);

  return viewerConfig;
}

/**
 * If file name is set in a data attribute, get this name. Otherwise,
 * parse name from PDF's URI.
 * @param {Object} link Anchor tag object; may include data attributes.
 * @returns String to be used as PDF file name.
 */
function getFileName(link) {
  return link.dataset.fileName
    ? (fileName = link.dataset.fileName)
    : (fileName = link["data-pdf-url"].split("/").pop());
}

/**
 * Display a PDF modal using the Adobe PDF Embed API.
 * @param {Object} link Link to PDF (entire anchor tag object).
 */
function viewPDFModal(link) {
  const adobeDCView = new AdobeDC.View({
    clientId: adminSettings.client_id,
    divId: "adobe-dc-view",
    reportSuiteId: adminSettings?.adobe_analytics,
  });

  adobeDCView.previewFile(
    {
      content: {
        location: {
          url: link["data-pdf-url"],
        },
      },
      metaData: {
        fileName: getFileName(link),
      },
    },
    getPDFModalConfiguration(link)
  );
}

document.addEventListener("adobe_dc_view_sdk.ready", function (event) {
  if (event.window !== document.parent || event?.origin && event.origin !== 'https://documentcloud.adobe.com/') {
    return;
  }

  let anchorCount = 0;

  $('a[href$=".pdf"], a[href$=".PDF"]').each(function () {
    // Store PDF URI (for Adobe PDF Embed API)
    this["data-pdf-url"] = this.href;

    // Give anchor unique name, in case of multiple anchors to same pdf
    anchorCount += 1;
    const uniquePDFAnchorName = `${anchorCount}_` + $(this).text();
    this.name = uniquePDFAnchorName;

    // Create direct link to named anchor (so page scrolls to anchor)
    this.href = "#" + uniquePDFAnchorName;

    $(this).attr("onclick", "viewPDFModal(this)");
  });
});