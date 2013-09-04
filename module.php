<?php 
/**
 * @package Abricos
 * @subpackage TinyMCE
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @author Alexander Kuzmin (roosit@abricos.org)
 */

/**
 * Модуль текстового редактора TinyMCE.
 * 
 */
class TinyMCEModule extends Ab_Module {
	
	/**
	 * Версия редактора TinyMCE
	 * @var String 
	 */
	public $tinyMCEVersion = "3.5.8";

	public function TinyMCEModule(){
		$this->version = "0.1.4";
		$this->name = "tinymce";
		$this->takelink = "tinymce";
	}
	
	public function GetContentName(){
		$adress = $this->registry->adress;
		
		// разрешить страницу для разработчика модуля
		if ($adress->level >= 2 && 
			$adress->dir[1] == 'develop' &&
			CMSRegistry::$instance->config['Misc']['develop_mode']){
			return 'develop';
		}
		return parent::GetContentName();
	}
}

Abricos::ModuleRegister(new TinyMCEModule());

?>