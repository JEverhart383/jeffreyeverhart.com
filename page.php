<?php get_header(); ?>
<main id="main">
  <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <h1><?php the_title(); ?></h1>
    <article>
      <?php the_content(); ?>
    </article>
    <?php endwhile; else : ?>
    <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
    <?php endif; ?>
    <?php comments_template(); ?>
</main>
<?php get_footer(); ?>