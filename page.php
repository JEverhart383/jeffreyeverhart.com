<?php 

/*
Template Name: Single Page w/o OptIn
*/

?>

<?php get_header(); ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<div class="jumbotron">
  <div class="container">
  <h1 class="center-block"><?php the_title(); ?></h1>       
  </div>
</div>
<div class="container">

      <div class="row">
      <div class="col-lg-2 col-md-2"></div>
        
        <div class="col-lg-8 col-md-8 blog-main">
            <div class="blog-post">
              <p><?php the_content(); ?></p>

            </div>

            <?php endwhile; else : ?>
            <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
            <?php endif; ?>
          
          <?php comments_template(); ?>

        </div><!-- /.blog-main -->
        <div class="col-lg-2 col-md-2">
          
        </div>


      </div><!-- /.row -->

    </div><!-- /.container -->


<?php get_footer(); ?>