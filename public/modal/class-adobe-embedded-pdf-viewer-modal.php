<?php

/**
 * Modal lightbox.
 *
 * @package    pdf_embed_plugin_for_wp
 * @subpackage pdf_embed_plugin_for_wp/public/modal
 */

class Adobe_Embedded_PDF_Viewer_Modal {
    function __construct() {
        add_action(
          'wp_enqueue_scripts',
          array( $this, 'enqueue_modal_script_with_admin_settings' )
        );
    }

    function enqueue_modal_script_with_admin_settings() {
        wp_register_script(
            'AdobeViewSDK',
            'https://documentcloud.adobe.com/view-sdk/viewer.js',
            false,
            null
        );

        wp_enqueue_script(
            'embed-pdf-modal-js',
            plugin_dir_url( __FILE__ ) . 'js/embed-pdf-modal.js',
            array( 'AdobeViewSDK' )
        );

        $admin_settings = array(
            'client_id' => get_option( 'adobe_embedded_pdf_viewer_client_id_field' ),
            'adobe_analytics' => get_option(
                'adobe_embedded_pdf_viewer_adobe_analytics_field'
            ),
            'embed_mode' => get_option(
                'adobe_embedded_pdf_viewer_modal_embed_mode_field'
            ),
            'initial_page_view' => get_option(
                'adobe_embedded_pdf_viewer_modal_initial_page_view_field'
            ),
            'exit_type' => get_option(
                'adobe_embedded_pdf_viewer_modal_exit_type_field'
            ),
            'enable_download' => get_option(
                'adobe_embedded_pdf_viewer_modal_enable_download_field'
            ),
            'enable_print' => get_option(
                'adobe_embedded_pdf_viewer_modal_enable_print_field'
            ),
            'dock_controls' => get_option(
                'adobe_embedded_pdf_viewer_modal_dock_page_controls_field'
            ),
        );

        wp_add_inline_script(
            'embed-pdf-modal-js',
            'const adminSettings = ' . json_encode($admin_settings),
            'before' // add script before embed-pdf-modal-js
        );
    }
}