<?php

function validate_embed_mode( $input ) {
    if( $input === 'FULL_WINDOW' || $input === 'SIZED_CONTAINER' || $input === 'LIGHT_BOX' || $input === 'IN_LINE') {
        return $input;
    }

    add_settings_error( 'adobe_embedded_pdf_viewer_modal_embed_mode_field', 'incorrect_embed_mode_error', 'Not a valid embed mode.' );
    return get_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field' );
}

function validate_initial_page_view( $input ) {
    if( $input === 'FIT_WIDTH' || $input === 'FIT_PAGE' ) {
        return $input;
    } 

    add_settings_error( 'adobe_embedded_pdf_viewer_modal_initial_page_view_field', 'incorrect_initial_page_view_error', 'Not a valid initial page view.' );
    return get_option( 'adobe_embedded_pdf_viewer_modal_initial_page_view_field' );
}

function validate_modal_exit_type( $input ) {
    if ( $input === 'CLOSE' || $input === 'RETURN' ) {
        return $input;
    } 

    add_settings_error(
        'adobe_embedded_pdf_viewer_modal_exit_type_field',
        'incorrect_modal_exit_type_error',
        'Not a valid modal exit type.'
    );

    return get_option( 'adobe_embedded_pdf_viewer_modal_exit_type_field' );
}

function sanitize_checkbox( $input ) {
    return ( ( $input === true || $input === 1 || $input === '1' )? true : false );
}

function validate_height( $input ) {
    return validate_css_width( $input, 'adobe_embedded_pdf_viewer_modal_height_field', 'Height: ' );
}

function validate_max_width( $input ) {
    return validate_css_width( $input, 'adobe_embedded_pdf_viewer_modal_maxwidth_field', 'Width: ' );
}

function validate_css_width( $input, $id, $field ) {

    if ( $input === 'auto' || $input === 'initial' || $input === 'inherit' || $input === '0' || $input === '' ) {
        return $input;
    }

    // 1 or more digits followed by one of the options
    if ( preg_match( '#(\d+)(px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax)$#', $input ) ) {
        return $input;
    }

    add_settings_error( $id, 'incorrect_css_width_error', $field . 'Not a valid CSS width.' );
    return get_option( $id );
}