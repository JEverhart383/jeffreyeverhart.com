<?php 

/*
Template Name: Single Post
*/

?>

<?php get_header(); ?>
<main id="main">

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
  <h1><?php the_title(); ?></h1>       
  <p><?php the_date()?> | Posted in <?php the_category(', '); ?></p>
  <article>
    <?php the_content(); ?>
  </article>
  <?php endwhile; else : ?>
    <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
  <?php endif; ?>


    <!-- Begin Pager and Comments -->
    <nav>
      <ul class="pager">
        <li>
          <?php $previous_post = get_previous_post(); if (!empty( $previous_post)): ?>
            <a class="" href="<?php echo get_permalink( $previous_post->ID ); ?>">Previous</a>
          <?php endif; ?>
        </li>
        <li>
          <?php $next_post = get_next_post(); if (!empty( $next_post )): ?>
            <a class="" href="<?php echo get_permalink( $next_post->ID ); ?>">Next</a>
          <?php endif; ?>
        </li>
      </ul>
    </nav>
    <?php comments_template(); ?>
</main>
<?php get_footer(); ?>



