/* ------------------------------------------------------------------------
Fire up Functions on Page Load
* ------------------------------------------------------------------------- */
jQuery(document).ready(function(){
	doMenu();
	doSuperFish();
	doTestimonials();
	doTabsType1();
	doTabsType2();
	doAccordion();
	initScrollTop();
//woocommerce cleanup
jQuery("ul.products .product").find('br').remove();

//plugin calls
	jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({hook:'data-gal',social_tools:false});
	jQuery('#gallery-nav li > a').click(function() {
    jQuery('#gallery-nav li').removeClass();
    jQuery(this).parent().addClass('active');
	});
});



/* ------------------------------------------------------------------------
Main Navigation
* ------------------------------------------------------------------------- */
function doMenu(){
	var isOpen, theTimeout;
	var menu = jQuery("header").find('ul').eq(0);
	var menu_items = menu.find("li");

	//Added. Oct 23 2012.
	//This checks if the menu itme has a submenu so we can dislay the arrows.
	menu_items.has('ul').addClass('has_submenu');

	menu_items.hover(function(){
		if(jQuery(this).css('display') == 'block'){
			return;//DIsables the menues. I don't check for window size since the sizec ould varia from CSS to javascript. Checking the display attribute is more accurate since it changes with CSS media queries.
		}
		var theSub = jQuery(this).children('ul').eq(0);
		if(this.timeout){
			clearTimeout(this.timeout);
		}
		if(theSub && !theSub.attr('goingUp')){
			var winSize = getWinSize();
			theSub.slideDown().fadeIn();
			if(theSub.offset()!= null){ // mod by denzel to fix null error
			var theSubEndLine = theSub.outerWidth() + theSub.offset().left;
			}else{
			var theSubEndLine = theSub.outerWidth();
			}
			if((theSubEndLine > winSize.w) &&  (!jQuery.browser.msie || (jQuery.browser.msie && parseInt(jQuery.browser.version) > 7))){
				if(!theSub.attr('wasDisplaced')){
					theSub.attr('wasDisplaced', true);
					theSub.animate({
						left: '-=495px'
					}, 250, 'swing');
				}
			}
		}
	});

	menu_items.mouseleave(function(e){
		var theSub = jQuery(this).children('ul').eq(0);
		var that = this;
		if(theSub){
			that.timeout = setTimeout(function(){
				if(theSub.attr('wasDisplacedfake')){
					theSub.animate({
						left: '+=480px'
					}, 0, 'swing', function(){
						theSub.slideUp().fadeOut();
					});
					theSub.attr('wasDisplaced', false);
				}else{
					theSub.attr('goingUp', true);
					theSub.slideUp().fadeOut(function(){
						theSub.removeAttr('goingUp');
					});
				}
			}, 250);
		}
	});
}

function getWinSize(){
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}
return {
h: winH,
w: winW
}
}


/* ------------------------------------------------------------------------
SuperFish - Top Toolbar Dropdowns
* ------------------------------------------------------------------------- */
function doSuperFish(){
//only activate if child <ul> is present
jQuery(".top-aside ul:has(ul)").addClass("sf-menu");
jQuery('ul.sf-menu').superfish({
    delay: 100,
    animation: {
        opacity: 'show',
        height: 'show'
    },
    speed: 'fast',
    autoArrows: true,
    dropShadows: false
})
}


/* ------------------------------------------------------------------------
Scroll to Top
* ------------------------------------------------------------------------- */
function initScrollTop() {
    var change_speed = 1200;
    jQuery('a.link-top').click(function () {
        if (!jQuery.browser.opera) {
            jQuery('body').animate({
                scrollTop: 0
            }, {
                queue: false,
                duration: change_speed
            })
        }
        jQuery('html').animate({
            scrollTop: 0
        }, {
            queue: false,
            duration: change_speed
        });
        return false
    })
}



/* ------------------------------------------------------------------------
Testimonials
* ------------------------------------------------------------------------- */
function doTestimonials(){
	var testimonialsCont = jQuery('.testimonials');
	if(testimonialsCont.length < 1){
		return;
	}
testimonialsCont.each(function(){
	var maxHeight = 0, total = 0, dots, circle;
	var testimonials = jQuery(this).children('div');
	testimonials.each(function(){
		maxHeight = jQuery(this).outerHeight() > maxHeight ? jQuery(this).outerHeight() : maxHeight;
	});
	testimonials.css({'position':'absolute', 'display': 'none'});
	if(jQuery(this).parent().hasClass('home_1_sidebar')){
		var gap = 50;
	}else{
		var gap = 30;
	}
	jQuery(this).css({'height': maxHeight + gap + 'px', 'position' : 'relative'});
	testimonials.eq(0).css('display', 'block');
	total = testimonials.length;
	dots = document.createElement('div');
	dots.className = 'dots';
	for(var i = 0; i < total; i++){
		circle = document.createElement('div');
		circle.className = 'circle';
		if(i == 0){
			circle.className += " current";
		}
		dots.appendChild(circle);
	}
	jQuery(this).append(dots);
	dots = jQuery('.dots');
	dots.css({'position': 'absolute', 'right' : 0, 'bottom' : 0});
	doCicleTestimonials(jQuery(this));
});
}

function doCicleTestimonials(testimonialsObj){
	var interval = "6500";//milliseconds
	var currentTestimonial = "0";//always starts at 0
	var testimonials = testimonialsObj.children('.testimonial');
	var dotsCont = testimonialsObj.children('.dots');
	var dots = dotsCont.children('div');
	var theTimeout;
	theTimeout = setTimeout(cicleTestimonials, interval);
	function cicleTestimonials(){
		testimonials.eq(currentTestimonial).fadeOut();
		dots.eq(currentTestimonial).removeClass('current');
		currentTestimonial++;
		if(currentTestimonial == testimonials.length){
			currentTestimonial = 0;
		}
		testimonials.eq(currentTestimonial).fadeIn();
		dots.eq(currentTestimonial).addClass('current');
		theTimeout = setTimeout(cicleTestimonials, interval);
	}
	dots.click(function(){
		clearTimeout(theTimeout);
		testimonials.eq(currentTestimonial).fadeOut();
		dots.eq(currentTestimonial).removeClass('current');
		currentTestimonial = jQuery(this).index();
		testimonials.eq(currentTestimonial).fadeIn();
		jQuery(this).addClass('current');
		theTimeout = setTimeout(cicleTestimonials, interval);
	});
}



/* ------------------------------------------------------------------------
Tabs - Type 1
* ------------------------------------------------------------------------- */
function doTabsType1(){
	var tabs = jQuery('.tabs_type_1');
	if(tabs.length < 1){
		return;
	}
	tabs.append("<span class='tabs_type_1_arrow'></span>");
	tabs.each(function(){
		var handlers = jQuery(this).children('dt');
		var tabContentBlocks = jQuery(this).children('dd');
		var currentTab = jQuery(this).find('dd.current');
		var arrow = jQuery(this).children('span').eq(0);
		var handlersWidth = handlers.eq(0).outerWidth();
		var minus = currentTab.prev().index() == 0 ? 18 : currentTab.prev().outerHeight()/2 + 18;
		var firstHandlerY = currentTab.prev().position().top + currentTab.prev().outerHeight() - minus;
		arrow.css({'left': handlersWidth-18 + 'px', 'top': firstHandlerY + 'px'});

		maybeGrowShrinkTab(currentTab.eq(0).prev());

		handlers.click(function(){
			if(jQuery(this).hasClass('current')) return
			currentTab.prev().removeClass('current');
			currentTab.fadeOut('fast');
			arrow.fadeOut('fast');
			var that = this;
			maybeGrowShrinkTab(this, function(){
				currentTab = jQuery(that).next();
				var minus = jQuery(that).index() == 0 ? 18 : jQuery(that).outerHeight()/2 + 18;
				arrowY = jQuery(that).position().top + jQuery(that).outerHeight() - minus;
				arrow.fadeIn('fast');
				arrow.animate({'top':arrowY + 'px'});
				currentTab.fadeIn('slow');
				jQuery(that).addClass('current');
			});
		});
	});
}

function maybeGrowShrinkTab(tab, callback, add){
	var jTab = (tab.nodeName) ? jQuery(tab) :  tab 
	var tabCont = jTab.next();
	var tabsContainer = jTab.parent();
	var handlers = tabsContainer.children('dt');
	var plus = add || 0;//tabs type 2 need a little added height because the handlers are placed on top.

	tabCont.css('height', 'auto');

	var tabContHeight = tabCont.outerHeight();
	tabContHeight += plus;
	var tabsContainerHeight = tabsContainer.outerHeight();
	var totalHandlersHeight = 0;

	handlers.each(function(){
		totalHandlersHeight += jQuery(this).outerHeight();
	});

	if(tabContHeight != tabsContainerHeight){
		if(tabContHeight > totalHandlersHeight){
			tabsContainer.animate({'height': tabContHeight + 'px'}, function(){
				if(typeof callback != 'undefined') callback()
			});
		}else{
			totalHandlersHeight += 60; //Just give it a lil space so it doesn't look too tight
			tabCont.css('height', totalHandlersHeight + 'px');
			tabsContainer.animate({'height': totalHandlersHeight + 'px'}, function(){
				if(typeof callback != 'undefined') callback()
			});
		}
	}else{
		if(typeof callback != 'undefined') callback()
	}
}



/* ------------------------------------------------------------------------
Tabs - Type 2
* ------------------------------------------------------------------------- */
function doTabsType2(){
	var tabs = jQuery('.tabs_type_2');
	if(tabs.length <  1){
		return;
	}
	tabs.append("<span class='tabs_type_2_arrow'></span>");
	tabs.each(function(){
		var handlers = jQuery(this).children('dt');
		var tabContentBlocks = jQuery(this).children('dd');
		//var currentTab = tabContentBlocks.eq(0);
		var currentTab = jQuery(this).find('dd.current');
		var arrow = jQuery(this).children('span').eq(0);
		var handlersWidth = handlers.eq(0).outerWidth();
		var firstHandlerY = handlers.eq(0).position().top + handlers.eq(0).outerHeight() - 18;
		var firstHandlerX = currentTab.prev().position().left + (currentTab.prev().outerWidth() /2) - 2;
		arrow.css({'left': firstHandlerX + 'px'});

		maybeGrowShrinkTab(currentTab.eq(0).prev(), undefined, 70);

		handlers.click(function(){
			currentTab.prev().removeClass('current');
			currentTab.fadeOut('fast');
			arrow.fadeOut('fast');
			var that = this;
			maybeGrowShrinkTab(this, function(){
				currentTab = jQuery(that).next();
				arrowY = jQuery(that).position().left + (jQuery(that).outerWidth() /2) - 2;
				arrow.fadeIn('fast');
				arrow.animate({'left':arrowY + 'px'});
				currentTab.fadeIn('slow');
				jQuery(that).addClass('current');
			}, 70);
		});
	});
}




/* ------------------------------------------------------------------------
Accordions
* ------------------------------------------------------------------------- */
function doAccordion(){
	var accordions = jQuery('.accordion');
	if(accordions.length < 1){
		return;
	}
	accordions.each(function(){
		var that = jQuery(this);
		var handlers = jQuery(this).children('dt');
		handlers.click(function(){
			// If statement added on Dec 12 2012 to allow closng all accordion elements.
			if(jQuery(this).hasClass('current')){
				jQuery(this).removeClass('current').next().slideUp();
				return;
			}
			that.children('dt.current').removeClass('current').next().slideUp();
			jQuery(this).toggleClass('current');
			jQuery(this).next('dd').slideToggle();
		});
	});
}




/* ------------------------------------------------------------------------
Gallery Image Fade
* ------------------------------------------------------------------------- */
jQuery('.hover-item').live('hover', function(e) {
		if( e.type == 'mouseenter' )
			jQuery(this).stop().animate({opacity:0.3},400);

		if( e.type == 'mouseleave' )
			jQuery(this).stop().animate({opacity:1},400);
	});



/*-----------------------------------------------------------------------------------*/
/*	Gallery Sorting
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function(){
				
	jQuery('#iso-wrap').isotope({
		animationOptions: {
	     duration: 750,
	     easing: 'linear',
	     queue: false,
 		 }
		 
	});
		
jQuery('#iso-wrap').isotope({ layoutMode : 'fitRows' });
						
	
	jQuery('#gallery-nav a').click(function(){
 	  var selector = jQuery(this).attr('data-filter');
	  jQuery('#iso-wrap').isotope({ filter: selector });
 	  return false;
	});	
	
	
});



/*-----------------------------------------------------------------------------------*/
/*	Select Element - Responsive Navigation
/*-----------------------------------------------------------------------------------*/
jQuery("<select />").appendTo("header nav");

// Create default option "Go to..."
jQuery("<option />", {
   "selected": "selected",
   "value"   : "",
   "text"    : "Select a page:"
}).appendTo("nav select");

// Populate dropdown with menu items
jQuery("nav a").each(function() {
 var el = jQuery(this);
 jQuery("<option />", {
     "value"   : el.attr("href"),
     "text"    : el.text()
 }).appendTo("nav select");
});

jQuery("nav select").change(function() {
  window.location = jQuery(this).find("option:selected").val();
});

//Find current menu item from desktop menu
var current_menu_item = jQuery('nav').find('.current-menu-item').text();

//Loop through mobile menu option text and add attribute selected if it matches the above current menu item found.
jQuery("nav select option").each(function(){
  if (jQuery(this).text() == current_menu_item)
    jQuery(this).attr("selected","selected");
});



/* ------------------------------------------------------------------------
Notification Boxes
* ------------------------------------------------------------------------- */
jQuery(document).ready(function(){

	jQuery('.closeable').closeThis({
		animation: 'fadeAndSlide', 	// set animation
		animationSpeed: 400 		// set animation speed
	});
	
});

(function(e){e.fn.closeThis=function(t){var n={animation:"slide",animationSpeed:300};var t=e.extend({},n,t);return this.each(function(){function r(e){switch(t.animation){case"fade":i(e);break;case"slide":s(e);break;case"size":o(e);break;case"fadeThenSlide":u(e);break;default:u(e)}}function i(e){e.fadeOut(t.animationSpeed)}function s(e){e.slideUp(t.animationSpeed)}function o(e){e.hide(t.animationSpeed)}function u(e){e.fadeTo(t.animationSpeed,0,function(){s(n)})}var n=e(this);n.css({cursor:"pointer"});n.click(function(){r(n)})})}})(jQuery)



/*--------------------------------------*/
/*	Sticky MenuBar
/*--------------------------------------*/
function truethemes_StickyMenu() {
	jQuery('#menu-main-nav').scrollWatch(function(s) {
		s.hidden_top < 0 ? (jQuery('#B_sticky_menu').length === 0 && truethemes_doStickyMenu()) : truethemes_undoStickyMenu();
	});
}

function truethemes_doStickyMenu() {
	var $ = jQuery;
	var container = $('<div id="B_sticky_menu"></div>'),
		sterling_clone = $('#tt-header-wrap').clone(true);
		//header_clone = $('#tt-header-wrap header').clone(true);

	container.append(sterling_clone)
	container.css({
		position: 'fixed',
		left: 0,
		top: -100,
		width: '100%',
		zIndex: 100,
		opacity: 0,
		boxShadow: '0 3px 9px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.2)',
	});
	/*container.find('header').css({
		maxWidth: 980,
		padding: '20px 20px',
		margin: 'auto'
	});*/
	container.find('.logo').css({
		'float': 'left',
	});
	//container.find('header').children().each(function() {
	//	!($(this).hasClass('logo') || $(this).is('nav')) && $(this).remove();
	//});
	$('body').append(container);
	container.animate({
		top: $('#wpadminbar').length === 0 ? 0 : $('#tt-header-wrap .top-aside').offset().top,
		opacity: 1
	}, 500);
}

function truethemes_undoStickyMenu() {
	jQuery('#B_sticky_menu').animate({
		top: -200,
		opacity: 0
	}, 900, function() {
		jQuery(this).remove();
	});
}
