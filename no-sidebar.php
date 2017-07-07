<?php 

/*
Template Name: Full-Width 
*/

?>

<?php get_header(); ?>
<div class="jumbotron">

      <div class="container">
        <div class="col-lg-4"></div>
        <div class="col-lg-4">
            <div class="call-out-text">
            <h1 class="center-block"><?php wp_title(''); ?></h1>
            <div class="arrow-down center-block"></div>
        </div>
        <div class="col-lg-4"></div>
      
        
    </div>
      </div>
    </div>

<div class="container">

    <div class="blog-post">
              <h2 class="blog-post-title"><?php the_title(); ?></h2>
                <p><?php the_content(); ?></p>

            </div>

            <?php endwhile; else : ?>
            <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
            <?php endif; ?>


    </div>
    





</div><!-- /.container -->

    <?php get_footer(); ?>