/*
NoteIt Version 0.4
Clemens Nylandsted Klokmose, 2016
*/

// Vi laver vores board manager objekt og hard-coder det til at peje på en json-server der kører lokalt på maskinen.
var sprintManager = {
    host: "http://localhost:3000"
};

// Get boards skaber et objekt med alle boards og alle deres tilknyttede noter.
// Dette kræver to kald til serveren, først et der henter boards ud, og et der henter notes ud.
// Den dobbelte for-løkke fylder noterne ind som et objekt i et givent board
sprintManager.getSprints = function(callback) {
    // Hent noter ud (asynkront kald, derfor gives en callback function med)
    miniREST.get(sprintManager.host+"/sprint", function(sprints) {
        // Noter hentes ud når boards er hentet
        miniREST.get(sprintManager.host+"/task", function(tasks) {
          // Vi løber alle boards i gennem
          for (var i = 0; i<sprints.length; i++) {
            // Kopierer listen over board IDer ud i et array
            var sprintNodes = sprints[i].tasks;
            // Overskriver attributten notes på boardet med et friskt objekt
            sprints[i].tasks = {};
            // Nu løber vi alle noter igennem
            for (var j = 0; j<tasks.length; j++) {
              // Hvis notes ID er i boardets liste af note IDer smider vi note objektet i det nye notes objekt
              var taskIndex = sprintNodes.indexOf(tasks[j].id);
              if (taskIndex > -1) {
                sprints[i].tasks[tasks[j].id] = tasks[j];
              }
            }
          }
          // Tilsidst kalder vi tilbage med vores nye (store) board objekt
          callback(sprints);
        });
    });
};

sprintManager.getTasks= function(callback) {
    // Hent noter ud (asynkront kald, derfor gives en callback function med)
    miniREST.get(sprintManager.host+"/task", function(tasks) {
          callback(tasks);
        });
};

// Her henter vi et specifikt board ud
sprintManager.getSprint = function(id, callback) {
    miniREST.get(sprintManager.host+"/sprint/"+id, function(sprint) {
        callback(sprint);
    });
};

// Denne metode tilføjer et board med et givent ID til serveren
sprintManager.addSprint = function(id, callback) {
    miniREST.post(sprintManager.host+"/sprint/", {"id": id, "estimatedTime": 0, "timeSpend": 0, "completed": false, "tasks": []}, function(status) {
      callback(status);
    });
};

// Henter en note med et givent id ud fra serveren
sprintManager.getTask = function(id, callback) {
    miniREST.get(sprintManager.host+"/task/"+id, function(sprint) {
        callback(sprint);
    });
};

// Tilføjer en note til serveren. Her sørger boardmanager for at give noten et unikt id
sprintManager.addTask = function(sprint, task) {
    task.id = sprintManager.createGuid();
    miniREST.post(sprintManager.host+"/task", task);
    this.addTaskToSprint(sprint, task);
};

// Updaterer en note med nu data
sprintManager.updateTask = function(taskId, task) {
    miniREST.put(sprintManager.host+"/task/"+taskId, task);
};


// Tilføjer en note til et board
// NB. boardet som giver med har noteobjekter associeret
// på serveren skal et board bare have en liste af note IDer
sprintManager.addTaskToSprint = function(sprint, task) {
  var sprintToStore = {
    "id": sprint.id,
    "tasks": Object.keys(sprint.tasks)
  };
  sprintToStore.tasks.push(task.id);
  miniREST.put(sprintManager.host+"/sprint/"+sprintToStore.id, sprintToStore);
}

// Metode til at skabe et unikt id.
sprintManager.createGuid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};


/*
SregSys Version 1.0
Asger Storebjerg og Magnus Szatkowski, 2016


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
*/
