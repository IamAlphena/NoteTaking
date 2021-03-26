const express = require("express");
const path = require("path");
const app = express();
const storage = require("./db/db.json")

const PORT = process.env.PORT || 8080

//Middleware Functions
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Static file hostong for public directory
app.use(express.static("public"));

//HTML Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
})

//API routes
//read from notes json
app.get("/api/notes", function (req, res){
    res.json(storage)
});

app.post("/api/notes", function (req, res){
    //variable to 
    
    storage.push(req.body);
});

app.delete("/api/notes", function (req, res){
    //Delete a note based off id
    const { id } = req.params;

});






app.listen(PORT, () => console.log("App listening on port" + PORT));