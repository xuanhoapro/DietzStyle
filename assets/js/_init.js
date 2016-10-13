/* global jQuery:false */
/* global STREETSTYLE_GLOBALS:false */

jQuery(document).ready(function() {
	"use strict";
	STREETSTYLE_GLOBALS['theme_init_counter'] = 0;
	streetstyle_init_actions();
});

jQuery(window).on('beforeunload', function() {
	"use strict";
	// Show preloader
//	jQuery('body.preloader>.outer_wrap,body.preloader>.body_wrap,body.preloader>.streetstyle_profiler').css({opacity:0.5});	//.animate({opacity:0}, 'fast');
	jQuery('#page_preloader').css({display: 'block', opacity: 0}).animate({opacity:0.8}, 300);
});


// Theme init actions
function streetstyle_init_actions() {
	"use strict";



	if (STREETSTYLE_GLOBALS['vc_edit_mode'] && jQuery('.vc_empty-placeholder').length==0 && STREETSTYLE_GLOBALS['theme_init_counter']++ < 30) {
		setTimeout(streetstyle_init_actions, 200);
		return;
	}


    hot_spot_hover();

    function hot_spot_hover() {
        jQuery('.hot_spot_hover').hover(function() {
                var klass = jQuery(this).attr('data-class');
                jQuery('[data-class=' + klass + ']').addClass('hovered');
                jQuery(this).addClass('hovered');
            },
            function() {
                var klass = jQuery(this).attr('data-class');
                jQuery('[data-class=' + klass + ']').removeClass('hovered');
                jQuery(this).removeClass('hovered');
            }
        );
    }


	// Hide preloader
//	jQuery('body.preloader>.outer_wrap,body.preloader>.body_wrap,body.preloader>.streetstyle_profiler').animate({opacity:1}, 'slow');	//.css({opacity:1});
//	jQuery('#page_preloader').hide();	//animate({opacity:0}, 300).css({display: 'none'});
	jQuery('#page_preloader').animate({opacity:0}, 300).css({display: 'none'});

	// Check for Retina display
	if (streetstyle_is_retina()) {
		streetstyle_set_cookie('streetstyle_retina', 1, 365);
	}

	streetstyle_ready_actions();
	streetstyle_resize_actions();
	streetstyle_scroll_actions();

	// Resize handlers
	jQuery(window).resize(function() {
		"use strict";
		streetstyle_resize_actions();
	});

	// Scroll handlers
	jQuery(window).scroll(function() {
		"use strict";
		streetstyle_scroll_actions();
	});
}



// Theme first load actions
//==============================================
function streetstyle_ready_actions() {
	"use strict";


	// Menu
    //----------------------------------------------

	// Clone main menu for responsive
	if (jQuery('ul#menu_main').length > 0) {
		var menu_responsive = jQuery('ul#menu_main').clone().removeAttr('id').removeClass('menu_main_nav').addClass('menu_main_responsive');	//.insertAfter('ul#menu_main');
		jQuery('ul#menu_main').parent().parent().append(menu_responsive);
		streetstyle_show_current_menu_item(jQuery('.menu_main_responsive'), jQuery('.menu_main_responsive_button'));
	}

    // Clone user menu for responsive
    if (jQuery('ul#menu_user').length > 0) {
        var menu_responsive = jQuery('ul#menu_user').clone().removeAttr('id').removeClass('menu_user_nav').addClass('menu_user_responsive');	//.insertAfter('ul#menu_main');
        jQuery('ul#menu_user').parent().append(menu_responsive);
        //streetstyle_show_current_menu_item(jQuery('.menu_user_responsive'), jQuery('.menu_user_responsive_button'));
    }

	// Responsive menu button
	jQuery('.menu_main_responsive_button, .menu_user_responsive_button').on('click', function(e){
		"use strict";
		jQuery(this).toggleClass('opened');
		if (jQuery(this).hasClass('menu_main_responsive_button'))
			jQuery('.menu_main_responsive').slideToggle();
		else {
            jQuery('.menu_user_responsive').slideToggle();
            if(jQuery('.menu_main_responsive_button').hasClass('opened')){
                jQuery('.menu_main_responsive_button').click();
            }
		}
		e.preventDefault();
		return false;
	});

	// Side menu widgets button
	jQuery('.sidebar_outer_widgets_button').on('click', function(e){
		"use strict";
		jQuery('.sidebar_outer_widgets').slideToggle();
		e.preventDefault();
		return false;
	});

	// Submenu click handler for the responsive menu
	jQuery('.menu_main_responsive, .menu_user_responsive').on('click', 'li a', function(e) {
		"use strict";
		var is_menu_main = jQuery(this).parents('.menu_main_responsive').length > 0;
		if ((!is_menu_main || jQuery('body').hasClass('menu_mode_responsive')) && jQuery(this).parent().hasClass('menu-item-has-children')) {
			if (jQuery(this).siblings('ul:visible').length > 0)
				jQuery(this).siblings('ul').slideUp().parent().removeClass('opened');
			else
				jQuery(this).siblings('ul').slideDown().parent().addClass('opened');
		}
		if (jQuery(this).attr('href')=='#' || ((!is_menu_main || jQuery('body').hasClass('menu_mode_responsive')) && jQuery(this).parent().hasClass('menu-item-has-children'))) {
			e.preventDefault();
			return false;
		}
	});

	// Init superfish menus
	streetstyle_init_sfmenu('ul#menu_main, ul#menu_user');

	// Store height of the top panel
	STREETSTYLE_GLOBALS['top_panel_height'] = 0;	//Math.max(0, jQuery('.top_panel_wrap').height());



	// Search form
    //----------------------------------------------
	if (jQuery('.search_wrap:not(.inited)').length > 0) {
		jQuery('.search_wrap:not(.inited)').each(function() {
			"use strict";
			jQuery(this).addClass('inited');
			// Focus/Blur in search field
			jQuery(this).find('.search_field').focus(function(e) {
				"use strict";
				jQuery(this).attr('data-width', jQuery(this).outerWidth()).parents('.search_wrap').find('.search_field').animate({'width':'17em'}, 300, 'linear');
			});
			jQuery(this).find('.search_field').focusout(function(e) {
				"use strict";
				jQuery(this).animate({'width':jQuery(this).data('width')}, 300, 'linear');
			});
			// Click "Search submit"
			jQuery(this).find('.search_submit').on('click', function(e) {
				"use strict";
				var search_wrap = jQuery(this).parents('.search_wrap');
				if (search_wrap.find('.search_field').val() != '')
					search_wrap.find('form').get(0).submit();
				e.preventDefault();
				return false;
			});
			// Click "Close search results"
			jQuery(this).find('.search_results_close').on('click', function(e) {
				"use strict";
				jQuery(this).parent().fadeOut();
				e.preventDefault();
				return false;
			});
			// Click "More results"
			jQuery(this).on('click', '.search_more', function(e) {
				"use strict";
				if (jQuery(this).parents('.search_wrap').find('.search_field').val() != '')
					jQuery(this).parents('.search_wrap').find('form').get(0).submit();
				e.preventDefault();
				return false;
			});
			// AJAX search
			if (jQuery(this).hasClass('search_ajax')) {
				var ajax_timer = null;
				jQuery(this).find('.search_field').keyup(function(e) {
					"use strict";
					var search_field = jQuery(this);
					var s = search_field.val();
					if (ajax_timer) {
						clearTimeout(ajax_timer);
						ajax_timer = null;
					}
					if (s.length >= 4) {
						ajax_timer = setTimeout(function() {
							jQuery.post(STREETSTYLE_GLOBALS['ajax_url'], {
								action: 'ajax_search',
								nonce: STREETSTYLE_GLOBALS['ajax_nonce'],
								text: s
							}).done(function(response) {
								"use strict";
								clearTimeout(ajax_timer);
								ajax_timer = null;
								var rez = {};
								try {
									rez = JSON.parse(response);
								} catch (e) {
									rez = { error: STREETSTYLE_GLOBALS['search_error'] };
								}
								var msg = rez.error === '' ? rez.data : rez.error;
								search_field.parents('.search_ajax').find('.search_results_content').empty().append(rez.data);
								search_field.parents('.search_ajax').find('.search_results').fadeIn();
							});
						}, 500);
					}
				});
			}
		});
	}



    // Search form new
    //----------------------------------------------
    if (jQuery('.search_link:not(.inited)').length > 0) {
            // Click "Search submit"
            jQuery('body').find('.search_link').on('click', function(e) {
                "use strict";
                jQuery('.search_form_wrap_fixed').fadeIn();
                jQuery('body').addClass('search_fixed');
                jQuery('.search_form_wrap_fixed .search_field').focus();
                e.preventDefault();
                return false;
            });
            // Click "Close search results"
            jQuery('body').find('.search_close').on('click', function(e) {
                "use strict";
                jQuery('.search_form_wrap_fixed').fadeOut();
                jQuery('body').removeClass('search_fixed');
                e.preventDefault();
                return false;
            });
    }


	// Widgets decoration
    //----------------------------------------------

	// Decorate nested lists in widgets and side panels
	jQuery('.widget ul > li').each(function() {
		"use strict";
		if (jQuery(this).find('ul').length > 0) {
			jQuery(this).addClass('has_children');
		}
	});

	// Archive widget decoration
	jQuery('.widget_archive a').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[val.length-1] = '<span>' + val[val.length-1] + '</span>';
			jQuery(this).html(val.join(' '))
		}
	});

	// Calendar widget decoration
	jQuery('.widget_calendar #prev a').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[0] = '<span class="icon-left"></span>';
			jQuery(this).html(val.join(''))
		}
	});
	jQuery('.widget_calendar #next a').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[val.length-1] = '<span class="icon-right"></span>';
			jQuery(this).html(val.join(''))
		}
	});


	// Forms validation
    //----------------------------------------------

	jQuery("select").wrap('<div class="select_container"></div>');

	// Comment form
	jQuery("form#commentform").submit(function(e) {
		"use strict";
		var rez = streetstyle_comments_validate(jQuery(this));
		if (!rez)
			e.preventDefault();
		return rez;
	});

	// Contact form
	if (jQuery('.sc_contact_form:not(.inited)').length > 0) {
		jQuery(".sc_contact_form:not(.inited)")
			.addClass('inited')
			.find('form')
			.submit(function(e) {
				"use strict";
				streetstyle_contact_form_validate(jQuery(this));
				e.preventDefault();
				return false;
			});
	}



	// Socials share
    //----------------------------------------------
	if (jQuery('.post_counters_item .socials_caption:not(.inited)').length > 0) {
		jQuery('.post_counters_item .socials_caption:not(.inited)').each(function() {
			jQuery(this).addClass('inited').on('click', function(e) {
				"use strict";
				jQuery(this).siblings('.social_items').fadeToggle();
				e.preventDefault();
				return false;
			});
		});
	}
    if (jQuery('.post_counters_item .social_items:not(.inited)').length > 0) {
        jQuery('.post_counters_item .social_items:not(.inited)').each(function() {
            "use strict";
            jQuery(this).addClass('inited').on('click', '.social_item_popup > a.social_icons', function(e) {
                "use strict";
                var url = jQuery(this).data('link');
                window.open(url, '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=480, height=400, toolbar=0, status=0');
                e.preventDefault();
                return false;
            });
        });
    }

    // PinIt link
    if (jQuery('.label_pinit:not(.inited)').length > 0) {
        jQuery('.label_pinit:not(.inited)').each(function() {
            "use strict";
            jQuery(this).addClass('inited').on('click', function(e) {
                "use strict";
                var url = jQuery(this).attr('href');
                window.open(url, '_blank', 'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=480, height=400, toolbar=0, status=0');
                e.preventDefault();
                return false;
            });
        });
    }


	// Tabs
    //------------------------------------
	if (jQuery('.sc_tabs:not(.inited)').length > 0) {
		jQuery('.sc_tabs:not(.inited)').each(function () {
			"use strict";
			var init = jQuery(this).data('active');
			if (isNaN(init)) init = 0;
			else init = Math.max(0, init);
			if (jQuery.ui && jQuery.ui.tabs) {
				jQuery(this).addClass('inited').tabs({
					active: init,
					show: {
						effect: 'fadeIn',
						duration: 300
					},
					hide: {
						effect: 'fadeOut',
						duration: 300
					}
				});
			}
		});
	}


	// Shortcodes handlers
    //------------------------------------

	// Recent news widget and sc
	jQuery('.sc_recent_news_header_category_item_more').on('click', function() {
		"use strict";
		jQuery(this).toggleClass('opened').find('.sc_recent_news_header_more_categories').slideToggle();
	});


	// Other settings
    //------------------------------------

	// Scroll to top button
	jQuery('.scroll_to_top').on('click', function(e) {
		"use strict";
		jQuery('html,body').animate({
			scrollTop: 0
		}, 'slow');
		e.preventDefault();
		return false;
	});

	// Init post format specific scripts
	streetstyle_init_post_formats();

	// Init hidden elements (if exists)
	if (window.streetstyle_init_hidden_elements) streetstyle_init_hidden_elements(jQuery('body').eq(0));

} //end ready




// Scroll actions
//==============================================

// Do actions when page scrolled
function streetstyle_scroll_actions() {
	"use strict";

	var scroll_offset = jQuery(window).scrollTop();
	var scroll_to_top_button = jQuery('.scroll_to_top');
	var adminbar_height = Math.max(0, jQuery('#wpadminbar').height());

	if (STREETSTYLE_GLOBALS['top_panel_height'] == 0)	STREETSTYLE_GLOBALS['top_panel_height'] = jQuery('.top_panel_wrap').height();

	// Call skin specific action (if exists)
    //----------------------------------------------
	if (window.streetstyle_skin_scroll_actions) streetstyle_skin_scroll_actions();


	// Scroll to top button show/hide
	if (scroll_offset > STREETSTYLE_GLOBALS['top_panel_height'])
		scroll_to_top_button.addClass('show');
	else
		scroll_to_top_button.removeClass('show');

	// Fix/unfix top panel
	if (!jQuery('body').hasClass('menu_mode_responsive')) {
		var slider_height = 0;
		if (jQuery('.top_panel_below .slider_wrap').length > 0) {
			slider_height = jQuery('.top_panel_below .slider_wrap').height();
			if (slider_height < 10) {
				slider_height = jQuery('.slider_wrap').hasClass('.slider_fullscreen') ? jQuery(window).height() : STREETSTYLE_GLOBALS['slider_height'];
			}
		}
		var logo_height = 0;
		if (jQuery('.top_panel_logo_wrap').length > 0) {
			logo_height = jQuery('.top_panel_logo_wrap').height();
		}
		if (scroll_offset <= logo_height + slider_height + STREETSTYLE_GLOBALS['top_panel_height']) {
			if (jQuery('body').hasClass('top_panel_fixed')) {
				jQuery('body').removeClass('top_panel_fixed');
			}
		} else if (scroll_offset > logo_height + slider_height + STREETSTYLE_GLOBALS['top_panel_height']) {
			if (!jQuery('body').hasClass('top_panel_fixed') && jQuery(document).height() > jQuery(window).height()*1.5) {
				jQuery('.top_panel_fixed_wrap').height(STREETSTYLE_GLOBALS['top_panel_height']);
				jQuery('.top_panel_wrap').css('marginTop', '-150px').animate({'marginTop': 0}, 500);
				jQuery('body').addClass('top_panel_fixed');
			}
		}

	}

	// Fix/unfix sidebar
	streetstyle_fix_sidebar();

	// Scroll actions for animated elements
	jQuery('[data-animation^="animated"]:not(.animated)').each(function() {
		"use strict";
		if (jQuery(this).offset().top < jQuery(window).scrollTop() + jQuery(window).height())
			jQuery(this).addClass(jQuery(this).data('animation'));
	});
}



// Resize actions
//==============================================

// Do actions when page scrolled
function streetstyle_resize_actions() {
	"use strict";
	streetstyle_responsive_menu();
	streetstyle_video_dimensions();
	streetstyle_fix_sidebar();
	streetstyle_sc_sliders_resize();
}


// Fix/unfix sidebar
function streetstyle_fix_sidebar() {
	"use strict";
	var sb = jQuery('.sidebar');
	if (sb.length > 0) {
		var content = jQuery('.page_content_wrap .content_wrap');

		// Unfix on responsive
		if (content.width() < 900) {
			if (sb.css('position')=='fixed') {
				sb.css({
					'float': sb.hasClass('right') ? 'right' : 'left',
					'position': 'static'
				});
			}

		} else {

			var sb_height = sb.outerHeight();
			var content_height = sb.siblings('.content').outerHeight();
			var scroll_offset = jQuery(window).scrollTop();
			var logo_height = jQuery('.top_panel_logo').length > 0 ? jQuery('.top_panel_logo').height() : 0;
	        var slider_height = jQuery('.slider_wrap').length > 0 ? jQuery('.slider_wrap').height() : 0;
			var menu_height = jQuery('.top_panel_wrap').length > 0 ? jQuery('.top_panel_wrap').height() : 0;
			var page_padding = parseInt(jQuery('.page_content_wrap').css('paddingTop'));
			if (isNaN(page_padding)) page_padding = 0;

			if (sb_height < content_height &&
				(sb_height >= jQuery(window).height() && scroll_offset + jQuery(window).height() > sb_height + logo_height + menu_height + slider_height + page_padding
				||
				sb_height < jQuery(window).height() && scroll_offset > logo_height  + slider_height + page_padding )
				) {

				// Fix when sidebar bottom appear
				if (sb.css('position')!=='fixed') {
					sb.css({
						'float': 'none',
						'position': 'fixed',
						'top': Math.min(0, jQuery(window).height() - sb_height) + 'px'
					});
				}

				// Detect horizontal position when resize
				var pos = jQuery('.page_content_wrap .content_wrap').position();
				pos = pos.left + Math.max(0, parseInt(jQuery('.page_content_wrap .content_wrap').css('paddingLeft'))) + Math.max(0, parseInt(jQuery('.page_content_wrap .content_wrap').css('marginLeft')));
				if (sb.hasClass('right'))
					sb.css({ 'right': pos });
				else
					sb.css({ 'left': pos });

				// Shift to top when footer appear
				var footer_top = 0;
				var footer_pos = jQuery('.footer_wrap').position();
				if (footer_pos)
					footer_top = footer_pos.top;
				else {
					footer_pos = jQuery('.copyright_wrap').position();
					if (footer_pos) footer_top = footer_pos.top;
				}
				if (footer_top > 0 && scroll_offset + jQuery(window).height() > footer_top)
					sb.css({
						'top': Math.min(menu_height+page_padding, jQuery(window).height() - sb_height - (scroll_offset + jQuery(window).height() - footer_top + 30)) + 'px'
					});
				else
					sb.css({
						'top': Math.min(menu_height+page_padding, jQuery(window).height() - sb_height) + 'px'
					});


			} else {

				// Unfix when page scrolling to top
				if (sb.css('position')=='fixed') {
					sb.css({
						'float': sb.hasClass('right') ? 'right' : 'left',
						'position': 'static',
						'top': 'auto',
						'left': 'auto',
						'right': 'auto'
					});
				}

			}
		}
	}
}


// Check window size and do responsive menu
function streetstyle_responsive_menu() {
	"use strict";
	// Check relayout mode
	if (STREETSTYLE_GLOBALS['menu_mode_relayout_width'] > 0) {
		if (streetstyle_is_responsive_need(STREETSTYLE_GLOBALS['menu_mode_relayout_width']))
			if (!jQuery('body').hasClass('menu_mode_relayout')) jQuery('body').addClass('menu_mode_relayout');
		else if (jQuery('body').hasClass('menu_mode_relayout'))
			jQuery('body').removeClass('menu_mode_relayout');
	}
	// Check responsive mode
	if (STREETSTYLE_GLOBALS['menu_mode_responsive_width'] > 0) {
		if (streetstyle_is_responsive_need(STREETSTYLE_GLOBALS['menu_mode_responsive_width'])) {
			if (!jQuery('body').hasClass('menu_mode_responsive')) {
				jQuery('body').removeClass('top_panel_fixed').addClass('menu_mode_responsive');
				if (jQuery('body').hasClass('menu_mode_relayout'))
					jQuery('body').removeClass('menu_mode_relayout');
				if (jQuery('ul.menu_main_nav').hasClass('inited')) {
					jQuery('ul.menu_main_nav').removeClass('inited').superfish('destroy');
				}
				if (jQuery('ul.menu_side_nav').hasClass('inited')) {
					jQuery('ul.menu_side_nav').removeClass('inited').superfish('destroy');
				}
			}
		} else {
			if (jQuery('body').hasClass('menu_mode_responsive')) {
				jQuery('body').removeClass('menu_mode_responsive');
				jQuery('.menu_main_responsive').hide();
				jQuery('.menu_user_responsive').hide();
				streetstyle_init_sfmenu('ul.menu_main_nav,ul.menu_user_nav');
				jQuery('.menu_main_nav_area').show();
                jQuery('.menu_user_nav_area').show();
			}
		}
	}
	// Show main menu
	if (!jQuery('.top_panel_wrap').hasClass('menu_show')) jQuery('.top_panel_wrap').addClass('menu_show');
	// user menu
    if (!jQuery('.top_user_panel_wrap').hasClass('menu_show')) jQuery('.top_user_panel_wrap').addClass('menu_show');
}


// Check if responsive menu need
function streetstyle_is_responsive_need(max_width) {
	"use strict";
	var rez = false;
	if (max_width > 0) {
		var w = window.innerWidth;
		if (w == undefined) {
			w = jQuery(window).width()+(jQuery(window).height() < jQuery(document).height() || jQuery(window).scrollTop() > 0 ? 16 : 0);
		}
		rez = max_width > w;
	}
	return rez;
}


// Fit video frames to document width
function streetstyle_video_dimensions() {
	jQuery('video').each(function() {
		"use strict";
		var video = jQuery(this).eq(0);
		var ratio = (video.data('ratio')!=undefined ? video.data('ratio').split(':') : [16,9]);
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var mejs_cont = video.parents('.mejs-video');
		var w_attr = video.data('width');
		var h_attr = video.data('height');
		if (!w_attr || !h_attr) {
			w_attr = video.attr('width');
			h_attr = video.attr('height');
			if (!w_attr || !h_attr) return;
			video.data({'width': w_attr, 'height': h_attr});
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = Math.round(mejs_cont.length > 0 ? Math.min(percent ? 10000 : w_attr, mejs_cont.parents('div,article').width()) : video.width()),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(video.attr('data-last-width'))==w_real) return;
		if (mejs_cont.length > 0 && mejs) {
			streetstyle_set_mejs_player_dimensions(video, w_real, h_real);
		}
		if (percent) {
			video.height(h_real);
		} else {
			video.attr({'width': w_real, 'height': h_real}).css({'width': w_real+'px', 'height': h_real+'px'});
		}
		video.attr('data-last-width', w_real);
	});
	jQuery('.post_featured iframe').each(function() {
		"use strict";
		var iframe = jQuery(this).eq(0);
		if (iframe.attr('src').indexOf('soundcloud')>0) return;
		var ratio = (iframe.data('ratio')!=undefined ? iframe.data('ratio').split(':') : (iframe.find('[data-ratio]').length>0 ? iframe.find('[data-ratio]').data('ratio').split(':') : [16,9]));
		ratio = ratio.length!=2 || ratio[0]==0 || ratio[1]==0 ? 16/9 : ratio[0]/ratio[1];
		var w_attr = iframe.attr('width');
		var h_attr = iframe.attr('height');
		if (!w_attr || !h_attr) {
			return;
		}
		var percent = (''+w_attr).substr(-1)=='%';
		w_attr = parseInt(w_attr);
		h_attr = parseInt(h_attr);
		var w_real = iframe.parent().width(),
			h_real = Math.round(percent ? w_real/ratio : w_real/w_attr*h_attr);
		if (parseInt(iframe.attr('data-last-width'))==w_real) return;
		iframe.css({'width': w_real+'px', 'height': h_real+'px'});
		iframe.attr('data-last-width', w_real);
	});
}


// Set Media Elements player dimensions
function streetstyle_set_mejs_player_dimensions(video, w, h) {
	"use strict";
	if (mejs) {
		for (var pl in mejs.players) {
			if (mejs.players[pl].media.src == video.attr('src')) {
				if (mejs.players[pl].media.setVideoSize) {
					mejs.players[pl].media.setVideoSize(w, h);
				}
				mejs.players[pl].setPlayerSize(w, h);
				mejs.players[pl].setControlsSize();
			}
		}
	}
}





// Navigation
//==============================================

// Init Superfish menu
function streetstyle_init_sfmenu(selector) {
	"use strict";
	jQuery(selector).show().each(function() {
		"use strict";
		if (streetstyle_is_responsive_need() && (jQuery(this).attr('id')=='menu_main' || jQuery(this).attr('id')=='menu_user')) return;
		jQuery(this).addClass('inited').superfish({
			delay: 500,
			animation: {
				opacity: 'show'
			},
			animationOut: {
				opacity: 'hide'
			},
			speed: 		STREETSTYLE_GLOBALS['css_animation'] ? 500 : 200,
			speedOut:	STREETSTYLE_GLOBALS['css_animation'] ? 500 : 200,
			autoArrows: false,
			dropShadows: false,
			onBeforeShow: function(ul) {
				"use strict";
				if (jQuery(this).parents("ul").length > 1){
					var w = jQuery(window).width();
					var par_offset = jQuery(this).parents("ul").offset().left;
					var par_width  = jQuery(this).parents("ul").outerWidth();
					var ul_width   = jQuery(this).outerWidth();
					if (par_offset+par_width+ul_width > w-20 && par_offset-ul_width > 0)
						jQuery(this).addClass('submenu_left');
					else
						jQuery(this).removeClass('submenu_left');
				}
				if (STREETSTYLE_GLOBALS['css_animation']) {
					jQuery(this).removeClass('animated fast '+STREETSTYLE_GLOBALS['menu_animation_out']);
					jQuery(this).addClass('animated fast '+STREETSTYLE_GLOBALS['menu_animation_in']);
				}
			},
			onBeforeHide: function(ul) {
				"use strict";
				if (STREETSTYLE_GLOBALS['css_animation']) {
					jQuery(this).removeClass('animated fast '+STREETSTYLE_GLOBALS['menu_animation_in']);
					jQuery(this).addClass('animated fast '+STREETSTYLE_GLOBALS['menu_animation_out']);
				}
			}
		});
	});
}


// Show current page title on the responsive menu button
function streetstyle_show_current_menu_item(menu, button) {
	"use strict";
	var text = '';
	menu.find('a').each(function () {
		"use strict";
		if (text) return;
		var menu_link = jQuery(this);
		if (menu_link.text() == "") {
			return;
		}
		if (menu_link.attr('href') == window.location.href)
			text = menu_link.text();
	});
	button.text( text ? text : button.data('title') );
}





// Post formats init
//=====================================================

function streetstyle_init_post_formats() {
	"use strict";

	// MediaElement init
	streetstyle_init_media_elements(jQuery('body'));

	// Sliders init
	streetstyle_init_sliders(jQuery('body'));

	// Popup init
	if (STREETSTYLE_GLOBALS['popup_engine'] == 'pretty') {
		jQuery("a[href$='jpg'],a[href$='jpeg'],a[href$='png'],a[href$='gif']").attr('rel', 'prettyPhoto[slideshow]');
		var images = jQuery("a[rel*='prettyPhoto']:not(.inited):not([data-rel*='pretty']):not([rel*='magnific']):not([data-rel*='magnific'])").addClass('inited hover_view');
		try {
			images.prettyPhoto({
				social_tools: '',
				theme: 'facebook',
				deeplinking: false
			});
		} catch (e) {};
	} else if (STREETSTYLE_GLOBALS['popup_engine']=='magnific') {
		jQuery("a[href$='jpg'],a[href$='jpeg'],a[href$='png'],a[href$='gif']").attr('rel', 'magnific');
		var images = jQuery("a[rel*='magnific']:not(.inited):not(.prettyphoto):not([rel*='pretty']):not([data-rel*='pretty'])").addClass('inited hover_view');
		try {
			images.magnificPopup({
				type: 'image',
				mainClass: 'mfp-img-mobile',
				closeOnContentClick: true,
				closeBtnInside: true,
				fixedContentPos: true,
				midClick: true,
				//removalDelay: 500,
				preloader: true,
				tLoading: STREETSTYLE_GLOBALS['strings']['magnific_loading'],
				gallery:{
					enabled: true
				},
				image: {
					tError: STREETSTYLE_GLOBALS['strings']['magnific_error'],
					verticalFit: true
				}
			});
		} catch (e) {};
	}


	// Likes counter
	if (jQuery('.post_counters_likes:not(.inited)').length > 0) {
		jQuery('.post_counters_likes:not(.inited)')
			.addClass('inited')
			.on('click', function(e) {
				"use strict";
				var button = jQuery(this);
				var inc = button.hasClass('enabled') ? 1 : -1;
				var post_id = button.data('postid');
				var cookie_likes = streetstyle_get_cookie('streetstyle_likes');
				if (cookie_likes === undefined || cookie_likes===null) cookie_likes = '';
				jQuery.post(STREETSTYLE_GLOBALS['ajax_url'], {
					action: 'post_counter',
					nonce: STREETSTYLE_GLOBALS['ajax_nonce'],
					post_id: post_id,
					likes: inc
				}).done(function(response) {
					"use strict";
					var rez = {};
					try {
						rez = JSON.parse(response);
					} catch (e) {
						rez = { error: STREETSTYLE_GLOBALS['ajax_error'] };
					}
					if (rez.error === '') {
						var counter = rez.counter;
						if (inc == 1) {
							var title = button.data('title-dislike');
							button.removeClass('enabled icon-heart-empty').addClass('disabled icon-heart');
							cookie_likes += (cookie_likes.substr(-1)!=',' ? ',' : '') + post_id + ',';
						} else {
							var title = button.data('title-like');
							button.removeClass('disabled icon-heart').addClass('enabled icon-heart-empty');
							cookie_likes = cookie_likes.replace(','+post_id+',', ',');
						}
						button.data('likes', counter).attr('title', title).find('.post_counters_number').html(counter);
						streetstyle_set_cookie('streetstyle_likes', cookie_likes, 365);
					} else {
						alert(STREETSTYLE_GLOBALS['strings']['error_like']);
					}
				});
				e.preventDefault();
				return false;
			});
	}
}


function streetstyle_init_media_elements(cont) {
	"use strict";
	if (STREETSTYLE_GLOBALS['use_mediaelements'] && cont.find('audio,video').length > 0) {
		if (window.mejs) {
			window.mejs.MepDefaults.enableAutosize = true;
			window.mejs.MediaElementDefaults.enableAutosize = true;
			cont.find('audio:not(.wp-audio-shortcode),video:not(.wp-video-shortcode)').each(function() {
				"use strict";
				if (jQuery(this).parents('.mejs-mediaelement').length == 0) {
					var media_tag = jQuery(this);
					var settings = {
						enableAutosize: true,
						videoWidth: -1,		// if set, overrides <video width>
						videoHeight: -1,	// if set, overrides <video height>
						audioWidth: '100%',	// width of audio player
						audioHeight: 30,	// height of audio player
						success: function(mejs) {
							var autoplay, loop;
							if ( 'flash' === mejs.pluginType ) {
								autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
								loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;
								autoplay && mejs.addEventListener( 'canplay', function () {
									mejs.play();
								}, false );
								loop && mejs.addEventListener( 'ended', function () {
									mejs.play();
								}, false );
							}
						}
					};
					jQuery(this).mediaelementplayer(settings);
				}
			});
		} else
			setTimeout(function() { streetstyle_init_media_elements(cont); }, 400);
	}
}

// Init sliders with engine=swiper
function streetstyle_init_sliders(container) {
	"use strict";

	// Swiper Slider
	if (container.find('.slider_swiper:not(.inited)').length > 0) {
		// Min width of the slides in swiper (used for validate slides_per_view on small screen)
		STREETSTYLE_GLOBALS['swipers_min_width'] = 250;
		container.find('.slider_swiper:not(.inited)')
			.each(function () {
				"use strict";
				if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;

				// Check attr id for slider. If not exists - generate it
				var id = jQuery(this).attr('id');
				if (id == undefined) {
					id = 'swiper_'+Math.random();
					id = id.replace('.', '');
					jQuery(this).attr('id', id);
				}
				// Validate Slides per view on small screen
				var width = jQuery(this).width();
				if (width == 0) width = jQuery(this).parent().width();
				var spv = jQuery(this).data('slides-per-view');
				if (spv == undefined) spv = 1;
				if (width / spv < STREETSTYLE_GLOBALS['swipers_min_width']) spv = Math.max(1, Math.floor(width / STREETSTYLE_GLOBALS['swipers_min_width']));

				// Space between slides
				var space = jQuery(this).data('slides-space');
				if (space == undefined) space = 0;

				jQuery(this).show()
					.addClass(id)
					.addClass('inited')
					.data('settings', {mode: 'horizontal'});		// VC hook

				if (STREETSTYLE_GLOBALS['swipers'] === undefined) STREETSTYLE_GLOBALS['swipers'] = {};

				STREETSTYLE_GLOBALS['swipers'][id] = new Swiper('.'+id, {
					calculateHeight: !jQuery(this).hasClass('slider_height_fixed'),
					resizeReInit: true,
					autoResize: true,
					loop: true,
					grabCursor: true,
					pagination: jQuery(this).hasClass('slider_pagination') ? '#'+id+' .slider_pagination_wrap' : false,
				    paginationClickable: jQuery(this).hasClass('slider_pagination') ? '#'+id+' .slider_pagination_wrap' : false,
			        nextButton: jQuery(this).hasClass('slider_controls') ? '#'+id+' .slider_next' : false,
			        prevButton: jQuery(this).hasClass('slider_controls') ? '#'+id+' .slider_prev' : false,
			        autoplay: jQuery(this).hasClass('slider_noautoplay')
								? false
								: (jQuery(this).data('interval')=='' || isNaN(jQuery(this).data('interval'))
									? 7000
									: parseInt(jQuery(this).data('interval'))
									),
        			autoplayDisableOnInteraction: false,
					initialSlide: 0,
					slidesPerView: spv,
					loopedSlides: spv,
					spaceBetween: space,
					speed: 600
				});
			});

		// Check slides per view
		streetstyle_sc_sliders_resize();
	}
}

// Sliders: Resize
function streetstyle_sc_sliders_resize() {
	"use strict";
	var slider = arguments[0]!==undefined ? arguments[0] : '.slider_swiper.inited';
	var resize = arguments[1]!==undefined ? arguments[1] : true;

	jQuery(slider).each(function() {
		"use strict";
		var id = jQuery(this).attr('id');
		var width = jQuery(this).width();
		var last_width = jQuery(this).data('last-width');
		if (isNaN(last_width)) last_width = 0;

		// Change slides_per_view
		if (last_width==0 || last_width!=width) {
			var spv = jQuery(this).data('slides-per-view');
			if (spv == undefined) spv = 1;
			if (width / spv < STREETSTYLE_GLOBALS['swipers_min_width']) spv = Math.max(1, Math.floor(width / STREETSTYLE_GLOBALS['swipers_min_width']));
			jQuery(this).data('last-width', width);
			if (STREETSTYLE_GLOBALS['swipers'][id].params.slidesPerView != spv) {
				STREETSTYLE_GLOBALS['swipers'][id].params.slidesPerView = spv;
				STREETSTYLE_GLOBALS['swipers'][id].params.loopedSlides = spv;
				//STREETSTYLE_GLOBALS['swipers'][id].reInit();
			}
		}

		// Resize slider
		if ( resize && !jQuery(this).hasClass('slider_height_fixed') ) {
			var h = 0;
			if ( jQuery(this).find('.swiper-slide > img').length > 0 ) {
				jQuery(this).find('.swiper-slide > img').each(function() {
					if (jQuery(this).height() > h) h = jQuery(this).height();
				});
				jQuery(this).height(h);
			} else if ( jQuery(this).find('.swiper-slide').text()=='' || jQuery(this).hasClass('slider_height_auto') ) {
				jQuery(this).height( Math.floor(width/16*9) );
			}
		}
	});
}



// Forms validation
//-------------------------------------------------------


// Comments form
function streetstyle_comments_validate(form) {
	"use strict";
	form.find('input').removeClass('error_fields_class');
	var error = streetstyle_form_validate(form, {
		error_message_text: STREETSTYLE_GLOBALS['strings']['error_global'],	// Global error message text (if don't write in checked field)
		error_message_show: true,									// Display or not error message
		error_message_time: 4000,									// Error message display time
		error_message_class: 'sc_infobox sc_infobox_style_error',	// Class appended to error message block
		error_fields_class: 'error_fields_class',					// Class appended to error fields
		exit_after_first_error: false,								// Cancel validation and exit after first error
		rules: [
			{
				field: 'author',
				min_length: { value: 1, message: STREETSTYLE_GLOBALS['strings']['name_empty']},
				max_length: { value: 60, message: STREETSTYLE_GLOBALS['strings']['name_long']}
			},
			{
				field: 'email',
				min_length: { value: 7, message: STREETSTYLE_GLOBALS['strings']['email_empty']},
				max_length: { value: 60, message: STREETSTYLE_GLOBALS['strings']['email_long']},
				mask: { value: STREETSTYLE_GLOBALS['email_mask'], message: STREETSTYLE_GLOBALS['strings']['email_not_valid']}
			},
			{
				field: 'comment',
				min_length: { value: 1, message: STREETSTYLE_GLOBALS['strings']['text_empty'] },
				max_length: { value: STREETSTYLE_GLOBALS['message_maxlength'], message: STREETSTYLE_GLOBALS['strings']['text_long']}
			}
		]
	});
	return !error;
}

// Contact form handlers
function streetstyle_contact_form_validate(form){
	"use strict";
	var url = form.attr('action');
	if (url == '') return false;
	form.find('input').removeClass('error_fields_class');
	var error = streetstyle_form_validate(form, {
			error_message_show: true,
			error_message_time: 4000,
			error_message_class: "sc_infobox sc_infobox_style_error",
			error_fields_class: "error_fields_class",
			exit_after_first_error: false,
			rules: [
				{
					field: "username",
					min_length: { value: 1,	 message: STREETSTYLE_GLOBALS['strings']['name_empty'] },
					max_length: { value: 60, message: STREETSTYLE_GLOBALS['strings']['name_long'] }
				},
				{
					field: "email",
					min_length: { value: 7,	 message: STREETSTYLE_GLOBALS['strings']['email_empty'] },
					max_length: { value: 60, message: STREETSTYLE_GLOBALS['strings']['email_long'] },
					mask: { value: STREETSTYLE_GLOBALS['email_mask'], message: STREETSTYLE_GLOBALS['strings']['email_not_valid'] }
				},
				{
					field: "message",
					min_length: { value: 1,  message: STREETSTYLE_GLOBALS['strings']['text_empty'] },
					max_length: { value: STREETSTYLE_GLOBALS['message_maxlength'], message: STREETSTYLE_GLOBALS['strings']['text_long'] }
				}
			]
		});

	if (!error && url!='#') {
		jQuery.post(url, {
			action: "send_contact_form",
			nonce: STREETSTYLE_GLOBALS['ajax_nonce'],
			data: form.serialize()
		}).done(function(response) {
			"use strict";
			var rez = {};
			try {
				rez = JSON.parse(response);
			} catch(e) {
				rez = { error: STREETSTYLE_GLOBALS['ajax_error'] };
			}
			var result = form.find(".result").toggleClass("sc_infobox_style_error", false).toggleClass("sc_infobox_style_success", false);
			if (rez.error === '') {
				form.get(0).reset();
				result.addClass("sc_infobox_style_success").html(STREETSTYLE_GLOBALS['strings']['send_complete']);
			} else {
				result.addClass("sc_infobox_style_error").html(STREETSTYLE_GLOBALS['strings']['send_error'] + ' ' + rez.error);
			}
			result.fadeIn().delay(3000).fadeOut();
		});
	}
	return !error;
}
