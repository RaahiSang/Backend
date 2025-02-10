const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/user");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User Already Exist",
        sucess: false,
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const userModel = new UserModel({ name, email, password: hashpassword });

    await userModel.save();

    res.status(201).json({
      message: "SignUp Sucessfully",
      sucess: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error ",
      sucess: false,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    const ErrorUserNotMsg = "User Not Found";
    const ErrorMsg = "Auth Falied--Invalid Credential ";
    if (!user) {
      return res.status(403).json({
        message: ErrorUserNotMsg,
        sucess: false,
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(403).json({
        message: ErrorMsg,
        sucess: false,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "LogIn Sucessfully",
      sucess: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      sucess: false,
    });
  }
};

const forgetpassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(403).json({
      message: "User Not Found",
      success: false,
    });
  }

  const Token = jwt.sign(
    {
      email: user.email,
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );

  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    text: `Reset Password

A password reset event has been triggered for your RaahiSang Company account. The password reset window is limited to two hours.

If you do not reset your password within this time, you will need to submit a new request.

To complete the password reset process, click the link below:

🔗 Reset Your Password
 https://raahisang.com/resetpassword/${user._id}/${Token}"


If you didn’t request this, please ignore this email or contact RaahiSang Support immediately.
RaahiSang Company
📧raahisang@gmail.com | 🌐 www.raahisang.com🚀`

  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Email sending failed", success: false });
    } else {
      return res.status(200).json({ message: "Success", success: true });
    }
  });


}

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token", success: false });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.findByIdAndUpdate(
          id,
          { password: hashedPassword },
          { new: true }
        );
        if (!user) {
          return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ status: "Success", message: "Password updated successfully" });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};


module.exports = {
  signup,
  login,
  forgetpassword,
  resetPassword
};
