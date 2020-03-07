<?php get_header(); ?>
<main id="main">
  <h1><?php wp_title(''); ?></h1>
  <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
  <article>
    <h2 class="blog-post-title"><?php the_title(); ?></h2>
    <p><?php the_excerpt(); ?></p>
    <a href="<?php the_permalink(); ?>">Read More</a>
  </article>

  <?php endwhile; else : ?>
  <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
