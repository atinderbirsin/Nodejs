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
};
