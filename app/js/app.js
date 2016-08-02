/* jshint esversion: 6 */
var testImgArr;

$(function() {
  var wpURL = 'https://franciscan.university/fus-bulletin/';
//  getImages();

  var $container = $('.isotope-container'),
  cardSize = 's12 m12 l12',
  selector;

  //Layout Buttons
  $('.list-btn').hide();
  $('.grid-btn').click(function(){
    $(this).hide();
    $('.list-btn').show();
    $('.isotope-container .col').not('.single-post').removeClass(cardSize);
    $('.isotope-container').addClass('masonry');
    cardSize = 's12 m6 l4';
    $('.isotope-container .col').not('.single-post').addClass(cardSize);

  });

  $('.list-btn').click(function(){
    $(this).hide();
    $('.grid-btn').show();
    $('.isotope-container .col').not('.single-post').removeClass(cardSize);
    $('.isotope-container').removeClass('masonry');
    cardSize = 's12 m12 l12';
    $('.isotope-container .col').not('.single-post').addClass(cardSize);
  });

  //Isotope

  function isotopeize() {
    $container.isotope({
      itemSelector: '.col',
      layoutMode: 'masonry',
      masonry: {
        columnWidth: '.col',
      },
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });
  }

  function isotopeizeInit() {

    isotopeize();

    // // Category filter (sidebar)
    // $('#mobile-demo .category').click(function(){
    //   selector = $(this).attr('catid');
    //   $('.button-collapse').sideNav('hide');
    //   $container.isotope({
    //       filter: selector,
    //       animationOptions: {
    //           duration: 750,
    //           easing: 'linear',
    //           queue: false
    //       }
    //   });
    //   return false;
    // });

    //Init category card filtering from the category name displayed on the cards
    initCatCardFilters();

    //Init tags filtering
  //  initTagFilters();
  }

function initCatCardFilters() {
  // Category filter (in card)
  $('.cat-name').click(function(){
     var selector = $(this).attr('data-filter');
      $container.isotope({
          filter: selector,
          animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false
          }
      });
      return false;
  });
}

// function initTagFilters () {
//   // Tag filter (in card)
//   $('.tag-name').click(function(){
//
//      var selector = $(this).attr('data-filter');
//       $container.isotope({
//           filter: selector,
//           animationOptions: {
//               duration: 750,
//               easing: 'linear',
//               queue: false
//           }
//       });
//       return false;
//   });
// }

  //More button on post cards
//   var currentPath;
//   function expandCard() {
//
//   $('.expand-card').click(function(){
//
//     currentPath = window.location.hash;
//     //console.log(currentPath);
//     // $('#post-modal .modal-content h4').text($(this).parent().parent().find('.card-title').text());
//     // $('#post-modal .modal-content p').html($(this).parent().parent().find('.full-content').html());
//     // $('#post-modal .full-content, #post-modal .tag-name').show();
//     //$('#post-modal').openModal();
//     let slug = $(this).attr('slug');
//     let currentView = $('.isotope-container').html();
//     getPosts(`filter[name]=${slug}&`, 1, false);
//     let stateObj = {foo: 'bar'};
//
//     $('.isotope-container').html('');
//
//     window.location.hash = slug;
//     initCatCardFilters();
//     initTagFilters();
//
//     $('.modal-content h4').text($(this).parent().parent().find('.card-title').text());
//     $('.modal-content p').html($(this).parent().parent().find('.full-content').html());
//     $('.full-content, .tag-name').show();
//     });
//
//     //Card Images
//     $('.card-image img').click(function(){
//       $(this).parent().parent().find('.expand-card').trigger('click');
//       console.log($(this).parent().parent().find('.expand-card'));
//     });
//   }
//
// $('#post-modal .modal-close, .lean-overlay').click(function(){
//   $('#post-modal').closeModal();
//   let stateObj = {old: 'state'};
//   window.location.hash = currentPath;
// });

// $('.expand-card').leanModal({
//   ready: function() { alert('Ready'); },
//   complete: function() {console.log('closed');}
// });

//   //On modal close
// $('.modal-close').click(function(){
//
// });

//API Calls
	var i, t,
  categories = {},
  tags = {},
  images = {},
  cardImg,
  cardImgTemp,
  posts, postTitle, postContent, postCatagories, postTags, categoryName, categoryID, categorySlug, tagName, tagID, tagSlug, catName;



  function get(url) {
    return fetch(url, {
      method: 'get'
    });
  }

  function getJSON(url) {
    return get(url).then(function(response) {
      return response.json();
    });
  }



  //Get Categories

  getJSON(`${wpURL}wp-json/wp/v2/categories?per_page=100`)
  .then(function(data){
    $.each(data, function(i, category){
      categories[category.id] = category.name;
      $( '.filters' ).append( `<option value=".${category.id}" catID="${category.id}">${category.name}</option>` );

      $('#mobile-demo').append(
        `
          <li><a class="category" catID=".${category.id}" href="#category_name/${category.slug}">${category.name}</a></li>
        `
      );
    });

     $('select').material_select();
  })
  .catch(function(error) {
    console.log(error);
  });

//get tags
//TODO: get the top 20 most popular tags
  getJSON(`${wpURL}wp-json/wp/v2/tags?per_page=100`)
  .then(function(data){
    $.each(data, function(i, tag){
      tags[tag.id] = tag.name;
    });
  })
  .catch(function(error) {
    console.log(error);
  });

// Fetch and render posts when images are ready
  // function tryAgain() {
  //   if (Object.keys(images).length !== 0) {
  //     getPosts();
  //   } else {
  //     setTimeout(tryAgain, 200);
  //   }
  // }


// Router
  var path = window.location.hash.split("#")[1],
  viewType, viewTypePath;


  if (path !== undefined && path.includes('/') === true) {
    viewType = path.split("/")[0];
    viewTypePath = path.split("/")[1];

  }

  // Fires when the url changes
    window.onhashchange = function(event) {
      window.scrollTo(0,0);
      //Reset offset for infinite scroll
      offsetCount = 10;

      $('.preloader-wrapper').show();
      path = window.location.hash.split("#")[1];
      $('.isotope-container, #related-posts, .related-posts-row h3').html('');

      if (path !== undefined && path.includes('/') === true) {
        viewType = path.split("/")[0];
        viewTypePath = path.split("/")[1];
        // $('.isotope-container').html(`<h3>${viewTypePath}</h3>`);
        getPosts(`filter[${viewType}]=${viewTypePath}&`, 10, false);


      } else if (window.location.hash !== "") {
        getPosts(`filter[name]=${path}&`, 1, false);
      } else {
        getPosts();
      }
    };

    $('.isotope-container, #related-posts, .related-posts-row h3').html('');
    if (path !== undefined && path.includes('/') === true) {
      viewType = path.split("/")[0];
      viewTypePath = path.split("/")[1];
      getPosts(`filter[${viewType}]=${viewTypePath}&`, 10, false);

    } else if (window.location.hash !== "") {
      getPosts(`filter[name]=${path}&`, 1, false);
    } else {
      getPosts();
    }

  // Get Posts
  function getPosts(filterOpts='', perPage=10, isotopeInit=true, isInfinite=false) {
    getJSON(`${wpURL}wp-json/wp/v2/posts?${filterOpts}per_page=${perPage}`)
    .then(function(data){
      renderCards(data, isotopeInit, isInfinite);
    })
    .catch(function(error) {
      console.log(error);
    });
  }


//Infinite scroll
  let offsetCount = 10;
function infiniteScroll() {

  $(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
       $(window).unbind('scroll');
         console.log("near bottom!");

         path = window.location.hash.split("#")[1];

        if ($('.single-post').length > 0) {

        } else if (path !== undefined && path.includes('/') === true) {
         viewType = path.split("/")[0];
         viewTypePath = path.split("/")[1];
         // $('.isotope-container').html(`<h3>${viewTypePath}</h3>`);
         getPosts(`filter[${viewType}]=${viewTypePath}&offset=${offsetCount}&`, 10, true, true);
         offsetCount = offsetCount + 10;

       } else {
         getPosts(`offset=${offsetCount}&`, 10, true, true);
         offsetCount = offsetCount + 10;
       }


     }
  });
}

    // Get Images
    // function getImages() {
    //   getJSON(`${wpURL}wp-json/wp/v2/media?per_page=100`)
    //   .then(function(data){
    //     testImgArr = data;
    //     // This function is now unnecessary, but still here because getPosts wont run until the image var has data
    //
    //     for(let thisImage of data){
    //       if(thisImage.media_type === 'image') {
    //         images[thisImage.id] = {
    //           thumb: thisImage.media_details.sizes.thumbnail.source_url || "",
    //           medium: thisImage.media_details.sizes.medium.source_url || "",
    //           'medium-large': thisImage.media_details.sizes.medium_large.source_url || "",
    //           large: thisImage.media_details.sizes.large.source_url || "",
    //           // 'post-thumb': (function(){if(thisImage.media_details.sizes.hasOwnProperty('post-thumbnail')){return thisImage.media_details.sizes['post-thumbnail'].source_url !== undefined}else{return ""}})(),
    //           full: thisImage.media_details.sizes.full.source_url || ""
    //         };
    //       }
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
    // }

  // function checkUndefined(objName, keyName, valPath){
  //   if (valPath.hasOwnProperty(keyName)) {
  //     objName[]
  //   } else {
  //     ""
  //   }
  // }

  function renderCards(data, isotopeInit=true, isInfinite) {
    let i = 0;
    let cardImgArr;

    // Check to see if multiple posts will be rendered
    if (window.location.hash.includes('/') === true || window.location.hash.split('#')[1] === "" || window.location.hash === "") {

      if (data[0] === undefined && isInfinite === false) {
        $('.preloader-wrapper').hide();
        $('.isotope-container').html('<h3>No matching posts</h3>');
      } else {

      //if so, then render post cards
    for(let post of data) {
      // Get media url for this post from data saved as cardImgArr
     if(post.featured_media !== 0) {

      let thumb = post.better_featured_image.media_details.sizes.thumbnail.source_url;
      let medium = post.better_featured_image.media_details.sizes.medium.source_url;
      let mediumLarge = post.better_featured_image.media_details.sizes.medium_large.source_url;
      let large = post.better_featured_image.media_details.sizes.large.source_url;
        //This was were the image url initially came from
       //images[post.featured_media].large;
      cardImgTemp = `<div class="card-image">
                       <a href="#${post.slug}"><img sizes="(max-width: 600px) 95vw, 50vw" srcset="${thumb} 150w, ${medium} 300w, ${mediumLarge} 700w, ${large} 1000w"  src="${medium}"/></a>
                    </div>`;
     } else {
       cardImgTemp = '';
     }

    //  Get category data
    let categoryNames = "";
    let categoryIds = "";
    let categoryTemplate = "";
    if (post.pure_taxonomies.categories !== undefined) {
       let categoryData = post.pure_taxonomies.categories;

       for(let category of categoryData) {
         categoryNames = categoryNames + " " + category.name;
         categoryIds = `${categoryIds} .${category.cat_ID}`;
         categoryTemplate = `${categoryTemplate} <a href="#category_name/${category.slug}"> <div class="cat-name" data-filter=".${category.cat_ID}">${category.name}</div></a>`;
       }
     }

    //  Get tag data
    let tagNames = "";
    let tagIds = "";
    let tagTemplate = ""
    if (post.pure_taxonomies.tags !== undefined) {
       let tagData = post.pure_taxonomies.tags;

       for(let tag of tagData) {
         tagNames = tagNames + " " + tag.name;
         tagIds = `${tagIds} t${tag.term_id}`;
         tagTemplate = `${tagTemplate} <span class="tag-name" data-filter=.t${tag.term_id}>${tag.name},</span>`;
       }
     }

     let thisDate = new Date(post.date);

     $( '.isotope-container' ).append(
       `<div class="col ${cardSize} ${post.categories}${tagIds}">
         <div class="card isotope-item ${tagIds}">
            ${cardImgTemp}
            <div class="card-content" post-id=${post.id}>
              <div class="card-title">
              ${categoryTemplate}
                <a href="#${post.slug}">${post.title.rendered}</a>
                  <span class="post-date">${thisDate.getMonth()}/${thisDate.getDate()}/${thisDate.getFullYear()}</span>
              </div>
              <div class="content excerpt">

                ${post.excerpt.rendered}
              </div>
            </div>

          </div>
        </div>` );

        $(`div[post-id="${post.id}"] .more-link`).attr('href', `#${post.slug}`);

     if (i === data.length - 1) {
       $('.preloader-wrapper').hide();
       infiniteScroll();
      //  $('.isotope-container').imagesLoaded(function(){
      //    setTimeout(function(){
      //      if (isotopeInit === true) {
      //       isotopeizeInit();
      //      } else {
      //        isotopeizeInit();
      //        $container.isotope('destroy');
      //        isotopeizeInit();
      //      }
      //    }, 100);
      //  });


      //
      //  function waitForComputedSrcset (images, timeout, $dfd) {
      //     $dfd = $dfd || $.Deferred();
      //     console.log('waitForComputedSrcset');
      //     var computed = 0,
      //         length = images.length;
      //
      //     for (var i = 0; i < length; i++) {
      //         if (images[i].hasOwnProperty('currentSrc') && !! !images[i].currentSrc) {
      //             window.setTimeout(this.waitForComputedSrcset.bind(this, images, timeout, $dfd), timeout);
      //             return $dfd;
      //         }
      //         computed++;
      //     }
      //     return (length === computed) ? $dfd.resolve(images) : $dfd;
      // }
      //
      // var images = document.getElementsByTagName('img');
      //
      // $.when(waitForComputedSrcset(images, 50))
      //   .done(function(computedImages){
      //
      //   var length = images.length;
      //     for (var i = 0; i < length; i++) {
      //      if (images[i].hasOwnProperty('currentSrc') && !! !images[i].currentSrc) {
      //       images[i].src = images[i].currentSrc;
      //    }
      //   }
      //
      //   console.info('imagesComputed', computedImages);
      //   imagesLoaded(images,function(instance){
      //      console.info('imagesLoaded', instance);
      //   });
      // });

     }
     i++;
   }
  }
  } else {
    //if data contained only one post, render single post view
    for(let post of data) {
      // Get media url for this post from data saved as cardImgArr
     if(post.featured_media !== 0) {
       let thumb = post.better_featured_image.media_details.sizes.thumbnail.source_url;
       let medium = post.better_featured_image.media_details.sizes.medium.source_url;
       let mediumLarge = post.better_featured_image.media_details.sizes.medium_large.source_url;
       let large = post.better_featured_image.media_details.sizes.large.source_url;
         //This was were the image url initially came from
        //images[post.featured_media].large;
       cardImgTemp = `<div class="card-image">
                        <img  sizes="(max-width: 993px) 95vw, 75vw" srcset="${thumb} 150w, ${medium} 300w, ${mediumLarge} 700w, ${large} 1000w" src="${thumb}" />
                     </div>`;
     } else {
       cardImgTemp = '';
     }

    //  Get category data
    let categoryNames = "";
    let categoryIds = "";
    let categoryTemplate = "";
    if (post.pure_taxonomies.categories !== undefined) {
       let categoryData = post.pure_taxonomies.categories;

       for(let category of categoryData) {
         categoryNames = categoryNames + " " + category.name;
         categoryIds = `${categoryIds} .${category.cat_ID}`;
         categoryTemplate = `${categoryTemplate} <a href="#category_name/${category.slug}"> <div class="cat-name" data-filter=".${category.cat_ID}">${category.name}</div></a>`;
       }
     }

    //  Get tag data
    let tagNames = "";
    let tagIds = "";
    let tagTemplate = ""
    if (post.pure_taxonomies.tags !== undefined) {
       let tagData = post.pure_taxonomies.tags;

       for(let tag of tagData) {
         tagNames = tagNames + " " + tag.name;
         tagIds = `${tagIds} t${tag.term_id}`;
         tagTemplate = `
          ${tagTemplate} <a href="#tag/${tag.slug}" class="tag-link"><span class="tag-name" data-filter=.t${tag.term_id}>${tag.name},</span></a>`;
       }
     }
     let thisDate = new Date(post.date);

     $( '.isotope-container' ).append(
       `<div class="col s12 ${post.categories}${tagIds} single-post">
         <div class="card isotope-item ${tagIds}">
            ${cardImgTemp}
            <div class="card-content" post-id=${post.id}>
              <div class="card-title">
              ${categoryTemplate}
                <a href="#${post.slug}">${post.title.rendered}</a>
                <span class="post-date">${thisDate.getMonth()}/${thisDate.getDate()}/${thisDate.getFullYear()}</span>
              </div>
              <div class="content excerpt">

                ${post.content.rendered}
              </div>
            </div>
            <div class="card-action">
              <h6>Tags</h6>
              ${tagTemplate}
            </div>
          </div>
        </div>` );

        $(`div[post-id="${post.id}"] .more-link`).attr('href', `#${post.slug}`);

     if (i === data.length - 1) {
           $container.isotope('destroy');
           $('.preloader-wrapper').hide();
     }
     i++;

     //Add related posts
     getJSON(`${wpURL}wp-json/wp/v2/posts/?filter[category_name]=${post.pure_taxonomies.categories[0].slug}&per_page=3&exclude=${post.id}`)
     .then(function(data){
       for(let relatedPost of data) {
         if(relatedPost.featured_media !== 0) {
           thumb = relatedPost.better_featured_image.media_details.sizes.thumbnail.source_url;
           medium = relatedPost.better_featured_image.media_details.sizes.medium.source_url;

            //This was were the image url initially came from
           //images[post.featured_media].large;
          cardImgTemp = `<div class="card-image">
                               <img src="${medium}"/>
                             </div>`;
         } else {
           cardImgTemp = '';
         }

         let relatedPostsTemp = `
         <div class="col s12 m4">
          <a href="#${relatedPost.slug}">
           <div class="card hoverable">
             ${cardImgTemp}
             <div class="card-stacked">
               <div class="card-content">
                 <p>${relatedPost.title.rendered}</p>
               </div>
             </div>
           </div>
           </a>
         </div>
         `
         $('#related-posts').append(relatedPostsTemp);
         $('.related-posts-row h3').text('You may also be interested in...');
       }
     })
     .catch(function(error) {
       console.log(error);
     });

     }

   }



 }

//Init side nav
$(".button-collapse").sideNav({
  //closeOnClick: true,
  menuWidth: 300
});


 //Search input
  var $searchInput;

  $('.search-form').hide();
  $('.search-icon').click(function(){
    $('.page-title, nav ul.right, nav .button-collapse').hide();
    $('.search-form').show();
    // Put cursor in search input
      $searchInput = $('#search');
      $searchInput.focus();
  });

  $('.search-nav .close-search').click(function(){
    $('.page-title, nav ul.right, nav .button-collapse').show();
    $('.search-form').hide();
  });

  //Search input
  // adapted from https://github.com/bearded-avenger/wp-live-search/blob/master/public/assets/js/wp-live-search.js

  var postList = $('#post-list'),
    results = $('#results'),
    helper = $('#helper'),
    input = $('#search'),
    timer;

    $('#close-search').click(function() {
      input.val('');
      $(this).removeClass('active');
      $(this).siblings('label').removeClass('active');
    });

  $(input).on('keyup keypress', function(e) {

    // clear the previous timer
		clearTimeout(timer);

    let key = e.which,
      val = $.trim($(this).val()),
      valEqual = val == $(this).val(),
      notEmpty = '' !== val,
      total = 10,
      searchURL = `${wpURL}wp-json/wp/v2/posts?filter[s]=${val}&per_page=${total}`;

    // 600ms delay so we dont exectute excessively
    timer = setTimeout(function(){
      console.log('timer');
      // don't proceed if the value is empty or not equal to itself
				if ( !valEqual && !notEmpty )
					return false;
          console.log(val);
				// what if the user only types two characters?
				if ( val.length == 2 && !$(helper).length ) {
          console.log('2chars');
					// $( input ).after( helperSpan );
        }

        // if we have more than 3 characters
        if ( val.length >= 3 || val.length >= 3 && 13 == key ) {
          //TODO: after the || should be >= 1 maybe? want search to work with less than 3 on enter
console.log('3chars');
          // dont run on escape or arrow keys
					if( blacklistedKeys( key ) )
						return false;

            //TODO: Add as loader in the html and link classes
          // // show loader
					// $( loader ).removeClass('wpls--hide').addClass('wpls--show');
          // TODO: figure out what the helpers are
					// // remove any helpers
					// $( helper ).fadeOut().remove();
          // TODO: see function below
					// // remove the close
					// destroyClose();
          // make the search request
          $('.isotope-container').html('');
          //getPosts(`filter[s]=${val}&`, total, false);
          window.location.hash = `s/${val}`;

        }

    }, 600);

  });

		/**
		* 	Blacklisted keys - dont allow search on escape or arrow keys
		*	@since 0.9
		*/
		function blacklistedKeys( key ){

			return 27 == key || 37 == key || 38 == key || 39 == key || 40 == key;

		}

});
