const USER_TYPE = {
  ADMIN: 1,
  OFFICE: 2,
  TECHNICIAN: 3,
  CUSTOMER: 4,
  VENDOR: 5,
};

const USER_TYPE_TEXT = {
  1: 'Admin',
  2: 'Office',
  3: 'Technician',
  4: 'Customer',
  5: 'Vendor',
};

const STATUS_TYPE = {
  INACTIVE: 0,
  ACTIVE: 1,
};

const DEVICE_STATUS_TYPE = {
  DEACTIVATED: 1,
  ACTIVATED: 2,
  INSTALLED: 3,
  UNINSTALLED: 4,
  DECOMISSIONED: 5,
};

const DEVICE_STATUS_TYPE_TEXT = {
  1: 'Deactivated',
  2: 'Activated',
  3: 'Installed',
  4: 'Un-installed',
  5: 'De-comissioned',
};

const DEVICE_ISSUE_TYPE = {
  FAULTY: 1,
  OUT_OF_SERVICE: 2,
};

const DEVICE_ISSUE_TYPE_TEXT = {
  1: 'Faulty',
  2: 'Out of service',
};

const STOCK_TYPE = {
  IN: 'in',
  OUT: 'out',
  RETURN: 'return',
};

const SHIPPING_STATUS_TYPE = {
  PROCESSING: 1,
  DISPATCHED: 2,
  ARRIVED_AT_DESTINATION: 3,
  DELIVERY_CONFIRMED_BY_OFFICE: 4,
};

const SHIPPING_STATUSES = [
  { id: 1, text: 'Processing' },
  { id: 2, text: 'Dispatched' },
  { id: 3, text: 'Arrived at destination' },
  { id: 4, text: 'Delivery confirmed by office' },
];

const SHIPPING_STATUS_TYPE_TEXT = {
  1: 'Processing',
  2: 'Dispatched',
  3: 'Arrived at destination',
  4: 'Delivery confirmed by office',
};

const ORDER_STATUS_TYPE = {
  PENDING: 1,
  ACCEPTED: 2,
  COMPLETED: 3,
  REJECTED: 4,
};

const ORDER_STATUSES = [
  { id: 1, text: 'Pending' },
  { id: 2, text: 'Accepted' },
  { id: 3, text: 'Completed' },
  { id: 4, text: 'Rejected' },
];

const ORDER_STATUS_TYPE_TEXT = {
  1: 'Pending',
  2: 'Accepted',
  3: 'Completed',
  4: 'Rejected',
};

const VENDOR_ID = '636886d7bc988a2dd4902525';
const VENDOR_NAME = 'Ekasilam Inventory Vendor';
const ADMIN_CODE = 'ADMIN';
const ADMIN_ID = '636886d7bc988a2dd4902527';
const ADMIN_NAME = 'Admin';

export default {
  USER_TYPE,
  USER_TYPE_TEXT,
  ADMIN_CODE,
  STATUS_TYPE,
  VENDOR_ID,
  VENDOR_NAME,
  ADMIN_ID,
  ADMIN_NAME,
  STOCK_TYPE,
  DEVICE_STATUS_TYPE,
  SHIPPING_STATUS_TYPE,
  SHIPPING_STATUS_TYPE_TEXT,
  ORDER_STATUS_TYPE,
  ORDER_STATUS_TYPE_TEXT,
  ORDER_STATUSES,
  SHIPPING_STATUSES,
  DEVICE_STATUS_TYPE_TEXT,
  DEVICE_ISSUE_TYPE,
  DEVICE_ISSUE_TYPE_TEXT,
};
