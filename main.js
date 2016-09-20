/*
NoteIt Version 0.4
Clemens Nylandsted Klokmose, 2016
*/

// Vi starter med at hive vores boards ud fra serveren
// NB. her giver vi en anonym funktion med som der kaldes tilbage på
// Dette gør vi fordi kaldet til serveren er asynkront!
sprintManager.getSprints(function(sprints) {

    // Nu laver vi et data objekt til ractive som består af boards, et activeBoard som vi sætter til at være det første i listen, og editedNote som holder styr på hvilken note der editeres.
    var data = {sprints: sprints, activeSprint: 0, tasks: []};
    // Nu instantierer vi ractive. Vi giver den en reference til det element vi gerne vil have tegnet vores brugergrænse flade i som en css selector, reference til vores template, vi antager at vi er i en ny browser så vi kan godt bruge magic mode (http://docs.ractivejs.org/latest/magic-mode) og til sidst giver vi ractive vores data objekt.
    var ractive = new Ractive({
        el: '#content',
        template: '#main',
        magic: true,
        data: data,
    });

    // I vores template har vi defineret en masse event bindinger, dem håndterer vi med ractive.on.
    ractive.on({
      // editnote kaldes når der dobbeltklikkes på en note
      "edittask": function ( event ) {
        // Vi sætter bare data.editedNote til iden på den note der er dobbeltklikket på
        data.editedTask = event.node.getAttribute("data-id");
        //Vi sørger for at dobbeltklikket ikke opfører sig som standard og selecter al tekst i noten
        event.original.preventDefault();
        // Vi sørger for at afbryde events videre færden i DOM træet
        event.original.stopPropagation();
      },

      // stopedit bliver udløst når der klikkes på baggrunden
      "stopedit": function ( event ) {
        // Hvis vi ikke er igang med at editerer en note returnerer vi
        if(!data.editedNote || data.editedNote.length == 0) return;
        // Vi henter den nærmeste forfader der måtte være en note
        var note = event.original.target.closest(".note");
        // Hvis det er den note der bliver editeret returnerer vi
        if (note && note.getAttribute("data-id") == data.editedNote) return;
        // Vi finder IDet på noten
        var noteId = data.editedNote;
        // Henter det givne noteobjekt ud
        var currentBoard = data.boards[data.activeBoard];
        var noteObj = currentBoard.notes[noteId];
        //Så beder vi boardManager om at opdatere noten på serveren
        boardManager.updateNote(noteId, noteObj);
        // Og vi slår editing fra
        data.editedNote = "";
      },

      // Her håndterer vi et mousedown på en note ifbm. at flytte noten rundt
      "note-mousedown": function ( event )  {
        // Hvis vi allerede dragger returnerer vi (burde ikke ske)
        if (dragged) return;
        // Vi checker om der er klikket på en note
        var note = event.original.target.closest(".note");
        if (!note) return;
        // Vi holder snor i det noteobjekt og dets id som vi trækker rundt på
        // Noteobjektet for vi med event.context
        dragged = {id: note.getAttribute("data-id"), noteObj: event.context}
        // Så beregner og gemmer vi draggOffset
        var e = event.original;
        dragOffset.x = e.clientX - dragged.noteObj.position.x;
        dragOffset.y = e.clientY - dragged.noteObj.position.y;
      },

      // Her håndterer vi mousemove hvor vi opdaterer positionen af noten
      "board-mousemove": function ( event )  {
        if (!dragged) return;
        var e = event.original;
        dragged.noteObj.position.x = e.clientX - dragOffset.x;;
        dragged.noteObj.position.y = e.clientY - dragOffset.y;;
      },

      // Når vi slipper musen gemmer vi dataen
      "board-mouseup": function ( event )  {
        if (!dragged) return;
        // Vi beder boardManager om at opdatere på serveren
        boardManager.updateNote(dragged.id, dragged.noteObj);
        dragged = null;
      },

      // createnote kaldes når der dobbeltklikkes på baggrunden
      "createnote": function ( event ) {
        var e = event.original;
        // Vi laver et nyt noteobjekt
        var newNote = {content: "", position: {x: e.clientX, y: e.clientY}};
        // Vi tilføjer noten på serveren som så kalder tilbage med notens id
        var currentBoard = data.boards[data.activeBoard];
        boardManager.addNote(currentBoard, newNote);
        // Så opdater vi vores data med det nye board
        currentBoard.notes[newNote.id] = newNote;
        ractive.set("boards", data.boards);
        // Sætter den nye note til at skulle editeres
        data.editedNote = newNote.id;
        // Finder DOM elementet for textareaet i den nye note og giver det fokus
        document.querySelector('div[data-id="'+newNote.id+'"]').querySelector("textarea").focus();
      },

      // newboard udløses når der trykkes en tast i inputfeltet i øverste venstre hjørne
      "newboard": function ( event ) {
        var e = event.original;
        // Hvis det ikke er enter afbryder vi
        if (e.key != "Enter") return;
        // Vi henter det nye navn
        var boardName = e.target.value;
        // Vi putter et nyt board in i data.boards
        var boards = data.boards;
        boards.push({"notes": [], "id": boardName});
        // Pga. en teknikalitet i Ractive bliver vi nødt til at sætte dataen eksplicit nu for at det slår igennem
        ractive.set("boards", boards);
        // Vi sætter activeBoard til det nye board
        ractive.set("activeBoard", boards.length-1);
        // og gemmer dataen i databasen
        e.target.value = "";
        boardManager.addBoard(boardName);

      },
    });

});



/*
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
*/
