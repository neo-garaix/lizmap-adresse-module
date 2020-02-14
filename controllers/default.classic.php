<?php
/**
* @package   lizmap
* @subpackage adresse
* @author    Pierre DRILLIN
* @copyright 2020 3liz
* @link      http://3liz.com
* @license    All rights reserved
*/

class defaultCtrl extends jController {

  function index(){
    $rep = $this->getResponse('json');

    // vérifier que les paramètres repository, project, geom, srid sont non null ou vide

    $project = $this->param('project');
    $repository = $this->param('repository');
    $geom = $this->param('geom');
    $srid = $this->param('srid');
    $option = $this->param('opt');

    if(!$project){
      $rep->data = array('status'=>'error', 'message'=>'Project not find');
      return $rep;
    }

    if(!$repository){
      $rep->data = array('status'=>'error', 'message'=>'Repository not find');
      return $rep;
    }

    if(!$geom){
      $rep->data = array('status'=>'error', 'message'=>'Geometry not find');
      return $rep;
    }

    if(!$srid){
      $rep->data = array('status'=>'error', 'message'=>'SRID not find');
      return $rep;
    }

    if(!$option){
      $rep->data = array('status'=>'error', 'message'=>'Option not find');
      return $rep;
    }

    // vérifier que le repository et le project correspondent à un projet lizmap

    $p = lizmap::getProject($repository.'~'.$project);
    if( !$p ){
        $rep->data = array('status'=>'error', 'message'=>'A problem occured while loading project with Lizmap');
        return $rep;
    }

    // vérifier que le projet contient la couche point_adresse

    $layer = $p->findLayerByName('point_adresse');
    if(!$layer){
      $rep->data = array('status'=>'error', 'message'=>'Layer point_adresse does not exist');
      return $rep;
    }

    // demander la voie éditable à proximité de la geom

    $autocomplete = jClasses::getService('adresse~search');
    try {
        $result = $autocomplete->getData( $repository, $project, 'point_adresse', $geom, $srid, $option);
    } catch (Exception $e) {
        $result = Null;
    }

    $rep->data = $result;
    return $rep;
  }
}
