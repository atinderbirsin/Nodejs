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
      user.image = `${process.env.BASE_PATH}user/${user.image}`;
    } else {
      user.image = `${process.env.BASE_PATH}user/user-placeholder.png`;
    }
    user.user_type = undefined;
    if (skipToken) {
      user.access_token = undefined;
    }
  }
  return user;
};

const User = (user, skipToken = true) => {
  const createdBy = user.created_by ? user.created_by.toString() : '';
  if (user) {
    user.password = undefined;
    user.forgot_otp = undefined;
    user.created_by = undefined;
    user.created_at = undefined;
    user.updated_at = undefined;
    user.deleted_at = undefined;
    user.__v = undefined;
    // user.vehicles = undefined;
    if (user.jwt_id === createdBy) {
      user.canEdit = true;
    } else {
      user.canEdit = false;
    }
    if (user.jwt_id === createdBy) {
      user.canDelete = true;
    } else {
      user.canDelete = false;
    }
    user.jwt_id = undefined;
    if (user.image && user.image !== '') {
      user.image = `${process.env.BASE_PATH}user/${user.image}`;
    } else {
      user.image = `${process.env.BASE_PATH}user/user-placeholder.png`;
    }
    user.user_type = undefined;
    if (skipToken) {
      user.access_token = undefined;
    }
  }

  return user;
};

const deviceAttribute = (attribute) => {
  if (attribute) {
    attribute.created_at = undefined;
    attribute.updated_at = undefined;
    attribute.deleted_at = undefined;
    attribute.__v = undefined;
    if (attribute.image && attribute.image !== '') {
      attribute.image = `${process.env.IMAGE_BASE_PATH}device/${attribute.image}`;
    }
  }
  return attribute;
};

const Device = (device) => {
  if (device) {
    device.created_at = undefined;
    device.updated_at = undefined;
    device.deleted_at = undefined;
    device.__v = undefined;
    device.attributes = device.attributes.map((attribute) => deviceAttribute(attribute));
  }
  return device;
};

const Vehicle = (vehicle) => {
  if (vehicle) {
    vehicle.created_at = undefined;
    vehicle.created_by = undefined;
    vehicle.updated_at = undefined;
    vehicle.deleted_at = undefined;
    vehicle.__v = undefined;
    if (vehicle.image && vehicle.image !== '') {
      vehicle.image = `${process.env.IMAGE_BASE_PATH}customerVehicle/${vehicle.image}`;
    }
  }
  return vehicle;
};

const CustomerVehicle = (user, skipToken) => {
  if (user) {
    user.password = undefined;
    user.forgot_otp = undefined;
    user.created_by = undefined;
    user.created_at = undefined;
    user.updated_at = undefined;
    user.deleted_at = undefined;
    user.__v = undefined;
    if (user.image && user.image !== '') {
      user.image = `${process.env.BASE_PATH}user/${user.image}`;
    } else {
      user.image = `${process.env.BASE_PATH}user/user-placeholder.png`;
    }
    user.user_type = undefined;
    if (skipToken) {
      user.access_token = undefined;
    }
    if (user.vehicles.length > 0) {
      user.vehicles.map((vehicle) => Vehicle(vehicle));
    }
  }
  return user;
};

const Order = (order) => {
  if (order) {
    return order;
  }
};

const service = (Obj) => {
  if (Obj) {
    Obj.description = undefined;
    Obj.status = undefined;
    Obj.vehicle_number = undefined;
    Obj.vehicle_make = undefined;
    Obj.vehicle_model = undefined;
    Obj.vehicle_color = undefined;
    Obj.image = undefined;
    Obj.created_by = undefined;
    Obj.updated_at = undefined;
    Obj.deleted_at = undefined;
    Obj.created_at = undefined;
  }

  return Obj;
};

const CartItem = (item) => {
  if (item) {
    item.attributes = item.attributes.map((attribute) => deviceAttribute(attribute));
    item.updated_at = undefined;
    item.deleted_at = undefined;
    item.created_at = undefined;
    item.__v = undefined;
  }

  return item;
};

export default {
  User,
  admin,
  deviceAttribute,
  Device,
  Vehicle,
  CustomerVehicle,
  service,
  CartItem,
  Order,
};
