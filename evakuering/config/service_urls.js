//Set locale for moment
moment.locale('nb_NO');

//Authentication
const clientId = '8jqFFuKioA6zepfu';
const clientSecret = '1243db4379f543f1b6be899fcbef8aea';
const url_Token = 'https://www.arcgis.com/sharing/rest/oauth2/token';

//GP services
const url_evacGP = 'http://demo09.geodata.no/arcgis/rest/services/GP_Tjenester/UMS_Evakuering_GP/GPServer/UMS%20Evakuering';
const evacIter = 10;