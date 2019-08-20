define({
  // UI
  "title": "OSL PASSASJERFLYT",
  "subtitle": "Pax i terminalen kl:",
  "credits": "Demonstrasjon for Avinor",
  "colors": ["#5cc9cd", "#54b2cd", "#4ba0c7", "#448ec7", "#b599db", "#d3d440", "#b4b537", "#99b535", "#6da92c", "#4d9828", "#f5c002", "#fb9721", "#fb621e", "#e53d0c", "#d1260f"],
  // MAP
  "basemap": "dark-gray",
  //"center": [-74.003, 40.68, 1800],
  "center": [11.035, 60.185, 1800],
  "zoom": 14,
  "tilt": 65,
  "heading": 80,
  // LAYERS
  //"buildingsUrl": "http://tiles.arcgis.com/tiles/0p6i4J6xhQas4Unf/arcgis/rest/services/Manhattan3D_CullingBack/SceneServer/layers/0",
  //"buildingsUrl": "http://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/New_York_LoD2_3D_Buildings/SceneServer/layers/0",
  
  //OSL
  //"buildingsUrl": "https://tiles.arcgis.com/tiles/2JyTvMWQSnM2Vi8q/arcgis/rest/services/EtasjeFBefolkning/SceneServer/layers/0",
  "buildingsUrl": "https://tiles.arcgis.com/tiles/2JyTvMWQSnM2Vi8q/arcgis/rest/services/OslBefolkningsanalyse_EtasjeF/SceneServer/layers/0",



  //"footprintsUrl": "https://services.arcgis.com/gy2aAFD8MoOmJdXp/ArcGIS/rest/services/Building_Footprints/FeatureServer/0",
  "footprintsUrl": "http://services.arcgis.com/80hk79qB8z45zcHi/arcgis/rest/services/Building_Footprints/FeatureServer/0",
  "idField": "doitt_id",
  "buildingsColor": [150, 150, 150, 1],
  "highColor": [17, 187, 223, 1],
  "startId": 529760,
  
  
  // DATA
  //"dataUrl": "http://services.arcgis.com/80hk79qB8z45zcHi/ArcGIS/rest/services/NYC_Felony_2015/FeatureServer/0",
  //"dataUrl": "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Passasjerflyt/FeatureServer/0",
  "dataUrl":"https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Passasjerflyt_liten/FeatureServer/0",
  
  //"dateField": "Occurrence_Date",
  "dateField": "Tidspunkt",
  // SETTINGS
  "min": 500,
  "max": 1000,
  "distance": 500,
  "interval": 100, 
  "months": ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  "hours": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
});
