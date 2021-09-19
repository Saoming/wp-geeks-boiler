<?php 

// add basic wordpress base support
if ( ! function_exists( 'base_setup' ) ) :
    function base_setup() {
        require get_template_directory() . '/functions/base.php';
    }
endif;
add_action( 'after_setup_theme', 'base_setup' );

// register the WordPress Registered Style
add_action('wp_enqueue_scripts', 'wp_register_styles');
function wp_register_styles() {
    $theme_version = wp_get_theme()->get( 'Version' );
    wp_enqueue_style( 'trending-topics-style', get_template_directory_uri() . '/style.css', $theme_version );
}