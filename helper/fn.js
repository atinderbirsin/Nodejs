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

export default {
  isEmailValid,
};
