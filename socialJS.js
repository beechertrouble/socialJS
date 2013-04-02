/**
* v. 3.8
* 
*/
var socialJS = function(target, parseNow, args) {
	
	this.args = args === undefined ? {} : args;
	
	this.target = target; // REQUIRED
	
	// some global settings ...
	this.parseNow = parseNow === undefined ? true : parseNow;
	this.URL = this.args.URL !== undefined ? this.args.URL : window.location.href; 
	this.IMG = this.args.IMG !== undefined ? this.args.IMG : undefined; 
	this.showCount = this.args.showCount !== undefined ? this.args.showCount : false;
	this.lang = this.args.lang !== undefined ? this.args.lang : 'en_US'; 
	this.description = this.args.description !== undefined ? this.args.description : false;
	this.which = ['facebook', 'twitter', 'googleplus', 'pinterest', 'tumblr']; // all of 'em
	
	// some specifics
	this.FBargs = this.args.FBargs !== undefined ? this.args.FBargs : {};
	this.TWargs = this.args.TWargs !== undefined ? this.args.TWargs : {};
	this.GPargs = this.args.GPargs !== undefined ? this.args.GPargs : {};
	this.PTargs = this.args.PTargs !== undefined ? this.args.PTargs : {};
	
	/**
	* setup based on js args > html data-attr > defaults
	*/
	this.setup = function() {
		
		var S = this;
		
		if(S.target !== undefined) {
			
			// which
			S.getWhich();
			
			// URL
			var tryURL = S.target.attr('data-url') === undefined ? S.args.URL : S.target.attr('data-url'); // from html or js args
			S.URL = tryURL === undefined ? S.URL : tryURL; 
				
			// IMG
			var tryIMG = S.target.attr('data-image') === undefined ? S.args.IMG : S.target.attr('data-image'); // from html or js args
			S.IMG = tryIMG === undefined ? S.IMG : tryIMG; 
			
			// showCount
			var tryShowCount = S.target.attr('data-showcount') === undefined ? S.args.showCount : S.target.attr('data-showcount'); // from html or js args
			S.showCount = tryShowCount === undefined ? S.showCount : tryShowCount; 
			
			// lang
			var tryLang = S.target.attr('data-lang') === undefined ? S.args.lang : S.target.attr('data-lang'); // from html or js args
			S.lang = tryLang === undefined ? S.lang : tryLang;
			S.translateLang();
			
			// Description
			var tryDesc = S.target.attr('data-description') === undefined ? S.args.description : S.target.attr('data-description'); // from html or js args
			S.description = tryDesc === undefined ? S.description : tryDesc;
			
			// parsenow?
			if(S.parseNow)
				S.parseEm();
								
		}
		
	} //
	
	/**
	* translate language : i.e. translate 'en' to 'en_US' ...
	*/
	this.translateLang = function(lang, whichVersion) {
			
		var tryLang = lang !== undefined ? lang : this.lang,
			wV = whichVersion !== undefined ? whichVersion : 'fb',
			rosetta = {
				'en' : {'fb' : 'en_US'}, 
				'fr' : {'fb' : 'fr_FR'}
			};
		
		this.lang = rosetta[tryLang] !== undefined ? rosetta[tryLang][wV] : this.lang;
		
	} //
	
	/**
	* build array of which based on container divs .social_wrap
	*/
	this.getWhich = function() {
		
		var S = this,
			current = S.which,
			which = [];
		
		for(var i=0;i<current.length;i++) {
		
			var thisOne = current[i].toLowerCase().replace(/[^a-z0-9]/g, ""),
				whichClass = "." + thisOne + '_wrap';
			
			if(S.target.find(whichClass).length > 0)
				which.push(thisOne);
			
			if(i == (S.which.length -1))
				S.which = which;
		}
		
	} //
	
	/**
	*  add the JS for each SN --> should only do this once ... pinterest might be an exception because it's dumb
	*/
	this.getScripts = function(S, thisOne) {
		
		var S = S === undefined ? this : S;
		
		if(window.socialScriptsStatus === undefined)
			window.socialScriptsStatus = {};
		
		if(thisOne == undefined) {
						
			for(var i=0;i<S.which.length;i++) {
				
				var which = S.which[i];
				
				S.tryScript(S, which);
				
			}
			
		} else {
			
			S.tryScript(S, thisOne);
			
		}
		
	} //
	
	this.tryScript = function(S, thisOne) {
		
		if(window.socialScriptsStatus[thisOne] === undefined) {
		
			window.socialScriptsStatus[thisOne] = 'loading';
									
			if(!(($.browser !== undefined && $.browser.msie && parseInt($.browser.version, 10) === 7) && thisOne == 'googleplus'))
				S[thisOne].script(S);
			
			window.socialScriptsStatus[thisOne] = 'loaded';
			
		}
		
	} //
	
	/**
	* adds the required html for each social network
	*/
	this.init = function(S) { 
	
		var S = S === undefined ? this : S;
								
		for(var i=0;i<S.which.length;i++) {
			
			var which = S.which[i];
			
			if(!(($.browser !== undefined && $.browser.msie && parseInt($.browser.version, 10) === 7) && which == 'googleplus'))
				S[which].html(S);
		
			if(i == (S.which.length - 1))
				S.target.addClass('social_inited');
		}
		
	} //
	
	/**
	* this asks the JS for each SN to parse the HTML we added in the init call
	*/
	this.parseEm = function(S, thisOne) {
				
		var S = S === undefined ? this : S;
				
		if(!S.target.is('.social_inited')) 
			S.init(S);
			
		if(window.socialScriptsStatus === undefined) {
			
			S.getScripts(S);
			setTimeout(function() { S.parseEm(S); }, 750);
			
		} else if(thisOne === undefined) {
		
			for(var i=0;i<S.which.length;i++) {
					
				var which = S.which[i];
				
				S.tryParse(S, which);
			
			}
			
		} else {
			
			S.tryParse(S, thisOne);
			
		}
	} //
	
	this.tryParse = function(S, thisOne) {
		
		switch(window.socialScriptsStatus[thisOne]) {
			
			case('loaded'):
				if(!(($.browser !== undefined && $.browser.msie && parseInt($.browser.version, 10) === 7) && thisOne == 'googleplus'))
					S[thisOne].parse(S);
				break;
				
			case('loading'):
				setTimeout(function() { S.tryParse(S, thisOne); }, 500);
				break;
				
			case(undefined):
			default:
				S.getScripts(S, thisOne);
				setTimeout(function() { S.tryParse(S, thisOne); }, 750);
				break;
			
		}
		
	} //
	
	/**
	* want to socialize a different url (or img, or desc) in the same spot?
	*/
	this.rebuild = function(newURL, newIMG, newDesc) {
		
		var S = this;
		
		// override
		S.URL = newURL === undefined ? S.URL : newURL;
		S.IMG = newIMG === undefined ? S.IMG : newIMG;
		S.description = newDesc === undefined ? S.description : newDesc;
		
		// emtpy and rebuild
		S.target.find(".social_wrap").empty();
		S.init(S);
		S.parseEm();
		
	} //
	
	/* 
	* >=======================> jam some setup and utilities for each social plugin .... <===============<
	*/
		
	this.facebook = {
				
		send : this.FBargs.send !== undefined ? this.FBargs.send : false, // only | true (both) | false (only like)
		layout : this.FBargs.layout !== undefined ? this.FBargs.layout : 'button_count', // standard | button_count | box_count 
		width : this.FBargs.width !== undefined ? this.FBargs.width : false,
		faces : this.FBargs.faces !== undefined ? this.FBargs.faces : false,
		action : this.FBargs.action !== undefined ? this.FBargs.action : 'like', // like | recommend
		colorscheme : this.FBargs.colorscheme !== undefined ? this.FBargs.colorscheme : 'light', // light | dark
		html : function(S) {
				
				// turn settings into attr strings ...
				var send = S.facebook.send == 'only' ? '' : ' data-send="' + S.facebook.send + '" ';
				var layout = S.facebook.send == 'only' ? '' : ' data-layout="' + S.facebook.layout + '" ';
				var action = S.facebook.send == 'only' ? '' : ' data-action="' + S.facebook.action + '" ';
				var faces = S.facebook.send == 'only' ? '' : ' data-show-faces="' + S.facebook.faces + '" ';
				var colorscheme = ' data-colorscheme="' + S.facebook.colorscheme + '" ';
				var width = '';
				
				switch(S.facebook.layout) {
					
					case('button_count'):
						width = 90;
						break;
					
					case('standard'):
						width = 225;
						break;
						
					case('box_count'):
						width = 55;
						break;
				}	
				
				width = S.facebook.width ? ' data-width="' + S.facebook.width + '" ' : ' data-width="' + width + '" ';
				
				var whichClass = S.facebook.send == 'only' ? 'fb-send' : 'fb-like';
				
				var theHTML = '<div class="' + whichClass + '" data-href="' + S.URL + '" ' + send + layout + action + faces + colorscheme + width + '></div>'; 
				
				S.target.find(".facebook_wrap").html(theHTML).addClass('social_inited');
				
			},
		script : function(SOC) {
				
				var add_app_id = SOC.FBargs.APP_ID !== undefined ? '&appId=' + SOC.FBargs.APP_ID : '';
								
				if($("#fb-root").index() < 0)
					$("body").append('<div id="fb-root" style="position:absolute;top:0px;"></div>');
					
				(function(d, s, id) {
				  var js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return;
				  js = d.createElement(s); js.id = id;
				  js.src = "//connect.facebook.net/" + SOC.lang + "/all.js#xfbml=1" + add_app_id;
				  fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			
			},
		parse : function(S) {
				
				S.facebook.canIparse(S);
				
			},
		canIparse : function(S) {
						
			if(typeof FB !== 'undefined') {
				FB.XFBML.parse();
			} else {
				setTimeout(function() { S.facebook.canIparse(); }, 900);
			}

		}
		
	} //
	this.twitter = {
		
		text : this.TWargs.text !== undefined ? this.TWargs.text : false,
		via : this.TWargs.via !== undefined ? this.TWargs.via : false,
		related : this.TWargs.related !== undefined ? this.TWargs.related : false,
		count : this.TWargs.count !== undefined ? this.TWargs.count : false, // none | horizontal | vertical
		hashtags : this.TWargs.hashtags !== undefined ? this.TWargs.hashtags : false,
		size : this.TWargs.size !== undefined ? this.TWargs.size : false, // medium | large
		html : function(S) {
				
				// turn settings into attr strings ...				
				var gobalText = S.description ? ' data-text="' + S.description + '" ' : '';
				var text = S.twitter.text ? ' data-text="' + S.twitter.text + '" ' : gobalText;
				var via = S.twitter.via ? ' data-via="' + S.twitter.via + '" ' : '';
				var related = S.twitter.related ? ' data-related="' + S.twitter.related + '" ' : '';
				var count = S.twitter.count ? '  data-count="' + S.twitter.count + '" ' : false;
					count = S.showCount ? count : ' data-count="none" ';
				var hashtags = S.twitter.hashtags ? ' data-hashtags="' + S.twitter.hashtags + '" ' : '';
				var size = S.twitter.size ? ' data-size="' + S.twitter.size + '" ' : ' data-size="medium" ';
				var theHTML = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + S.URL + '" data-counturl="' + S.URL + '" data-lang="' + S.lang + '" ' + count + text + via + related + hashtags + size + '>&nbsp;</a>'; 
				S.target.find(".twitter_wrap").html(theHTML).addClass('social_inited');
			
			},
		script : function(S) {
		
				!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
				
			},
		parse : function(S) {
		
				if(typeof twttr !== 'undefined')
					twttr.widgets.load();
					
			}
			
	} //
	this.googleplus = {
				
		size : this.GPargs.size !== undefined ? this.GPargs.size : false, // small | medium | standard | tall
		annotation : this.GPargs.annotation !== undefined ? this.GPargs.annotation : false, // none | bubble | inline
		width : this.GPargs.width !== undefined ? this.GPargs.width : false, // 
		align : this.GPargs.align !== undefined ? this.GPargs.align : false, //
		expandTo : this.GPargs.expandTo !== undefined ? this.GPargs.expandTo : false, // csv : top, right, left, bottom
		html : function(S) {
				
				// turn settings into attr strings ...					
				var size = S.googleplus.size ?  ' data-size="' + S.googleplus.size + '" ' : ' data-size="medium" ';
				var annotation = S.googleplus.annotation ?  ' data-annotation="' + S.googleplus.annotation + '" ' : '';
				var width = S.googleplus.width ?  ' data-size="' + S.googleplus.width + '" ' : '';
				var align = S.googleplus.align ?  ' data-align="' + S.googleplus.align + '" ' : '';
				var expandTo = S.googleplus.expandTo ?  ' data-align="' + S.googleplus.expandTo + '" ' : '';
				var count = S.showCount ? annotation : ' data-annotation="none" ';
				var theHTML = '<div class="g-plusone" data-href="' + S.URL + '" ' + count + size + width + align + expandTo + '></div>'; 
				
				S.target.find(".googleplus_wrap").html(theHTML).addClass('social_inited');
			
			},
		script : function(S) {
				
				window.___gcfg = {parsetags: 'explicit'};

				(function() {
				    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				    po.src = 'https://apis.google.com/js/plusone.js';
				    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				  })();
			
			},
		parse : function(S) {
				
												
				if(typeof gapi !== 'undefined') { // && typeof window.googleapis !== 'undefined' <- that bug is only when firebug is disabled

					gapi.plusone.go();

				} else {
				
					setTimeout(function() { S.googleplus.parse(S); }, 850);
					
				}
								
				
			}
		
	} //
	this.tumblr = {
		
		html : function(S) {
				
				var theHTML = '<a href="http://www.tumblr.com/share" title="Share on Tumblr" style="display:inline-block; text-indent:-9999px; overflow:hidden; width:61px; height:20px; background:url(http://platform.tumblr.com/v1/share_2.png) top left no-repeat transparent;">Share on Tumblr</a>'; 
				
				S.target.find(".tumblr_wrap").html(theHTML).addClass('social_inited');
				
			},
		script : function(S) {
				
				$.getScript('http://platform.tumblr.com/v1/share.js');
			
			},
		parse : function(S) {}
		
	} //
	this.pinterest = {
		
		layout : this.PTargs.layout !== undefined ? this.PTargs.layout : false,
		description : this.PTargs.description !== undefined ? this.PTargs.description : false,
		html : function(S) {
								
				if(S.IMG !== undefined) { // only if an image is defined ...
					
					// turn settings into attr strings ...			
					var layout = S.pinterest.layout ? ' data-pin-config="' + S.pinterest.layout + '" ' : ' data-pin-config="beside" ',
						count = S.showCount ? layout : ' data-pin-config="none" ',
						media = S.IMG !== undefined && S.IMG != 'undefined' ? '&media=' + encodeURIComponent( S.IMG ) : '',
						gobalText = S.description ?  '&description=' + encodeURIComponent( S.description ) : '',
						desc = S.pinterest.description ? '&description=' + encodeURIComponent( S.pinterest.description ) : '&description=' + gobalText,
						theHTML = '<a ' + count + ' href="//pinterest.com/pin/create/button/?url=' + encodeURIComponent( S.URL ) + media + desc + '" data-pin-do="buttonPin" data-pin-log="button_pinit" ><img src="//assets.pinterest.com/images/pidgets/pin_it_button.png" /></a>';
										
					S.target.find(".pinterest_wrap").html(theHTML).addClass('social_inited');
				
				}
				
			},
		script : function(S) {
				S.pinterest.parse(S);
			},
		parse : function(SOC) {
			
			if(SOC.IMG !== undefined) {
			
				$.getScript('http://assets.pinterest.com/js/pinit.js');
					
			}
			
		}
		
	} //
	

	/**
	* run the setup on definition
	*/
	this.setup();

}