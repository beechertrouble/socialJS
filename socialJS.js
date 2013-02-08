/**
* v. 3.6
* 
*/
var socialJS = function(target, parseNow, args) {
	
	this.args = args === undefined ? {} : args;
	
	this.target = target; // REQUIRED
	this.parseNow = parseNow === undefined ? true : parseNow;
	this.URL = window.location.href; 
	this.IMG = undefined; 
		
	this.showCount = false;
	this.lang = 'en_US';
	this.description = false;
	
	this.which = ['facebook', 'twitter', 'googleplus', 'pinterest', 'tumblr']; // all of 'em
	
	// setup
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
			
			// lang
			var tryDesc = S.target.attr('data-description') === undefined ? S.args.description : S.target.attr('data-description'); // from html or js args
			S.description = tryDesc === undefined ? S.description : tryDesc;
			
			// parsenow?
			if(S.parseNow)
				S.parseEm();
				
		}
		
	} //
	this.getWhich = function() {
		
		var S = this,
			current = S.which,
			which = [];
		
		for(var i=0;i<current.length;i++) {
		
			var thisOne = current[i].toLowerCase().replace(/[^a-z0-9]/g, ""),
				whichClass = "." + thisOne + '_wrap';
			
			if(S.target.find(whichClass).length	 > 0)
				which.push(thisOne);
			
			if(i == (S.which.length -1))
				S.which = which;
		}
		
	} //
	this.facebook = {
		
		send : false,
		layout : 'button_count', // standard | button_count | box_count 
		width : false,
		faces : false,
		action : 'like', // like | recommend
		colorscheme : 'light', // light | dark
		html : function(S) {
								
				var send = ' data-send="' + S.facebook.send + '" ';
				var layout = ' data-layout="' + S.facebook.layout + '" ';
				var action = ' data-action="' + S.facebook.action + '" ';
				var faces = ' data-show-faces="' + S.facebook.faces + '" ';
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
				
				var theHTML = '<div class="fb-like" data-href="' + S.URL + '" ' + send + layout + action + faces + colorscheme + width + '></div>'; 
				
				S.target.find(".facebook_wrap").html(theHTML).addClass('social_inited');
				
			},
		script : function(SOC) {
								
				if($("#fb-root").index() < 0)
					$("body").append('<div id="fb-root" />');
					
				(function(d, s, id) {
				  var js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return;
				  js = d.createElement(s); js.id = id;
				  js.src = "//connect.facebook.net/" + SOC.lang + "/all.js#xfbml=1";
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
		
		text : false,
		via : false,
		related : false,
		count : false, // none | horizontal | vertical
		hashtags : false,
		size : false, // medium | large
		html : function(S) {
								
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
				
		size : false, // small | medium | standard | tall
		annotation : false, // none | bubble | inline
		width : false, // 
		align : false, //
		expandTo : false, // csv : top, right, left, bottom
		html : function(S) {
								
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
				
												
				if(typeof gapi !== 'undefined') { // && typeof window.googleapis !== 'undefined'

					setTimeout(function() { gapi.plusone.go(); }, 900); // having to put a stupid delay on this to deal with the intermittant window.googleapis error ... 

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
		parse : function(S) {
			
		}
		
	} //
	this.pinterest = {
		
		layout : false,
		description : false,
		html : function(S) {
				
				if(S.IMG !== undefined) {
				
					var layout = S.pinterest.layout ? ' count-layout="' + S.pinterest.layout + '" ' : ' count-layout="horizontal" ';
					var count = S.showCount ? layout : ' count-layout="none" ';
					var media = S.IMG !== undefined ? '&media=' + encodeURIComponent( media ) : '';
					var gobalText = S.description ?  '&description=' + encodeURIComponent( S.description ) : '';
					var desc = S.pinterest.description ? '&description=' + encodeURIComponent( S.pinterest.description ) : gobalText;
					var theHTML = '<a href="http://pinterest.com/pin/create/button/?url=' + encodeURIComponent( S.URL ) + media + '" class="pin-it-button" ' + count + '><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>'; 
					
					S.target.find(".pinterest_wrap").html(theHTML).addClass('social_inited');
				
				}
				
			},
		script : function(S) {
				S.pinterest.parse(S);
			},
		parse : function(S) {
						
			if(S.IMG !== undefined) {
			
				(function(m,q,c){var s=function(h){var d=c.pinit,n="?",a,i,f,b;f=[];b=[];var j={},g=m.createElement("IFRAME"),r=h.getAttribute(c.att.count)||false,o=h.getAttribute(c.att.layout)||"horizontal";if(q.location.protocol==="https:")d=c.pinit_secure;f=h.href.split("?")[1].split("#")[0].split("&");a=0;for(i=f.length;a<i;a+=1){b=f[a].split("=");j[b[0]]=b[1]}a=f=0;for(i=c.vars.req.length;a<i;a+=1){b=c.vars.req[a];if(j[b]){d=d+n+b+"="+j[b];n="&"}f+=1}if(j.media&&j.media.indexOf("http")!==0)f=0;if(f===i){a=0;
	for(i=c.vars.opt.length;a<i;a+=1){b=c.vars.opt[a];if(j[b])d=d+n+b+"="+j[b]}d=d+"&layout="+o;d=d+"&ref="+encodeURIComponent(m.URL);if(r!==false)d+="&count=1";g.setAttribute("src",d);g.setAttribute("scrolling","no");g.allowTransparency=true;g.frameBorder=0;g.style.border="none";g.style.width=c.layout[o].width+"px";g.style.height=c.layout[o].height+"px";h.parentNode.replaceChild(g,h)}else h.parentNode.removeChild(h)},p=m.getElementsByTagName("A"),l,e,k=[];e=0;for(l=p.length;e<l;e+=1)k.push(p[e]);e=0;
	for(l=k.length;e<l;e+=1)k[e].href&&k[e].href.indexOf(c.button)!==-1&&s(k[e])})(document,window,{att:{layout:"count-layout",count:"always-show-count"},pinit:"http://pinit-cdn.pinterest.com/pinit.html",pinit_secure:"https://assets.pinterest.com/pinit.html",button:"//pinterest.com/pin/create/button/?",vars:{req:["url","media"],opt:["title","description"]},layout:{none:{width:43,height:20},vertical:{width:43,height:58},horizontal:{width:90,height:20}}});
	
			}
			
		}
		
	} //

	this.init = function(S) {
								
		for(var i=0;i<S.which.length;i++) {
			
			var which = S.which[i];
			
			if(!(($.browser !== undefined && $.browser.msie && parseInt($.browser.version, 10) === 7) && which == 'googleplus'))
				S[which].html(S);
		
			if(i == (S.which.length - 1))
				S.target.addClass('social_inited');
		}
		
	} //
	this.getScripts = function() {
		
		var S = this;
		
		if(window.socialScriptsStatus === undefined) { // don't load 'em twice!
		
			window.socialScriptsStatus = 'loading';
			
			for(var i=0;i<S.which.length;i++) {
			
				var which = S.which[i];
								
				if(!(($.browser !== undefined && $.browser.msie && parseInt($.browser.version, 10) === 7) && which == 'googleplus'))
					S[which].script(S);
				
				if(i == (S.which.length -1)) {
					window.socialScriptsStatus = 'loaded';	
					$("body").addClass('social_scripts_loaded');
				}
			}
		}
	} //
	this.parseEm = function(S) {
				
		var S = S === undefined ? this : S;
				
		if(!S.target.is('.social_inited')) 
			S.init(S);
		
		switch(window.socialScriptsStatus) {
			
			case('loaded'):
				for(var i=0;i<S.which.length;i++) {
				
					var which = S.which[i];
								
					if(!(($.browser !== undefined && $.browser.msie && parseInt($.browser.version, 10) === 7) && which == 'googleplus'))
						S[which].parse(S);
				
				}
				break;
				
			case('loading'):
				setTimeout(function() { S.parseEm(); }, 500);
				break;
				
			case(undefined):
			default:
				S.getScripts();
				setTimeout(function() { S.parseEm(); }, 750);
				break;
			
		}
		
	
	} //
	this.newURL = function(newURL) {
		
		var S = this;
		
		S.URL = newURL;
		S.target.find(".socail_wrap").empty();
		S.init(S);
		S.parseEm();
		
	} //


	this.setup();

}