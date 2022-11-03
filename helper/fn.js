import fs from 'fs';
import QRCode from 'qrcode';

const isEmailValid = (email) => {
  if (!email) {
    return false;
  }
  if (email.length > 254) {
    return false;
  }
  const EMAIL_REGEX =
    // eslint-disable-next-line no-useless-escape
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!EMAIL_REGEX.test(email)) {
    return false;
  }
  // Further checking of some things regex can't handle
  const parts = email.split('@');
  if (parts[0].length > 64) {
    return false;
  }
  const domainParts = parts[1].split('.');
  return !domainParts.some((part) => part.length > 63);
};

const serialNumber = (value = new Date().getTime().toString()) =>
  `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8)}`;

const getError = (message) => message.substring(message.indexOf(':') + 2, message.length);

const randomNum = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const removeImage = (file, path) => {
  const full_path = path + file;
  if (file) {
    if (fs.existsSync(full_path)) {
      fs.unlink(full_path, (err) => {
        if (err) {
          throw new Error(getError(err.message));
        }
      });
    }
  }
};

const generateQR = async function (str, name) {
  return new Promise((res, rej) => {
    name = name.split(' ').join('');
    const string = JSON.stringify(str);
    QRCode.toFile(`public/qrcode/${name}`, string, (err) => {
      if (err) throw new Error(err.message);
      res(true);
    });
  });
};

export default {
  isEmailValid,
  serialNumber,
  getError,
  removeImage,
  randomNum,
  generateQR,
};
