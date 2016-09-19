/*
SregSys Version 1.0
Asger Storebjerg og Magnus Szatkowski, 2016
*/

//Denne fil bruges til at oprette et projekt
var projectManager = {};

//Denne funktion gemmer et objekt alle projekter i JSONStorage under nøglen project1
projectManager.store = function(projects) {
  jsonStorage.setItem("project1", projects);
}

//Denne funktion henter alle applikationernes projekter ud fra JSONStorage
projectManager.getProjects = function() {
  var projects = (jsonStorage.getItem("project1") || {default: {projectBacklog: []}});
  return projects;
}

// Denne funktion laver en (sandsynligvis) garanteret unik ID streng
projectManager.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};
