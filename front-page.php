<?php 

/*
Template Name: Front Page
*/

?>

<?php get_header(); ?>
    <main>
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
              <!-- Post Meta -->
              <article>
                <h2><?php the_title(); ?></h2>
                <p><?php the_date()?> | Posted in <?php the_category(', ')?></p>
                <!-- Post Thumbnail -->
                <?php if (has_post_thumbnail() ){ ?>
                    <img src=<?php echo get_the_post_thumbnail_url(); ?>> 
                <?php } ?>
                <p><?php the_excerpt(); ?></p>
                <a href="<?php the_permalink();?>"> Read More </a>
              </article>
            <?php endwhile;?> 
            <nav>
            <ul class="pager">
              <li>
                <?php previous_posts_link(); ?>
              </li>
              <li>
                <?php next_posts_link();?>
              </li>
            </ul>
          </nav>
            <?php else : ?>
            <p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
            <?php endif; ?>
    <!-- End main container div -->
    </main>

<?php get_footer(); ?>