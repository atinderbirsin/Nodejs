const admin = (user, skipToken = true) => {
  if (user) {
    user._id = undefined;
    user.password = undefined;
    user.forgot_otp = undefined;
    user.created_by = undefined;
    user.created_at = undefined;
    user.updated_at = undefined;
    user.deleted_at = undefined;
    user.__v = undefined;
    user.description = undefined;
    user.lat = undefined;
    user.lng = undefined;
    user.code = undefined;
    user.vehicles = undefined;
    if (user.image && user.image !== '') {
      user.image = process.env.BASE_PATH + user.image;
    } else {
      user.image = `${process.env.BASE_PATH}user-placeholder.png`;
    }
    user.user_type = undefined;
    if (skipToken) {
      user.access_token = undefined;
    }
  }
  return user;
};

const User = (user, skipToken = true) => {
  if (user) {
    user.password = undefined;
    user.forgot_otp = undefined;
    user.created_by = undefined;
    user.created_at = undefined;
    user.updated_at = undefined;
    user.deleted_at = undefined;
    user.__v = undefined;
    if (user.image && user.image !== '') {
      user.image = process.env.BASE_PATH + user.image;
    } else {
      user.image = `${process.env.BASE_PATH}user-placeholder.png`;
    }
    user.user_type = undefined;
    if (skipToken) {
      user.access_token = undefined;
    }
  }

  return user;
};

const deviceAttribute = (device) => {
  if (device) {
    device.created_at = undefined;
    device.updated_at = undefined;
    device.deleted_at = undefined;
    device.__v = undefined;
    if (device.image && device.image !== '') {
      device.image = process.env.IMAGE_BASE_PATH + device.image;
    }
  }
  return device;
};

export default {
  User,
  admin,
  deviceAttribute,
};
