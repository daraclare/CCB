
// start the popup specefic scripts
// safe to use $
jQuery(document).ready(function($) {
    var tts = {
    	loadVals: function()
    	{
    		var shortcode = $('#_tt_shortcode').text(),
    			uShortcode = shortcode;
    		
    		// fill in the gaps eg {{param}}
    		$('.tt-input').each(function() {
    			var input = $(this),
    				id = input.attr('id'),
    				id = id.replace('tt_', ''),		// gets rid of the tt_ prefix
    				re = new RegExp("{{"+id+"}}","g");
    				
    			uShortcode = uShortcode.replace(re, input.val());
    		});
    		
    		// adds the filled-in shortcode as hidden input
    		$('#_tt_ushortcode').remove();
    		$('#tt-sc-form-table').prepend('<div id="_tt_ushortcode" class="hidden">' + uShortcode + '</div>');
    		
    		// updates preview
    		tts.updatePreview();
    	},
    	cLoadVals: function()
    	{
    		var shortcode = $('#_tt_cshortcode').text(),
    			pShortcode = '';
    			shortcodes = '';
    		
    		// fill in the gaps eg {{param}}
    		$('.child-clone-row').each(function() {
    			var row = $(this),
    				rShortcode = shortcode;
    			
    			$('.tt-cinput', this).each(function() {
    				var input = $(this),
    					id = input.attr('id'),
    					id = id.replace('tt_', '')		// gets rid of the tt_ prefix
    					re = new RegExp("{{"+id+"}}","g");
    					
    				rShortcode = rShortcode.replace(re, input.val());
    			});
    	
    			shortcodes = shortcodes + rShortcode + "\n";
    		});
    		
    		// adds the filled-in shortcode as hidden input
    		$('#_tt_cshortcodes').remove();
    		$('.child-clone-rows').prepend('<div id="_tt_cshortcodes" class="hidden">' + shortcodes + '</div>');
    		
    		// add to parent shortcode
    		this.loadVals();
    		pShortcode = $('#_tt_ushortcode').text().replace('{{child_shortcode}}', shortcodes);
    		
    		// add updated parent shortcode
    		$('#_tt_ushortcode').remove();
    		$('#tt-sc-form-table').prepend('<div id="_tt_ushortcode" class="hidden">' + pShortcode + '</div>');
    		
    		// updates preview
    		tts.updatePreview();
    	},
    	children: function()
    	{
    		// assign the cloning plugin
    		$('.child-clone-rows').appendo({
    			subSelect: '> div.child-clone-row:last-child',
    			allowDelete: false,
    			focusFirst: false
    		});
    		
    		// remove button
    		$('.child-clone-row-remove').live('click', function() {
    			var	btn = $(this),
    				row = btn.parent();
    			
    			if( $('.child-clone-row').size() > 1 )
    			{
    				row.remove();
    			}
    			else
    			{
    				alert('You need a minimum of one row');
    			}
    			
    			return false;
    		});
    		
    		// assign jUI sortable
    		$( ".child-clone-rows" ).sortable({
				placeholder: "sortable-placeholder",
				items: '.child-clone-row'
				
			});
    	},
    	updatePreview: function()
    	{
    		if( $('#tt-sc-preview').size() > 0 )
    		{
	    		var	shortcode = $('#_tt_ushortcode').html(),
	    			iframe = $('#tt-sc-preview'),
	    			iframeSrc = iframe.attr('src'),
	    			iframeSrc = iframeSrc.split('preview.php'),
	    			iframeSrc = iframeSrc[0] + 'preview.php';
    			
	    		// updates the src value
	    		iframe.attr( 'src', iframeSrc + '?sc=' + base64_encode( shortcode ) );
	    		
	    		// update the height
	    		$('#tt-sc-preview').height( $('#tt-popup').outerHeight()-42 );
    		}
    	},
    	resizeTB: function()
    	{
			var	ajaxCont = $('#TB_ajaxContent'),
				tbWindow = $('#TB_window'),
				ttPopup = $('#tt-popup'),
				no_preview = ($('#_tt_preview').text() == 'false') ? true : false;
			
			if( no_preview )
			{
				ajaxCont.css({
					paddingTop: 0,
					paddingLeft: 0,
					height: (tbWindow.outerHeight()-47),
					overflow: 'scroll', // IMPORTANT
					width: 560
				});
				
				tbWindow.css({
					width: ajaxCont.outerWidth(),
					marginLeft: -(ajaxCont.outerWidth()/2)
				});
				
				$('#tt-popup').addClass('no_preview');
			}
			else
			{
				ajaxCont.css({
					padding: 0,
					// height: (tbWindow.outerHeight()-47),
					height: ttPopup.outerHeight()-15,
					overflow: 'hidden' // IMPORTANT
				});
				
				tbWindow.css({
					width: ajaxCont.outerWidth(),
					height: (ajaxCont.outerHeight() + 30),
					marginLeft: -(ajaxCont.outerWidth()/2),
					marginTop: -((ajaxCont.outerHeight() + 47)/2),
					top: '50%'
				});
			}
    	},
    	load: function()
    	{
    		var	tts = this,
    			popup = $('#tt-popup'),
    			form = $('#tt-sc-form', popup),
    			shortcode = $('#_tt_shortcode', form).text(),
    			popupType = $('#_tt_popup', form).text(),
    			uShortcode = '';
    		
    		// resize TB
    		tts.resizeTB();
    		$(window).resize(function() { tts.resizeTB() });
    		
    		// initialise
    		tts.loadVals();
    		tts.children();
    		tts.cLoadVals();
    		
    		// update on children value change
    		$('.tt-cinput', form).live('change', function() {
    			tts.cLoadVals();
    		});
    		
    		// update on value change
    		$('.tt-input', form).change(function() {
    			tts.loadVals();
    		});
    		
    		// when insert is clicked
    		$('.tt-insert', form).click(function() {
    			if(window.tinyMCE)
				{
					window.tinyMCE.execCommand('mceInsertContent', false, $('#_tt_ushortcode', form).html());
					tb_remove();
				}
    		});
    	}
	}
    
    // run
    $('#tt-popup').livequery( function() { tts.load(); } );
});
