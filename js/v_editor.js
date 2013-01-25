/*
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

/**
 * @module TinyMCE
 * @namespace Brick.mod.tinymce
 */

var TINYMCE_VERSION = '3.3.9.2'; 

var Component = new Brick.Component();
Component.requires = {
	mod:[
	     {name: 'tinymce', files: ['api.js']},
	     {name: 'sys', files: ['editor.js']}
	]
};
Component.entryPoint = function(NS){
	
	var Dom = YAHOO.util.Dom,
		E = YAHOO.util.Event,
		L = YAHOO.lang;
	
	var Editor = Brick.widget.Editor;

	/**
	 * Конфигурация визуального редактора TinyMCE.
	 * 
	 * @class TinyMCEConfig
	 * @static 
	 */
	var TinyMCEConfig = {

		/**
		 * Базовые настройки редактора.
		 * 
		 * @property base
		 * @static
		 * @type Object
		 */
		base: {
			mode : "exact", 
			theme : "advanced", 
			language: Brick.env.language, 
			debug: false, 
			plugins : 'abrvideo,inlinepopups,safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,'+
				'emotions,iespell,insertdatetime,preview,media,searchreplace,print,'+
				'contextmenu,paste,directionality,fullscreen,noneditable,visualchars,'+
				'nonbreaking,xhtmlxtras',
			paste_auto_cleanup_on_paste: true,
			cleanup: true,
			theme_advanced_buttons1: "",
			theme_advanced_buttons2: "", 
			theme_advanced_buttons3: "", 
			theme_advanced_buttons4: "",
			paste_auto_cleanup_on_paste: true,
			theme_advanced_toolbar_location: "top",
			theme_advanced_toolbar_align: "left",
			theme_advanced_resizing: true,
			theme_advanced_resize_horizontal: false,
			extended_valid_elements : 'object[width|height|classid|codebase|embed|param],param[name|value],embed[param|src|type|width|height|flashvars|wmode]',
			relative_urls: false,			
			convert_urls: false,
			media_strict: false,
			gecko_spellcheck : true
		},

		/**
		 * Конфигурация панели инструментов, режим "Расширеный"
		 * 
		 * @property toolbarFull
		 * @static
		 * @type Object
		 */
		toolbarFull: {
			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
			theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,blockquote,pagebreak"
		},
		
		/**
		 * Конфигурация панели инструментов, режим "Средний"
		 * 
		 * @property toolbarAverage
		 * @static
		 * @type Object
		 */
		toolbarAverage: {
			theme_advanced_buttons1: "formatselect,|,bold,italic,underline,strikethrough,|,undo,redo,|,bullist,numlist,|,link,unlink,image,abrvideo",
			theme_advanced_blockformats : "p,h3,h4,h5,h6,blockquote,code"
		},
		
		/**
		 * Конфигурация панели инструментов, режим "Минимальный"
		 * 
		 * @property toolbarMinimal
		 * @static
		 * @type Object
		 */
		toolbarMinimal: {
			theme_advanced_buttons1: "bold,italic,underline,strikethrough,|,bullist,numlist,|,link,unlink,image"
		},
		
		/**
		 * Получить конфигурацию редактора.
		 * 
		 * @method getConfig
		 * @static
    	 * @param {String} toolbarMode Режим панели инструментов, имеет значение: 
         * <a href="Brick.widget.Editor.html#property_TOOLBAR_FULL">Editor.TOOLBAR_FULL</a> |
         * <a href="Brick.widget.Editor.html#property_TOOLBAR_STANDART">Editor.TOOLBAR_STANDART</a> |
         * <a href="Brick.widget.Editor.html#property_TOOLBAR_MINIMAL">Editor.TOOLBAR_MINIMAL</a>.
         * @return {Object} Конфигурация редактора.
		 */
		getConfig: function(toolbarMode){
			var toolbar = {};
			switch(toolbarMode){
			case Editor.TOOLBAR_FULL:
				toolbar = this.toolbarFull;
				break;
			case Editor.TOOLBAR_STANDART:
				toolbar = this.toolbarAverage;
				break;
			case Editor.TOOLBAR_MINIMAL:
				toolbar = this.toolbarMinimal;
				break;
			}
			var cfg = L.merge(this.base, toolbar);
			return cfg;
		}
	};
	
	NS.TinyMCEConfig = TinyMCEConfig;
	
	/**
	 * Обертка визуального редактора TinyMCE для Brick.mod.Editor.
	 * 
     * @class EditorEngine
     * @constructor
     * @extends Brick.widget.VisualEditor
     * @param {Brick.widget.Editor} owner
	 */
	var EditorEngine = function(owner){
		EditorEngine.superclass.constructor.call(this, 'tinymce', owner);
	};
	EditorEngine.preload = function(callback){
		NS.API.loadTinyMCE(callback);
	};
	
	YAHOO.extend(EditorEngine, Brick.widget.VisualEditor, {
		
		_isSetTinyMCE: false,
		
		init: function(){
			var __self = this;
			NS.API.loadTinyMCE(function(){
				var mode = __self.owner.get('mode');
				__self.setMode(mode);
			});
		},
		
		destroy: function(){
			this.setMode(Editor.MODE_CODE);
		},
		
		setMode: function(mode){
			var el = this.getElement();
			if (mode == Editor.MODE_CODE && this._isSetTinyMCE){
				tinyMCE.execCommand( 'mceRemoveControl', true, el.id);
				this._isSetTinyMCE = false;
			}else if (mode == Editor.MODE_VISUAL && !this._isSetTinyMCE){
				var tbmode = this.owner.get('toolbar');
				this.setToolbar(tbmode);
			}
		},
		
		setToolbar: function(toolbarMode){
			if (this._isSetTinyMCE){
				this.setMode(Editor.MODE_CODE);
			}
			var el = this.getElement();
			var cfg = TinyMCEConfig.getConfig(toolbarMode);

			tinyMCE.init(cfg);
			tinyMCE.execCommand('mceAddControl', true, el.id);
			this._isSetTinyMCE = true;
		},
		
		setContent: function(text){
			var el = this.getElement();
			el.value = text;
			if (!this._isSetTinyMCE){
				return;
			}
			tinyMCE.get(el.id).setContent(text);
		},
		
		getContent: function(){
			var el = this.getElement();
			if (!this._isSetTinyMCE){
				return el.value;
			}
			return tinyMCE.get(el.id).getContent();
		},
		
		insertValue: function(text){
			var el = this.getElement();
			if (!this._isSetTinyMCE){
				return;
			}
			tinyMCE.get(el.id).execCommand('mceInsertContent', false, text);
		}
		
	});

	NS.EditorEngine = EditorEngine;
	
	// Зарегистрировать редактор в менеджере редакторов
	Brick.widget.EditorManager.registerEngine('tinymce', EditorEngine);
};
