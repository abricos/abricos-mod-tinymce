<?php
/**
 * @package Abricos
 * @subpackage Tinymce
 * @copyright 2008-2015 Alexander Kuzmin
 * @license http://opensource.org/licenses/mit-license.php MIT License
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

/**
 * Class TinyMCEModule
 */
class TinyMCEModule extends Ab_Module {

    /**
     * Версия редактора TinyMCE
     *
     * @var string
     */
    public $tinyMCEVersion = "3.5.8";

    public function __construct(){
        $this->version = "0.1.7";
        $this->name = "tinymce";
    }
}

Abricos::ModuleRegister(new TinyMCEModule());
