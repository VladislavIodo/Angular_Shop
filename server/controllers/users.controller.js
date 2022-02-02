const UsersController = require("../models/users");
const OrdersController = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const mailer = require('../nodemailer');

const generateAccessToken = (id, role, email, userName, userSurname) => {
  const payload = {
    id,
    role,
    email,
    userName,
    userSurname
  };
  return jwt.sign(payload, secret, {expiresIn: "24h"});
}

const changeEmail = async (req, res) => {
  try {
    const checkEmail = await UsersController.find({email: req.body.email});
    if (checkEmail.length !== 0) {
      res.status(403).json({message: "Email адрес занят!", errorEmail: true});
    } else {
      await UsersController.findOneAndUpdate(
        {email: req.body.oldEmail},
        {$set: {email: req.body.email}},
      )
      await OrdersController.updateMany(
        {email: req.body.oldEmail},
        {$set: {email: req.body.email}},
      )
      res.status(200).json({message: "Email успешно обновлен!", errorEmail: false});
    }
  } catch (error) {
    res.status(500).json({message: "User change Email  --- error", error: error});
  }
}

const changePassword = async (req, res) => {
  try {
    let user = await UsersController.findOne({_id: req.body.userId});
    const validPassword = bcrypt.compareSync(req.body.oldPassword, user.password);
    const salt = await bcrypt.genSaltSync(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt)
    if (validPassword) {
      await UsersController.findOneAndUpdate(
        {_id: req.body.userId},
        {$set: {password: req.body.newPassword}},
      )
      res.status(200).json({message: "Пароль успешно обновлен!", errorPassword: false});
    } else {
      res.status(403).json({message: "Неверно введен старый пароль", errorPassword: true});
    }
  } catch (error) {
    res.status(500).json({message: "User change password --- error", error: error});
  }
}

const registrationUsers = async (req, res) => {
  try {
    let userEmail = new UsersController({email: req.body.email});
    const checkEmail = await UsersController.find({email: `${userEmail.email}`});
    if (checkEmail.length !== 0) {
      res.status(403).json({message: "Email адрес занят!", errorEmail: true});
    } else {
      const newUser = new UsersController({...req.body});
      const salt = await bcrypt.genSaltSync(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser.role = 'user';
      newUser.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      const token = generateAccessToken(newUser._id, newUser.role, newUser.email, newUser.userName, newUser.userSurname);
      const avatar = newUser.avatar;
      newUser.save();
      const message = {
        to: req.body.email,
        subject: 'Congratulations! You are successfully registred on our site',
        html: `
          <h1>Поздравляем, Вы успешно зарегистрировались на нашем сайте!</h1>

      <i>Данные вашей учетной записи:</i>
      <ul>
        <li>login: ${req.body.email}</li>
        <li>login: ${req.body.password}</li>
      </ul>

      <p>Данное письмо не требует ответа.</p>`
      }
      mailer(message);
      res.status(201).json({message: "Пользователь зарегистрирован!", errorEmail: false, token, avatar});
    }
  } catch (error) {
    res.status(500).json({message: "User registration --- error", error: error});
  }
}

const checkEmail = async (req, res) =>{
  try {
    let userEmail = new UsersController({email: req.body.email});
    const checkEmail = await UsersController.find({email: `${userEmail.email}`});
    if (checkEmail.length !== 0) {
      res.status(201).json({message: "Email адрес занят!", errorEmail: true});
    } else {
      res.status(201).json({message: "Email адрес свободен!", errorEmail: false});
    }
  } catch (error){
    res.status(500).json({message: "User check email --- error", error: error});
  }
}

const authenticationUsers = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await UsersController.findOne({email});
    if (!user) {
      return res.status(500).json({message: `Пользователь ${email} не найден`});
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(500).json({message: 'Введен не верный пароль!'});
    }
    const token = generateAccessToken(user._id, user.role, user.email, user.userName, user.userSurname);
    const avatar = user.avatar;
    const userName = user.userName;
    return res.status(201).json({token, avatar, userName});
  } catch (error) {
    res.status(500).json({message: "User logIn --- error", error: error});
  }
}

module.exports = {registrationUsers, checkEmail, authenticationUsers, changeEmail, changePassword};
