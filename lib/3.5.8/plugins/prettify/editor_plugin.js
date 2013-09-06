/**
 * http://abricos.org, https://github.com/abricos/tinymce-prettify-plugin
 * @license    Dual licensed under the MIT or GPL Version 3 licenses.
 * @version    0.1
 * @author     Alexander Kuzmin <roosit@abricos.org>
 * @package    TinyMCE
 * @name       prettify
 * GPL 3 LICENCES
 */
(function() {
	tinymce.PluginManager.requireLangPack('prettify');
	
	tinymce.create('tinymce.plugins.prettify', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;
			ed.addCommand('mceprettify', function() {
				ed.windowManager.open({
					file : url + '/dialog.htm',
					width : 450 + parseInt(ed.getLang('prettify.delta_width', 0)),
					height : 400 + parseInt(ed.getLang('prettify.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url, 
					some_custom_arg : 'custom arg'
				});
			});

			ed.addButton('prettify', {
				title : 'prettify.desc',
				cmd : 'mceprettify',
				image : url + '/img/prettify.png'
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('prettify', n.nodeName == 'IMG');
			});

            ed.onInit.add(function( ed ) {
                ed.dom.loadCSS(url + '/css/codeditor.css');
            });

	        if (tinymce.isIE || tinymce.isWebKit){
	            ed.onKeyDown.add(function(ed, e) {
	                var brElement;
	                var selection = ed.selection;
	
	                if (e.keyCode == 13 && selection.getNode().nodeName === 'CODE') {
	                    selection.setContent('<br id="__prettify" /> ', {format : 'raw'}); // Do not remove the space after the BR element.
	
	                    brElement = ed.dom.get('__prettify');
	                    brElement.removeAttribute('id');
	                    selection.select(brElement);
	                    selection.collapse();
	                    return tinymce.dom.Event.cancel(e);
	                }
	            });
	        }
	
	        if (tinymce.isGecko || tinymce.isOpera) {
	            ed.onKeyDown.add(function(ed, e) {
	                var selection = ed.selection;
	                
	                if (e.keyCode == 9 && selection.getNode().nodeName === 'CODE') {
	                    selection.setContent('\t', {format : 'raw'});
	                    return tinymce.dom.Event.cancel(e);
	                }
	            });
	        }
	
	        if (tinymce.isGecko) {
	            ed.onSetContent.add(function(ed, o) {
	                t._replaceNewlinesWithBrElements(ed);
	            });
	        }
	
	        ed.onPreProcess.add(function(ed, o) {
	            t._replaceBrElementsWithNewlines(ed, o.node);
	
	            if (tinymce.isWebKit){
	                t._removeSpanElementsInPreElementsForWebKit(ed, o.node);
	            }
	
	            var el = ed.dom.get('__prettifyFixTooltip');
	            ed.dom.remove(el);
	        });
	    },
	
	    _nl2br: function( strelem ) {
	        var t = this;
	        //Redefined the espace and unescape function
	
	        if(!(t.escape && t.unescape)) {
	            var escapeHash = {
	                '_' : function(input) {
	                    var ret = escapeHash[input];
	                    if(!ret) {
	                        if(input.length - 1) {
	                            ret = String.fromCharCode(input.substring(input.length - 3 ? 2 : 1));
	                        }
	                        else {
	                            var code = input.charCodeAt(0);
	                            ret = code < 256
	                                ? "%" + (0 + code.toString(16)).slice(-2).toUpperCase()
	                                : "%u" + ("000" + code.toString(16)).slice(-4).toUpperCase();
	                        }
	                        escapeHash[ret] = input;
	                        escapeHash[input] = ret;
	                    }
	                    return ret;
	                }
	            };
	            t.escape = t.escape || function(str) {
	                return str.replace(/[^\w @\*\-\+\.\/]/g, function(aChar) {
	                    return escapeHash._(aChar);
	                });
	            };
	            t.unescape = t.unescape || function(str) {
	                return str.replace(/%(u[\da-f]{4}|[\da-f]{2})/gi, function(seq) {
	                    return escapeHash._(seq);
	                });
	            };
	        }
	        strelem = t.escape(strelem);
	        var newlineChar;
	
	        if(strelem.indexOf('%0D%0A') > -1 ){
	            newlineChar = /%0D%0A/g ;
	        } else if (strelem.indexOf('%0A') > -1){
	            newlineChar = /%0A/g ;
	        } else if (strelem.indexOf('%0D') > -1){
	            newlineChar = /%0D/g ;
	        }
	
	        if ( typeof(newlineChar) == "undefined"){
	            return t.unescape(strelem);
	        } else {
	            return t.unescape(strelem.replace(newlineChar, '<br/>'));
	        }
	    },
	
	    _replaceNewlinesWithBrElements: function(ed) {
	        var t = this;
	        
	        var preElements = ed.dom.select('code');
	        for (var i=0; i<preElements.length; i++) {
	            preElements[i].innerHTML = t._nl2br(preElements[i].innerHTML);
	        }
	    },
	
	     _replaceBrElementsWithNewlines: function(ed, node){
	        var brElements = ed.dom.select('code br', node);
	        var newlineChar = tinymce.isIE ? '\r' : '\n';
	        var newline;
	
	        for (var i=0; i<brElements.length; i++){
	            newline = ed.getDoc().createTextNode(newlineChar);
	
	            ed.dom.insertAfter(newline, brElements[i]);
	            ed.dom.remove(brElements[i]);
	        }
	    },
	
	    _removeSpanElementsInPreElementsForWebKit: function(ed, node){
	        var spanElements = ed.dom.select('code span', node);
	        var space;
	        for (var i=0; i<spanElements.length; i++) {
	            space = ed.getDoc().createTextNode(spanElements[i].innerHTML);
	            ed.dom.insertAfter(space, spanElements[i]);
	            ed.dom.remove(spanElements[i]);
	        }
	    },
		createControl : function(n, cm) {
			return null;
		},
	
		getInfo : function() {
			return {
				longname : 'Code Highlight',
				author : 'Alexander Kuzmin',
				authorurl : 'http://abricos.org',
				infourl : 'http://abricos.org',
				version : "0.1"
			};
		}
	});

	tinymce.PluginManager.add('prettify', tinymce.plugins.prettify);
})();