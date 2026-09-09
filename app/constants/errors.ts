export const ERROR_MESSAGE = {
  400: {
    title: "درخواست ارسالی معتبر نیست.",
    description:
      "سرور نتوانست درخواست شما را پردازش کند زیرا داده‌های ارسال‌شده نامعتبر یا ناقص بودند.",
  },
  403: {
    title: "دسترسی شما محدود شده است.",
    description:
      "شما اجازه دسترسی به این صفحه یا عملیات را ندارید. در صورت نیاز با پشتیبانی تماس بگیرید.",
  },
  404: {
    title: "صفحه ای که به دنبالش بودید پیدا نشد.",
    description:
      " ممکنه آدرس رو اشتباه وارد کرده باشید، صفحه حذف شده باشه یا موقتاً در دسترس نباشه.",
  },
  500: {
    title: "مشکلی از سمت ما پیش اومده!",
    description:
      "متأسفانه در حال حاضر خطای داخلی سرور رخ داده است.در حال رفع مشکل هستیم و به‌زودی برمی‌گردیم.از صبر و همراهی شما متشکریم.",
  },
} as const;

export const ERROR_CODE = {
  GENERAL: {
    FAILED_TO_FETCH_DATA: "GENERAL_01",
    FAILED_TO_FIND: "GENERAL_02",
  },
  USER_CONTEXT: {
    FAILED_TO_GET_DATA: "USER_CONTEXT_01",
  },
  DASHBOARD_HOME: {
    NO_ACCESS: "USER_CONTEXT_01",
  },
  USERS: {
    GENERAL_ERROR: "USERS_01",
    NOT_FOUND: "USERS_02",
  },
  FEEDBACK: {
    NO_DEFAULT_BOARD_OR_POST: "FEEDBACK_01",
    FAILED_TO_LOAD_POST_DETAILS: "FEEDBACK_02",
  },
  TAG_CATEGORY_SETTINGS: {
    INVALID_ENTITY_TYPE: "TAG_CATEGORY_SETTINGS_01",
    MISSING_OR_INVALID_BOARD_SLUG: "TAG_CATEGORY_SETTINGS_02",
    FAILED_TO_FETCH_ENTITIES: "TAG_CATEGORY_SETTINGS_03",
  },
  BOARD_SETTING: {
    MISSING_PARAMS: "BOARD_SETTING_01",
    MISSING_BOARD_SLUG: "BOARD_SETTING_02",
    FAILED_TO_FETCH_BOARDS: "BOARD_SETTING_03",
  },
  INDEX_POLLS: {
    FAILED_TO_FETCH_POLLS: "INDEX_POLLS_01",
  },
  MANAGE_CHANGELOG: {
    FAILED_TO_FETCH_CHANGELOG: "MANAGE_CHANGELOG_01",
  },
  INDEX_CHANGELOG: {
    FAILED_TO_FETCH_CHANGELOGS_WITH_LIKES: "INDEX_CHANGELOG_01",
  },
  NEWS: {
    FAILED_TO_FETCH_DATA: "NEWS_01",
  },
  PORTAL_HOME: {
    FAILED_TO_FETCH_DATA: "PORTAL_HOME_01",
    FAILED_TO_GET_WORKSPACE_USER: "PORTAL_HOME_02",
    USER_BANNED: "PORTAL_HOME_03",
  },
  PORTAL_POLLS: {
    FAILED_TO_FETCH_DATA: "PORTAL_POLLS_01",
  },
  PORTAL_POLL: {
    FAILED_TO_FETCH_DATA: "PORTAL_POLL_01",
  },
  PORTAL_FEEDBACK: {
    FAILED_TO_FETCH_DATA: "PORTAL_FEEDBACK_01",
  },
  PORTAL_POST: {
    FAILED_TO_FETCH_DATA: "PORTAL_POST_01",
  },
  PORTAL_CHANGELOGS: {
    FAILED_TO_FETCH_DATA: "PORTAL_CHANGELOGS_01",
  },
  PORTAL_CHANGELOG: {
    FAILED_TO_FETCH_DATA: "PORTAL_CHANGELOG_01",
  },
  WEB_SERVICE: {
    FAILED_TO_FETCH_API_KEY: "WEB_SERVICE_01",
  },
} as const;
