const schema_routes = {
  "fields" : [
    {
      "name" : "OBJECTID", 
      "type" : "esriFieldTypeOID", 
      "alias" : "OBJECTID", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "FacilityID", 
      "type" : "esriFieldTypeInteger", 
      "alias" : "Kjøretøys-ID", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "FacilityRank", 
      "type" : "esriFieldTypeInteger", 
      "alias" : "Rekkefølge", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Name", 
      "type" : "esriFieldTypeString", 
      "alias" : "Rutenavn", 
      "sqlType" : "sqlTypeOther", 
      "length" : 255, 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "IncidentCurbApproach", 
      "type" : "esriFieldTypeSmallInteger", 
      "alias" : "Ankomstside", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "FacilityCurbApproach", 
      "type" : "esriFieldTypeSmallInteger", 
      "alias" : "Avreiseside", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "IncidentID", 
      "type" : "esriFieldTypeInteger", 
      "alias" : "Hendelses-ID", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "StartTime", 
      "type" : "esriFieldTypeDate", 
      "alias" : "Avreisetidspunkt", 
      "sqlType" : "sqlTypeOther", 
      "length" : 8, 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "EndTime", 
      "type" : "esriFieldTypeDate", 
      "alias" : "Ankomsttidspunkt", 
      "sqlType" : "sqlTypeOther", 
      "length" : 8, 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "StartTimeUTC", 
      "type" : "esriFieldTypeDate", 
      "alias" : "Avreisetidspunkt, UTC", 
      "sqlType" : "sqlTypeOther", 
      "length" : 8, 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "EndTimeUTC", 
      "type" : "esriFieldTypeDate", 
      "alias" : "Ankomsttidspunkt, UTC", 
      "sqlType" : "sqlTypeOther", 
      "length" : 8, 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_Minutes", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Kjøretid", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_TravelTime", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Reisetid", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_Miles", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Antall miles", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_Kilometers", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Antall km", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_TimeAt1KPH", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Reisetid i 1 km/h", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_WalkTime", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Gangtid", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_TruckMinutes", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Kjøretid, lastebil", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Total_TruckTravelTime", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Reisetid, lastebil", 
      "sqlType" : "sqlTypeOther", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Shape__Length", 
      "type" : "esriFieldTypeDouble", 
      "alias" : "Shape__Length", 
      "sqlType" : "sqlTypeDouble", 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "RouteType", 
      "type" : "esriFieldTypeString", 
      "alias" : "RouteType", 
      "sqlType" : "sqlTypeOther", 
      "length" : 256, 
      "domain" : null, 
      "defaultValue" : null
    }, 
    {
      "name" : "Destination", 
      "type" : "esriFieldTypeString", 
      "alias" : "Destination", 
      "sqlType" : "sqlTypeOther", 
      "length" : 256, 
      "domain" : null, 
      "defaultValue" : null
    }
  ]
}