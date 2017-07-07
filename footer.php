
  </div> <!-- /container -->
    <footer class="footer">
      
      <div class="container">
          
          <div class="row">
             <div class="col-lg-4 col-md-4">
              <?php if( dynamic_sidebar('footer-left') ); ?> 

             </div>
             <div class="col-lg-4 col-md-4">
            <?php if( dynamic_sidebar('footer-center') ); ?> 

             </div>
             <div class="col-lg-4 col-md-4">
              <?php if( dynamic_sidebar('footer-right') ); ?> 

             </div>
          </div>

      </div>
    </footer>
    <div class="footer-credits footer-sticky">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                    <a href="#top" class="pull-right" style="margin-top: 10px;"><span class="glyphicon glyphicon-chevron-up"></span> Back to Top</a>
                      <h4 class="center-block">&copy;&nbsp;<?php echo bloginfo("name");?> <?php echo date("Y");?></h4>
                    
                    </div>
                  </div>
                </div>
    </div>
    <script type="text/javascript">
      
      var uls = document.querySelectorAll('.widget-panel ul');
      
      uls.forEach(function(ul){
        ul.classList.add('list-group'); 
      }); 

      var lis = document.querySelectorAll('.widget-panel ul li');
      
      lis.forEach(function(li){
        li.classList.add('list-group-item'); 
      }); 

      var tags = document.querySelectorAll('.widget-panel .tagcloud a'); 

      tags.forEach(function(tag){
        tag.classList.add("label", "label-default"); 
      })

      //var lis = document.querySelectorAll('.widget-panel ul li').classList.add('list-group-item'); 

    </script>
 <?php wp_footer(); ?>
  </body>
</html>
