/**
 * @autor Alexander Kuzmin <roosit@abricos.org>
 */
(function() {
	tinymce.PluginManager.requireLangPack('abrvideo');
	
	tinymce.create('tinymce.plugins.AbrVideo', {
		init : function(ed, url) {

			ed.addCommand('mceAbrVideo', function(ui) {
				ed.windowManager.open({
					file : url + '/video.htm',
					width : 480,
					height : 250,
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addButton('abrvideo', {
				title : 'abrvideo.title', 
				cmd : 'mceAbrVideo',
				image : url + '/img/video.gif'
			});
		},

		getInfo : function() {
			return {
				longname : 'Abricos Video plugin',
				author : 'Alexander Kuzmin',
				authorurl : 'http://abricos.org',
				infourl : 'http://abricos.org',
				version : "0.1"
			};
		}
	});
	tinymce.PluginManager.add('abrvideo', tinymce.plugins.AbrVideo);
})();