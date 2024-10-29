<?php

class Adobe_Embedded_PDF_Viewer_Admin {

    private $plugin_name;

    private $version;

    function __construct( $plugin_name, $version ) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;

        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts_admin' ) );

        add_action( 'admin_init', array( $this, 'settings_init' ) );
        add_action( 'admin_menu', array( $this, 'adobe_embedded_pdf_viewer_setup_menu' ) );
        add_action( 'init', array( $this, 'set_default_values' ) );

        $this->load_dependencies();
    }

    function enqueue_scripts_admin() {
        wp_enqueue_script(
            'admin-script',
            plugin_dir_url(__FILE__) . 'js/admin.js'
        );
        wp_enqueue_style(
            'admin-styles',
            plugin_dir_url(__FILE__) . 'css/admin-styles.css'
        );
    }

    function load_dependencies() {
        require_once (plugin_dir_path( __FILE__ ) . 'validation.php' );
    }

    // Add a menu page to the admin sidebar for the Adobe Embedded PDF Viewer settings
    function adobe_embedded_pdf_viewer_setup_menu() {
        add_menu_page(
            esc_html__( 'Adobe Embedded PDF Viewer', 'adobe-embedded-pdf-viewer' ),
            esc_html__( 'Adobe Embedded PDF Viewer', 'adobe-embedded-pdf-viewer' ),
            'manage_options',
            'adobe-embedded-pdf-viewer',
            array( $this, 'adobe_embedded_pdf_viewer_settings_page_contents' ),
            plugin_dir_url(__FILE__) . 'images/acrobat-pro-cc.png'
        );
    }

    // Add the setting input fields
    function settings_init() {
        // General Settings
        add_settings_section(
            'general_settings_section',
            esc_html__( 'General Settings:', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'general_settings_callback_function' ),
            'general_settings_fields'
        );

        // Add the Client ID field to the general settings section
        add_settings_field(
            'adobe_embedded_pdf_viewer_client_id_field',
            esc_html__( 'Client ID (API Key)', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'client_id_markup' ),
            'general_settings_fields',
            'general_settings_section'
        );
        register_setting(
            'general_settings_fields',
            'adobe_embedded_pdf_viewer_client_id_field',
            array(
                'sanitize_callback' => 'sanitize_text_field',
                'default' => ''
            )
        );

        // Add the Adobe Analytics Report Suite ID field to the general settings section
        add_settings_field(
            'adobe_embedded_pdf_viewer_adobe_analytics_field',
            __( 'Adobe Analytics <br> Report Suite ID', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'adobe_analytics_id_markup' ),
            'general_settings_fields',
            'general_settings_section'
        );
        register_setting(
            'general_settings_fields',
            'adobe_embedded_pdf_viewer_adobe_analytics_field',
            array(
                'sanitize_callback' => 'sanitize_text_field',
                'default' => ''
            )
        );

        //PDF Viewer Settings
        add_settings_section(
            'view_settings_section',
            esc_html__( 'View Settings:', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_section_callback_function' ),
            'view_settings_fields'
        );

        // Modal Embed Modes
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_embed_mode_field',
            esc_html__( 'Embed Mode', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_embed_mode_markup' ),
            'view_settings_fields',
            'view_settings_section'
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_embed_mode_field',
            array(
                'sanitize_callback' => 'validate_embed_mode',
                'default' => 'SIZED_CONTAINER'
            )
        );

        // Initial Page View
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_initial_page_view_field',
            esc_html__( 'Initial Page View', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_page_view_markup' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noSizedContainer noInLine'
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_initial_page_view_field',
            array(
                'sanitize_callback' => 'validate_initial_page_view',
                'default' => 'FIT_PAGE'
            )
        );

        // Modal exit type
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_exit_type_field',
            esc_html__( 'Lightbox Exit Type', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'modal_exit_type_markup' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noSizedContainer noInLine noFullWindow'
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_exit_type_field',
            array(
                'sanitize_callback' => 'validate_modal_exit_type',
                'default' => 'CLOSE',
            )
        );

        // Enable Annotation Tools
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_annotate_field',
            esc_html__( 'Enable Annotation Tools', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_checkbox_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noLightBox noSizedContainer noInLine',
                'input_id' => 'enableAnnotateSwitch',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_annotate_field',
                'description' => esc_html__( 'Add annotation tools to the Full Window Viewer.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_annotate_field',
            array(
                'sanitize_callback' => 'sanitize_checkbox',
                'default' => '1'
            )
        );

        // Enable PDF Download
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_enable_download_field',
            esc_html__( 'Enable PDF Download', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_checkbox_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => '',
                'input_id' => 'enableDownloadSwitch',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_enable_download_field',
                'description' => esc_html__( 'Add a download button to the Embedded PDF Viewer. Unavailable on mobile.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_enable_download_field',
            array(
                'sanitize_callback' => 'sanitize_checkbox',
                'default' => '1'
            )
        );

        // Enable Printing PDF
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_enable_print_field',
            esc_html__( 'Enable Printing PDF', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_checkbox_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => '',
                'input_id' => 'enablePrintSwitch',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_enable_print_field',
                'description' => esc_html__( 'Add a print button to the Embedded PDF Viewer. Unavailable on mobile.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_enable_print_field',
            array(
                'sanitize_callback' => 'sanitize_checkbox',
                'default' => '1'
            )
        );

        // Enable Full Screen mode
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_full_screen_field',
            esc_html__( 'Enable Full Screen View', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_checkbox_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noLightBox noFullWindow noInLine',
                'input_id' => 'enableFullScreenSwitch',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_full_screen_field',
                'description' => esc_html__( 'Add a full screen button to the Sized Container Viewer.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_full_screen_field',
            array(
                'sanitize_callback' => 'sanitize_checkbox',
                'default' => '1'
            )
        );

        // Dock Page Controls
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_dock_page_controls_field',
            esc_html__( 'Dock Page Controls', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_checkbox_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noLightBox noFullWindow noInLine',
                'input_id' => 'dockPageControlsSwitch',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_dock_page_controls_field',
                'description' => esc_html__( 'Dock the page controls in the Embedded PDF Viewer.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_dock_page_controls_field',
            array(
                'sanitize_callback' => 'sanitize_checkbox',
                'default' => '1'
            )
        );

        // Set the height of the sized container
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_height_field',
            esc_html__( 'Height', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_textfield_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noLightBox noFullWindow noInLine',
                'input_id' => 'height_field',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_height_field',
                'description' => esc_html__( 'Height of the Sized Container Viewer. Valid CSS widths are accepted.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_height_field',
            array(
                'sanitize_callback' => 'validate_height',
                'default' => '400px'
            )
        );

        // Set the max width of the sized container
        add_settings_field(
            'adobe_embedded_pdf_viewer_modal_maxwidth_field',
            esc_html__( 'Width', 'adobe-embedded-pdf-viewer' ),
            array( $this, 'view_settings_textfield_html' ),
            'view_settings_fields',
            'view_settings_section',
            array(
                'div_class' => 'noLightBox noFullWindow',
                'input_id' => 'maxwidth_field',
                'input_name' => 'adobe_embedded_pdf_viewer_modal_maxwidth_field',
                'description' => esc_html__( 'Width of the Sized Container and In-Line Viewer. Valid CSS widths are accepted.', 'adobe-embedded-pdf-viewer' )
            )
        );
        register_setting(
            'view_settings_fields',
            'adobe_embedded_pdf_viewer_modal_maxwidth_field',
            array(
                'sanitize_callback' => 'validate_max_width',
                'default' => '500px'
            )
        );
    }

    // Add the contents to the plugin settings page
    function adobe_embedded_pdf_viewer_settings_page_contents() {
        ?>
        <div class="wrap adobe-embedded-pdf-viewer">
            <a href="https://www.adobe.com/go/onboarding_docservices" target="_blank">
                <img src="<?php echo esc_url( plugin_dir_url(__FILE__) . 'images/Adobe_Scaled_Transparent.png' ); ?>" style="padding-left: 3px; padding-top: 13px; padding-bottom: 13px;">
            </a>
            <hr/>
            <h2><?php esc_html_e( 'Adobe Embedded PDF Viewer', 'adobe-embedded-pdf-viewer' );?></h2>

            <div class="float-container">
                <div class="float-child-left">
                    <?php
                    $tab = filter_input(
                        INPUT_GET, 
                        'tab', 
                        FILTER_CALLBACK, 
                        ['options' => 'esc_html']
                    );
                    $active_tab = $tab ?: 'general_settings';
                    ?>

                    <h2 id="adobe-emb-pdf-tabs" class="nav-tab-wrapper">
                        <a href="?page=adobe-embedded-pdf-viewer&tab=general_settings" id="general-tab" class="nav-tab <?php echo $active_tab == 'general_settings' ? 'nav-tab-active' : '';?>"><?php esc_html_e('General Settings', 'adobe-embedded-pdf-viewer'); ?></a>
                        <a href="?page=adobe-embedded-pdf-viewer&tab=view_settings" id="view-tab" class="nav-tab <?php echo $active_tab == 'view_settings' ? 'nav-tab-active' : '';?>"><?php esc_html_e('View Settings', 'adobe-embedded-pdf-viewer'); ?></a>
                    </h2>

                    <form method="POST" action="options.php">
                    <?php
                        if($active_tab === 'general_settings') {
                            settings_errors();
                            settings_fields( 'general_settings_fields' );
                            do_settings_sections( 'general_settings_fields' );
                            echo '</br>';
                            submit_button();
                        } elseif ( $active_tab === 'view_settings' ) {
                            settings_errors();
                            settings_fields( 'view_settings_fields' );
                            do_settings_sections( 'view_settings_fields' );
                            echo '</br>';
                            submit_button();
                        }
                        ?>
                    </form>
                </div>
                <div class="float-child-right">
                <center>
                    <a href="https://www.adobe.io/apis/documentcloud/dcsdk/pdf-services.html?sdid=SPVLM6MM&mv=affiliate" target="_blank">
                        <img src="<?php echo esc_url( plugin_dir_url(__FILE__) . 'images/pdf-services-300x600-free-trial-nocard-v1.jpeg' ); ?>" alt="">
                    </a>
                </center>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * General Settings
     */

    // Credential settings description
    function general_settings_callback_function() {
        ?>
            <p>
            <?php
                esc_html_e(
                    'Adobe Embedded PDF Viewer is free to use. Sign up for your free credential ',
                    'adobe-embedded-pdf-viewer'
                )
            ?>
            <a href="https://www.adobe.com/go/onboarding_embedapi" target="_blank" style="display: inline-block;">
                <?php esc_html_e( 'here', 'adobe-embedded-pdf-viewer' );?>
            </a>
            <?php
                esc_html_e(
                    ' and paste it into the Client ID field below.',
                    'adobe-embedded-pdf-viewer'
                )
            ?>
            </p>
            <p>
                <?php
                    esc_html_e(
                        'To learn more about how user data may be collected or used, please see the ',
                        'adobe-embedded-pdf-viewer'
                    )
                ?>
                <a href="https://www.adobe.com/privacy/policy.html" target="_blank" style="display: inline-block;">
                    <?php esc_html_e( 'Adobe Privacy Policy', 'adobe-embedded-pdf-viewer' );?>
                </a>
                <?php
                    esc_html_e(
                        '.',
                        'adobe-embedded-pdf-viewer'
                    )
                ?>
            </p>
        <?php
    }

    // Client ID textfield
    function client_id_markup() {
        ?>
        <input type="text" style="width:350px" name="adobe_embedded_pdf_viewer_client_id_field"
            value="<?php esc_attr_e( get_option( 'adobe_embedded_pdf_viewer_client_id_field' ), 'adobe-embedded-pdf-viewer' );?>" >
        <div id="clientID_Status"></div>
        <?php
    }

    // Adobe Analytics Report Suite ID textfield
    function adobe_analytics_id_markup() {
        ?>
        <input placeholder="Report Suite ID" type="text" style="width:350px" name="adobe_embedded_pdf_viewer_adobe_analytics_field"
            value="<?php esc_attr_e( get_option( 'adobe_embedded_pdf_viewer_adobe_analytics_field' ), 'adobe-embedded-pdf-viewer' );?>" >

        <p>
            <?php
                esc_html_e(
                    'Embedded PDF Viewer integrates with Adobe Analytics (requires separate licensing). Enter your reportSuiteID and follow the configuration steps outlined in',
                    'adobe-embedded-pdf-viewer'
                )
            ?>
                        <a href="https://www.adobe.com/devnet-docs/dcsdk_io/viewSDK/howtodata.html#adobe-analytics" target="_blank" style="display: inline-block;">
                <?php esc_html_e( 'Configure Adobe Analytics', 'adobe-embedded-pdf-viewer' );?>
            </a>
            <?php
                esc_html_e(
                    ' guide to correctly map the data from Embedded PDF Viewer to your Adobe Analytics report suite.',
                    'adobe-embedded-pdf-viewer'
                )
            ?>
            </br>
        </p>
        <?php
    }

    /**
     * PDF Viewer Settings
     */

    // Populating DB with default values for the PDF viewer settings
    function set_default_values() {
        if ( get_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field' ) == null ) {
            update_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field', "SIZED_CONTAINER" );
        }

        if (get_option( 'adobe_embedded_pdf_viewer_modal_initial_page_view_field' ) == null ) {
            update_option( 'adobe_embedded_pdf_viewer_modal_initial_page_view_field', "FIT_PAGE" );
        }

        if ( get_option( 'adobe_embedded_pdf_viewer_modal_exit_type_field' ) == null ) {
            update_option( 'adobe_embedded_pdf_viewer_modal_exit_type_field', "CLOSE" );
        }

        if ( get_option( 'adobe_embedded_pdf_viewer_modal_height_field' ) == null ) {
            update_option( 'adobe_embedded_pdf_viewer_modal_height_field', "400px" );
        }

        if ( get_option( 'adobe_embedded_pdf_viewer_modal_maxwidth_field' ) == null ) {
            update_option( 'adobe_embedded_pdf_viewer_modal_maxwidth_field', "500px" );
        }
    }

    // Modal Section
    function view_settings_section_callback_function() {
        echo '<div style="width: 75%;"><p>' . esc_html__('These settings affect how the embedded PDF will be presented. The values set here are used as defaults for the Modal View and Gutenberg block and can be overwritten for each use case individually.
                                            Setting changes will not impact previously applied settings in the block editor. Non-applicable settings to the embed mode are grayed out.') . '</p></div>';
    }

    function view_embed_mode_markup() {
        ?>
        <select name="adobe_embedded_pdf_viewer_modal_embed_mode_field" id="embed_mode_select">
            <option value="LIGHT_BOX" <?php selected( esc_attr( get_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field' ) ), 'LIGHT_BOX' ); ?> >
                <?php esc_html_e( 'Lightbox' , 'adobe-embedded-pdf-viewer' ); ?>
            </option>
            <option value="FULL_WINDOW" <?php selected( esc_attr( get_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field' ) ), 'FULL_WINDOW' ); ?> >
                <?php esc_html_e( 'Full Window' , 'adobe-embedded-pdf-viewer' ); ?>
            </option>
            <option value="SIZED_CONTAINER" <?php selected( esc_attr( get_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field' ) ), 'SIZED_CONTAINER' ); ?> >
                <?php esc_html_e( 'Sized Container' , 'adobe-embedded-pdf-viewer' ); ?>
            </option>
            <option value="IN_LINE" <?php selected( esc_attr( get_option( 'adobe_embedded_pdf_viewer_modal_embed_mode_field' ) ), 'IN_LINE' ); ?> >
                <?php esc_html_e( 'In-Line' , 'adobe-embedded-pdf-viewer' ); ?>
            </option>
            </select>
        <p>
            <?php esc_html_e( 'Set the ' , 'adobe-embedded-pdf-viewer' ); ?>
            <a href="https://opensource.adobe.com/pdfembed-sdk-docs/howtos.html#embed-modes" target="_blank"><?php esc_html_e( 'embed mode.' , 'adobe-embedded-pdf-viewer' ); ?></a>
        </p>
        <?php
    }

    // Initial Page View
    function view_page_view_markup( $args) {
        ?>
        <div class="<?php echo esc_attr( $args['div_class'] ); ?>">
            <select name="adobe_embedded_pdf_viewer_modal_initial_page_view_field" >
                <option value="FIT_PAGE" <?php selected( esc_attr( get_option( 'adobe_embedded_pdf_viewer_modal_initial_page_view_field' ) ), 'FIT_PAGE' ); ?> >
                    <?php esc_html_e( 'Fit Page' , 'adobe-embedded-pdf-viewer' ); ?>
                </option>
                <option value="FIT_WIDTH" <?php selected( esc_attr( get_option( 'adobe_embedded_pdf_viewer_modal_initial_page_view_field' ) ), 'FIT_WIDTH' ); ?> >
                    <?php esc_html_e( 'Fit Width' , 'adobe-embedded-pdf-viewer' ); ?>
                </option>
            </select>
            <p><?php esc_html_e( 'Set the initial page view to either fit page or fit width.' , 'adobe-embedded-pdf-viewer' ); ?></p>
        </div>
        <?php
    }

    // Modal exit type
    function modal_exit_type_markup( $args ) {
        ?>
        <div class="<?php echo esc_attr( $args['div_class'] ); ?>">
            <select name="adobe_embedded_pdf_viewer_modal_exit_type_field" >
                <option
                    value="CLOSE"
                    <?php
                    selected(
                        esc_attr(
                            get_option( 'adobe_embedded_pdf_viewer_modal_exit_type_field' )
                        ),
                        'CLOSE'
                    );
                    ?>
                >
                    <?php
                    esc_html_e( 'Close' , 'adobe-embedded-pdf-viewer' );
                    ?>
                </option>
                <option
                    value="RETURN"
                    <?php
                    selected(
                        esc_attr(
                            get_option( 'adobe_embedded_pdf_viewer_modal_exit_type_field' )
                        ),
                        'RETURN'
                    );
                    ?>
                >
                    <?php
                    esc_html_e( 'Return' , 'adobe-embedded-pdf-viewer' );
                    ?>
                </option>
            </select>
            <p>
                <?php
                esc_html_e(
                    'Close the Lightbox with a close button or a back button (Return).',
                    'adobe-embedded-pdf-viewer'
                );
                ?>
            </p>
        </div>
        <?php
    }

    function view_settings_checkbox_html( $args ) {
        ?>
        <div class="<?php echo esc_attr( $args['div_class'] ) ?>">
            <label class="toggle">
                <input type="checkbox" id="<?php echo esc_attr( $args['input_id'] ) ?>" name="<?php echo esc_attr( $args['input_name'] ) ?>"
                    value="1" <?php checked( 1, esc_attr( get_option( $args['input_name'], '1' ) ), true )?> >
                    <span class="slider circle"></span>
            </label>
            <p>
                <?php echo esc_html( $args['description'] ) ?>
            </p>
        </div>
        <?php
    }

    function view_settings_textfield_html( $args ) {
        ?>
        <div class="<?php echo esc_attr( $args['div_class'] ); ?>">
            <input id="<?php echo esc_attr( $args['input_id'] ) ?>" type="text" style="width:350px" name="<?php echo esc_attr( $args['input_name'] ) ?>"
                value="<?php esc_attr_e( get_option( $args['input_name'] ) )?>">
            <p>
                <?php
                    echo esc_html( $args['description'] );
                    esc_html_e( '(auto, initial, inherit, 0 or a number with any of the following px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax units)', 'adobe-embedded-pdf-viewer');
                ?>
            </p>
        </div>

        <?php
    }

}
