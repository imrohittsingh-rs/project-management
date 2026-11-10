import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const smtpPort = Number(process.env.MAILTRAP_SMTP_PORT);
const mailFrom =
  process.env.MAIL_FROM || "Projectub <noreply@mail.imrohittsingh.dev>";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

const sendEmail = async function (options) {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Projectub",
      link: "https://imrohittsingh.dev/",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error while sending mail:", error);
    throw error;
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Projectub! We're very excited to have you on board.",
      action: {
        instructions: "To verify you email, please click here:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset your Projectub account password.",
      action: {
        instructions: "To reset your password, click button below:",
        button: {
          color: "#00a046",
          text: "Verify your email",
          link: passwordResetUrl,
        },
      },
      outro:
        "If you didn't request a password reset, you can safely ignore this email.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
