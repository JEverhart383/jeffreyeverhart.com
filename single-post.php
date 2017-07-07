<?php 

/*
Template Name: Single Post
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
              <p class="blog-post-meta"><?php the_date()?> | Posted in <?php the_category(','); ?></p>
              <p><?php the_content(); ?></p>

            </div>

            <?php endwhile; else : ?>
            <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
            <?php endif; ?>

        </div><!-- /.blog-main -->
        <div class="col-lg-2 col-md-2">
          
        </div>


      </div><!-- /.row -->

    </div><!-- /.container -->
    <!-- Begin CTA container -->
    <div class="jumbotron">
      <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-md-3"></div>
        <div class="col-lg-6 col-md-6">
          <?php if( dynamic_sidebar('cta-one') ); ?> 
        </div>
        <div class="col-lg-3 col-md-3"></div>
      </div>
      </div>
    </div>


    <!-- Begin Pager and Comments -->
          <nav>
            <ul class="pager">
              <li>
                <?php $previous_post = get_previous_post();
                if (!empty( $previous_post)): ?>
                <a class="" href="<?php echo get_permalink( $previous_post->ID ); ?>"><span class="glyphicon glyphicon-chevron-left"></span>&nbsp;Previous</a>
              <?php endif; ?>
              </li>
              <li>
              <?php $next_post = get_next_post(); 
              if (!empty( $next_post )): ?>
              <a class="" href="<?php echo get_permalink( $next_post->ID ); ?>">&nbsp;Next <span class="glyphicon glyphicon-chevron-right"></span> </a>
              <?php endif; ?>
              </li>
            </ul>
          </nav>
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-3"></div>
              <div class="col-lg-6 col-md-6">
                <?php comments_template(); ?>
              </div>
              <div class="col-lg-3 col-md-3"></div>
            </div>
          </div>


    <?php get_footer(); ?>



