const express = require('express');
const fs = require("fs");
const path = require("path");

const basicAuth = require("express-basic-auth");
const bcrypt = require('bcrypt');

const app = express();
const port =  process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views','./views');
app.set('viewengine','ejs');

app.use(express.static('public'));

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const datafile = "./name_school.csv"
const datafile2 = "./users.csv"

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

app.use(
  basicAuth({
      //users: { admin: "supercretin" },
      //users: {[process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
      authorizer:passwordAuthorizer,
      authorizeAsync:true,
      challenge: true,
  })
);

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
            id : infos[0],
            name : infos[1],
            school : infos[2]
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
    const rowSeparator = "\r\n";
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
              id : infos[0],
              name : infos[1],
              school : infos[2]
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

app.post('/students/create', (req, res) => {
  // Read the CSV file to get the number of lines
  fs.readFile(datafile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      // Handle the error appropriately
      return res.redirect("/students/create?error=1");
    }
    // Split the CSV data into an array of lines
    const lines = data.split("\n");
    // Calculate the next ID for the new student
    const nextId = lines.length;
    // Construct the CSV line for the new student
    const csvLine = nextId + ";" + req.body.name + ";" + req.body.school;
    // Append the new student to the CSV file
    fs.writeFile(datafile, "\n" + csvLine, { flag: 'a' }, (err) => {
      if (err) {
        console.error(err);
        // Handle the error appropriately
        return res.redirect("/students/create?error=1");
      }
      console.log("A new student has been created: ", csvLine);
      // Redirect to the appropriate page
      res.redirect("/students/create?created=1");
    });
  });
});

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

app.get('/games/checkers', (req, res) => {
  res.render(path.join(__dirname, "./views/checkers.ejs"));
});

app.get('/games/tictactoe', (req, res) => {
  res.render(path.join(__dirname, "./views/new-game-modal.ejs"));
});

app.get('/contact', (req, res) => {
  res.render(path.join(__dirname, "./views/contact.ejs"));
});

app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  studentsfromcsv((err, students) => {
    if (err){
      console.error(err)
    } else {
      // Check if the requested id is valid
      if (id >= 0 && id < students.length) {
        const student = students[id];
        res.render(path.join(__dirname, "./views/student_details.ejs"), { student });
      } else {
        res.status(404).send('Student Not Found');
      }
    }
  });
});


app.post('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const updatedName = req.body.name;
  const updatedSchool = req.body.school;

  // Read the CSV file
  fs.readFile(datafile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.redirect("/students"); // Redirect to appropriate error page
    }
    // Parse the CSV data
    const lines = data.split('\n');
    let updatedData = '';
    // Update the student with the matching ID
    for (let i = 0; i < lines.length; i++) {
      const columns = lines[i].split(';');
      const id = columns[0];
      if (id === studentId) {
        columns[1] = updatedName;
        columns[2] = updatedSchool;
      }
      updatedData += columns.join(';') + '\n';
    }
    // Write the updated CSV data back to the file
    fs.writeFile(datafile, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/students"); // Redirect to appropriate error page
      }
      console.log("Student with ID", studentId, "has been updated");
      res.redirect("/students/" + studentId);
    });
  });
});



