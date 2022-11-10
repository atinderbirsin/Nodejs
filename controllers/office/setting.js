import Setting from '../../models/setting.js';

const privacyPolicy = async (req, res) => {
  try {
    const setting = await Setting.findOne();

    res.status(200).send(setting.privacy_policy);
  } catch (err) {
    res.status(400).send('');
  }
};

const termsCondition = async (req, res) => {
  try {
    const setting = await Setting.findOne();

    res.status(200).send(setting.term_condition);
  } catch (err) {
    res.status(400).send('');
  }
};

const help = async (req, res) => {
  try {
    const setting = await Setting.findOne();

    res.status(200).send(setting.help);
  } catch (err) {
    res.status(400).send('');
  }
};

const aboutUs = async (req, res) => {
  try {
    const setting = await Setting.findOne();

    res.status(200).send(setting.about_us);
  } catch (err) {
    res.status(400).send('');
  }
};

export default {
  privacyPolicy,
  termsCondition,
  help,
  aboutUs,
};
