"use strict";

const serviceImages = [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=700&q=82",

    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=82",

    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=700&q=82",

    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=700&q=82",

    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=82",

    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=82"
];

const translations = {
    ka: {
        pageTitle:
            "საქართველოს სისხლის სამართლის ეროვნული ცენტრი",

        topText:
            "სამართლებრივი დახმარება და კონსულტაცია",

        hotline:
            "ცხელი ხაზი",

        brand:
            "სისხლის სამართლის ეროვნული ცენტრი",

        brandSub:
            "საქართველო • ბათუმი",

        navAbout:
            "ცენტრის შესახებ",

        navServices:
            "მომსახურება",

        navDirector:
            "ხელმძღვანელი",

        navInformation:
            "ინფორმაცია",

        navContact:
            "კონტაქტი",

        consultation:
            "კონსულტაცია",

        heroTag:
            "დაცვა • წარმომადგენლობა • სამართლებრივი სტრატეგია",

        heroTitle:
            "თქვენი უფლებების პროფესიული და თანმიმდევრული დაცვა",

        heroText:
            "საქართველოს სისხლის სამართლის ეროვნული ცენტრი გთავაზობთ ინდივიდუალურ სამართლებრივ მხარდაჭერას, კონფიდენციალურობასა და ინტერესების პროფესიულ წარმომადგენლობას.",

        heroButton:
            "მოითხოვეთ კონსულტაცია",

        servicesButton:
            "იხილეთ მომსახურება",

        quickContact:
            "სწრაფი კონტაქტი",

        appointment:
            "კონსულტაცია წინასწარი შეთანხმებით",

        addressLabel:
            "მისამართი",

        shortAddress:
            "დ. აღმაშენებლის გამზირი 13, ბათუმი",

        languagesLabel:
            "ენები",

        privacyTitle:
            "კონფიდენციალურობა",

        privacyText:
            "თქვენი ინფორმაციისა და ინტერესების დაცვა.",

        approachTitle:
            "ინდივიდუალური მიდგომა",

        approachText:
            "გარემოებებზე მორგებული სამართლებრივი სტრატეგია.",

        responsibilityTitle:
            "პასუხისმგებლობა",

        responsibilityText:
            "თანმიმდევრული კომუნიკაცია და წარმომადგენლობა.",

        nationalCenter:
            "ეროვნული ცენტრი",

        lawAndProtection:
            "სამართალი და დაცვა",

        aboutTag:
            "ცენტრის შესახებ",

        aboutTitle:
            "სამართლებრივი მხარდაჭერა, რომელიც თქვენი საქმის ყურადღებით მოსმენით იწყება",

        aboutText:
            "თითოეული სამართლებრივი საკითხი განსხვავებულია. ჩვენი მიდგომა ეფუძნება გარემოებების დეტალურ შესწავლას, რისკების მკაფიო შეფასებასა და შესაბამისი მოქმედების გეგმის შექმნას.",

        aboutPointOne:
            "საქმის პირველადი სამართლებრივი შეფასება",

        aboutPointTwo:
            "შესაძლო გზებისა და რისკების გასაგები განმარტება",

        aboutPointThree:
            "კლიენტის ინტერესების თანმიმდევრული დაცვა",

        meetDirector:
            "გაიცანით ცენტრის ხელმძღვანელი",

        servicesTag:
            "პრაქტიკის მიმართულებები",

        servicesTitle:
            "სამართლებრივი მომსახურება",

        servicesIntro:
            "მხარდაჭერა საკითხის პირველადი შეფასებიდან თქვენი ინტერესების წარმომადგენლობამდე.",

        urgentTag:
            "გადაუდებელი სამართლებრივი დახმარება",

        urgentTitle:
            "დაკავების ან საგამოძიებო მოქმედების შემთხვევაში, დროულად დაუკავშირდით ადვოკატს.",

        urgentText:
            "ადრეულ ეტაპზე მიღებული პროფესიული კონსულტაცია გეხმარებათ საკუთარი უფლებებისა და შესაძლო ნაბიჯების სწორად გააზრებაში.",

        leadership:
            "ცენტრის ხელმძღვანელობა",

        directorTag:
            "გენერალური დირექტორი",

        directorRole:
            "ადვოკატი • საქართველოს ადვოკატთა ასოციაციის წევრი",

        directorText:
            "პროფესიული მიდგომა, პასუხისმგებლობა და კლიენტის ინტერესების თანმიმდევრული დაცვა.",

        directorDescription:
            "იურიდიული დახმარება ეფუძნება საქმის გარემოებების საფუძვლიან შესწავლას, შესაძლო სამართლებრივი გზების მკაფიო განმარტებასა და ინდივიდუალური სტრატეგიის შემუშავებას.",

        directorButton:
            "კონსულტაციის მოთხოვნა",

        informationTag:
            "სასარგებლო ინფორმაცია",

        informationTitle:
            "როგორ მოემზადოთ პირველადი კონსულტაციისთვის",

        informationText:
            "წინასწარ მომზადებული ინფორმაცია ადვოკატს ეხმარება, თქვენი საკითხი უფრო ზუსტად შეაფასოს.",

        consultationTag:
            "კონსულტაცია",

        consultationTitle:
            "მოგვიყევით თქვენი სამართლებრივი საკითხის შესახებ",

        consultationText:
            "შეავსეთ ფორმა. გაგზავნის შემდეგ გაიხსნება თქვენი ელფოსტის პროგრამა მომზადებული შეტყობინებით.",

        directNumber:
            "პირდაპირი ნომერი",

        batumiOffice:
            "ოფისი ბათუმში",

        formName:
            "სახელი და გვარი",

        namePlaceholder:
            "თქვენი სახელი",

        formPhone:
            "ტელეფონი",

        formService:
            "მომსახურება",

        chooseService:
            "აირჩიეთ მიმართულება",

        formDate:
            "სასურველი თარიღი",

        formMessage:
            "საკითხის მოკლე აღწერა",

        messagePlaceholder:
            "მოკლედ აღწერეთ თქვენი საკითხი...",

        formConsent:
            "ვეთანხმები, რომ ინფორმაცია გამოყენებული იყოს ჩემთან დასაკავშირებლად.",

        formSubmit:
            "მოთხოვნის მომზადება",

        formSuccess:
            "შეტყობინება მომზადებულია — იხსნება თქვენი ელფოსტა.",

        contactTag:
            "კონტაქტი",

        contactTitle:
            "დაგვიკავშირდით",

        contactText:
            "კონსულტაციის დრო და ფორმატი წინასწარ შეთანხმდება ცენტრთან.",

        fullAddress:
            "დავით აღმაშენებლის გამზირი №13, ბათუმი, საქართველო",

        openMap:
            "რუკაზე გახსნა",

        phoneLabel:
            "ტელეფონი",

        call:
            "დარეკვა",

        emailLabel:
            "ელფოსტა",

        sendEmail:
            "წერილის გაგზავნა",

        footerText:
            "პროფესიული სამართლებრივი მხარდაჭერა და თქვენი კანონიერი ინტერესების დაცვა.",

        rights:
            "ყველა უფლება დაცულია.",

        disclaimer:
            "ვებსაიტზე განთავსებული ინფორმაცია არ წარმოადგენს ინდივიდუალურ სამართლებრივ რჩევას.",

        emailSubject:
            "კონსულტაციის მოთხოვნა",

        emailName:
            "სახელი და გვარი",

        emailPhone:
            "ტელეფონი",

        emailService:
            "მომსახურება",

        emailDate:
            "სასურველი თარიღი",

        emailMessage:
            "საკითხის აღწერა",

        openMenu:
            "მენიუს გახსნა",

        closeMenu:
            "მენიუს დახურვა",

        services: [
            {
                title:
                    "სისხლის სამართალი",

                text:
                    "დაცვა და წარმომადგენლობა სისხლის სამართლის პროცესის შესაბამის ეტაპებზე."
            },

            {
                title:
                    "სამოქალაქო სამართალი",

                text:
                    "სამოქალაქო დავები, ხელშეკრულებები, ვალდებულებები და უფლებების დაცვა."
            },

            {
                title:
                    "საოჯახო სამართალი",

                text:
                    "განქორწინება, მეურვეობა, ალიმენტი და სხვა საოჯახო საკითხები."
            },

            {
                title:
                    "ადმინისტრაციული სამართალი",

                text:
                    "ადმინისტრაციული გადაწყვეტილებების გასაჩივრება და წარმომადგენლობა."
            },

            {
                title:
                    "უძრავი ქონება",

                text:
                    "ქონებრივი დავები, საკუთრების დაცვა და გარიგებების სამართლებრივი შეფასება."
            },

            {
                title:
                    "ბიზნეს სამართალი",

                text:
                    "კომპანიების სამართლებრივი მხარდაჭერა, ხელშეკრულებები და კომერციული დავები."
            }
        ],

        preparation: [
            {
                title:
                    "შეაგროვეთ დოკუმენტები",

                text:
                    "მოამზადეთ საქმესთან დაკავშირებული ხელშეკრულებები, წერილები, გადაწყვეტილებები და სხვა მასალა."
            },

            {
                title:
                    "ჩამოწერეთ ქრონოლოგია",

                text:
                    "მოკლედ დაალაგეთ მნიშვნელოვანი მოვლენები და თარიღები თანმიმდევრობით."
            },

            {
                title:
                    "მოამზადეთ კითხვები",

                text:
                    "ჩამოწერეთ ყველა საკითხი, რომელზეც მკაფიო პასუხის მიღება გსურთ."
            }
        ]
    },

    en: {
        pageTitle:
            "National Center of Criminal Law of Georgia",

        topText:
            "Legal assistance and consultation",

        hotline:
            "Hotline",

        brand:
            "National Center of Criminal Law",

        brandSub:
            "Georgia • Batumi",

        navAbout:
            "About the center",

        navServices:
            "Services",

        navDirector:
            "Director",

        navInformation:
            "Information",

        navContact:
            "Contact",

        consultation:
            "Consultation",

        heroTag:
            "Defense • Representation • Legal strategy",

        heroTitle:
            "Professional and consistent protection of your rights",

        heroText:
            "The National Center of Criminal Law of Georgia provides individual legal support, confidentiality, and professional representation of your interests.",

        heroButton:
            "Request a consultation",

        servicesButton:
            "View services",

        quickContact:
            "Quick contact",

        appointment:
            "Consultations by appointment",

        addressLabel:
            "Address",

        shortAddress:
            "13 D. Aghmashenebeli Ave., Batumi",

        languagesLabel:
            "Languages",

        privacyTitle:
            "Confidentiality",

        privacyText:
            "Protection of your information and interests.",

        approachTitle:
            "Individual approach",

        approachText:
            "A strategy tailored to your circumstances.",

        responsibilityTitle:
            "Responsibility",

        responsibilityText:
            "Consistent communication and representation.",

        nationalCenter:
            "National center",

        lawAndProtection:
            "Law and protection",

        aboutTag:
            "About the center",

        aboutTitle:
            "Legal support that begins with careful attention to your matter",

        aboutText:
            "Every legal matter is different. Our approach is based on a detailed review of the circumstances, a clear assessment of risks, and an appropriate action plan.",

        aboutPointOne:
            "Initial legal assessment of the matter",

        aboutPointTwo:
            "Clear explanation of available options and risks",

        aboutPointThree:
            "Consistent protection of the client's interests",

        meetDirector:
            "Meet the center's director",

        servicesTag:
            "Practice areas",

        servicesTitle:
            "Legal services",

        servicesIntro:
            "Support from the initial assessment of your matter through the representation of your interests.",

        urgentTag:
            "Urgent legal assistance",

        urgentTitle:
            "If you are detained or involved in an investigative action, contact an attorney promptly.",

        urgentText:
            "Professional advice at an early stage helps you understand your rights and possible next steps.",

        leadership:
            "Center leadership",

        directorTag:
            "General Director",

        directorRole:
            "Attorney • Member of the Georgian Bar Association",

        directorText:
            "A professional approach, responsibility, and consistent protection of the client's interests.",

        directorDescription:
            "Legal assistance is based on a thorough review of the circumstances, a clear explanation of available legal options, and the development of an individual strategy.",

        directorButton:
            "Request a consultation",

        informationTag:
            "Useful information",

        informationTitle:
            "How to prepare for your initial consultation",

        informationText:
            "Information prepared in advance helps the attorney assess your matter more accurately.",

        consultationTag:
            "Consultation",

        consultationTitle:
            "Tell us about your legal matter",

        consultationText:
            "Complete the form. Your email application will open with a prepared message.",

        directNumber:
            "Direct number",

        batumiOffice:
            "Batumi office",

        formName:
            "Full name",

        namePlaceholder:
            "Your name",

        formPhone:
            "Phone number",

        formService:
            "Legal service",

        chooseService:
            "Select a practice area",

        formDate:
            "Preferred date",

        formMessage:
            "Brief description",

        messagePlaceholder:
            "Briefly describe your matter...",

        formConsent:
            "I agree that the provided information may be used to contact me.",

        formSubmit:
            "Prepare request",

        formSuccess:
            "Your message is ready — opening your email application.",

        contactTag:
            "Contact",

        contactTitle:
            "Get in touch",

        contactText:
            "The time and format of the consultation will be agreed with the center in advance.",

        fullAddress:
            "13 David Aghmashenebeli Avenue, Batumi, Georgia",

        openMap:
            "Open in maps",

        phoneLabel:
            "Phone",

        call:
            "Call now",

        emailLabel:
            "Email",

        sendEmail:
            "Send an email",

        footerText:
            "Professional legal support and protection of your legitimate interests.",

        rights:
            "All rights reserved.",

        disclaimer:
            "The information on this website does not constitute individual legal advice.",

        emailSubject:
            "Consultation request",

        emailName:
            "Full name",

        emailPhone:
            "Phone",

        emailService:
            "Legal service",

        emailDate:
            "Preferred date",

        emailMessage:
            "Matter description",

        openMenu:
            "Open menu",

        closeMenu:
            "Close menu",

        services: [
            {
                title:
                    "Criminal law",

                text:
                    "Defense and representation at the relevant stages of criminal proceedings."
            },

            {
                title:
                    "Civil law",

                text:
                    "Civil disputes, contracts, obligations, and the protection of rights."
            },

            {
                title:
                    "Family law",

                text:
                    "Divorce, custody, maintenance, and other family-related matters."
            },

            {
                title:
                    "Administrative law",

                text:
                    "Challenges to administrative decisions and legal representation."
            },

            {
                title:
                    "Real estate",

                text:
                    "Property disputes, ownership protection, and legal review of transactions."
            },

            {
                title:
                    "Business law",

                text:
                    "Legal support for companies, contracts, and commercial disputes."
            }
        ],

        preparation: [
            {
                title:
                    "Gather your documents",

                text:
                    "Prepare contracts, correspondence, decisions, and any other material related to your matter."
            },

            {
                title:
                    "Write a timeline",

                text:
                    "Arrange the important events and dates in chronological order."
            },

            {
                title:
                    "Prepare your questions",

                text:
                    "List every point on which you would like to receive a clear answer."
            }
        ]
    },

    ru: {
        pageTitle:
            "Национальный центр уголовного права Грузии",

        topText:
            "Юридическая помощь и консультация",

        hotline:
            "Горячая линия",

        brand:
            "Национальный центр уголовного права",

        brandSub:
            "Грузия • Батуми",

        navAbout:
            "О центре",

        navServices:
            "Услуги",

        navDirector:
            "Руководитель",

        navInformation:
            "Информация",

        navContact:
            "Контакты",

        consultation:
            "Консультация",

        heroTag:
            "Защита • Представительство • Правовая стратегия",

        heroTitle:
            "Профессиональная и последовательная защита ваших прав",

        heroText:
            "Национальный центр уголовного права Грузии предлагает индивидуальную юридическую поддержку, конфиденциальность и профессиональное представительство ваших интересов.",

        heroButton:
            "Запросить консультацию",

        servicesButton:
            "Посмотреть услуги",

        quickContact:
            "Быстрая связь",

        appointment:
            "Консультации по предварительной записи",

        addressLabel:
            "Адрес",

        shortAddress:
            "проспект Д. Агмашенебели, 13, Батуми",

        languagesLabel:
            "Языки",

        privacyTitle:
            "Конфиденциальность",

        privacyText:
            "Защита вашей информации и интересов.",

        approachTitle:
            "Индивидуальный подход",

        approachText:
            "Стратегия с учетом обстоятельств вашего дела.",

        responsibilityTitle:
            "Ответственность",

        responsibilityText:
            "Последовательная коммуникация и представительство.",

        nationalCenter:
            "Национальный центр",

        lawAndProtection:
            "Право и защита",

        aboutTag:
            "О центре",

        aboutTitle:
            "Юридическая поддержка, которая начинается с внимательного изучения вашего вопроса",

        aboutText:
            "Каждый правовой вопрос индивидуален. Наш подход основан на детальном изучении обстоятельств, ясной оценке рисков и подготовке соответствующего плана действий.",

        aboutPointOne:
            "Первичная правовая оценка вопроса",

        aboutPointTwo:
            "Понятное разъяснение возможных вариантов и рисков",

        aboutPointThree:
            "Последовательная защита интересов клиента",

        meetDirector:
            "Познакомиться с руководителем центра",

        servicesTag:
            "Направления практики",

        servicesTitle:
            "Юридические услуги",

        servicesIntro:
            "Поддержка от первичной оценки вопроса до представительства ваших интересов.",

        urgentTag:
            "Срочная юридическая помощь",

        urgentTitle:
            "При задержании или проведении следственного действия своевременно свяжитесь с адвокатом.",

        urgentText:
            "Профессиональная консультация на раннем этапе помогает понять свои права и возможные дальнейшие шаги.",

        leadership:
            "Руководство центра",

        directorTag:
            "Генеральный директор",

        directorRole:
            "Адвокат • Член Ассоциации адвокатов Грузии",

        directorText:
            "Профессиональный подход, ответственность и последовательная защита интересов клиента.",

        directorDescription:
            "Юридическая помощь основана на тщательном изучении обстоятельств дела, понятном разъяснении доступных правовых вариантов и разработке индивидуальной стратегии.",

        directorButton:
            "Запросить консультацию",

        informationTag:
            "Полезная информация",

        informationTitle:
            "Как подготовиться к первой консультации",

        informationText:
            "Заранее подготовленная информация помогает адвокату точнее оценить ваш вопрос.",

        consultationTag:
            "Консультация",

        consultationTitle:
            "Расскажите о вашем правовом вопросе",

        consultationText:
            "Заполните форму. Откроется ваша почтовая программа с подготовленным сообщением.",

        directNumber:
            "Прямой номер",

        batumiOffice:
            "Офис в Батуми",

        formName:
            "Имя и фамилия",

        namePlaceholder:
            "Ваше имя",

        formPhone:
            "Телефон",

        formService:
            "Юридическая услуга",

        chooseService:
            "Выберите направление",

        formDate:
            "Желаемая дата",

        formMessage:
            "Краткое описание",

        messagePlaceholder:
            "Кратко опишите ваш вопрос...",

        formConsent:
            "Я согласен, что информация может быть использована для связи со мной.",

        formSubmit:
            "Подготовить запрос",

        formSuccess:
            "Сообщение подготовлено — открывается ваша почтовая программа.",

        contactTag:
            "Контакты",

        contactTitle:
            "Свяжитесь с нами",

        contactText:
            "Время и формат консультации заранее согласовываются с центром.",

        fullAddress:
            "проспект Давида Агмашенебели, №13, Батуми, Грузия",

        openMap:
            "Открыть на карте",

        phoneLabel:
            "Телефон",

        call:
            "Позвонить",

        emailLabel:
            "Эл. почта",

        sendEmail:
            "Отправить письмо",

        footerText:
            "Профессиональная юридическая поддержка и защита ваших законных интересов.",

        rights:
            "Все права защищены.",

        disclaimer:
            "Информация на сайте не является индивидуальной юридической консультацией.",

        emailSubject:
            "Запрос на консультацию",

        emailName:
            "Имя и фамилия",

        emailPhone:
            "Телефон",

        emailService:
            "Юридическая услуга",

        emailDate:
            "Желаемая дата",

        emailMessage:
            "Описание вопроса",

        openMenu:
            "Открыть меню",

        closeMenu:
            "Закрыть меню",

        services: [
            {
                title:
                    "Уголовное право",

                text:
                    "Защита и представительство на соответствующих стадиях уголовного процесса."
            },

            {
                title:
                    "Гражданское право",

                text:
                    "Гражданские споры, договоры, обязательства и защита прав."
            },

            {
                title:
                    "Семейное право",

                text:
                    "Развод, опека, алименты и другие вопросы семейного права."
            },

            {
                title:
                    "Административное право",

                text:
                    "Обжалование административных решений и юридическое представительство."
            },

            {
                title:
                    "Недвижимость",

                text:
                    "Имущественные споры, защита собственности и проверка сделок."
            },

            {
                title:
                    "Бизнес-право",

                text:
                    "Юридическая поддержка компаний, договоры и коммерческие споры."
            }
        ],

        preparation: [
            {
                title:
                    "Соберите документы",

                text:
                    "Подготовьте договоры, переписку, решения и другие материалы по вашему вопросу."
            },

            {
                title:
                    "Составьте хронологию",

                text:
                    "Расположите важные события и даты в хронологическом порядке."
            },

            {
                title:
                    "Подготовьте вопросы",

                text:
                    "Запишите все пункты, по которым вы хотите получить ясный ответ."
            }
        ]
    }
};

const translatedElements =
    document.querySelectorAll(
        "[data-i18n]"
    );

const translatedPlaceholders =
    document.querySelectorAll(
        "[data-i18n-placeholder]"
    );

const languageButtons =
    document.querySelectorAll(
        "[data-language]"
    );

const navigation =
    document.getElementById(
        "navigation"
    );

const menuButton =
    document.getElementById(
        "menuButton"
    );

const servicesGrid =
    document.getElementById(
        "servicesGrid"
    );

const preparationList =
    document.getElementById(
        "preparationList"
    );

const serviceSelect =
    document.getElementById(
        "serviceSelect"
    );

const consultationForm =
    document.getElementById(
        "consultationForm"
    );

const consultationDate =
    document.getElementById(
        "consultationDate"
    );

const formStatus =
    document.getElementById(
        "formStatus"
    );

const header =
    document.getElementById(
        "header"
    );

const scrollProgress =
    document.getElementById(
        "scrollProgress"
    );

const backTop =
    document.getElementById(
        "backTop"
    );

let currentLanguage = "ka";

function closeMenu() {
    navigation.classList.remove(
        "open"
    );

    menuButton.classList.remove(
        "open"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        translations[
            currentLanguage
        ].openMenu
    );

    document.body.classList.remove(
        "menu-open"
    );
}

function renderServices() {
    const content =
        translations[
            currentLanguage
        ];

    servicesGrid.innerHTML = "";

    content.services.forEach(
        (service, index) => {
            const card =
                document.createElement(
                    "a"
                );

            card.href =
                "#consultation";

            card.className =
                "service-card reveal visible";

            card.innerHTML = `
                <span class="service-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="service-photo">
                    <img
                        src="${serviceImages[index]}"
                        alt="${service.title}"
                        loading="lazy"
                    >
                </span>

                <h3>
                    ${service.title}
                </h3>

                <p>
                    ${service.text}
                </p>
            `;

            servicesGrid.appendChild(
                card
            );
        }
    );
}

function renderPreparation() {
    const content =
        translations[
            currentLanguage
        ];

    preparationList.innerHTML = "";

    content.preparation.forEach(
        (item, index) => {
            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "preparation-item";

            article.innerHTML = `
                <span>
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <div>
                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        ${item.text}
                    </p>
                </div>
            `;

            preparationList.appendChild(
                article
            );
        }
    );
}

function renderServiceSelect() {
    const content =
        translations[
            currentLanguage
        ];

    serviceSelect.innerHTML = "";

    const placeholder =
        document.createElement(
            "option"
        );

    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;

    placeholder.textContent =
        content.chooseService;

    serviceSelect.appendChild(
        placeholder
    );

    content.services.forEach(
        (service) => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                service.title;

            option.textContent =
                service.title;

            serviceSelect.appendChild(
                option
            );
        }
    );
}

function updateLanguage(language) {
    const content =
        translations[language];

    if (!content) {
        return;
    }

    currentLanguage = language;

    document.documentElement.lang =
        language;

    document.title =
        content.pageTitle;

    translatedElements.forEach(
        (element) => {
            const key =
                element.dataset.i18n;

            if (
                typeof content[key] ===
                "string"
            ) {
                element.textContent =
                    content[key];
            }
        }
    );

    translatedPlaceholders.forEach(
        (element) => {
            const key =
                element.dataset
                    .i18nPlaceholder;

            if (content[key]) {
                element.placeholder =
                    content[key];
            }
        }
    );

    languageButtons.forEach(
        (button) => {
            const active =
                button.dataset.language ===
                language;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        }
    );

    renderServices();
    renderPreparation();
    renderServiceSelect();

    formStatus.textContent = "";

    closeMenu();

    try {
        localStorage.setItem(
            "center-language",
            language
        );
    } catch {
        // საიტი იმუშავებს შენახვის გარეშეც.
    }
}

languageButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                updateLanguage(
                    button.dataset.language
                );
            }
        );
    }
);

menuButton.addEventListener(
    "click",
    () => {
        const open =
            navigation.classList.toggle(
                "open"
            );

        menuButton.classList.toggle(
            "open",
            open
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuButton.setAttribute(
            "aria-label",
            open
                ? translations[
                    currentLanguage
                ].closeMenu
                : translations[
                    currentLanguage
                ].openMenu
        );

        document.body.classList.toggle(
            "menu-open",
            open
        );
    }
);

navigation
    .querySelectorAll("a")
    .forEach((link) => {
        link.addEventListener(
            "click",
            closeMenu
        );
    });

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            navigation.classList.contains(
                "open"
            )
        ) {
            closeMenu();
        }
    }
);

function updateScroll() {
    const scrollTop =
        window.scrollY;

    const scrollHeight =
        document.documentElement
            .scrollHeight -
        window.innerHeight;

    const progress =
        scrollHeight > 0
            ? (
                scrollTop /
                scrollHeight
            ) * 100
            : 0;

    scrollProgress.style.width =
        `${Math.min(progress, 100)}%`;

    header.classList.toggle(
        "scrolled",
        scrollTop > 35
    );

    backTop.classList.toggle(
        "visible",
        scrollTop > 600
    );
}

window.addEventListener(
    "scroll",
    updateScroll,
    {
        passive: true
    }
);

backTop.addEventListener(
    "click",
    () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );

if (
    "IntersectionObserver" in window
) {
    const observer =
        new IntersectionObserver(
            (
                entries,
                revealObserver
            ) => {
                entries.forEach(
                    (entry) => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target
                                .classList
                                .add(
                                    "visible"
                                );

                            revealObserver
                                .unobserve(
                                    entry.target
                                );
                        }
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px"
            }
        );

    revealElements.forEach(
        (element) => {
            observer.observe(
                element
            );
        }
    );
} else {
    revealElements.forEach(
        (element) => {
            element.classList.add(
                "visible"
            );
        }
    );
}

function getLocalDate(date) {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

consultationDate.min =
    getLocalDate(
        new Date()
    );

consultationForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        if (
            !consultationForm
                .reportValidity()
        ) {
            return;
        }

        const content =
            translations[
                currentLanguage
            ];

        const formData =
            new FormData(
                consultationForm
            );

        const selectedService =
            serviceSelect.options[
                serviceSelect
                    .selectedIndex
            ].textContent;

        const message = [
            `${content.emailName}: ${formData.get("name")}`,

            `${content.emailPhone}: ${formData.get("phone")}`,

            `${content.emailService}: ${selectedService}`,

            `${content.emailDate}: ${formData.get("date")}`,

            "",

            `${content.emailMessage}:`,

            formData.get("message")
        ].join("\n");

        const mailtoUrl =
            `mailto:P.Shavadze@mail.ru` +
            `?subject=${encodeURIComponent(
                content.emailSubject
            )}` +
            `&body=${encodeURIComponent(
                message
            )}`;

        formStatus.textContent =
            content.formSuccess;

        window.setTimeout(
            () => {
                window.location.href =
                    mailtoUrl;
            },
            150
        );
    }
);

document.getElementById(
    "year"
).textContent =
    new Date().getFullYear();

let savedLanguage = "ka";

try {
    savedLanguage =
        localStorage.getItem(
            "center-language"
        ) || "ka";
} catch {
    savedLanguage = "ka";
}

if (
    !translations[savedLanguage]
) {
    savedLanguage = "ka";
}

updateLanguage(savedLanguage);
updateScroll();