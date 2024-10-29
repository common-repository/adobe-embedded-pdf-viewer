<?php

class Adobe_Embedded_PDF_Viewer_Public {
    private $plugin_name;
    private $version;

    function __construct( $plugin_name, $version ) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->load_dependencies();

        add_action(
            'wp_after_admin_bar_render',
            array( $this, 'lightbox_covers_wp_admin_bar')
        );
    }

    private function load_dependencies() {
        require_once ( plugin_dir_path( __FILE__ ) . 'modal/class-adobe-embedded-pdf-viewer-modal.php');
        $modal = new Adobe_Embedded_PDF_Viewer_Modal();

        require_once ( plugin_dir_path( __FILE__ ) . 'gutenberg/class-adobe-embedded-pdf-viewer-gutenberg.php');
        $gutenberg = new Adobe_Embedded_PDF_Viewer_Gutenberg();
    }

    function lightbox_covers_wp_admin_bar() {
        wp_enqueue_style(
            'embed-pdf-modal-css',
            plugin_dir_url( __FILE__ ) . 'modal/css/embed-pdf-modal.css'
        );

        wp_add_inline_style(
            'embed-pdf-modal-css',
            '#adobe-dc-view { z-index: 999999 !important; }'
        );
    }
}