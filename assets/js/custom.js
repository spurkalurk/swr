(function($) {
	var $window = $(window),
		$body = $('body'),
		$featured = $('#featured-slider');

	$(document).ready(function() {
		// Search
		var searchField = $("#search-field").ghostHunter({
			results : "#search-results",
			onKeyUp : true,
			onPageLoad : true,
			includepages : true,
			info_template : '<div class="results-info">Posts found: {{amount}}</div>',
			result_template : '<div class="result-item"><div class="result-title"><a href="{{link}}">{{title}}</a></div><div class="result-date">{{pubDate}}</div></div>'
		});

		// Hidden sections
		$('#show-sidebar, #hide-sidebar').on('click', function(e){
			$body.toggleClass('sidebar--opened');
			e.preventDefault();
		});
		$('#show-search, #hide-search').on('click', function(e){
			if ( $body.hasClass('search--opened') ) {
				$body.removeClass('search--opened');
				searchField.clear();
			} else {
				$body.addClass('search--opened');
				setTimeout(function() {
					$("#search-field").focus();
				}, 300);
			}
			e.preventDefault();
		});
		$('#site-overlay').on('click', function(e){
			$body.removeClass('sidebar--opened search--opened');
			searchField.clear();
			e.preventDefault();
		});

		// Featured carousel
		$featured.slick({
			autoplay: true,
			arrows : true,
			dots : false,
			fade : true,
			appendArrows : $('.featured-nav'),
			prevArrow : $('.featured-prev'),
			nextArrow : $('.featured-next')
		});
		$featured.fadeIn(600, function(){
			$featured.parents().removeClass('slider-loading');
		});

		// Back to top button
		$('#top-link').on('click', function(e) {
			$('html, body').animate({'scrollTop': 0});
			e.preventDefault();
		});
		$window.scroll(function () {
			if ( $(this).scrollTop() > 600 ) {
				$body.addClass('is--scrolled');
			} else {
				$body.removeClass('is--scrolled');
			}
		});

		// Responsive videos
		$('.post').fitVids();

		// Images
		if ( $body.hasClass( 'post-template' ) || $body.hasClass( 'page-template' ) ) {
			adjustImages();
		}

		// Grid layout
		if ( $.isFunction( $.fn.masonry ) && $('#post-wrapper').length ) {
			gridLayout.refresh();
		}

		// Instagram feed
		if ( typeof instagram_user_id !== 'undefined' && typeof instagram_access_token !== 'undefined' ) {
			if ( $('#instafeed').length ) {
				var userFeed = new Instafeed({
					get: 'user',
					userId: instagram_user_id,
					accessToken: instagram_access_token,
					limit: 6,
					resolution: 'low_resolution',
					template: '<div class="instagram-item"><a target="_blank" href="{{link}}"><img src="{{image}}" alt="{{caption}}" /></a></div>'
				});
				userFeed.run();
			}
		}

	});

	$window.on('debouncedresize', onResize);

	var gridLayout = (function() {
		var $container = $('#post-wrapper'),
			$items = $container.children().addClass('post--loaded'),
			initialized = false,
			init = function() {
				$container.imagesLoaded(function() {
					$container.masonry({
						itemSelector: '.post',
						columnWidth: '.post',
						transitionDuration: 0
					});
					setTimeout(function() {
						$container.masonry('layout');
					}, 100);
					showItems($items);
					initialized = true;
				});
			},
			refresh = function() {
				if (!initialized) {
					init();
					return;
				}
				$container.masonry('layout');
			},
			showItems = function($items) {
				$items.each(function(i, obj) {
					var $postInside = $(obj).find('.post-inside');
					animatePost($postInside, i * 100);
				});
			},
			animatePost = function($postInside, delay) {
				setTimeout(function() {
					$postInside.addClass('is--visible');
				}, delay);
			};
		return {
			init: init,
			refresh: refresh
		}
	})();

	function onResize() {
		if ( $body.hasClass( 'post-template' ) || $body.hasClass( 'page-template' ) ) {
			adjustImages();
		}
		if ( $.isFunction( $.fn.masonry ) && $('#post-wrapper').length ) {
			gridLayout.refresh();
		}
	}

	function adjustImages() {
		var $entry = $('.post'),
			$entryContent = $entry.find('.entry-content'),
			entryWidth = $entry.width(),
			entryContentWidth = $entryContent.width(),
			margin = entryContentWidth / 2 - entryWidth / 2;

		$entryContent.find('.alignleft').each(function() {
			$(this).css({ 'margin-left': margin });
		});
		$entryContent.find('.alignright').each(function() {
			var _this = $(this),
				elName = _this.prop('tagName').toLowerCase();
			if ( elName == 'blockquote' ) {
				_this.css({ 'margin-right': margin + 15 });
			} else {
				_this.css({ 'margin-right': margin });
			}
		});
		$entryContent.find('.full-width').each(function() {
			$(this).css({ 'margin-left': margin, 'max-width': 'none', 'width': entryWidth });
		});
	}

})(jQuery);
