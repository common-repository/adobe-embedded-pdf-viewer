<?php

/**
 * Gutenberg block.
 *
 * @package    pdf_embed_plugin_for_wp
 * @subpackage pdf_embed_plugin_for_wp/public/gutenberg
 */

class Adobe_Embedded_PDF_Viewer_Gutenberg {
    function __construct() {
        add_action( 'init', array( $this, 'register_block' ) );
    }

    function register_block() {
        if ( ! function_exists( 'register_block_type' ) ) {
            // Gutenberg is not active
            return;
        }

        wp_register_script(
            'AdobeViewSDK',
            'https://documentcloud.adobe.com/view-sdk/viewer.js',
            false,
            null
        );

        wp_register_script(
            'pdf-block-js',
            plugins_url( 'build/index.js', __FILE__ ),
            array(
                'wp-block-editor',
                'wp-blocks',
                'wp-components',
                'wp-element',
                'wp-i18n',
                'wp-polyfill',
                'AdobeViewSDK',
            )
        );

        $admin_settings = array(
            'client_id' => get_option( 'adobe_embedded_pdf_viewer_client_id_field' ),
            'adobe_analytics' => get_option(
                'adobe_embedded_pdf_viewer_adobe_analytics_field'
            ),
            'embed_mode' => get_option(
                'adobe_embedded_pdf_viewer_modal_embed_mode_field',
                'SIZED_CONTAINER'
            ),
            'initial_page_view' => get_option(
                'adobe_embedded_pdf_viewer_modal_initial_page_view_field',
                'FIT_PAGE'
            ),
            'exit_type' => get_option(
                'adobe_embedded_pdf_viewer_modal_exit_type_field',
                'CLOSE'
            ),
            'enable_annotation_tools' => get_option(
                'adobe_embedded_pdf_viewer_modal_annotate_field'
            ),
            'enable_download' => get_option(
                'adobe_embedded_pdf_viewer_modal_enable_download_field'
            ),
            'enable_print' => get_option(
                'adobe_embedded_pdf_viewer_modal_enable_print_field'
            ),
            'enable_full_screen' => get_option(
                'adobe_embedded_pdf_viewer_modal_full_screen_field'
            ),
            'dock_controls' => get_option(
                'adobe_embedded_pdf_viewer_modal_dock_page_controls_field'
            ),
            'height' => get_option( 'adobe_embedded_pdf_viewer_modal_height_field', '400px' ),
            'width' => get_option( 'adobe_embedded_pdf_viewer_modal_maxwidth_field', '500px' ),
        );
        wp_add_inline_script(
            'pdf-block-js',
            'const adminSettings = ' . json_encode($admin_settings),
            'before' // add script before embed-pdf-modal-js
        );

        register_block_type(
            'pdf-embed-plugin-for-wp/embedded-pdf',
            array( 'editor_script' => 'pdf-block-js' )
        );
    }
}