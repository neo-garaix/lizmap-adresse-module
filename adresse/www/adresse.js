/**
* @package   lizmap
* @subpackage adresse
* @author    Pierre DRILLIN
* @copyright 2020 3liz
* @link      http://3liz.com
* @license    Mozilla Public Licence
*/

var lizAdresse = function() {
  var adresseMessageTimeoutId = null;
  function cleanAdresseMessage() {
          var $AdresseMessage = $('#lizmap-adresse-message');
          if ( $AdresseMessage.length != 0 ) {
              $AdresseMessage.remove();
          }
          adresseMessageTimeoutId = null;
  }
  function addAdresseMessage(aMessage, aType, aClose){
    if ( adresseMessageTimeoutId ) {
        window.clearTimeout(adresseMessageTimeoutId);
        adresseMessageTimeoutId = null;
    }
    var $AdresseMessage = $('#lizmap-adresse-message');
    if ( $AdresseMessage.length != 0 ) {
        $AdresseMessage.remove();
    }
    lizMap.addMessage(aMessage, aType, aClose).attr('id','lizmap-adresse-message');
    adresseMessageTimeoutId = window.setTimeout(cleanAdresseMessage, 5000);
  }
  lizMap.events.on({
   'lizmapeditiongeometryupdated': function(e){
     if (e.layerId == adresseConfig['point_adresse']['id']) {
       var form = $('#edition-form-container form');
       var nColumn = form.find('input[name="numero"]');
       var sColumn = form.find('input[name="suffixe"]');
       var vColumn = form.find('select[name="id_voie"]');
       var option = undefined;
       var val = undefined;
       var num = "";
       var suffixe = '';
       var voie = '';
       option = 'idvoie';
       var options = {
                      repository: lizUrls.params.repository,
                      project: lizUrls.params.project,
                      geom: ''+e.geometry,
                      srid: e.srid,
                      opt: option
                  };
       var url = adresseConfig['urls']['getVoie'];
       if (form.find('input[name="liz_featureId"]').val()== ''){
         $.getJSON(
             url,
             options,
             function( data, status, xhr ) {
                 if(data){
                     option = data[0]['type_num'].toLowerCase();
                     options['opt'] = option;
                     voie = data[0]['id_voie'];
                     vColumn.val(voie);
                     vColumn.change();
                     $.getJSON(
                         url,
                         options,
                         function( data, status, xhr ) {
                             if(data){
                               nColumn.val(data[0]['num']);
                               sColumn.val(data[0]['suffixe']);
                             }
                         }
                     );
                 }
             }
         );
       }
     }
  },
  'lizmappopupdisplayed':function(e){
    $('div.lizmapPopupContent input.lizmap-popup-layer-feature-id').each(function(){

              var self = $(this);
              var val = self.val();
              var fid = val.split('.').pop();
              var layerId = val.replace( '.' + fid, '' );
              var getLayerConfig = lizMap.getLayerConfigById( layerId );
              if( getLayerConfig ) {
                  var layerConfig = getLayerConfig[1];
                  var layerName = getLayerConfig[0];

                  if (layerName == adresseConfig['voie']['name'] ){
                    var btnBar = self.next('span.popupButtonBar');
                    var btn = $('<button></button>');
                    btn.addClass("btn btn-mini");
                    var icon = $('<i></i>');
                    icon.addClass('icon-refresh');
                    btn.append(icon);
                    if ( btnBar.length != 0 ) {
                        btnBar.append(btn);
                    } else {
                        var eHtml = '<span class="popupButtonBar">' + btn + '</span></br>';
                        self.after(eHtml);
                    }
                    var url = adresseConfig['urls']['update'];
                    var options = {
                                   repository: lizUrls.params.repository,
                                   project: lizUrls.params.project,
                                   id: '',
                                   opt: 'reverse'
                               };
                    btn.click(function(e) {
                      var featId = self.val();
                      var leid = featId.split('.');
                      options['id'] = leid[1];
                      $.getJSON(
                        url,
                        options,
                        function(data,status,xhr){
                          if(data){
                            if(data['type'] == 'success'){
                              addAdresseMessage(data['message'],'info',true);
                              $('#dock-close').click();
                            }else{
                              addAdresseMessage(data['message'],'error',true);
                            }
                          }
                        }
                      );
                    });

                  }
             }
    });
  },
  'lizmapeditionformdisplayed':function(e) {
    var login = adresseConfig['user'];
    var form = $('#edition-form-container form');
    var cColumn = form.find('input[name="createur"]');
    var mColumn = form.find('input[name="modificateur"]');
    if (form.find('input[name="liz_featureId"]').val()== ''){
      cColumn.val(adresseConfig['user']);
      mColumn.val(adresseConfig['user']);
    }else{
      mColumn.val(adresseConfig['user']);
    }
  }
 });
 return {};
}();
