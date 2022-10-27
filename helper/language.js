export default {
  unauthorizedAccess: ' Unauthorized access!',
  InvalidToken: ' Inavlid token!',
  invalidEmailAddress: ' Invalid email address!',
  emailAddressRequired: ' Email address is required!',
  passwordRequired: ' Password is required!',
  emailAlreadyRegistered: ' Email already registered!',
  mobileNumberAlreadyRegistered: ' Mobile number already registered!',
  imageValidationError: ' Image must be of valid format',
  userIdRequired: ' User id is required!',
  invalidCredentials: ' Invalid details!',
  attributeIdRequired: ' Attribute id is required!',
  emailAddressExist: ' Email address already exist!',
  mobileNumberExist: ' Mobile number already exist!',

  fullNameRequired: 'Full name is required!',
  dialCodeRequired: 'Dial code is required!',
  fcmRequired: 'FCM Token is required!',
  dialCodeISORequired: 'DialCode ISO is required!',
  phoneNumberRequired: 'Phone number is required!',
  invalidPhoneNumber: 'Invalid Phone number!',
  userAlreadyRegistered: 'User already registered, kindly login instead!',
  scheduleNameRequired: 'Schedule name is required!',
  fanStatusRequired: 'Fan status is required!',
  fromFanTimeRequired: 'From fan time is required!',
  toFanTimeRequired: 'To fan time is required!',
  fromPumpTimeRequired: 'From pump time is required!',
  toPumpTimeRequired: 'To pump time is required!',
  scheduleIdRequired: 'Schedule Id is required!',
  scheduleStatusRequired: 'Schedule Status is required!',
  phoneNumberVerificationFailed: 'Phone number verification failed!',
  ticketIdRequired: 'Ticket id is required',
  ticketTitleRequired: 'Ticket title is required',
  ticketReplyAdded: 'Ticket reply added successfully',
  ticketTypeRequired: 'Ticket type is required',
  ticketNotFound: 'Ticket not found',
  unableToAddReply: 'Unable to add ticket reply',
  ticketDescriptionRequired: 'Ticket description is required!',
  invalidTicketType: (ticketType) => `Invalid ticket type: (${ticketType})`,

  passwordRequiredWithMinLength: (minLength = 8) =>
    `Password is required (min ${minLength} chars)!`,
  oldPasswordRequiredWithMinLength: (minLength = 8) =>
    `Old Password is required (min ${minLength} chars)!`,
  newPasswordRequiredWithMinLength: (minLength = 8) =>
    `New Password is required (min ${minLength} chars)!`,
  invalidPassword: 'Invalid Password!',
  tokenError: 'Authentication Failed: Invalid Token! ',
  tokenExpired: 'Authentication Failed: Token Expired!',
  concatDeviceNumber: (num) => `Device #${num}`,
  invalidFanSpeed: (fanSpeed) => `Invalid fan speed (${fanSpeed})`,
  deviceAddedSuccessfully: 'Device added successfully!',
  deviceIdRequired: 'Device ID is required!',
  deviceNameRequired: 'Device Name is required',
  deviceUpdatedSuccessfully: 'Device Updated successfully!',
  updatedSuccessfully: 'Updated successfully!',
  deviceNotFound: 'QRcode not found!',
  userNotFound: 'User not found!',
  noDataFound: 'No data found!',
  deviceDeletedSuccessfully: 'Device deleted successfully!',
  deviceUnlinkedSuccessfully: 'Device unlinked successfully!',
  deviceLinkedSuccessfully: 'Device linked successfully!',
  unableToLinkDevice: 'Unable to link device, Something went wrong!!',
  unableToAddDevices: 'Unable to add device, Something went wrong!',
  countGreaterThan1: 'Count shall be greater than 1',
  otpFCMRequired: 'OTP FCM is required!',
  unsupportedImageFile: 'Unsupported image file!',
  unsupportedFile: 'Unsupported bin file!',
  accessDenied: 'Access denied!',
  macroNameRequired: 'Climate name is required!',
  macroValueRequired: 'Climate value is required!',
  fromFanSpeedRequired: 'From fan speed is required!',
  toFanSpeedRequired: 'To fan speed is required!',
  fromPumpStatusRequired: 'From pump status is required!',
  toPumpStatusRequired: 'To pump status is required!',
  macroTypeRequired: 'Climate type is required!',
  fileRequired: 'File is required!',
  invalidMacroType: 'Invalid Macro type!',
  unableToAddMacro: 'Unable to add climate!',
  unableToUpdateMacro: 'Unable to update climate!',
  unableToUpdateUser: 'Unable to update user!',
  unableToUpdateDevice: 'Unable to update device!',
  unableToUpdateFirmware: 'Unable to update Firmware!',
  invalidMacroValue: (value) => `Invalid climate value (${value})`,
  invalidPumpStatus: (pumpStatus) => `Invalid pump status (${pumpStatus})`,
  macroNotFound: 'Climate not found!',
  macroUpdated: 'Climate updated successfully!',
  macroAdded: 'Climate added successfully!',
  macroIdRequired: 'Climate id is required!',
  unableToAddUser: 'Unable to add user, Something went wrong!',
  macroDeleted: 'Climate deleted successfully!',
  unableToDeleteMacro: 'Unable to delete climate!',
  invalidUserType: 'Invalid user type!',
  userDeletedSuccessfully: 'User deleted successfuly!',
  adminForgotPassSubject: 'Forgot Password - Automatic Cooler',
  unableToChangePassword: 'Unable to change password, Something went wrong!',
  passwordUpdated: 'Password updated successfully!',
  forgotPasswordLinkSentOnMail:
    'Link to change password has been sent on your registered mail!',
  unableToAddSchedule: 'Unable to add schedule, Something went wrong!',
  scheduleNotFound: 'Schedule not found!',
  noScheduleFound: 'No schedule found!',
  scheduleDeleted: 'Schedule deleted successfully!',
  unableToDeleteSchedule: 'Unable to delete schedule!',
  dataFieldRequired: 'Data field is Required!',
  scheduleUpdated: 'Schedule updated successfully!',
  scheduleAdded: 'Schedule added successfully!',
  macroDeactivated: 'Climate deactivated successfully!',
  scheduleDeactivated: 'Schedule deactivated successfully!',
  unableToUpdateSchedule: 'Unable to update schedule, Something went wrong!',
  unableToAddTicket: 'Unable to add ticket, Something went wrong!',
  ticketAdded: 'Ticket added successfully!',
  unableToPublishScheduledEvents: 'Unable to publish scheduled events!',
  activeFan: 'Active Fan is required!',
  activePump: 'Active Pump is required!',
  noUpdateAvailable: 'No updates available!',
  termsAndConditionRequired: 'Terms and condition is required!',
  privacyPolicyRequired: 'Privacy policy is required!',
  unableToUpdateContent: 'Unable to update content, Something went wrong!',
  invalidScheduleId: 'Invalid schedule ID!',
  unauthorizedId: 'Unauthorized access!',
  deviceHasBeenUnlinkedOrDeleted: 'Device has been unlinked or deleted!',
  noClimateFound: 'No climate found!',
  messageIsRequired: 'Please enter a message',
};
