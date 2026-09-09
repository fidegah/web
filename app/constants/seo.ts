export const SEO_CONFIG = {
  onboarding: {
    title: "راه‌اندازی اولیه فضای کاری | فیدگاه",
    description:
      "لطفاً مراحل راه‌اندازی و شخصی‌سازی فضای کاری اختصاصی خود در فیدگاه را تکمیل کنید.",
    robots: "noindex, nofollow",
  },

  chooseWorkspace: {
    title: "انتخاب فضای کاری | فیدگاه",
    description:
      "فضای کاری مد نظر خود را برای ورود به داشبورد مدیریت فیدگاه انتخاب کنید.",
    robots: "noindex, nofollow",
  },

  sdk: {
    feedbackWidget: {
      title: "ویجت بازخورد | فیدگاه",
      description:
        "صندوق دریافت و مدیریت بازخوردهای کاربران از طریق SDK فیدگاه.",
      robots: "noindex, nofollow",
    },
    postWidget: {
      title: "جزئیات بازخورد | ویجت فیدگاه",
      description:
        "مشاهده جزئیات پست، لایک‌ها و ثبت دیدگاه در ویجت SDK فیدگاه.",
      robots: "noindex, nofollow",
    },
  },

  portal: {
    home: (name: string) => ({
      title: `${name} | بازخورد و پیشنهادات`,
      description: `به پورتال بازخورد ${name} خوش آمدید. نظرات و پیشنهادات خود را با ما در میان بگذارید.`,
    }),

    changelogs: (name: string) => ({
      title: `آخرین تغییرات و اطلاعیه‌ها | ${name}`,
      description: `از آخرین ویژگی‌ها، بهبودها و رفع باگ‌های ${name} مطلع شوید.`,
    }),

    singleChangelog: (workspaceName: string, changelogTitle: string) => ({
      title: `${changelogTitle} | ${workspaceName}`,
      description: `جزئیات آخرین تغییرات و آپدیت‌های ${workspaceName}. موضوع: ${changelogTitle}`,
    }),

    postDetail: (
      workspaceName: string,
      postTitle: string,
      categoryName?: string,
    ) => ({
      title: `${postTitle} | ${workspaceName}`,
      description: `جزئیات بازخورد درباره «${postTitle}» ${
        categoryName ? `در دسته ${categoryName}` : ""
      } در ${workspaceName}`,
      robots: "noindex, nofollow",
    }),

    pollsList: (workspaceName: string) => ({
      title: `نظرسنجی‌ها | ${workspaceName}`,
      description: `در نظرسنجی‌های ${workspaceName} شرکت کنید و نظرات خود را با ما در میان بگذارید. لیست تمام نظرسنجی‌های فعال و گذشته.`,
    }),

    pollDetail: (workspaceName: string, pollTitle: string) => ({
      title: `${pollTitle} | نظرسنجی | ${workspaceName}`,
      description: `در نظرسنجی «${pollTitle}» شرکت کنید و نظر خود را برای بهبود ${workspaceName} ثبت کنید.`,
    }),
  },

  dashboard: {
    home: {
      title: "داشبورد | فیدگاه",
    },
    announcements: {
      title: "اخبار و اطلاعیه‌ها | فیدگاه",
    },
    createBoard: {
      title: "ایجاد بخش جدید | فیدگاه",
    },
    ticket: {
      title: "ارسال تیکت پشتیبانی | فیدگاه",
    },
    apiKey: {
      title: "کلید API | فیدگاه",
    },
    createWorkspace: {
      title: "ایجاد فضای کاری جدید | فیدگاه",
    },
    feedbacks: {
      title: "بازخوردها | فیدگاه",
    },
    users: {
      title: "مدیریت کاربران | فیدگاه",
    },
    roadmap: {
      list: {
        title: "نقشه‌راه | فیدگاه",
      },
      create: {
        title: "ایجاد نقشه‌راه جدید | فیدگاه",
      },
    },
    changelog: {
      list: {
        title: "اطلاعیه‌های بروزرسانی | فیدگاه",
      },
      create: {
        title: "ایجاد گزارش تغییرات | فیدگاه",
      },
      edit: {
        title: "ویرایش گزارش تغییرات | فیدگاه",
      },
    },
    poll: {
      list: {
        title: "نظرسنجی‌ها | فیدگاه",
      },
      create: {
        title: "ایجاد نظرسنجی | فیدگاه",
      },
    },
    setting: {
      account: {
        title: "ویرایش اطلاعات حساب کاربری | فیدگاه",
      },
      workspaces: {
        title: "مدیریت فضاهای‌کاری | فیدگاه",
      },
      sdk: {
        title: "تنظیمات SDK",
      },
      enforceSecureIdentify: {
        title: "شناسایی امن",
      },
      boards: {
        title: "مدیریت بخش‌ها | فیدگاه",
      },
      categories: {
        title: "مدیریت دسته‌بندی‌ها | فیدگاه",
      },
      tags: {
        title: "مدیریت تگ‌ها | فیدگاه",
      },
    },
  },

  publicPage: {
    home: {
      title: "فیدگاه - پلتفرم مدیریت بازخورد و تعامل با کاربران",
      description:
        "فیدگاه به شما کمک می‌کند بازخوردهای کاربران را جمع‌آوری کنید، اولویت‌بندی کنید و نقشه راه محصول خود را بسازید.",
      ogTitle: "فیدگاه | دیدگاه بگیرید، رشد کنید",
    },
    features: {
      title: "امکانات و ویژگی‌ها | فیدگاه",
      description:
        "ما زیرساختی قدرتمند و مدرن را برای جمع‌آوری، تحلیل و مدیریت بازخوردهای کاربران فراهم کرده‌ایم تا محصول شما بر اساس دیتای واقعی رشد کند.",
      ogTitle: "امکانات و ابزارهای فیدگاه - پلتفرم هوشمند مدیریت بازخورد",
    },
    productTour: {
      title: "تور محصول | فیدگاه",
      description:
        "نگاهی به داخل پنل فیدگاه بیندازید؛ فضایی ساده، مدرن و قدرتمند برای جمع‌آوری و مدیریت هوشمند بازخوردهای کاربران شما.",
      ogTitle: "تور محصول؛ فیدگاه را ببینید",
    },
    contact: {
      title: "تماس با ما | فیدگاه",
      description:
        "با تیم فیدگاه در ارتباط باشید. آماده پاسخگویی به سوالات شما در مورد پلتفرم مدیریت بازخورد هستیم.",
      ogTitle: "تماس با پشتیبانی فیدگاه",
    },
    about: {
      title: "درباره ما | فیدگاه",
      description:
        "فیدگاه به عنوان پلتفرم هوشمند مدیریت بازخورد، ابزاری تخصصی برای کسب‌وکارهای موفق است تا بدون ابزارهای متفرقه، دیدگاه‌های واقعی مخاطبان خود را بشنوند.",
      ogTitle: "درباره فیدگاه | ما صدای مشتریان شما را شفاف می‌کنیم",
    },
    privacy: {
      title: "سیاست حریم خصوصی | فیدگاه",
      description:
        "فیدگاه متعهد است که از داده‌های شخصی شما و مشتریانتان با بالاترین استانداردهای امنیتی محافظت کند. در این صفحه به طور شفاف توضیح می‌دهیم چه اطلاعاتی را جمع‌آوری می‌کنیم.",
      ogTitle: "سیاست حریم خصوصی فیدگاه (Fidegah)",
    },
    terms: {
      title: "قوانین و مقررات | فیدگاه",
      description:
        "ورود به وب‌سایت فیدگاه و استفاده از پنل مدیریتی، ابزارها و خدمات نرم‌افزار به معنای پذیرش کامل و بدون قید و شرط این شرایط است. لطفاً این سند را به دقت مطالعه فرمایید.",
      ogTitle: "شرایط و ضوابط استفاده از فیدگاه",
    },
  },

  auth: {
    login: {
      title: "ورود به حساب کاربری | فیدگاه",
      description:
        "برای ورود به حساب کاربری خود در فیدگاه، ایمیل و رمز عبور خود را وارد کنید.",
    },
    signUp: {
      title: "ثبت‌نام در فیدگاه",
      description:
        "برای ایجاد حساب کاربری جدید در فیدگاه، فرم ثبت‌نام را تکمیل کنید.",
    },
    forgotPassword: {
      title: "بازیابی رمز عبور",
      description:
        "اگر رمز عبور خود را فراموش کرده‌اید، از این قسمت می‌توانید برای بازیابی آن اقدام کنید.",
      robots: "noindex, nofollow",
    },
    updatePassword: {
      title: "تغییر رمز عبور",
      description:
        "لطفاً رمز عبور جدید و ایمن برای حساب کاربری خود انتخاب کنید.",
      robots: "noindex, nofollow",
    },
    verify: (isSuccess: boolean) => ({
      title: isSuccess ? "تایید موفقیت‌آمیز حساب" : "تایید ایمیل فیدگاه",
      description: "مرحله نهایی فعال‌سازی حساب کاربری فیدگاه",
    }),
    callback: {
      title: "در حال احراض هویت",
      description: "در حال پردازش و اتصال امن به حساب کاربری شما در فیدگاه.",
      robots: "noindex, nofollow",
    },
  },
} as const;
