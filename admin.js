/* =========================================================
   CRIMINAL LAW CENTER GEORGIA — ADMIN.JS
   Supabase Auth + Database + Storage
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://oaphygvtdayllubygjut.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_z56PmTmBFKzQD9tviwL7mA_wGeMEe_H";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   HELPERS
========================================================= */

const $ = (id) =>
    document.getElementById(id);


function setStatus(element, message = "", type = "") {

    if (!element) return;

    element.textContent = message;

    element.classList.remove(
        "success",
        "error"
    );

    if (type) {
        element.classList.add(type);
    }
}


function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function shortText(
    text = "",
    length = 170
) {

    const value =
        String(text || "").trim();

    if (value.length <= length) {
        return value;
    }

    return value.slice(0, length) + "...";
}


function formatDate(value) {

    if (!value) {
        return "";
    }

    try {

        return new Intl.DateTimeFormat(
            "ka-GE",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        ).format(new Date(value));

    } catch {

        return "";
    }
}


function safeFileName(name = "file") {

    const extension =
        name.includes(".")
            ? "." + name.split(".").pop()
            : "";

    const base =
        name
            .replace(extension, "")
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, "-")
            .replace(/-+/g, "-");

    return (
        base +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 8) +
        extension
    );
}


/* =========================================================
   DOM
========================================================= */

const loginScreen = $("loginScreen");
const adminApp = $("adminApp");

const loginForm = $("loginForm");
const loginEmail = $("loginEmail");
const loginPassword = $("loginPassword");
const loginStatus = $("loginStatus");

const logoutButton = $("logoutButton");

const adminEmail = $("adminEmail");
const adminPageTitle = $("adminPageTitle");


/* COUNTERS */

const casesCount = $("casesCount");
const newsCount = $("newsCount");
const vacanciesCount = $("vacanciesCount");
const publicationsCount = $("publicationsCount");


/* LISTS */

const casesList = $("casesList");
const newsList = $("newsList");
const vacanciesList = $("vacanciesList");
const publicationsList = $("publicationsList");


/* =========================================================
   STORAGE
========================================================= */

async function uploadFile(
    file,
    folder = "uploads"
) {

    if (!file) {
        return null;
    }

    const fileName =
        safeFileName(file.name);

    const filePath =
        `${folder}/${fileName}`;


    const {
        error
    } =
        await db
            .storage
            .from("website-media")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (error) {

        console.error(
            "Storage upload error:",
            error
        );

        throw error;
    }


    const {
        data
    } =
        db
            .storage
            .from("website-media")
            .getPublicUrl(filePath);


    return data?.publicUrl || null;
}


/* =========================================================
   ADMIN VERIFICATION
========================================================= */

async function verifyAdmin(userId) {

    const {
        data,
        error
    } =
        await db
            .from("admin_users")
            .select("user_id")
            .eq(
                "user_id",
                userId
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Admin verification error:",
            error
        );

        return false;
    }


    return Boolean(data);
}


/* =========================================================
   LOGIN
========================================================= */

async function login(
    email,
    password
) {

    setStatus(
        loginStatus,
        "მიმდინარეობს შესვლა..."
    );


    const {
        data,
        error
    } =
        await db.auth.signInWithPassword({
            email,
            password
        });


    if (error) {

        console.error(error);

        setStatus(
            loginStatus,
            "ელფოსტა ან პაროლი არასწორია.",
            "error"
        );

        return;
    }


    const user =
        data.user;


    const admin =
        await verifyAdmin(user.id);


    if (!admin) {

        await db.auth.signOut();

        setStatus(
            loginStatus,
            "ამ ანგარიშს ადმინისტრატორის წვდომა არ აქვს.",
            "error"
        );

        return;
    }


    setStatus(
        loginStatus,
        "წარმატებით შეხვედით.",
        "success"
    );


    await showAdmin(user);
}


/* =========================================================
   SHOW ADMIN
========================================================= */

async function showAdmin(user) {

    if (loginScreen) {
        loginScreen.hidden = true;
    }

    if (adminApp) {
        adminApp.hidden = false;
    }

    if (adminEmail) {

        adminEmail.textContent =
            user.email || "Admin";
    }


    await loadAllContent();
}


function showLogin() {

    if (adminApp) {
        adminApp.hidden = true;
    }

    if (loginScreen) {
        loginScreen.hidden = false;
    }
}


/* =========================================================
   LOGIN FORM
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;


            if (!email || !password) {

                setStatus(
                    loginStatus,
                    "შეავსეთ ელფოსტა და პაროლი.",
                    "error"
                );

                return;
            }


            await login(
                email,
                password
            );
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            await db.auth.signOut();

            showLogin();

            if (loginForm) {
                loginForm.reset();
            }

            setStatus(
                loginStatus,
                "თქვენ გამოხვედით სისტემიდან."
            );
        }
    );
}


/* =========================================================
   SESSION
========================================================= */

async function checkSession() {

    const {
        data: {
            session
        },
        error
    } =
        await db.auth.getSession();


    if (error) {

        console.error(error);

        showLogin();

        return;
    }


    if (!session?.user) {

        showLogin();

        return;
    }


    const admin =
        await verifyAdmin(
            session.user.id
        );


    if (!admin) {

        await db.auth.signOut();

        showLogin();

        setStatus(
            loginStatus,
            "ამ ანგარიშს ადმინისტრატორის წვდომა არ აქვს.",
            "error"
        );

        return;
    }


    await showAdmin(
        session.user
    );
}


/* =========================================================
   NAVIGATION
========================================================= */

const navButtons =
    document.querySelectorAll(
        ".admin-nav-button"
    );

const adminPanels =
    document.querySelectorAll(
        ".admin-panel"
    );


const panelTitles = {

    dashboardPanel:
        "მთავარი",

    casesPanel:
        "წარმატებული საქმეები",

    newsPanel:
        "სიახლეები",

    vacanciesPanel:
        "ვაკანსიები",

    publicationsPanel:
        "პუბლიკაციები"
};


navButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.dataset.panel;


                navButtons.forEach(
                    (item) =>
                        item.classList.remove(
                            "active"
                        )
                );


                adminPanels.forEach(
                    (panel) =>
                        panel.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                const panel =
                    $(target);


                if (panel) {

                    panel.classList.add(
                        "active"
                    );
                }


                if (adminPageTitle) {

                    adminPageTitle.textContent =
                        panelTitles[target] ||
                        "Administration";
                }
            }
        );
    }
);


/* =========================================================
   FORM OPEN / CLOSE
========================================================= */

document
    .querySelectorAll(
        "[data-form-toggle]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        $(button.dataset.formToggle);


                    if (!card) {
                        return;
                    }


                    if (
                        card.id ===
                        "caseFormCard"
                    ) {

                        resetCaseForm();
                    }


                    if (
                        card.id ===
                        "newsFormCard"
                    ) {

                        resetNewsForm();
                    }


                    if (
                        card.id ===
                        "vacancyFormCard"
                    ) {

                        resetVacancyForm();
                    }


                    if (
                        card.id ===
                        "publicationFormCard"
                    ) {

                        resetPublicationForm();
                    }


                    card.hidden = false;


                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        }
    );


document
    .querySelectorAll(
        "[data-form-close]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        $(button.dataset.formClose);


                    if (card) {

                        card.hidden = true;
                    }
                }
            );
        }
    );


/* =========================================================
   LOAD ALL
========================================================= */

async function loadAllContent() {

    await Promise.all([
        loadCases(),
        loadNews(),
        loadVacancies(),
        loadPublications()
    ]);

    await updateDashboardCounters();
}


/* =========================================================
   GENERIC DELETE
========================================================= */

async function deleteRecord(
    table,
    id,
    reloadFunction,
    name
) {

    const confirmed =
        window.confirm(
            `ნამდვილად გსურთ "${name}"-ის წაშლა?`
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } =
        await db
            .from(table)
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "წაშლა ვერ მოხერხდა: " +
            error.message
        );

        return;
    }


    await reloadFunction();

    await updateDashboardCounters();
}


/* =========================================================
   CASES
========================================================= */

const caseForm = $("caseForm");
const caseFormCard = $("caseFormCard");
const caseFormTitle = $("caseFormTitle");

const caseId = $("caseId");
const caseTitle = $("caseTitle");
const caseCategory = $("caseCategory");
const caseDescription = $("caseDescription");
const caseResult = $("caseResult");
const caseImage = $("caseImage");
const casePublished = $("casePublished");
const caseStatus = $("caseStatus");


async function loadCases() {

    if (!casesList) {
        return;
    }


    const {
        data,
        error
    } =
        await db
            .from("cases")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Cases error:",
            error
        );

        casesList.innerHTML = `
            <div class="empty-state">
                საქმეების ჩატვირთვა ვერ მოხერხდა.
            </div>
        `;

        return;
    }


    renderCases(data || []);
}


function renderCases(items) {

    if (!items.length) {

        casesList.innerHTML = `
            <div class="empty-state">
                წარმატებული საქმეები ჯერ დამატებული არ არის.
            </div>
        `;

        return;
    }


    casesList.innerHTML =
        items.map(
            (item) => `
                <article class="content-item">

                    <div class="content-thumb">
                        ${
                            item.image_url
                                ? `
                                    <img
                                        src="${escapeHTML(item.image_url)}"
                                        alt=""
                                    >
                                `
                                : ""
                        }
                    </div>

                    <div class="content-body">

                        <h4>
                            ${escapeHTML(item.title || "")}
                        </h4>

                        <p>
                            ${escapeHTML(
                                shortText(
                                    item.description
                                )
                            )}
                        </p>

                        <div class="content-meta">

                            ${
                                item.category
                                    ? `
                                        <span class="badge">
                                            ${escapeHTML(item.category)}
                                        </span>
                                    `
                                    : ""
                            }

                            <span
                                class="badge ${
                                    item.is_published
                                        ? "published"
                                        : "draft"
                                }"
                            >
                                ${
                                    item.is_published
                                        ? "გამოქვეყნებულია"
                                        : "დრაფტი"
                                }
                            </span>

                            <span class="badge">
                                ${formatDate(item.created_at)}
                            </span>

                        </div>

                    </div>

                    <div class="item-actions">

                        <button
                            type="button"
                            class="edit-button"
                            data-edit-case="${item.id}"
                        >
                            რედაქტირება
                        </button>

                        <button
                            type="button"
                            class="delete-button"
                            data-delete-case="${item.id}"
                        >
                            წაშლა
                        </button>

                    </div>

                </article>
            `
        ).join("");


    document
        .querySelectorAll(
            "[data-edit-case]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            items.find(
                                (entry) =>
                                    entry.id ===
                                    Number(
                                        button.dataset.editCase
                                    )
                            );


                        if (item) {
                            editCase(item);
                        }
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-delete-case]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteRecord(
                            "cases",
                            Number(
                                button.dataset.deleteCase
                            ),
                            loadCases,
                            "საქმე"
                        );
                    }
                );
            }
        );
}


function editCase(item) {

    caseId.value =
        item.id;

    caseTitle.value =
        item.title || "";

    caseCategory.value =
        item.category || "";

    caseDescription.value =
        item.description || "";

    caseResult.value =
        item.result || "";

    casePublished.checked =
        Boolean(item.is_published);


    caseForm.dataset.currentImage =
        item.image_url || "";


    if (caseFormTitle) {

        caseFormTitle.textContent =
            "საქმის რედაქტირება";
    }


    caseFormCard.hidden =
        false;


    caseFormCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function resetCaseForm() {

    if (!caseForm) {
        return;
    }


    caseForm.reset();

    caseId.value = "";

    casePublished.checked =
        true;

    delete caseForm.dataset.currentImage;


    if (caseFormTitle) {

        caseFormTitle.textContent =
            "ახალი საქმის დამატება";
    }
}


if (caseForm) {

    caseForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            setStatus(
                caseStatus,
                "მიმდინარეობს შენახვა..."
            );


            try {

                let imageUrl =
                    caseForm.dataset.currentImage ||
                    null;


                if (
                    caseImage.files &&
                    caseImage.files[0]
                ) {

                    imageUrl =
                        await uploadFile(
                            caseImage.files[0],
                            "cases"
                        );
                }


                const payload = {

                    title:
                        caseTitle.value.trim(),

                    category:
                        caseCategory.value,

                    description:
                        caseDescription.value.trim(),

                    result:
                        caseResult.value.trim(),

                    image_url:
                        imageUrl,

                    is_published:
                        casePublished.checked
                };


                let error;


                if (caseId.value) {

                    ({
                        error
                    } =
                        await db
                            .from("cases")
                            .update(payload)
                            .eq(
                                "id",
                                caseId.value
                            )
                    );

                } else {

                    ({
                        error
                    } =
                        await db
                            .from("cases")
                            .insert(payload)
                    );
                }


                if (error) {
                    throw error;
                }


                setStatus(
                    caseStatus,
                    "საქმე წარმატებით შეინახა.",
                    "success"
                );


                resetCaseForm();

                caseFormCard.hidden =
                    true;


                await loadCases();

                await updateDashboardCounters();

            } catch (error) {

                console.error(error);

                setStatus(
                    caseStatus,
                    error.message ||
                        "შენახვა ვერ მოხერხდა.",
                    "error"
                );
            }
        }
    );
}


/* =========================================================
   NEWS
========================================================= */

const newsForm = $("newsForm");
const newsFormCard = $("newsFormCard");

const newsId = $("newsId");
const newsTitle = $("newsTitle");
const newsDescription = $("newsDescription");
const newsImage = $("newsImage");
const newsPublished = $("newsPublished");
const newsStatus = $("newsStatus");


async function loadNews() {

    if (!newsList) {
        return;
    }


    const {
        data,
        error
    } =
        await db
            .from("news")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "News error:",
            error
        );

        newsList.innerHTML = `
            <div class="empty-state">
                სიახლეების ჩატვირთვა ვერ მოხერხდა.
            </div>
        `;

        return;
    }


    renderNews(data || []);
}


function renderNews(items) {

    if (!items.length) {

        newsList.innerHTML = `
            <div class="empty-state">
                სიახლეები ჯერ დამატებული არ არის.
            </div>
        `;

        return;
    }


    newsList.innerHTML =
        items.map(
            (item) => `
                <article class="content-item">

                    <div class="content-thumb">

                        ${
                            item.image_url
                                ? `
                                    <img
                                        src="${escapeHTML(item.image_url)}"
                                        alt=""
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div class="content-body">

                        <h4>
                            ${escapeHTML(item.title || "")}
                        </h4>

                        <p>
                            ${escapeHTML(
                                shortText(
                                    item.description
                                )
                            )}
                        </p>

                        <div class="content-meta">

                            <span
                                class="badge ${
                                    item.is_published
                                        ? "published"
                                        : "draft"
                                }"
                            >
                                ${
                                    item.is_published
                                        ? "გამოქვეყნებულია"
                                        : "დრაფტი"
                                }
                            </span>

                            <span class="badge">
                                ${formatDate(item.created_at)}
                            </span>

                        </div>

                    </div>


                    <div class="item-actions">

                        <button
                            type="button"
                            class="edit-button"
                            data-edit-news="${item.id}"
                        >
                            რედაქტირება
                        </button>

                        <button
                            type="button"
                            class="delete-button"
                            data-delete-news="${item.id}"
                        >
                            წაშლა
                        </button>

                    </div>

                </article>
            `
        ).join("");


    document
        .querySelectorAll(
            "[data-edit-news]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            items.find(
                                (entry) =>
                                    entry.id ===
                                    Number(
                                        button.dataset.editNews
                                    )
                            );


                        if (item) {
                            editNews(item);
                        }
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-delete-news]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteRecord(
                            "news",
                            Number(
                                button.dataset.deleteNews
                            ),
                            loadNews,
                            "სიახლე"
                        );
                    }
                );
            }
        );
}


function editNews(item) {

    newsId.value =
        item.id;

    newsTitle.value =
        item.title || "";

    newsDescription.value =
        item.description || "";

    newsPublished.checked =
        Boolean(item.is_published);


    newsForm.dataset.currentImage =
        item.image_url || "";


    newsFormCard.hidden =
        false;


    newsFormCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function resetNewsForm() {

    if (!newsForm) {
        return;
    }


    newsForm.reset();

    newsId.value =
        "";

    newsPublished.checked =
        true;

    delete newsForm.dataset.currentImage;
}


if (newsForm) {

    newsForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            setStatus(
                newsStatus,
                "მიმდინარეობს შენახვა..."
            );


            try {

                let imageUrl =
                    newsForm.dataset.currentImage ||
                    null;


                if (
                    newsImage.files &&
                    newsImage.files[0]
                ) {

                    imageUrl =
                        await uploadFile(
                            newsImage.files[0],
                            "news"
                        );
                }


                const payload = {

                    title:
                        newsTitle.value.trim(),

                    description:
                        newsDescription.value.trim(),

                    image_url:
                        imageUrl,

                    is_published:
                        newsPublished.checked
                };


                let error;


                if (newsId.value) {

                    ({
                        error
                    } =
                        await db
                            .from("news")
                            .update(payload)
                            .eq(
                                "id",
                                newsId.value
                            )
                    );

                } else {

                    ({
                        error
                    } =
                        await db
                            .from("news")
                            .insert(payload)
                    );
                }


                if (error) {
                    throw error;
                }


                setStatus(
                    newsStatus,
                    "სიახლე წარმატებით შეინახა.",
                    "success"
                );


                resetNewsForm();

                newsFormCard.hidden =
                    true;


                await loadNews();

                await updateDashboardCounters();

            } catch (error) {

                console.error(error);

                setStatus(
                    newsStatus,
                    error.message ||
                        "შენახვა ვერ მოხერხდა.",
                    "error"
                );
            }
        }
    );
}


/* =========================================================
   VACANCIES
========================================================= */

const vacancyForm = $("vacancyForm");
const vacancyFormCard = $("vacancyFormCard");

const vacancyId = $("vacancyId");
const vacancyTitle = $("vacancyTitle");
const vacancyDescription = $("vacancyDescription");
const vacancyImage = $("vacancyImage");
const vacancyPublished = $("vacancyPublished");
const vacancyStatus = $("vacancyStatus");


async function loadVacancies() {

    if (!vacanciesList) {
        return;
    }


    const {
        data,
        error
    } =
        await db
            .from("vacancies")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Vacancies error:",
            error
        );

        vacanciesList.innerHTML = `
            <div class="empty-state">
                ვაკანსიების ჩატვირთვა ვერ მოხერხდა.
            </div>
        `;

        return;
    }


    renderVacancies(data || []);
}


function renderVacancies(items) {

    if (!items.length) {

        vacanciesList.innerHTML = `
            <div class="empty-state">
                ვაკანსიები ჯერ დამატებული არ არის.
            </div>
        `;

        return;
    }


    vacanciesList.innerHTML =
        items.map(
            (item) => `
                <article class="content-item">

                    <div class="content-thumb">

                        ${
                            item.image_url
                                ? `
                                    <img
                                        src="${escapeHTML(item.image_url)}"
                                        alt=""
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div class="content-body">

                        <h4>
                            ${escapeHTML(item.title || "")}
                        </h4>

                        <p>
                            ${escapeHTML(
                                shortText(
                                    item.description
                                )
                            )}
                        </p>

                        <div class="content-meta">

                            <span
                                class="badge ${
                                    item.is_published
                                        ? "published"
                                        : "draft"
                                }"
                            >
                                ${
                                    item.is_published
                                        ? "გამოქვეყნებულია"
                                        : "დრაფტი"
                                }
                            </span>

                            <span class="badge">
                                ${formatDate(item.created_at)}
                            </span>

                        </div>

                    </div>


                    <div class="item-actions">

                        <button
                            type="button"
                            class="edit-button"
                            data-edit-vacancy="${item.id}"
                        >
                            რედაქტირება
                        </button>

                        <button
                            type="button"
                            class="delete-button"
                            data-delete-vacancy="${item.id}"
                        >
                            წაშლა
                        </button>

                    </div>

                </article>
            `
        ).join("");


    document
        .querySelectorAll(
            "[data-edit-vacancy]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            items.find(
                                (entry) =>
                                    entry.id ===
                                    Number(
                                        button.dataset.editVacancy
                                    )
                            );


                        if (item) {
                            editVacancy(item);
                        }
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-delete-vacancy]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteRecord(
                            "vacancies",
                            Number(
                                button.dataset.deleteVacancy
                            ),
                            loadVacancies,
                            "ვაკანსია"
                        );
                    }
                );
            }
        );
}


function editVacancy(item) {

    vacancyId.value =
        item.id;

    vacancyTitle.value =
        item.title || "";

    vacancyDescription.value =
        item.description || "";

    vacancyPublished.checked =
        Boolean(item.is_published);


    vacancyForm.dataset.currentImage =
        item.image_url || "";


    vacancyFormCard.hidden =
        false;


    vacancyFormCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function resetVacancyForm() {

    if (!vacancyForm) {
        return;
    }


    vacancyForm.reset();

    vacancyId.value =
        "";

    vacancyPublished.checked =
        true;

    delete vacancyForm.dataset.currentImage;
}


if (vacancyForm) {

    vacancyForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            setStatus(
                vacancyStatus,
                "მიმდინარეობს შენახვა..."
            );


            try {

                let imageUrl =
                    vacancyForm.dataset.currentImage ||
                    null;


                if (
                    vacancyImage.files &&
                    vacancyImage.files[0]
                ) {

                    imageUrl =
                        await uploadFile(
                            vacancyImage.files[0],
                            "vacancies"
                        );
                }


                const payload = {

                    title:
                        vacancyTitle.value.trim(),

                    description:
                        vacancyDescription.value.trim(),

                    image_url:
                        imageUrl,

                    is_published:
                        vacancyPublished.checked
                };


                let error;


                if (vacancyId.value) {

                    ({
                        error
                    } =
                        await db
                            .from("vacancies")
                            .update(payload)
                            .eq(
                                "id",
                                vacancyId.value
                            )
                    );

                } else {

                    ({
                        error
                    } =
                        await db
                            .from("vacancies")
                            .insert(payload)
                    );
                }


                if (error) {
                    throw error;
                }


                setStatus(
                    vacancyStatus,
                    "ვაკანსია წარმატებით შეინახა.",
                    "success"
                );


                resetVacancyForm();

                vacancyFormCard.hidden =
                    true;


                await loadVacancies();

                await updateDashboardCounters();

            } catch (error) {

                console.error(error);

                setStatus(
                    vacancyStatus,
                    error.message ||
                        "შენახვა ვერ მოხერხდა.",
                    "error"
                );
            }
        }
    );
}


/* =========================================================
   PUBLICATIONS
========================================================= */

const publicationForm = $("publicationForm");
const publicationFormCard = $("publicationFormCard");

const publicationId = $("publicationId");
const publicationTitle = $("publicationTitle");
const publicationDescription = $("publicationDescription");
const publicationImage = $("publicationImage");
const publicationFile = $("publicationFile");
const publicationPublished = $("publicationPublished");
const publicationStatus = $("publicationStatus");


async function loadPublications() {

    if (!publicationsList) {
        return;
    }


    const {
        data,
        error
    } =
        await db
            .from("publications")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Publications error:",
            error
        );

        publicationsList.innerHTML = `
            <div class="empty-state">
                პუბლიკაციების ჩატვირთვა ვერ მოხერხდა.
            </div>
        `;

        return;
    }


    renderPublications(data || []);
}


function renderPublications(items) {

    if (!items.length) {

        publicationsList.innerHTML = `
            <div class="empty-state">
                პუბლიკაციები ჯერ დამატებული არ არის.
            </div>
        `;

        return;
    }


    publicationsList.innerHTML =
        items.map(
            (item) => `
                <article class="content-item">

                    <div class="content-thumb">

                        ${
                            item.image_url
                                ? `
                                    <img
                                        src="${escapeHTML(item.image_url)}"
                                        alt=""
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div class="content-body">

                        <h4>
                            ${escapeHTML(item.title || "")}
                        </h4>

                        <p>
                            ${escapeHTML(
                                shortText(
                                    item.description
                                )
                            )}
                        </p>


                        <div class="content-meta">

                            <span
                                class="badge ${
                                    item.is_published
                                        ? "published"
                                        : "draft"
                                }"
                            >
                                ${
                                    item.is_published
                                        ? "გამოქვეყნებულია"
                                        : "დრაფტი"
                                }
                            </span>


                            ${
                                item.file_url
                                    ? `
                                        <a
                                            href="${escapeHTML(item.file_url)}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="badge"
                                        >
                                            ფაილის ნახვა
                                        </a>
                                    `
                                    : ""
                            }


                            <span class="badge">
                                ${formatDate(item.created_at)}
                            </span>

                        </div>

                    </div>


                    <div class="item-actions">

                        <button
                            type="button"
                            class="edit-button"
                            data-edit-publication="${item.id}"
                        >
                            რედაქტირება
                        </button>

                        <button
                            type="button"
                            class="delete-button"
                            data-delete-publication="${item.id}"
                        >
                            წაშლა
                        </button>

                    </div>

                </article>
            `
        ).join("");


    document
        .querySelectorAll(
            "[data-edit-publication]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            items.find(
                                (entry) =>
                                    entry.id ===
                                    Number(
                                        button.dataset.editPublication
                                    )
                            );


                        if (item) {
                            editPublication(item);
                        }
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-delete-publication]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteRecord(
                            "publications",
                            Number(
                                button.dataset.deletePublication
                            ),
                            loadPublications,
                            "პუბლიკაცია"
                        );
                    }
                );
            }
        );
}


function editPublication(item) {

    publicationId.value =
        item.id;

    publicationTitle.value =
        item.title || "";

    publicationDescription.value =
        item.description || "";

    publicationPublished.checked =
        Boolean(item.is_published);


    publicationForm.dataset.currentImage =
        item.image_url || "";

    publicationForm.dataset.currentFile =
        item.file_url || "";


    publicationFormCard.hidden =
        false;


    publicationFormCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function resetPublicationForm() {

    if (!publicationForm) {
        return;
    }


    publicationForm.reset();

    publicationId.value =
        "";

    publicationPublished.checked =
        true;


    delete publicationForm.dataset.currentImage;

    delete publicationForm.dataset.currentFile;
}


if (publicationForm) {

    publicationForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            setStatus(
                publicationStatus,
                "მიმდინარეობს შენახვა..."
            );


            try {

                let imageUrl =
                    publicationForm.dataset.currentImage ||
                    null;

                let fileUrl =
                    publicationForm.dataset.currentFile ||
                    null;


                if (
                    publicationImage.files &&
                    publicationImage.files[0]
                ) {

                    imageUrl =
                        await uploadFile(
                            publicationImage.files[0],
                            "publications/images"
                        );
                }


                if (
                    publicationFile.files &&
                    publicationFile.files[0]
                ) {

                    fileUrl =
                        await uploadFile(
                            publicationFile.files[0],
                            "publications/files"
                        );
                }


                const payload = {

                    title:
                        publicationTitle.value.trim(),

                    description:
                        publicationDescription.value.trim(),

                    image_url:
                        imageUrl,

                    file_url:
                        fileUrl,

                    is_published:
                        publicationPublished.checked
                };


                let error;


                if (publicationId.value) {

                    ({
                        error
                    } =
                        await db
                            .from("publications")
                            .update(payload)
                            .eq(
                                "id",
                                publicationId.value
                            )
                    );

                } else {

                    ({
                        error
                    } =
                        await db
                            .from("publications")
                            .insert(payload)
                    );
                }


                if (error) {
                    throw error;
                }


                setStatus(
                    publicationStatus,
                    "პუბლიკაცია წარმატებით შეინახა.",
                    "success"
                );


                resetPublicationForm();

                publicationFormCard.hidden =
                    true;


                await loadPublications();

                await updateDashboardCounters();

            } catch (error) {

                console.error(error);

                setStatus(
                    publicationStatus,
                    error.message ||
                        "შენახვა ვერ მოხერხდა.",
                    "error"
                );
            }
        }
    );
}


/* =========================================================
   DASHBOARD COUNTERS
========================================================= */

async function getTableCount(table) {

    const {
        count,
        error
    } =
        await db
            .from(table)
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );


    if (error) {

        console.error(
            `Count error ${table}:`,
            error
        );

        return 0;
    }


    return count || 0;
}


async function updateDashboardCounters() {

    const [
        caseTotal,
        newsTotal,
        vacancyTotal,
        publicationTotal
    ] =
        await Promise.all([

            getTableCount("cases"),

            getTableCount("news"),

            getTableCount("vacancies"),

            getTableCount("publications")

        ]);


    if (casesCount) {
        casesCount.textContent =
            caseTotal;
    }


    if (newsCount) {
        newsCount.textContent =
            newsTotal;
    }


    if (vacanciesCount) {
        vacanciesCount.textContent =
            vacancyTotal;
    }


    if (publicationsCount) {
        publicationsCount.textContent =
            publicationTotal;
    }
}


db.auth.onAuthStateChange((event) => {

    if (event === "SIGNED_OUT") {
        showLogin();
    }

});