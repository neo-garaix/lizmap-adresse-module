
<?php
class adresseListener extends jEventListener{

   function ongetMapAdditions ($event) {

        // vérifier que le repository et le project correspondent à un projet lizmap
        $repository = $event->repository;
        $project = $event->project;
        $p = lizmap::getProject($repository.'~'.$project);
        if( !$p ){
             return;
        }

        // vérifier que le projet contient la couche point_adresse

        $layer = $p->findLayerByName('point_adresse');
        if (!$layer) {
        return;
        }

       $js = array();
       $jscode = array();
       $css = array();

       $adresseConfig = array();

       $adresseConfig['point_adresse'] = array();
       $adresseConfig['point_adresse']['id'] = $layer->id;
       $adresseConfig['point_adresse']['name'] = $layer->name;

       $adresseConfig['urls'] = array();
       $adresseConfig['urls']['getVoie'] = jUrl::get('adresse~service:index');

       $bp = jApp::config()->urlengine['basePath'];

       $js = array(
          jUrl::get('jelix~www:getfile', array('targetmodule'=>'adresse', 'file'=>'adresse.js'))
       );

       $jscode = array(
                'var adresseConfig = ' . json_encode($adresseConfig)
       );

       $event->add(
           array(
               'js' => $js,
               'jscode' => $jscode
           )
       );
   }
}
?>
