<?php

// if uninstall.php is not called by WordPress, die
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

// delete all plugin related options and settings from the database
delete_option('adobe_embedded_pdf_viewer_client_id_field');
delete_option('adobe_embedded_pdf_viewer_adobe_analytics_field');
delete_option('adobe_embedded_pdf_viewer_modal_embed_mode_field');
delete_option('adobe_embedded_pdf_viewer_modal_initial_page_view_field');
delete_option('adobe_embedded_pdf_viewer_modal_annotate_field');
delete_option('adobe_embedded_pdf_viewer_modal_enable_download_field');
delete_option('adobe_embedded_pdf_viewer_modal_enable_print_field');
delete_option('adobe_embedded_pdf_viewer_modal_full_screen_field');
delete_option('adobe_embedded_pdf_viewer_modal_dock_page_controls_field');
delete_option('adobe_embedded_pdf_viewer_modal_height_field');
delete_option('adobe_embedded_pdf_viewer_modal_maxwidth_field');
