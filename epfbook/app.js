const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

datafile = "C:/Users/Amine/Desktop/4E_ANNEE/Semestre_2/Web Programming/Web_Programming0/MMMDE4IN19-23-DHANE-Amine/epfbook/name_school.csv"

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views','./views');
app.set('viewengine','ejs')

app.get('/', (req, res) => {
  //res.send('Hello World! My name is Amine DHANE. I am 21 years old')
  res.sendFile(path.join(__dirname, "./views/home.html"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log("Bonjour je m'appelle Amine.")
})

app.get('/api/students', (req, res) => {
    /*res.send([{ name: "Eric Burel", school: "EPF" }, 
              { name: "HarryPotter", school: "Poudlard"}])*/
    const rowSeparator = "\n";
    const cellSeparator = ",";
    fs.readFile('name_school.csv', 'utf8', (err, data) => {
      if (err) {
        // gestion de l'erreur
        console.log("Not possible to load the data from the file.")
      } else {
        // utilisation des données lues depuis le fichier
        const rows = data.split(rowSeparator);
        var students = []
        for (i=1;i<rows.length;i++){
          if(rows[i]!=""){
            infos = rows[i].split(";")
            let Student = {
              name : infos[0],
              school : infos[1]
            };
            students[i-1] = Student
          }
        }
        res.send(students);
      }
    })
})

app.post('/api/students/create', (req,res) => {
  const csvLine = "\n" + req.body.name + "," + req.body.school;
  fs.writeFile(datafile, csvLine, { flag: 'a'}, (err) => {
    if(err){
      console.error(err);
    } else {
      console.log(req.body);
    }
  }); 
  res.send('Student created');
});

function studentsfromcsv(datafile, callback) {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  fs.readFile(datafile, 'utf8', (err, data) => {
    if (err) {
      // gestion de l'erreur
      console.log("Not possible to load the data from the file.")
      callback(err);
    } else {
      var students = []
      // utilisation des données lues depuis le fichier
      const rows = data.split(rowSeparator);
      for (i=1;i<rows.length;i++){
        if(rows[i]!=""){
          infos = rows[i].split(";")
          let Student = {
            name : infos[0],
            school : infos[1]
          };
          students[i-1] = Student
        }
      }
      callback(null, students);
    }
  })
}

app.get('/students', (req, res) => {
  studentsfromcsv(datafile, (err, students) => {
    if (err){
      console.error(err)
    } else {
      res.render(path.join(__dirname, "./views/students.ejs"), {students})
    }
  })
})

app.get('/students/create', (req, res) => {
  res.render(path.join(__dirname, "./views/create-student.ejs"));
});

app.post('/students/create', (req,res) => {
  const csvLine = "\n" + req.body.name + ";" + req.body.school;
  fs.writeFile(datafile, csvLine, { flag: 'a'}, (err) => {
    if(err){
      console.error(err);
    } else {
      console.log(req.body);
    }
    res.redirect("/students/create?created=1");
  }); 
})