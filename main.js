
// Først hiver vi vores boards ud
var projects = ProjectManager.getProjects();
// Nu laver vi et data objekt til ractive som består af boards, et activeBoard som vi sætter til at være det første i listen, og editedNote som holder styr på hvilken note der editeres.
var data = {
  projects: projects;
  projectName: "",
  activeProject: Object.keys(projects)[0],
  productBacklog: {userStories:[]},
  sprints: [],
}
// Nu instantierer vi ractive. Vi giver den en reference til det element vi gerne vil have tegnet vores brugergrænse flade i som en css selector, reference til vores template, vi antager at vi er i en ny browser så vi kan godt bruge magic mode (http://docs.ractivejs.org/latest/magic-mode) og til sidst giver vi ractive vores data objekt.
var ractive = new Ractive({
    el: '#content',
    template: '#projekt',
    magic: true,
    data: data,
});
