// const { useInflection } = require("sequelize/types");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { AUTH_ROUNDS, AUTH_SECRET } = process.env;
require("../db.js");

async function createUser(req, res) {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(404).json({ error: "Faltan completar Campos obligatorios" });
  } else {
    try {
      let passcrypt = bcrypt.hashSync(password, AUTH_ROUNDS);
      User.create({
        where: {
          username: username,
          password: passcrypt,
          email: email,
        },
      }).then((newuser) => {
        let token = jwt.sign({ user: newuser }, AUTH_SECRET, {});
      });
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }
}
// "No se ha logrado crear el usuario"
async function getUser(req, res) {
  const DBusers = await User.findAll({ include: { model: Ticket } });
  /* const { username, password } = req.body; */
  try {
    /* if (username && password) {
      const userFound = DBusers.find((user) => {
        if (user.username === username && user.password === password)
          return user;
      });
      return res.send(userFound);
    } */
    return res.send(DBusers);
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
}

async function putUser(req, res) {
  const { id, email, password, username } = req.body;
  try {
    if (!id && !email && !password && username) {
      return res
        .status(404)
        .json({ error: "Faltan completar Campos obligatorios" });
    } else {
      await User.update(
        {
          email: email,
          password: password,
          username: username,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const user = await User.findOne({ where: { id: id } });
      return res.json({ message: `Usuario Actualizado con exitos`, user });
    }
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}
async function deleteUser(req, res) {
  try {
    const { id } = req.body; //req.params.id
    //console.log(id)
    const user = await User.findByPk(id);
    //console.log(user)
    if (!id) {
      return res.status(404).json({ error: "El ID solicitado no existe" });
    }
    if (!user) {
      return res.status(404).json({
        error: "No se a encontrado un Usuario que corresponda a lo solicitado",
      });
    }
    const destoyed = await user.destroy();
    if (destoyed) {
      return res
        .status(201)
        .json({ message: "El Usuario a sido eliminado con exito" });
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}

//   const { name } = req.params;
//   try {
//     const user = await Usuario.create({
//       name,
//     });
//     res.send(user);
//   } catch (error) {
//     return res.status(400).send({ error: error.message });
//   }
// }

module.exports = {
  getUser,
  createUser,
  putUser,
  deleteUser,
};
