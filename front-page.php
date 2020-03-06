<?php 

/*
Template Name: Front Page
*/

?>

<?php get_header(); ?>

<!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron front-page">
      <div class="container">
      	<div class="call-out-text">
        <h1>Hello out there web friend.</h1> 
        <h2>My name is Jeff.</h2>
        <p>
        <svg width="300" height="200">
         <line x1="25" x2="150" y1="25" y2="75" stroke="#303434" fill="transparent" stroke-width="5"/>
         <line x1="25" x2="100" y1="25" y2="175" stroke="#303434" fill="transparent" stroke-width="5"/>
         <line x1="25" x2="150" y1="25" y2="75" stroke="#303434" fill="transparent" stroke-width="5"/>
         <line x1="25" x2="200" y1="25" y2="165" stroke="#303434" fill="transparent" stroke-width="5"/>
         <line x1="150" x2="100" y1="75" y2="175" stroke="#303434" fill="transparent" stroke-width="5"/>
         <line x1="200" x2="256" y1="165" y2="47" stroke="#303434" fill="transparent" stroke-width="5"/>

         <circle cx="25" cy="25" r="25" fill="#a61d58" />
         <circle cx="150" cy="75" r="25" fill="#a61d58" />
         <circle cx=100 cy="175" r="25" fill="#a61d58" />
         <circle cx="200" cy="165" r="25" fill="#a61d58" />
         <circle cx="256" cy="47" r="25" fill="#1d86a6" />

        </svg>
        </p>
       
        <h2>Thanks for connecting.</h2>
        <div class="arrow-down center-block"></div>
        </div>
      </div>
    </div>
    <div class="container">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <div class="panel panel-default">
              <div class="panel-body">
              <!-- Post Meta -->
              <h2 ><?php the_title(); ?></h2>
              <p><?php the_date()?> | Posted in <?php the_category(',')?></p>

              <!-- Post Thumbnail -->
              <?php if (has_post_thumbnail() ){ ?>
                <div class="col-lg-3 col-md-4">
                  <img class="img img-responsive thumbnail" src=<?php echo get_the_post_thumbnail_url(); ?>> 
                </div>

                <?php } ?>

              <div class="col-lg-9 col-md-8" >
                <?php the_excerpt(); ?>
              <a class="btn btn-primary" href=<?php the_permalink(); ?> >
              Read More
              </a>
              </div>
              

              <!-- End Panel Body -->
              </div>
              <!-- End Panel -->
            </div>

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
    </div>

<?php get_footer(); ?>