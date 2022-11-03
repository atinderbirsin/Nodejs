const USER_TYPE = {
  ADMIN: 1,
  OFFICE: 2,
  TECHNICIAN: 3,
  CUSTOMER: 4,
  VENDOR: 5,
};

const STATUS_TYPE = {
  INACTIVE: 0,
  ACTIVE: 1,
};

const DEVICE_STATUS_TYPE = {
  DEACTIVATED: 0,
  ACTIVATED: 1,
  INSTALLED: 2,
  UNINSTALLED: 3,
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

const SHIPPING_STATUS_TYPE_TEXT = {
  1: 'Processing',
  2: 'Dispatched',
  3: 'Arrived at destination',
  4: 'Delivery confirmed by office',
};

const ORDER_STATUS_TYPE = {
  PENDING: 1,
  PROCESSING: 2,
  DISPATCHED: 3,
  DELIVERED: 4,
};

const ORDER_STATUS_TYPE_TEXT = {
  1: 'Pending',
  2: 'Processing',
  3: 'Dispatched',
  4: 'Delivered',
};

const VENDOR_ID = '635ecc1ab0e262b6e7183300';
const VENDOR_NAME = 'Ekasilam Inventory Vendor';
const ADMIN_CODE = 'ADMIN';
const ADMIN_ID = '635ecc1ab0e262b6e7183302';
const ADMIN_NAME = 'Admin';

export default {
  USER_TYPE,
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
};
