
// Først hiver vi vores boards ud
var projects = projectManager.getProjects();
// Nu laver vi et data objekt til ractive som består af boards, et activeBoard som vi sætter til at være det første i listen, og editedNote som holder styr på hvilken note der editeres.
var data = {
  projects: projects,
  projectName: "",
  activeProject: Object.keys(projects)[0],
  productBacklog: {backlogUrl:"", userStories:[]},
  sprints: [],
}
// Nu instantierer vi ractive. Vi giver den en reference til det element vi gerne vil have tegnet vores brugergrænse flade i som en css selector, reference til vores template, vi antager at vi er i en ny browser så vi kan godt bruge magic mode (http://docs.ractivejs.org/latest/magic-mode) og til sidst giver vi ractive vores data objekt.
var ractive = new Ractive({
    el: '#content',
    template: '#main',
    magic: true,
    data: data,
});

// KODE INDSAT FRA HANS MAIN.JS
// I vores template har vi defineret en masse event bindinger, dem håndterer vi med ractive.on.
ractive.on({
  // editnote kaldes når der dobbeltklikkes på en note
  "editnote": function ( event ) {
    // Vi sætter bare data.editedNote til iden på den note der er dobbeltklikket på
    data.editedNote = event.node.getAttribute("data-id");
    //Vi sørger for at dobbeltklikket ikke opfører sig som standard og selecter al tekst i noten
    event.original.preventDefault();
    // Vi sørger for at afbryde events videre færden i DOM træet
    event.original.stopPropagation();
  },


  // newproject udlæses når der trykkes en tast i inputfeltet i øverste venstre hjørne
  "newproject": function ( event ) {
    var e = event.original;
    // Hvis det ikke er enter afbryder vi
    if (e.key != "Enter") return;
    // Vi henter det nye navn
    var projectName = e.target.value;
    // Vi putter et nyt project in i data.projects
    var projects = data.projects;
    projects[projectName] = {projectName: e.target.value, productBacklog: {backlogUrl:"test",userStories:["Get Shit Done", "Get Shit To Work"]}, sprints:{}};
    // Pga. en teknikalitet i Ractive bliver vi nødt til at sætte dataen eksplicit nu for at det slår igennem
    ractive.set("projects", projects);
    // Vi sætter activeBoard til det nye board
    data.activeProject = projectName;
    // og gemmer dataen i databasen
    projectManager.store(data.projects);
    // Tilsidst rydder vi inputfeltet
    e.target.value = "";
  },

  "creatUserstory": function ( event ) {
    var e = event.original;
    // Vi laver et nyt noteobjekt
    var newUserstory = {text: "", id: boardManager.guid()};
    // Putter noten ind i listen af notes på det active board
    data.projects[data.activeProject].productBacklog.userStories.push(newUserstory);
    // Gemmer dataen
    projectManager.store(data.projects);
    // Sætter den nye note til at skulle editeres
    data.editedNote = newUserstory.id;
    // Finder DOM elementet for textareaet i den nye note og giver det fokus
    document.querySelector('div[data-id="'+newUserstory.id+'"]').querySelector("textarea").focus();
  },
});
