/** 
 * http://abricos.org, https://github.com/abricos/tinymce-prettify-plugin
 * @license    Dual licensed under the MIT or GPL Version 3 licenses.
 * @version    0.1
 * @author     Alexander Kuzmin <roosit@abricos.org>
 * @package    TinyMCE
 * @name	   prettify
 * GPL 3 LICENCES
 */
tinyMCEPopup.requireLangPack();
var prettifyDialog = {
	init : function() {},
	insert : function() {
		var f = document.forms[0], options = '';
		//If no code just return.
		if(f.prettify_code.value == '') {
		  tinyMCEPopup.close();
		  return false;
		}
		if(f.prettify_linenums.checked) {
		  options += ' linenums';
		}
		var oCode = '<pre class="prettyprint"><code class="';
		if (f.prettify_language.value != ''){
			oCode += ' language-' +f.prettify_language.value;
		}
		oCode += options + '">';
		oCode +=  tinyMCEPopup.editor.dom.encode(f.prettify_code.value);
		oCode += '</code></pre> ';
        oCode += '<p>&nbsp;</p>';
		tinyMCEPopup.editor.execCommand('mceInsertContent', false, oCode);
		tinyMCEPopup.close();
	}
};
tinyMCEPopup.onInit.add(prettifyDialog.init, prettifyDialog);