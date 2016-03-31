var TINYMCE_VERSION = '4.3.3';

var Component = new Brick.Component();
Component.requires = {
    ext: [{
        name: 'tinymce',
        fullpath: '/modules/tinymce/lib/' + TINYMCE_VERSION + '/tinymce.gzip.js',
        type: 'js'
    }],
    mod: [
        {name: 'sys', files: ['editor.js']},
        {name: '{C#MODNAME}', files: ['lib.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,
        SYS = Brick.mod.sys,
        language = Abricos.config.locale;

    if (language === 'ru-RU'){
        language = 'ru';
    } else if (language === 'en-EN'){
        language = 'en';
    }

    new Abricos.TemplateManager(this.key); // css enable hack

    var LNG = new Abricos.ComponentLanguage(this),

        MODE_CODE = SYS.Editor.MODE_CODE,
        MODE_VISUAL = SYS.Editor.MODE_VISUAL;

    // TODO: pagebreak config
    NS.OPTIONS = {
        language: language,
        theme: 'modern',
        plugins: 'hr link image paste print preview anchor pagebreak ' +
        'searchreplace visualblocks visualchars fullscreen media ' +
        'nonbreaking table ' +
        'emoticons textcolor',
        relative_urls: false,
        convert_urls: false,
        gecko_spellcheck: true,
        menubar: false,
        pagebreak_separator: '<cut>',
        visual: false,
        statusbar: false,
        allow_script_urls: true,
        extended_valid_elements:'script[language|type|src|charset]'
    };

    NS.TOOLBAR_FULL = {
        toolbar1: 'undo redo | cut copy paste | bullist numlist | ' +
        'filemanager image link unlink media anchor nonbreaking table emoticons hr ',

        toolbar2: 'bold italic underline strikethrough | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'forecolor backcolor | ' +
        'subscript superscript blockquote | ' +
        'styleselect formatselect fontselect fontsizeselect | removeformat',

        toolbar3: 'searchreplace preview print visualblocks fullscreen codemode'
    };

    NS.TOOLBAR_STANDART = {
        toolbar1: 'undo redo | cut copy paste | bullist numlist | ' +
        'filemanager image link unlink media nonbreaking table emoticons hr | ' +
        'searchreplace preview print fullscreen codemode',

        toolbar2: 'bold italic underline strikethrough | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'forecolor backcolor | ' +
        'styleselect formatselect fontselect fontsizeselect | removeformat'

    };

    NS.TOOLBAR_MINIMAL = {
        toolbar1: 'bold italic underline strikethrough | ' +
        'undo redo | ' +
        'filemanager image link unlink media | ' +
        'codemode '
    };

    NS.VisualEditor = Y.Base.create('tinyMCE', SYS.VisualEditor, [], {
        initializer: function(){
            this._mceInstance = null;

            var instance = this;

            tinyMCE_GZ.init(NS.OPTIONS, function(){
                instance._onLoadTinyMCE();
            });
        },
        _onLoadTinyMCE: function(){
            var toolbar = {};
            switch (this.get('toolbar')) {
                case SYS.Editor.TOOLBAR_FULL:
                    toolbar = NS.TOOLBAR_FULL;
                    break;
                case SYS.Editor.TOOLBAR_STANDART:
                    toolbar = NS.TOOLBAR_STANDART;
                    break;
                case SYS.Editor.TOOLBAR_MINIMAL:
                    toolbar = NS.TOOLBAR_MINIMAL;
                    break;
            }

            var instance = this,
                srcNode = this.get('srcNode'),
                options = Y.merge(NS.OPTIONS,
                    toolbar,
                    {
                        selector: '#' + srcNode.id,
                        setup: function(editor){
                            instance._onSetupTinyMCE(editor);
                        }
                    }
                );

            Brick.use('{C#MODNAME}', 'plugins', function(){
                tinymce.init(options);
            }, this);
        },
        _onSetupTinyMCE: function(editor){
            this._mceInstance = editor;

            var instance = this;

            editor.addButton('filemanager', {
                tooltip: LNG.get('button.filemanager.tooltip'),
                icon: 'icon-filemanager',
                onclick: function(){
                    Brick.Component.API.fire('filemanager', 'api', 'showFileBrowserPanel', function(result){
                        editor.execCommand('mceInsertContent', false, result['html']);
                    });
                }
            });

            editor.addButton('codemode', {
                tooltip: LNG.get('button.codemode.tooltip'),
                icon: 'icon-codemode',
                onclick: function(){
                    instance.set('mode', MODE_CODE);
                }
            });

            var callback = this.get('initCallback');
            callback ? callback.call((this.get('initContext') || null), this) : null;

            // hack for change visual mode
            var mode = this.get('mode');
            setTimeout(function(){
                if (mode === MODE_CODE){
                    editor.hide();
                } else {
                    editor.show();
                }
            }, 500);
        },
        destructor: function(){
            var mce = this._mceInstance;
            if (mce){
                mce.destroy();
                tinymce.remove(mce);
                this._mceInstance = null;
            }
        },
        insertValue: function(value){
            this._mceInstance.execCommand('mceInsertContent', false, value);
        }
    }, {
        ATTRS: {
            content: {
                lazyAdd: false,
                value: '',
                getter: function(val){
                    var mce = this._mceInstance;
                    if (mce){
                        val = mce.getContent();
                    }

                    if (mce.hidden){
                        val = this.get('srcNode').value;
                    }
                    return val;
                },
                setter: function(val){
                    var mce = this._mceInstance;
                    if (!mce){
                        return val;
                    }
                    mce.setContent(val);
                    return val;
                }
            },
            mode: {
                getter: function(val){
                    var mce = this._mceInstance;
                    if (!mce){
                        return val;
                    }
                    val = mce.isHidden() ? SYS.Editor.MODE_CODE : SYS.Editor.MODE_VISUAL;
                    return val;
                },
                setter: function(val){
                    var mce = this._mceInstance;
                    if (!mce){
                        return val;
                    }

                    if (val === MODE_CODE){
                        mce.hide();
                    } else {
                        mce.show();
                    }
                    return val;
                }
            }
        }
    });
};
