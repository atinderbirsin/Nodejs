const login = (req, res) => {
  res.status(200).send('Its Working');
};

const dashboard = (req, res) => {
  res.status(200).send('dashboard also Working');
};

export default { login, dashboard };
