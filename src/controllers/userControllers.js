const database = require("../../database");

const getUsers = (req, res) => {
    database
  .query("select * from users")
  .then((result) => {
    const users = result[0]; 
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
  };
  
  const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  
  };

  const postUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
  
    if(firstname && lastname && email && city && language){
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language]
      )
      .then(([result]) => {

        const newUser = {
          id : result.insertId,
          firstname,
          lastname,
          email,
          city,
          language
        }

        res.status(201).send(newUser);
      })

    } else{
      database
      .catch((err) => {
        console.error(err);
        res.sendStatus(422);
      });
    }
    
  };

  const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;
  
    if(firstname&& lastname&& email&& city&& language){
      database
      .query(
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
        [firstname, lastname, email, city, language, id]
      )
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
    } else{
      database
      .catch((err) => {
        console.error(err);
        res.sendStatus(422);
      });
    } 
  };

  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    if(id) {
    database
      .query("delete from users where id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
    }
    else {
      database
      .catch((err) => {
        console.error(err);
        res.sendStatus(404);
      });
    }
  };

  module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser
  };