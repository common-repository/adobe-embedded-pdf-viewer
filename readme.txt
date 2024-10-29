=== Adobe Embedded PDF Viewer ===
Contributors: adobe, ensemblesys
Tags: adobe, pdf, embed, viewer, acrobat
Requires at least: 6.0
Tested up to: 6.1.1
Stable tag: 1.0.0
Requires PHP: 7.0
License: Apache 2.0
License URI: https://www.apache.org/licenses/LICENSE-2.0

Embed PDF files into your posts and pages and display them in a modal, a presentation-style container, full-screen, or inline.

== Description ==

Adobe Embedded PDF Viewer is a FREE plugin that allows you to easily embed high-fidelity PDF viewing into your posts and pages with collaboration, security, and analytics. Deliver the highest quality PDF rendering available and streamline user experiences with custom viewer modes and digital collaboration through annotation tools. Extend the viewer with PDF usage analytics to understand how users interact with your documents. 

Embedded PDFs can be displayed in four PDF viewer modes: 

* **Lightbox**: Displays PDF files in a modal.
* **Sized Container**: Displays PDF files in a presentation-style container with landscape orientation. Each page of the embedded PDF file appears as a slide. This is the default mode that applies to all embedded PDFs.
* **In-Line**: Displays PDF files inline within the content of the page or post itself. When using this mode, all pages within the embedded PDF file are displayed at once.
* **Full Window**: The viewing area fits the size of the parent element and can be customized to cover the entire browser window. Unlike the Sized Container mode, which also fits the size of the parent element, the Full Window mode allows your visitors to use annotation tools, navigate pages using PDF thumbnails, and access other features of the Full Window embed mode of the [Adobe PDF Embed API](https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos/#full-window-embed-mode).

The plugin allows you to control how PDF files are displayed on your website and what viewer options your visitors have access to.

Adobe Embedded PDF Viewer is JavaScript-based and uses the [Adobe PDF Embed API](https://developer.adobe.com/document-services/apis/pdf-embed/) to display PDFs in the browser.

Adobe Embedded PDF Viewer is part of Adobe Acrobat Services, cloud-based REST APIs, SDKs, and integrations to automate digital document workflows for PDF creation, conversion, PDF content   extraction, document generation with signatures, and more. Learn more at [Adobe Acrobat Services](https://developer.adobe.com/document-services/)

By installing and activating this plugin, you acknowledge that you agree to the [Adobe General Terms of Use](https://www.adobe.com/legal/terms.html). To learn more about how user data may be collected or used, please see the [Adobe Privacy Policy](https://www.adobe.com/privacy/policy.html).

### Key features

* FREE plugin for high fidelity PDF viewing from the company that created the PDF standard.
* Quickly display embedded PDF documents on your website using four unique viewer modes.
* Add security to your published files by disabling printing and downloading of your PDFs in all four PDF viewer modes.
* Embed PDFs with the Adobe Embedded PDF Viewer block in the Gutenberg editor.

= Lightbox embed mode =

* Choose the type of the modal close button between the standard close button ("X") on the right side of the modal header and the back arrow on the left side of the modal header.
* Control the initial appearance of the modal to either fit the screen vertically or zoom in to fit the window width.

= Sized Container embed mode =

* Control the width and height of the viewing area.
* Enable or disable the option to toggle the full-screen mode.
* Dock the page control toolbar to the bottom of the viewing area or configure it as a floating overlay.

= In-Line embed mode =

* Control the width of the viewing area.

= Full Window embed mode =

* Control the width and height of the viewing area.
* Show or hide annotation tools that include text comments, sticky notes, a highlighting tool, drawing and eraser tools, and undo/redo options.
* Control the initial appearance of PDF pages to either fit the viewing area vertically or zoom in to fit the viewing area width.

> **Note:** In Full Window embed mode, the PDF viewing area fits the size of the parent element.

### Getting started

To use Adobe Embedded PDF Viewer, you need a client ID (API key). To get a client ID, follow these steps:

1. Visit the [Adobe Acrobat Services website](https://www.adobe.com/go/onboarding_embedapi), complete the required fields and select **Create Credentials**.
1. Once complete, copy the client ID (API key) from your project’s console.
1. In your WordPress admin dashboard, navigate to **Adobe Embedded PDF Viewer** > **General Settings** and paste the client ID into the **Client ID (API Key)** field.

You can integrate the plugin with your Adobe Analytics account (requires separate licensing). Navigate to **Adobe Embedded PDF Viewer** > **General Settings**, enter your Report Suite ID in the field, and follow the steps outlined in the guide on [configuring Adobe Analytics](https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata/) to correctly map the data from Embedded PDF Viewer to your Analytics report suite.

### Usage

The plugin provides the Embedded PDF Viewer block for the Gutenberg editor. See the [block editor usage guide](https://wordpress.com/support/wordpress-editor/) for instructions on how to work with blocks in WordPress.

In the Gutenberg editor, you can embed a PDF using the following steps:

1. Toggle **Block Inserter** in the top-left corner of the editor and search for Adobe Embedded PDF Viewer. You can find it under the Embed category.
1. Add the block to your post or page and select **Media Library**. In the dialog, select or upload the PDF file you want to embed. The preview of your PDF appears in the editor.
1. You can configure the viewer settings for your PDF in the **Block settings** tab in the right sidebar of the editor. Sized Container is the default embed mode for the Gutenberg editor.

> **Note:** Sized Container is the default embed mode for the Embedded PDF Viewer block, and the site-wide embed mode settings do not apply. You can change the embed mode for individual PDFs using the Block settings tab in the right sidebar.

== Frequently Asked Questions ==

= What is the difference between the Full Window and Sized Container embed modes? =

Although both embed modes render PDFs inside a parent container, there are a few differences between them:

* The **Sized Container** mode displays PDFs in a presentation-style box where each page is a slide. The **Full Window** mode displays PDFs in a box with portrait orientation.
* The **Sized Container** mode allows your visitors to toggle the full-screen view. In the **Full Window** mode, your visitors cannot change the size of the viewing area. You configure the size of the viewing area when you embed the PDF.
* The **Full Window** mode allows your visitors to use annotation tools: text comments, sticky notes, a highlight tool, drawing and eraser tools, and undo/redo options.
* The **Full Window** mode allows your visitors to navigate pages using PDF thumbnails and access bookmarks and file attachments if they are available in the PDF.

== Screenshots ==

1. Embed PDFs in a lightbox.
2. Embed PDFs in a presentation-style container.
3. Embed PDFs inline within the content of your posts and pages.
4. Embed PDFs in a Full Window container.
5. Customize the Full Window view to cover the entire browser window.
6. Configure the default appearance of your PDFs in the **Adobe Embedded PDF Viewer** > **View Settings**.

== Installation ==

### Using WordPress plugin search

1. Navigate to the Plugins page inside your WordPress admin area and select **Add New**.
1. Search for “Adobe Embedded PDF Viewer”.
1. Select **Install Now** next to the plugin’s name. 
1. Once installed, **Install Now** will change to **Activate**. Make sure to select it to start using the plugin.

### Using WordPress plugin uploader

1. Download the plugin ZIP file.
1. Navigate to the Plugins page inside your WordPress admin area and select **Add New**.
1. Select **Upload Plugin** at the top-left area of the page.
1. Navigate to **Choose File** and select the plugin ZIP file that you downloaded in step 1.
1. Select **Install Now** to upload the plugin file from your computer.
1. Once installed, select **Activate Plugin** to start using the plugin.

### Uploading directly to your server

1. Download the plugin ZIP file.
1. Upload the plugin ZIP file to the `/wp-content/plugins` folder on your server.
1. Extract the plugin ZIP file to create the Adobe Embedded PDF Viewer folder.
1. Make sure to activate Adobe Embedded PDF Viewer on the Plugins page inside your WordPress admin area to start using the plugin.

== Changelog ==

= 1.0.0 =
First version.
