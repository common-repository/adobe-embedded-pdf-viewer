<?php
/**
 * Plugin Name:       Adobe Embedded PDF Viewer
 * Description:       Embed PDF's in WordPress using the Adobe PDF Embed API and replace the default PDF viewer.
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Adobe Inc.
 * Author URI:        https://www.adobe.com/
 * License:           Apache 2.0
 * License URI: 	  https://www.apache.org/licenses/LICENSE-2.0
 * Text Domain:       adobe-embedded-pdf-viewer
 * Domain Path: 	  /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'ADOBE_EMBEDDED_PDF_VIEWER_VERSION', '1.0.0' );

/**
 * The core plugin class.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-adobe-embedded-pdf-viewer.php';


/**
 * Begins execution of the plugin.
 */
function run_adobe_embedded_pdf_viewer() {
	$plugin = new Adobe_Embedded_PDF_Viewer();
}

run_adobe_embedded_pdf_viewer();