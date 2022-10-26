const serialNumber = (value = new Date().getTime().toString()) =>
  `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8)}`;

const getError = (message) =>
  message.substring(message.indexOf(':') + 2, message.length);

export default {
  serialNumber,
  getError,
};
