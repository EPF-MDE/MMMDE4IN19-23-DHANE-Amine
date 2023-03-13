const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World! My name is Amine DHANE. I am 21 years old')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log("Bonjour je m'appelle Amine.")
})

app.get('/students', (req, res) => {
    res.send([{ name: "Eric Burel", school: "EPF" }, 
              { name: "HarryPotter", school: "Poudlard"}])
})