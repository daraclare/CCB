<?php
/*-------------------------------------------------------------------------*/
/*	Do not modify this file - The sky will fall.
/*-------------------------------------------------------------------------*/ 

// Define File Directores.
if ( function_exists( 'wp_get_theme' ) ) :
	$theme_object 	= wp_get_theme(); // WordPress 3.4.0 plus.
	$theme_name 	= $theme_object->name;
else:
	$theme_data 	= get_theme_data( get_template_directory() . '/style.css' ); // Before WordPress 3.4.0 deprecated function.
	$theme_name 	= $theme_data['Name'];
endif;

// Define Theme Constants.
define( 'TT_FUNCTIONS', 				get_template_directory() . '/framework' );
define( 'TT_GLOBAL', 					get_template_directory() . '/framework/global' );
define( 'TT_ADMIN', 					get_template_directory() . '/framework/admin' );
define( 'TT_EXTENDED', 					get_template_directory() . '/framework/extended' );
define( 'TT_CONTENT', 					get_template_directory() . '/framework/content' );
define( 'TT_JS', 						get_template_directory_uri() . '/framework/js' );
define( 'TT_FRAMEWORK', 				get_template_directory_uri() . '/framework' );
define( 'TT_CSS', 						get_template_directory_uri() . '/css/' );
define( 'TT_HOME', 						get_template_directory_uri() );
define( 'TT', 							get_template_directory() . '/framework/truethemes' );
define( 'TIMTHUMB_SCRIPT',				get_template_directory_uri() . '/framework/extended/timthumb/timthumb.php' );
define( 'TIMTHUMB_SCRIPT_MULTISITE', 	get_template_directory_uri() . '/framework/extended/timthumb/timthumb.php' );

// Load Theme Specific Functions.
require_once( get_template_directory() . '/framework/theme-specific/_theme_specific_init.php' );

// Load Global Functions.
require_once( TT_GLOBAL . '/widgets.php' );
require_once( TT_GLOBAL . '/theme-functions.php' );

// Load TrueThemes Functions.
require_once( TT . '/upgrade/init.php' );
require_once( TT . '/image-thumbs.php' );
require_once( TT . '/metabox/init.php' );

// Load Admin Framework.
require_once( TT_ADMIN . '/admin-functions.php' );
require_once( TT_ADMIN . '/admin-interface.php' );

// Load Extended Functionality.
require_once( TT_EXTENDED . '/multiple_sidebars.php' );
require_once( TT_EXTENDED . '/breadcrumbs.php' );
require_once( TT_EXTENDED . '/3d-tag-cloud/wp-cumulus.php' );
require_once( TT_EXTENDED . '/twitter/latest-tweets.php' );
require_once( TT_EXTENDED . '/page_linking.php' );
require_once( TT_EXTENDED . '/tgm-plugin-activation/truethemes-plugins.php' );

if ( ! function_exists( 'wp_pagenavi' ) ){
	require_once( TT_EXTENDED . '/wp-pagenavi.php' );
}


if(class_exists('Jetpack')){
//We found Jetpack

	
//get jetpack activated modules.
$jetpack_activated_modules = get_option('jetpack_active_modules');
//check if jetpack contact form is deactivated, we load our theme contact form.
if(!in_array('contact-form',$jetpack_activated_modules)){
	
	//check if publicize and share module is activated, if yes, we disable it too, so that our contact form shortcode works!
	$arr = array_diff($jetpack_activated_modules, array("publicize","sharedaddy"));
  	
  	//We update back modified jetpack activated modules.
  	update_option('jetpack_active_modules',$arr);  

	//check if user enables our theme contact form plugin, if yes, we use it.
	$tt_formbuilder = get_option( 'st_formbuilder' );
	
	   //checks for grunion contact form plugin
		if(!function_exists('contact_form_parse')){
			if ( 'true' == $tt_formbuilder ){require_once( TT_EXTENDED . '/grunion-contact-form/grunion-contact-form.php' );}
		}
}

}else{
//no Jetpack, we do normal check

	//check if user enables our theme contact form plugin, if yes, we use it.
	$tt_formbuilder = get_option( 'st_formbuilder' );
	   //checks for grunion contact form plugin
		if(!function_exists('contact_form_parse')){
			if ( 'true' == $tt_formbuilder ){require_once( TT_EXTENDED . '/grunion-contact-form/grunion-contact-form.php' );}
		}

}


if ( class_exists( 'woocommerce' ) )
	require_once( TT_EXTENDED . '/woocommerce.php' );	

// Load SEO Module.
global $ttso;
$seo_module = $ttso->st_seo_module;

// Check user setting at site options general settings.
if ( 'true' == $seo_module ) {
	// Require all seo module files and "activate" seo module.
	require_once( TT_EXTENDED. '/seo-module/seo_module.php' );
	$aioseop_options = get_option( 'aioseop_options' );
	
	if ( 0 == $aioseop_options['aiosp_enabled'] ) {
		$aioseop_options['aiosp_enabled'] = 1;
		update_option( 'aioseop_options', $aioseop_options );
	}
} else {
    // User has "disabled" the seo module, but still show the empty page with a message.
	$aioseop_options = get_option( 'aioseop_options' );
	$aioseop_options['aiosp_enabled'] = 0;
	update_option( 'aioseop_options', $aioseop_options );
    add_action( 'admin_menu', 'truethemes_add_empty_seo_settings_page' );
}

/**
 * Do not move this function! Loads the empty seo settings page.
 */
function truethemes_add_empty_seo_settings_page() {
	add_theme_page( __( 'SEO Settings', 'tt_theme_framework' ), __( 'SEO Settings', 'tt_theme_framework' ), 'manage_options', 'seo_settings', 'truethemes_empty_seo_settings_page' );
}

/**
 * Do not move this function! Displays the empty seo settings page.
 */
function truethemes_empty_seo_settings_page() {

	?>
	<div class="wrap">
		<div style="padding:8px 10px 15px 15px;">	
			<?php screen_icon( 'options-general' ); ?>
			<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
		</div>
		<div id="message" class="updated fade" style="width:765px!important;margin:10px 0px 0px 0px;">
			<p><?php printf( __( 'The SEO Module is currently disabled. To enable this Module, please go to <a href="%s">Appearance &gt; Site Options &gt; General Settings</a>.', 'tt_theme_framework' ), add_query_arg( array( 'page' => 'siteoptions' ), admin_url( 'admin.php' ) ) ); ?></p>
		</div>
	<?php
	
}



/*------------------------------------*/
/* Register Custom Taxonomies
/*------------------------------------*/
//Slider Taxonomy
function truethemes_sterling_slider_taxonomy() {
	register_taxonomy(
		'sterling-slider-category',
		'slider',
		array(
			'label'        => __('Categories' , 'tt_theme_framework'),
			'sort'         => true,
			'hierarchical' => true,
			'args'         => array( 'orderby' => 'term_order' ),
			'rewrite'      => array( 'slug'    => 'sterling-slider-category' )
		)
	);
}
add_action( 'init', 'truethemes_sterling_slider_taxonomy' );




/*------------------------------------*/
/* Sticky Menu
/*------------------------------------*/
/*
* function to hook jQuery to footer to activate sticky menu according to site option setting.
*/
function tt_hook_sticky_menu(){
	$activate_sticky_menu = get_option('st_fix_header_and_menubar');
	if($activate_sticky_menu == 'true'){
	wp_enqueue_script( 'scrollwatch', TT_JS .'/scrollWatch.js', array('jquery'),'4.0',$in_footer = true);
	echo "<!--Site Option Activated Sticky Menu-->\n<script type='text/javascript'>jQuery(document).ready(function(){truethemes_StickyMenu();});</script>\n<!--End Sticky Menu Activation-->\n";
	}
}
add_action('wp_footer','tt_hook_sticky_menu');



/*------------------------------------*/
/*	CSS for Custom Post Type Icons
/*------------------------------------*/
function truethemes_custom_admin_css(){
	echo '<style>

#adminmenu #menu-posts-slider .menu-icon-post div.wp-menu-image:before {
	content: "\f169";
	/* content: "\f181"; */
}

#adminmenu #menu-posts-gallery .menu-icon-post div.wp-menu-image:before {
	content: "\f233";
}

#adminmenu #menu-posts-feedback .menu-icon-post div.wp-menu-image:before {
	content: "\f175";
}

.wp-media-buttons .tt-add-form span.wp-media-buttons-icon:before {
	font: 400 17px/1 dashicons;
	content: "\f175";
	margin-left:-1px;
}
	/* Social Media Widget select field */
	.wp-admin #tt-social-widget-dropdown {
	width:95% !important;	
}

/* hide revolution slider notice */
.rs-update-notice-wrap {
	display: none;
}
	</style>';        
}
add_action('admin_head','truethemes_custom_admin_css');





/*----------------------------------------------------------------*/
/* "Activate Sterling 2.2" (General > Site Options)
/*----------------------------------------------------------------*/
/**
 * @since 3.0
 * Hides old page templates from Page Attributes metabox when Sterling 2.2 is "Activated"
 * Hides old "Custom Settings" metabox from Post Editing screen
 */
function tt_remove_page_template_name_from_select_dropdown(){
//do this only in WordPress admin
if(is_admin()):
    //check which admin page we are in now.
    //do this only if typenow variable is page.
	
	global $typenow;
	global $pagenow;
	if( ($typenow == 'page') || ($pagenow == 'edit.php') ){
	    $option = get_option('st_activate_sterling3');
	    if($option == 'true'):
	    	//we enqueue jquery script.
	   		wp_register_script( 'remove_page_template_select_option', TT_JS .'/admin-remove-page-template-select-option.js', array('jquery'),'1.0');
	    	wp_enqueue_script( 'remove_page_template_select_option');
	    endif;
	}
	
	//do this only if typenow variable is post.
	if( $typenow == 'post'){
	    $option = get_option('st_activate_sterling3');
	    if($option == 'true'):
	    	//we enqueue jquery script.
	   		wp_register_script( 'hide_post_meta_box', TT_JS .'/admin-hide-post-meta-box.js', array('jquery'),'1.0');
	    	wp_enqueue_script( 'hide_post_meta_box');
	    endif;
	}	
	
endif;
}
add_action( 'admin_enqueue_scripts', 'tt_remove_page_template_name_from_select_dropdown' );
?>