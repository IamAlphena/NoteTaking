const express = require("express");
const path = require("path");
const fs = require("fs")
const app = express();
const storage = require("./db/db.json");
const { uuid } = require('uuidv4');

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
//read from notes json
app.get("/api/notes", function (req, res) {
    res.json(storage)
});

app.post("/api/notes", function (req, res) {

    const notes = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text,
    }

    fs.readFile("./db/db.json", "utf8", function (err, data) {
        let parseData = JSON.parse(data);
        parseData.push(notes);
        parseData = JSON.stringify(parseData)
        fs.writeFile("./db/db.json", parseData, function (err, data) {
            if (err) throw err
        })
    })


});

app.delete("/api/notes/:id", function (req, res) {
    //Delete a note based off id
    const id = req.params.id;
    console.log(id)

    fs.readFile("./db/db.json", "utf8", function (err, data) {
        let dataNote = JSON.parse(data)
        // console.log(dataNote)
        for (let i = 0; i < dataNote.length; i++) {
            if (id === dataNote[i].id){
                dataNote.splice([i],1);
            }else {
                return
            }
        }
    })
    res.end("Note was deleted")
});

app.listen(PORT, () => console.log("App listening on port" + PORT));