<?php 

/*
Template Name: Sidebar-Page
*/

?>

<?php get_header(); ?>
<div class="jumbotron">

      <div class="container">
            <h1 class="center-block"><?php wp_title(''); ?></h1>
      </div>
    </div>

<div class="container">
  <div class="row">

        <!-- Main Content Area -->
        <div class="col-sm-8">

         <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <div class="blog-post">
              
              <p><?php the_content(); ?></p>

            </div>

            <?php endwhile; else : ?>
            <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
            <?php endif; ?>


      
      </div>

      
      <!-- Sidebar -->
      <div class="col-sm-3 col-sm-offset-1">
        <?php if( dynamic_sidebar('sidebar') ); ?>
          
      </div><!-- /.blog-sidebar -->
      </div><!-- /.row -->

    </div><!-- /.container -->

    <?php get_footer(); ?>