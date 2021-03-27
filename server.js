//variables requring pieces to function
const express = require("express");
const path = require("path");
const fs = require("fs")
const app = express();
const storage = require("./db/db.json");
const { uuid } = require('uuidv4');

//directs to specific port
const PORT = process.env.PORT || 8080

//Middleware Functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Static file hostong for public directory
app.use(express.static("public"));

//HTML Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
})

//API routes

//continuously communiate with the json db to interact with it throughout our data
let storedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

//pulls from storedNotes to update as we go, generating on the page
app.get("/api/notes", function (req, res) {
    res.json(storedNotes)
});

//saves a new note
app.post("/api/notes", function (req, res) {
    //creates variable to save information from app
    const notes = {
        //generates a unique id number
        id: uuid(),
        //pulls the title of the note
        title: req.body.title,
        //pulls the text of the note
        text: req.body.text,
    }

    //add new note to storedNotes
    storedNotes.push(notes)

    //stringifies the array to be able to save it 
    storedNotes = JSON.stringify(storedNotes)
    //saves the new note to file, or throws err
    fs.writeFile("./db/db.json", storedNotes, function (err, data) {
        if (err) throw err
    });
    //reparses the data to stay written on the page
    storedNotes = JSON.parse(storedNotes);
    //resolves, and logs a note was added
    res.json(console.log("note added"))
});

//allows us to delete a note
app.delete("/api/notes/:id", function (req, res) {
    //creates a variable off id, pulling from the note we click on's button
    const id = req.params.id;

    //for each item in our storedNotes array
    storedNotes.forEach(function (data, index) {
        //if the id we pulled matches the id of the item in the storedNotes array
        if (id === data.id) {
            //delete that index'd value from the array using splice
            storedNotes.splice(data.index, 1);
            //else, do nothing. 
        } else {
            return
        }
    })
       //stringifies the array to be able to save it 
       storedNotes = JSON.stringify(storedNotes)
       //saves the new note to file, or throws err
       fs.writeFile("./db/db.json", storedNotes, function (err, data) {
           if (err) throw err
       });
       //reparses the data to stay written on the page
       storedNotes = JSON.parse(storedNotes);

       //console log that a note was deleted
    res.end(console.log("Note was deleted"))
});

//let us know upon launch it is listening properly
app.listen(PORT, () => console.log("App listening on port" + PORT));