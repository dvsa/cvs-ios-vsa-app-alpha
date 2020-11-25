// TODO: Once web config is implemented, move env logic/variables into create-script to dynamically hybrid and web based on --environment provided at runtime by merging base config file
const { argv } = require('yargs');

const {
  BASE_URL,
  FRONT_END_ENV,
  BACK_END_ENV,
  AZURE_CLIENT_ID,
  AZURE_TENANT_ID,
  MSAL_HOST,
  MSAL_REDIRECT_URL,
  APP_KEY_PHONE_NUMBER,
  SENTRY_DSN
} = process.env;
const { environment } = argv;

const isProduction = environment === 'production';

export const hybridConfig = `export default {
  "IS_PRODUCTION": "${isProduction}",
  "app": {
    "CLIENT_ID": "${AZURE_CLIENT_ID}",
    "TENANT_ID": "${AZURE_TENANT_ID}",
    "logoutUrl": "",
    "STAFF_ID_KEY": "extn.StaffId",
    "KEY_PHONE_NUMBER": "${APP_KEY_PHONE_NUMBER}",
    "MSAL_CLIENT_ID": "${AZURE_CLIENT_ID}",
    "MSAL_AUTHORITY": "https://login.windows.net/common",
    "MSAL_HOST": "${MSAL_HOST}",
    "MSAL_REDIRECT_URL": "${MSAL_REDIRECT_URL}",
    "MSAL_RESOURCE_URL": "${AZURE_CLIENT_ID}",
    "UNAUTH_LOGS_API_KEY": "",
    "BACKEND_URL_SIGNATURE": "${BASE_URL}/${BACK_END_ENV}/cvs-signature-nonprod/${BACK_END_ENV}%2F",
    "BACKEND_URL_TEST_STATIONS":"${BASE_URL}/${BACK_END_ENV}/test-stations",
    "BACKEND_URL_DEFECTS": "${BASE_URL}/${BACK_END_ENV}/defects",
    "BACKEND_URL_PREPARERS": "${BASE_URL}/${BACK_END_ENV}/preparers",
    "BACKEND_URL_TESTTYPES": "${BASE_URL}/${BACK_END_ENV}/test-types",
    "BACKEND_URL_TECHRECORDS": "${BASE_URL}/${BACK_END_ENV}/vehicles",
    "BACKEND_URL_TEST_RESULTS": "${BASE_URL}/${BACK_END_ENV}/test-results",
    "BACKEND_URL_LOGS": "${BASE_URL}/${BACK_END_ENV}/logs",
    "BACKEND_URL_VISIT": "${BASE_URL}/${BACK_END_ENV}/activities",
    "BACKEND_URL_UNAUTH_LOGS": "${BASE_URL}/${BACK_END_ENV}/unauth-logs",
    "URL_LATEST_VERSION": ""
  },
  "sentry": {
    "SENTRY_ENV": "${FRONT_END_ENV}",
    "SENTRY_DSN": "${SENTRY_DSN}",
  }
}`;
