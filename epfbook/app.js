const express = require('express')
const app = express()
const port = 3000
<<<<<<< HEAD
const fs = require("fs")
=======
>>>>>>> e605d5d684b9c6b4213a748997e1fb9f41169859

app.get('/', (req, res) => {
  res.send('Hello World! My name is Amine DHANE. I am 21 years old')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log("Bonjour je m'appelle Amine.")
})

app.get('/students', (req, res) => {
<<<<<<< HEAD
    fs.readFile('name_school.csv', 'utf8', (err, data) => {
      if (err) {
        // gestion de l'erreur
        console.log("Not possible to load the data from the file.")
      } else {
        // utilisation des données lues depuis le fichier
        console.log(data)
        res.send(data)
      }
    })
=======
    res.send([{ name: "Eric Burel", school: "EPF" }, 
              { name: "HarryPotter", school: "Poudlard"}])
>>>>>>> e605d5d684b9c6b4213a748997e1fb9f41169859
})