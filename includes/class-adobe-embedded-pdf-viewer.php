<?php

class Adobe_Embedded_PDF_Viewer {

    protected $plugin_name;

    protected $version;

    /**
	 * Define the core functionality of the plugin.
	 * Set the plugin name and version that can be used throughout the plugin.
	 * Load the dependencies for the admin area and the public-facing side of the site.
     * 
	 */
	public function __construct() {
		$this->plugin_name = 'adobe-embedded-pdf-viewer';

        if ( defined( 'ADOBE_EMBEDDED_PDF_VIEWER_VERSION' ) ) {
			$this->version = ADOBE_EMBEDDED_PDF_VIEWER_VERSION;
		} else {
			$this->version = '1.0.0';
		}

		$this->load_dependencies();
        $this->languages();
	}

    private function load_dependencies() {

        if ( is_admin() ) {
            require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-adobe-embedded-pdf-viewer-admin.php';
			$plugin_admin = new Adobe_Embedded_PDF_Viewer_Admin( $this->get_plugin_name(), $this->get_version() );
        }

        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-adobe-embedded-pdf-viewer-public.php';
      $plugin_public = new Adobe_Embedded_PDF_Viewer_Public( $this->get_plugin_name(), $this->get_version() );

	}

    private function languages() 
    {
        load_plugin_textdomain( 'adobe-embedded-pdf-viewer', false, plugin_dir_path( dirname( __FILE__ ) ) . '/languages' );
    }

	public function get_plugin_name() {
		return $this->plugin_name;
	}

    public function get_version() {
		return $this->version;
	}
}