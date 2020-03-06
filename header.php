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
	<script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/cfe05867a82d1c7e882d0b6c4/0575b4c676514f21761f90ded.js");</script>
  </head>


  <body <?php body_class(); ?>>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="secondary-nav">
    <p class="pull-right desktop-icons" style="margin-right: 10px; margin-top: 5px;">
              <a href="https://twitter.com/j_everhart383" target="_blank" class="footer-media-link"><span class="fa fa-twitter fa-2x">&nbsp;</span></a>

              <a href="https://www.linkedin.com/in/jeff-everhart-42248b44" target="_blank" class="footer-media-link"><span class="fa fa-linkedin fa-2x">&nbsp;</span></a>

              <a href="https://github.com/JEverhart383" target="_blank" class="footer-media-link"><span class="fa fa-github fa-2x">&nbsp;</span></a>

              <a href="http://stackoverflow.com/users/3888822/j-everhart383" target="_blank" class="footer-media-link"><span class="fa fa-stack-overflow fa-2x">&nbsp;</span></a>

              <a href="https://www.youtube.com/user/JeffEverhart0721" class="footer-media-link" target="_blank"><span class="fa fa-youtube fa-2x"></span></a>
    </p>
    <p class="pull-right mobile-icons" style="margin-right: 10px; margin-top: 12.5px;">
              <a href="https://twitter.com/j_everhart383" target="_blank" class="footer-media-link"><span class="fa fa-twitter">&nbsp;</span></a>

              <a href="https://www.linkedin.com/in/jeff-everhart-42248b44" target="_blank" class="footer-media-link"><span class="fa fa-linkedin">&nbsp;</span></a>

              <a href="https://github.com/JEverhart383" target="_blank" class="footer-media-link"><span class="fa fa-github">&nbsp;</span></a>

              <a href="http://stackoverflow.com/users/3888822/j-everhart383" target="_blank" class="footer-media-link"><span class="fa fa-stack-overflow">&nbsp;</span></a>

              <a href="https://www.youtube.com/user/JeffEverhart0721" class="footer-media-link" target="_blank"><span class="fa fa-youtube"></span></a>
    </p>

    </div>
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle orange" data-toggle="collapse" data-target=".navbar-collapse" style="float:left; margin-left: 15px; margin-right:0px;">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand orange" href="<?php bloginfo( 'url' ); ?>" style="font-size: 1.75em;">JE</a>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
          <ul>
          <?php 
            
            $defaults = array(
              'theme_location' => 'header-menu', 
              'menu_class' => 'no-bullet nav navbar-nav'

            );

            wp_nav_menu( $defaults ); 

          ?>  
        </ul>
        </div><!--/.nav-collapse -->

      </div>
    </div>
     <a name="top"></a>
