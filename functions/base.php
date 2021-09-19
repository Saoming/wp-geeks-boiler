<?php
// WooCommerce Support
add_theme_support( 'woocommerce' );

// add menu for Primary and for Footer Menu
register_nav_menus( array(
    'primary' => __( 'Navigation Menu', 'WP_Geeks_Menu'),
    'secondary' => __( 'Footer Menu', 'WP_Geeks_Menu'),
) );
