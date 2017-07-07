<?php


// Load CSS Stylesheets

function theme_styles() {

	wp_enqueue_style( 'fontawesome_css', get_template_directory_uri() . '/font-awesome-4.5.0/css/font-awesome.min.css' );
	wp_enqueue_style( 'bootstrap_css', get_template_directory_uri() . '/css/bootstrap.min.css' );
	wp_enqueue_style( 'main_css', get_template_directory_uri() . '/style.css' );

}


add_action( 'wp_enqueue_scripts', 'theme_styles' );

// Load JS scripts 

function theme_js() {

	global $wp_scripts;

	wp_register_script( 'html5_shiv', 'https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js', '', '', false );
	wp_register_script( 'respond_js', 'https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js', '', '', false );

	$wp_scripts->add_data( 'html5_shiv', 'conditional', 'lt IE 9' );
	$wp_scripts->add_data( 'respond_js', 'conditional', 'lt IE 9' );

	wp_enqueue_script( 'bootstrap_js', get_template_directory_uri() . '/js/bootstrap.min.js', array('jquery'), '', true );

}
add_action( 'wp_enqueue_scripts', 'theme_js' );

//add_filter( 'show_admin_bar', '__return_false' );


// add theme support for post thumbnails/featured images
add_theme_support( 'post-thumbnails' ); 
// add theme support for menu, register nav menu  

add_theme_support( 'menus' ); 

function register_theme_menus() {
	register_nav_menus(
		array(
			'header-menu'	=> __( 'Header Menu' )
		)
	);
}
add_action( 'init', 'register_theme_menus' );

// add sidebars / widgets

function create_widget($name, $id, $description){

	register_sidebar(array(
		'name' => __($name), 
		'id' => $id, 
		'description' => __($description), 
		'before_widget' => '<div class="panel panel-default widget-panel">', 
		'after_widget' => '</div></div>', 
		'before_title' => '<div class="panel-body"><h3>', 
		'after_title' =>  '</h3>'

		));

}

function create_cta($name, $id, $description){

	register_sidebar(array(
		'name' => __($name), 
		'id' => $id, 
		'description' => __($description), 
		'before_widget' => '<div class="center-block cta-widget">', 
		'after_widget' => '</div>', 
		'before_title' => '<h3>', 
		'after_title' =>  '</h3>'

		));

}



 create_cta('OptIn', 'opt-in', 'Widget for email opt in');
 create_cta('CTA1', 'cta-one', 'Widget for opt-in CTA1 or form');
 create_cta('CTA2', 'cta-two', 'Widget for opt-in CTA2 or form');
 create_cta('CTA3', 'cta-three', 'Widget for opt-in CTA3 or form');


 create_widget('Footer Left', 'footer-left', 'Widget for the left of front page' ); 
 create_widget('Footer Center', 'footer-center', 'Widget for the center of front page' ); 
 create_widget('Footer Right', 'footer-right', 'Widget for the right of front page' ); 

 create_widget('Sidebar', 'sidebar', 'Widget for the sidebar' ); 












?>