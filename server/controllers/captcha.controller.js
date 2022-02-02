const request = require("request");
const captchaTokenValidate = async (req, res) => {

  const token = req.body.captchaResponse;
  const secretKey = "6LeU0_wdAAAAAG5SO8ZlUydH9-nuuZ0gEJ9b1hik";
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
  const options = {
    url: `${url}`,
    method: 'POST'
  };

  if (token === null || token === undefined) {
    res.status(201).json({message: "Token is empty or invalid", tokenValidate: false})
  }

  await request(options, function (err, response, body) {
    body = JSON.parse(body);
    if (body.success !== true) {
      res.status(401).json({message: "recaptcha failed", tokenValidate: false});
    }
    res.status(200).json({message: "recaptcha passed", tokenValidate: true});
  })

}

module.exports = {captchaTokenValidate};
