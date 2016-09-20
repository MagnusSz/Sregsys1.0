/*
NoteIt Version 0.4
Clemens Nylandsted Klokmose, 2016

miniREST er et minimalt library til at lave xmlHTTP requests til en RESTful API
*/

var miniREST = {};

// Laver et GET på url og kalder callback med JSON data
miniREST.get = function(url, callback) {
    this.doRequest("GET", url, null, function(data) {
        callback(JSON.parse(data));
    });
};

// Laver et POST på url med JSON dataen data og kalder callback
miniREST.post = function(url, data, callback) {
    this.doRequest("POST", url, data, callback);
};

// Laver et PUT på url med JSON dataen data og kalder callback
miniREST.put = function(url, data, callback) {
    this.doRequest("PUT", url, data, callback);
};

// Laver et DETE på url kalder callback
miniREST.delete = function(url, callback) {
    this.doRequest("DELETE", url, null, callback);
};

// Opretter et xmlHTTP request med det givne HTTP verb på url med data og kalder callback
miniREST.doRequest = function(verb, url, data, callback) {
    // Opret et http request object
    var xmlHttp = new XMLHttpRequest();
    // Dette kaldes når der kommer svar tilbage fra serveren
    xmlHttp.onreadystatechange = function() { 
        // Hvis vi er færdige og vi ikke fik en fejl så kald tilbage med dataen
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            if (callback) callback(xmlHttp.responseText);
    };
    // Her åbner vi requestet, den sidste parameter angiver at det er et asynkront request
    xmlHttp.open(verb, url, true);
    // Så sætter vi headeren til at vi sender JSON
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Og så sender vi dataen som en JSON serialiseret streng.
    xmlHttp.send(JSON.stringify(data));
};
