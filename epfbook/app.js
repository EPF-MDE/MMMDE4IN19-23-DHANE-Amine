const express = require('express');
const app = express();
const basicAuth = require("express-basic-auth");
const port =  process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const datafile = "./name_school.csv"
const datafile2 = "./users.csv"
var cookieParser = require('cookie-parser')
/**
* Authorizer function
* @param {*} username Provided username
* @param {*} password Provided password
* @param {*} callback (error, isAuthorized)
*/
const passwordAuthorizer = (username, password, callback) => {

  usersFromCsv((err, users) => {
    console.log(users)
    const userSearched = users.find((possibleUser) => {
      return basicAuth.safeCompare(possibleUser.username, username)
    });
  
    if (!userSearched){
      callback(null,false)
    } else {
      bcrypt.compare(password, userSearched.password, callback);
    }
  });
};
//1234admin, 22072001, coucou, buggit
app.use(express.json());
app.use(cookieParser())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  basicAuth({
      //users: { admin: "supercretin" },
      //users: {[process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
      authorizer:passwordAuthorizer,
      authorizeAsync:true,
      challenge: true,
  })
);

app.set('views','./views');
app.set('viewengine','ejs')

function usersFromCsv(callback){
  const rowSeparator = "\r\n";
  fs.readFile(datafile2, 'utf8', (err, data) => {
    if (err) {
      // gestion de l'erreur
      console.log("Not possible to load the data from the file.")
      callback(err);
    } else {
  var users = []
  const rows = data.split(rowSeparator);

  for (i=1;i<rows.length;i++){
    if(rows[i]!=""){
      infos = rows[i].split(";")
      let User = {
        username : infos[0],
        password : infos[1]
      };
      users[i-1] = User
    }
  }
  return callback(null, users);
    }
  });
}

function studentsfromcsv(callback) {
  const rowSeparator = "\n";
  const cellSeparator = "\t";
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

app.get('/', (req, res) => {
  //res.send('Hello World! My name is Amine DHANE. I am 21 years old')
  res.sendFile(path.join(__dirname, "./views/home.html"))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
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

app.get('/students', (req, res) => {
  studentsfromcsv((err, students) => {
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

app.post('/api/login', (req,res) => {
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.send(req.cookies);
});

app.get('/students/data', (req, res) => {
  res.render(path.join(__dirname, "./views/students_data.ejs"));
});