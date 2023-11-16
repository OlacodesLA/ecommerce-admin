import * as ERROR_MESSAGES from "./customError";

export const getFirebaseErrorMessage = (code: string) => {
  let message = null;

  switch (code) {
    case "auth/user-not-found":
      message = ERROR_MESSAGES.USER_NOT_FOUND;
      break;
    case "auth/email-already-in-use":
      message = ERROR_MESSAGES.EMAIL_ALREADY_EXIST;
      break;
    case "auth/internal-error":
      message = ERROR_MESSAGES.INTERNAL_ERROR;
      break;
    case "auth/invalid-login-credentials":
      message = ERROR_MESSAGES.INVALID_CREDENTIAL;
      break;
    case "auth/too-many-requests":
      message = ERROR_MESSAGES.TOO_MANY_REQUEST;
      break;
    case "auth/invalid-email":
      message = ERROR_MESSAGES.INVALID_EMAIL_FORMAT;
      break;
    case "auth/invalid-password":
      message = ERROR_MESSAGES.INVALID_PASSWORD_FORMAT;
    case "Failed to get document because the client is offline.":
      message = ERROR_MESSAGES.OFFLINE;
    case "auth/session-cookie-expired":
      message = ERROR_MESSAGES.SESSION_EXPIRED;
    case "auth/network-request-failed":
      message = ERROR_MESSAGES.NETWORK_ERROR;
      break;
    default:
      message = ERROR_MESSAGES.DEFAULT_MESSAGE;
      break;
  }

  return message;
};
