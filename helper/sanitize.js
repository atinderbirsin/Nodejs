import { type } from '../util/index.js';

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

const User = (user, skipToken = true, skipVehicles = false) => {
  const createdBy = user?.created_by ? user.created_by.toString() : '';
  if (user) {
    user.password = undefined;
    user.forgot_otp = undefined;
    user.created_by = undefined;
    user.created_at = undefined;
    user.updated_at = undefined;
    user.deleted_at = undefined;
    user.__v = undefined;
    // user.vehicles = undefined;
    user.status_text = type.STATUS_TYPE_TEXT[user.status];
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
    // user.user_type = undefined;
    user.user_type_text = type.USER_TYPE_TEXT[user.user_type];
    if (skipToken) {
      user.token = undefined;
    }
    if (skipVehicles) {
      user.vehicles = undefined;
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
      vehicle.image = `${process.env.BASE_PATH}customerVehicle/${vehicle.image}`;
    }
    vehicle.status_text = type.STATUS_TYPE_TEXT[vehicle.status];
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

const orderDetails = (order) => {
  if (order) {
    order._id = undefined;
  }
  return order;
};

const orderStatusLog = (log) => {
  if (log) {
    log.created_at = undefined;
    log.updated_at = undefined;
    log.deleted_at = undefined;
    log.order_status_text = type.ORDER_STATUS_TYPE_TEXT[log.order_status];
  }
  return log;
};

const shippingStatusLog = (log) => {
  if (log) {
    log.created_at = undefined;
    log.updated_at = undefined;
    log.deleted_at = undefined;
    log.shipping_status_text = type.SHIPPING_STATUS_TYPE_TEXT[log.shipping_status];
  }
  return log;
};

const Order = (order) => {
  if (order) {
    order.created_at = undefined;
    order.created_by = undefined;
    order.updated_at = undefined;
    order.deleted_at = undefined;
    order.__v = undefined;
    order.order_status_text = type.ORDER_STATUS_TYPE_TEXT[order.order_status];
    order.shipping_status_text = type.SHIPPING_STATUS_TYPE_TEXT[order.shipping_status];
    order.order_details = order.order_details.map((o) => orderDetails(o));
    order.order_status_log = order.order_status_log.map((log) => orderStatusLog(log));
    order.shipping_status_log = order.shipping_status_log.map((log) => shippingStatusLog(log));
    if (order.office) {
      order.office = User(order.office, true);
    }
    if (order.qrCode !== '') {
      order.qrCode = `${process.env.BASE_PATH}qrcode/${order.qrCode}`;
    }
    if (order.order_status_log) {
      order.order_status_log = order.order_status_log.map((log) => orderStatusLog(log));
    }
    if (order.shipping_status_log) {
      order.shipping_status_log = order.shipping_status_log.map((log) => orderStatusLog(log));
    }
  }
  return order;
};

const returnOrder = (order) => {
  if (order) {
    order.created_at = undefined;
    order.created_by = undefined;
    order.updated_at = undefined;
    order.deleted_at = undefined;
    order.__v = undefined;
    order.issue_type_text = type.DEVICE_ISSUE_TYPE_TEXT[order.issue_type];
    order.order_status_text = type.ORDER_STATUS_TYPE_TEXT[order.order_status];
    order.order_details = orderDetails(order.order_details);
    order.return_order_status_log = order.return_order_status_log.map((log) => orderStatusLog(log));
    if (order.office) {
      order.office = User(order.office, true);
    }
    if (order.order_status_log) {
      order.order_status_log = order.return_order_status_log.map((log) => orderStatusLog(log));
    }
  }
  return order;
};

const deviceLog = (log) => {
  if (log) {
    log._id = undefined;
  }

  return log;
};

const stockDevice = (d) => {
  if (d) {
    d.order_id = undefined;
    d.serial_number = undefined;
    d.__v = undefined;
    d.created_at = undefined;
    d.updated_at = undefined;
    d.deleted_at = undefined;
    d.logs = d.logs.map((log) => deviceLog(log));
    d.device = Device(d.device);
  }

  return d;
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

const stockList = (entry) => {
  if (entry) {
    if (entry.stock_in >= 0 && entry.stock_out >= 0) {
      entry.available_stock = entry.stock_in - entry.stock_out;
    }
  }

  return entry;
};

const stockItem = (device) => {
  if (device) {
    device.order_id = undefined;
    device.technician_id = undefined;
    device.customer_id = undefined;
    device.customer_vehicle_id = undefined;
    device.user_id = undefined;
    device.device_id = undefined;
    if (device.technician) {
      device.technician = User(device.technician) || undefined;
    }
    if (device.customer) {
      device.customer = User(device.customer) || undefined;
    }
    if (device.vehicle) {
      device.customer_vehicle = Vehicle(device.vehicle) || undefined;
    }
    device.vehicle = undefined;
    // device.serial_number = undefined;
    device.customer_vehicle_id = undefined;
    device.job_id = undefined;
    device.status_text = type.DEVICE_STATUS_TYPE_TEXT[device.status];
    device.__v = undefined;
    device.created_at = undefined;
    device.updated_at = undefined;
    device.deleted_at = undefined;
    if (device.logs) {
      device.logs = device.logs.map((log) => deviceLog(log));
    }
    device.qrCode = `${process.env.BASE_PATH}stockDetail/${device.qrCode}`;
    device.device = Device(device.device);
    device.user = User(device.user);
  }

  return device;
};

const JobLogs = (log) => {
  if (log) {
    log.status = type.JOB_STATUS_TYPE_TEXT[log.status];
    log.service_images = log.service_images.map((i) => `${process.env.BASE_PATH}job/${i.img}`);
    log.created_at = undefined;
  }

  return log;
};

const Job = (job) => {
  if (job) {
    job.type_text = type.JOB_TYPE_TEXT[job.type];
    job.status_text = type.JOB_STATUS_TYPE_TEXT[job.status];
    job.quantity = undefined;
    job.office_id = undefined;
    job.technician_id = undefined;
    job.customer_id = undefined;
    job.customer_vehicle_id = undefined;
    job.images = job.images.map((i) => `${process.env.BASE_PATH}job/${i.img}`);
    job.logs = job.logs.map((log) => JobLogs(log));
    if (job.technician) {
      job.technician = User(job.technician);
    }
    if (job.customer) {
      job.customer = User(job.customer, true, true);
    }
    if (job.vehicle) {
      job.customer_vehicle = Vehicle(job.vehicle);
    }
    job.vehicle = undefined;
    job.created_at = undefined;
    job.updated_at = undefined;
    job.deleted_at = undefined;
    job.__v = undefined;
  }

  return job;
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
  returnOrder,
  stockList,
  stockDevice,
  stockItem,
  Job,
};
