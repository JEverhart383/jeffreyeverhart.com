<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, scrollable=no">
    <meta name="description" content="The personal blog of Jeff Everhart">
    <meta name="author" content="Jeff Everhart">
    <meta name="google-site-verification" content="4Rzjb_tE2LibgZFBjx4ITaDOXlS9C_XF42t44Ysoey8" />
    <link rel="shortcut icon" href="../../assets/ico/favicon.ico">

    <title>
      <?php wp_title("|", true, "right"); ?>
      <?php bloginfo("name"); ?>
    </title>

    <?php wp_head(); ?>
	
  </head>


  <body <?php body_class(); ?>>
  <a href="#main">Skip to main content</a>
  <a id="top"></a>

        <a class="navbar-brand orange" href="<?php bloginfo( 'url' ); ?>" style="font-size: 1.75em;">JE</a>
        <ul>
          <?php 
            $defaults = array(
              'theme_location' => 'header-menu', 
              'menu_class' => 'no-bullet nav navbar-nav'
            );
            wp_nav_menu( $defaults ); 
          ?>
        </ul>
