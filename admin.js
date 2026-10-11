"use strict";


/* =========================================================
   CRIMINAL LAW CENTER GEORGIA
   ADMIN PANEL
========================================================= */


const SUPABASE_URL =
    "https://oaphygvtdayllubygjut.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_z56PmTmBFKzQD9tviwL7mA_wGeMEe_H";


const STORAGE_BUCKET =
    "website-media";


let db = null;


const cache = {

    cases: [],

    news: [],

    vacancies: [],

    publications: []

};


const viewState = {

    cases: {
        search: "",
        filter: "all"
    },

    news: {
        search: "",
        filter: "all"
    },

    vacancies: {
        search: "",
        filter: "all"
    },

    publications: {
        search: "",
        filter: "all"
    }

};



const $ =
    (id) =>
        document.getElementById(
            id
        );



const loginScreen =
    $("loginScreen");


const adminApp =
    $("adminApp");


const loginForm =
    $("loginForm");


const loginEmail =
    $("loginEmail");


const loginPassword =
    $("loginPassword");


const loginStatus =
    $("loginStatus");


const logoutButton =
    $("logoutButton");


const adminEmail =
    $("adminEmail");


const adminPageTitle =
    $("adminPageTitle");



/* =========================================================
   CONTENT CONFIG
========================================================= */


const configs = {


    cases: {

        table:
            "cases",

        label:
            "საქმე",

        listId:
            "casesList",

        formId:
            "caseForm",

        formCardId:
            "caseFormCard",

        idId:
            "caseId",

        titleId:
            "caseTitle",

        descriptionId:
            "caseDescription",

        imageId:
            "caseImage",

        publishedId:
            "casePublished",

        statusId:
            "caseStatus",

        imageFolder:
            "cases",

        extra: [

            {
                id:
                    "caseCategory",

                key:
                    "category"
            },

            {
                id:
                    "caseResult",

                key:
                    "result"
            }

        ]

    },


    news: {

        table:
            "news",

        label:
            "სიახლე",

        listId:
            "newsList",

        formId:
            "newsForm",

        formCardId:
            "newsFormCard",

        idId:
            "newsId",

        titleId:
            "newsTitle",

        descriptionId:
            "newsDescription",

        imageId:
            "newsImage",

        publishedId:
            "newsPublished",

        statusId:
            "newsStatus",

        imageFolder:
            "news",

        extra: []

    },


    vacancies: {

        table:
            "vacancies",

        label:
            "ვაკანსია",

        listId:
            "vacanciesList",

        formId:
            "vacancyForm",

        formCardId:
            "vacancyFormCard",

        idId:
            "vacancyId",

        titleId:
            "vacancyTitle",

        descriptionId:
            "vacancyDescription",

        imageId:
            "vacancyImage",

        publishedId:
            "vacancyPublished",

        statusId:
            "vacancyStatus",

        imageFolder:
            "vacancies",

        extra: []

    },


    publications: {

        table:
            "publications",

        label:
            "პუბლიკაცია",

        listId:
            "publicationsList",

        formId:
            "publicationForm",

        formCardId:
            "publicationFormCard",

        idId:
            "publicationId",

        titleId:
            "publicationTitle",

        descriptionId:
            "publicationDescription",

        imageId:
            "publicationImage",

        fileId:
            "publicationFile",

        publishedId:
            "publicationPublished",

        statusId:
            "publicationStatus",

        imageFolder:
            "publications/images",

        fileFolder:
            "publications/files",

        extra: []

    }

};



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
        "პუბლიკაციები",

    siteBuilderPanel:
        "საიტის კონსტრუქტორი",

    siteContentPanel:
        "საიტის სრული რედაქტირება"

};



/* =========================================================
   HELPERS
========================================================= */


function setStatus(
    element,
    message = "",
    type = ""
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.classList.remove(
        "success",
        "error"
    );


    if (type) {

        element.classList.add(
            type
        );
    }
}



function escapeHTML(
    value = ""
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}



function shortenText(
    value = "",
    max = 190
) {

    const text =
        String(
            value || ""
        )
        .trim();


    return (
        text.length > max

            ? `${text.slice(
                0,
                max
            )}...`

            : text
    );
}



function formatDate(
    value
) {

    if (!value) {
        return "";
    }


    try {

        return new Intl.DateTimeFormat(
            "ka-GE",
            {

                year:
                    "numeric",

                month:
                    "short",

                day:
                    "numeric"

            }
        )
        .format(
            new Date(value)
        );

    } catch {

        return "";
    }
}



function safeFileName(
    name = "file"
) {

    const dot =
        name.lastIndexOf(
            "."
        );


    const extension =
        dot >= 0

            ? name
                .slice(dot)
                .toLowerCase()

            : "";


    const base = (

        dot >= 0

            ? name.slice(
                0,
                dot
            )

            : name

    )

    .toLowerCase()

    .replace(
        /[^a-z0-9_-]/g,
        "-"
    )

    .replace(
        /-+/g,
        "-"
    )

    .replace(
        /^-|-$/g,
        ""
    )

    || "file";


    return (

        `${base}-` +

        `${Date.now()}-` +

        `${Math.random()
            .toString(36)
            .slice(
                2,
                8
            )
        }${extension}`

    );
}



function getElements(
    config
) {

    return {

        list:
            $(config.listId),

        form:
            $(config.formId),

        formCard:
            $(config.formCardId),

        id:
            $(config.idId),

        title:
            $(config.titleId),

        description:
            $(config.descriptionId),

        image:
            $(config.imageId),

        file:
            config.fileId
                ? $(config.fileId)
                : null,

        published:
            $(config.publishedId),

        status:
            $(config.statusId)

    };
}



/* =========================================================
   SUPABASE CLIENT
========================================================= */


async function createSupabaseClient() {

    const module =
        await import(
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
        );


    if (
        !module ||
        !module.createClient
    ) {

        throw new Error(
            "Supabase ბიბლიოთეკა ვერ ჩაიტვირთა."
        );
    }


    return module.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}



/* =========================================================
   VERIFY ADMIN
========================================================= */


async function verifyAdmin(
    userId
) {

    const {
        data,
        error
    } =
        await db

            .from(
                "admin_users"
            )

            .select(
                "user_id"
            )

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


        throw new Error(

            "ადმინისტრატორის შემოწმება ვერ მოხერხდა: " +

            error.message

        );
    }


    return Boolean(
        data
    );
}



/* =========================================================
   LOGIN VIEW
========================================================= */


function showLogin(
    message = "",
    type = ""
) {

    if (adminApp) {

        adminApp.hidden =
            true;
    }


    if (loginScreen) {

        loginScreen.hidden =
            false;
    }


    if (message) {

        setStatus(
            loginStatus,
            message,
            type
        );
    }
}



async function showAdmin(
    user
) {

    if (loginScreen) {

        loginScreen.hidden =
            true;
    }


    if (adminApp) {

        adminApp.hidden =
            false;
    }


    if (adminEmail) {

        adminEmail.textContent =

            user?.email ||

            "Admin";
    }


    await loadAll();
    await loadSiteBuilder();
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
        await db.auth
            .signInWithPassword({

                email,

                password

            });


    if (error) {

        console.error(
            error
        );


        setStatus(
            loginStatus,
            "ელფოსტა ან პაროლი არასწორია.",
            "error"
        );


        return;
    }


    try {

        const isAdmin =
            await verifyAdmin(
                data.user.id
            );


        if (!isAdmin) {

            await db.auth
                .signOut();


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


        await showAdmin(
            data.user
        );

    } catch (error2) {

        await db.auth
            .signOut();


        setStatus(
            loginStatus,
            error2.message,
            "error"
        );
    }
}



/* =========================================================
   SESSION
========================================================= */


async function checkSession() {

    const {
        data,
        error
    } =
        await db.auth
            .getSession();


    if (
        error ||
        !data?.session?.user
    ) {

        showLogin();

        return;
    }


    try {

        const isAdmin =
            await verifyAdmin(
                data.session.user.id
            );


        if (!isAdmin) {

            await db.auth
                .signOut();


            showLogin(
                "ამ ანგარიშს ადმინისტრატორის წვდომა არ აქვს.",
                "error"
            );


            return;
        }


        await showAdmin(
            data.session.user
        );

    } catch (error2) {

        await db.auth
            .signOut();


        showLogin(
            error2.message,
            "error"
        );
    }
}



/* =========================================================
   STORAGE UPLOAD
========================================================= */


async function uploadFile(
    file,
    folder
) {

    if (!file) {

        return null;
    }


    const path =

        `${folder}/` +

        safeFileName(
            file.name
        );


    const {
        error
    } =
        await db.storage

            .from(
                STORAGE_BUCKET
            )

            .upload(
                path,
                file,
                {

                    cacheControl:
                        "3600",

                    upsert:
                        false

                }
            );


    if (error) {

        throw error;
    }


    const {
        data
    } =
        db.storage

            .from(
                STORAGE_BUCKET
            )

            .getPublicUrl(
                path
            );


    return (
        data?.publicUrl ||
        null
    );
}



/* =========================================================
   NAVIGATION
========================================================= */


function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".admin-nav-button"
        );


    const panels =
        document.querySelectorAll(
            ".admin-panel"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {


                    buttons.forEach(
                        (item) => {

                            item.classList
                                .remove(
                                    "active"
                                );
                        }
                    );


                    panels.forEach(
                        (panel) => {

                            panel.classList
                                .remove(
                                    "active"
                                );
                        }
                    );


                    button.classList
                        .add(
                            "active"
                        );


                    const target =
                        $(
                            button.dataset
                                .panel
                        );


                    if (target) {

                        target.classList
                            .add(
                                "active"
                            );
                    }


                    if (
                        adminPageTitle
                    ) {

                        adminPageTitle
                            .textContent =

                            panelTitles[
                                button.dataset.panel
                            ]

                            || "ადმინისტრაცია";
                    }

                }
            );

        }
    );
}



/* =========================================================
   FORMS OPEN/CLOSE
========================================================= */


function resetForm(
    type
) {

    const config =
        configs[type];


    const elements =
        getElements(
            config
        );


    if (!elements.form) {

        return;
    }


    elements.form
        .reset();


    if (elements.id) {

        elements.id.value =
            "";
    }


    if (
        elements.published
    ) {

        elements.published
            .checked =
            true;
    }


    delete elements.form
        .dataset
        .currentImage;


    delete elements.form
        .dataset
        .currentFile;


    setStatus(
        elements.status,
        ""
    );


    if (
        type === "cases" &&
        $("caseFormTitle")
    ) {

        $("caseFormTitle")
            .textContent =
            "ახალი წარმატებული საქმე";
    }
}



function typeByCardId(
    cardId
) {

    return Object
        .keys(
            configs
        )
        .find(
            (type) =>

                configs[type]
                    .formCardId ===
                cardId
        );
}



function setupFormToggles() {

    document
        .querySelectorAll(
            "[data-open-form]"
        )
        .forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    () => {


                        const id =
                            button.dataset
                                .openForm;


                        const card =
                            $(id);


                        const type =
                            typeByCardId(
                                id
                            );


                        if (type) {

                            resetForm(
                                type
                            );
                        }


                        if (card) {

                            card.hidden =
                                false;


                            card.scrollIntoView({

                                behavior:
                                    "smooth",

                                block:
                                    "start"

                            });
                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-close-form]"
        )
        .forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    () => {


                        const card =
                            $(
                                button.dataset
                                    .closeForm
                            );


                        if (card) {

                            card.hidden =
                                true;
                        }

                    }
                );

            }
        );
}



/* =========================================================
   SEARCH / FILTER
========================================================= */


function setupSearchAndFilters() {

    document
        .querySelectorAll(
            "[data-search-type]"
        )
        .forEach(
            (input) => {


                input.addEventListener(
                    "input",
                    () => {


                        const type =
                            input.dataset
                                .searchType;


                        viewState[type]
                            .search =

                            input.value
                                .trim()
                                .toLowerCase();


                        renderType(
                            type
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-filter-type]"
        )
        .forEach(
            (select) => {


                select.addEventListener(
                    "change",
                    () => {


                        const type =
                            select.dataset
                                .filterType;


                        viewState[type]
                            .filter =
                            select.value;


                        renderType(
                            type
                        );

                    }
                );

            }
        );
}



function filteredItems(
    type
) {

    const state =
        viewState[type];


    return cache[type]
        .filter(
            (item) => {


                const text =

                    `${item.title || ""} ` +

                    `${item.description || ""} ` +

                    `${item.category || ""} ` +

                    `${item.result || ""}`;


                const haystack =
                    text.toLowerCase();


                const searchOk =

                    !state.search ||

                    haystack.includes(
                        state.search
                    );


                const filterOk =

                    state.filter === "all"

                    ||

                    (
                        state.filter ===
                        "published"

                        &&

                        item.is_published ===
                        true
                    )

                    ||

                    (
                        state.filter ===
                        "draft"

                        &&

                        item.is_published !==
                        true
                    );


                return (

                    searchOk &&

                    filterOk

                );
            }
        );
}



/* =========================================================
   EDIT
========================================================= */


function fillForm(
    type,
    item
) {

    const config =
        configs[type];


    const elements =
        getElements(
            config
        );


    if (elements.id) {

        elements.id.value =
            item.id ?? "";
    }


    if (elements.title) {

        elements.title.value =
            item.title ?? "";
    }


    if (
        elements.description
    ) {

        elements.description.value =
            item.description ?? "";
    }


    if (
        elements.published
    ) {

        elements.published.checked =

            item.is_published !==
            false;
    }


    config.extra.forEach(
        ({
            id,
            key
        }) => {


            const field =
                $(id);


            if (field) {

                field.value =
                    item[key] ?? "";
            }

        }
    );


    if (elements.form) {

        elements.form
            .dataset
            .currentImage =

            item.image_url ||
            "";


        if (
            config.fileId
        ) {

            elements.form
                .dataset
                .currentFile =

                item.file_url ||
                "";
        }
    }


    if (
        type === "cases" &&
        $("caseFormTitle")
    ) {

        $("caseFormTitle")
            .textContent =
            "საქმის რედაქტირება";
    }


    if (
        elements.formCard
    ) {

        elements.formCard.hidden =
            false;


        elements.formCard
            .scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });
    }
}



/* =========================================================
   RENDER
========================================================= */


function renderType(
    type
) {

    const config =
        configs[type];


    const elements =
        getElements(
            config
        );


    if (!elements.list) {

        return;
    }


    const items =
        filteredItems(
            type
        );


    if (!items.length) {

        elements.list.innerHTML = `

            <div class="empty-state">
                ჩანაწერი ვერ მოიძებნა.
            </div>

        `;


        return;
    }


    elements.list.innerHTML =

        items.map(
            (item) => {


                const category =

                    type === "cases"

                    &&

                    item.category

                    ? `

                        <span class="badge">

                            ${escapeHTML(
                                item.category
                            )}

                        </span>

                    `

                    : "";


                const result =

                    type === "cases"

                    &&

                    item.result

                    ? `

                        <p>

                            <strong>
                                შედეგი:
                            </strong>

                            ${escapeHTML(
                                shortenText(
                                    item.result,
                                    150
                                )
                            )}

                        </p>

                    `

                    : "";


                const file =

                    type ===
                        "publications"

                    &&

                    item.file_url

                    ? `

                        <a
                            class="badge"
                            href="${escapeHTML(
                                item.file_url
                            )}"
                            target="_blank"
                            rel="noopener"
                        >
                            ფაილის ნახვა ↗
                        </a>

                    `

                    : "";


                return `

                    <article class="content-item">

                        <div class="content-thumb">

                            ${
                                item.image_url

                                ? `

                                    <img
                                        src="${escapeHTML(
                                            item.image_url
                                        )}"
                                        alt=""
                                    >

                                `

                                : ""
                            }

                        </div>


                        <div class="content-body">

                            <h4>

                                ${escapeHTML(
                                    item.title ||
                                    "უსათაურო"
                                )}

                            </h4>


                            <p>

                                ${escapeHTML(
                                    shortenText(
                                        item.description ||
                                        "",
                                        190
                                    )
                                )}

                            </p>


                            ${result}


                            <div class="content-meta">

                                ${category}


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


                                ${file}


                                ${
                                    item.created_at

                                    ? `

                                        <span class="badge">

                                            ${escapeHTML(
                                                formatDate(
                                                    item.created_at
                                                )
                                            )}

                                        </span>

                                    `

                                    : ""
                                }

                            </div>

                        </div>


                        <div class="item-actions">

                            <button
                                class="edit-button"
                                type="button"
                                data-edit-type="${type}"
                                data-id="${escapeHTML(
                                    item.id
                                )}"
                            >
                                რედაქტირება
                            </button>


                            <button
                                class="delete-button"
                                type="button"
                                data-delete-type="${type}"
                                data-id="${escapeHTML(
                                    item.id
                                )}"
                            >
                                წაშლა
                            </button>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    elements.list
        .querySelectorAll(
            "[data-edit-type]"
        )
        .forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    () => {


                        const item =

                            cache[type]
                                .find(
                                    (entry) =>

                                        String(
                                            entry.id
                                        )

                                        ===

                                        String(
                                            button.dataset.id
                                        )
                                );


                        if (item) {

                            fillForm(
                                type,
                                item
                            );
                        }

                    }
                );

            }
        );


    elements.list
        .querySelectorAll(
            "[data-delete-type]"
        )
        .forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    () => {


                        deleteRecord(
                            type,
                            button.dataset.id
                        );

                    }
                );

            }
        );
}



/* =========================================================
   LOAD
========================================================= */


async function loadType(
    type
) {

    const config =
        configs[type];


    const elements =
        getElements(
            config
        );


    const {
        data,
        error
    } =
        await db

            .from(
                config.table
            )

            .select("*")

            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            `${config.table} load error:`,
            error
        );


        if (
            elements.list
        ) {

            elements.list.innerHTML = `

                <div class="empty-state">

                    ჩატვირთვა ვერ მოხერხდა:

                    ${escapeHTML(
                        error.message
                    )}

                </div>

            `;
        }


        cache[type] =
            [];


        return;
    }


    cache[type] =

        Array.isArray(
            data
        )

        ? data

        : [];


    renderType(
        type
    );
}



/* =========================================================
   SAVE
========================================================= */


async function saveType(
    type,
    event
) {

    event.preventDefault();


    const config =
        configs[type];


    const elements =
        getElements(
            config
        );


    setStatus(
        elements.status,
        "მიმდინარეობს შენახვა..."
    );


    try {

        let imageUrl =

            elements.form
                ?.dataset
                .currentImage

            || null;


        let fileUrl =

            elements.form
                ?.dataset
                .currentFile

            || null;


        if (
            elements.image
                ?.files
                ?.[0]
        ) {

            imageUrl =
                await uploadFile(

                    elements.image
                        .files[0],

                    config.imageFolder

                );
        }


        if (
            elements.file
                ?.files
                ?.[0]
        ) {

            fileUrl =
                await uploadFile(

                    elements.file
                        .files[0],

                    config.fileFolder

                );
        }


        const payload = {

            title:

                elements.title
                    ?.value
                    .trim()

                || "",


            description:

                elements.description
                    ?.value
                    .trim()

                || "",


            image_url:
                imageUrl,


            is_published:

                Boolean(
                    elements.published
                        ?.checked
                )

        };


        config.extra
            .forEach(
                ({
                    id,
                    key
                }) => {


                    const field =
                        $(id);


                    payload[key] =

                        field
                            ?.value
                            ?.trim
                            ?.()

                        ??

                        field
                            ?.value

                        ??

                        "";

                }
            );


        if (
            config.fileId
        ) {

            payload.file_url =
                fileUrl;
        }


        if (
            !payload.title
        ) {

            throw new Error(
                "სათაური აუცილებელია."
            );
        }


        let response;


        if (
            elements.id
                ?.value
        ) {

            response =
                await db

                    .from(
                        config.table
                    )

                    .update(
                        payload
                    )

                    .eq(
                        "id",
                        elements.id.value
                    );

        } else {

            response =
                await db

                    .from(
                        config.table
                    )

                    .insert(
                        payload
                    );
        }


        if (
            response.error
        ) {

            throw response.error;
        }


        setStatus(
            elements.status,
            `${config.label} წარმატებით შეინახა.`,
            "success"
        );


        await loadType(
            type
        );


        await updateCounters();


        setTimeout(
            () => {


                resetForm(
                    type
                );


                if (
                    elements.formCard
                ) {

                    elements.formCard
                        .hidden =
                        true;
                }

            },
            450
        );

    } catch (error) {

        console.error(
            error
        );


        setStatus(
            elements.status,

            error?.message ||

            "შენახვა ვერ მოხერხდა.",

            "error"
        );
    }
}



/* =========================================================
   DELETE
========================================================= */


async function deleteRecord(
    type,
    id
) {

    const config =
        configs[type];


    const confirmed =
        window.confirm(

            `ნამდვილად გსურთ ${config.label}-ის წაშლა?`

        );


    if (!confirmed) {

        return;
    }


    const {
        error
    } =
        await db

            .from(
                config.table
            )

            .delete()

            .eq(
                "id",
                id
            );


    if (error) {

        alert(

            "წაშლა ვერ მოხერხდა: " +

            error.message

        );


        return;
    }


    await loadType(
        type
    );


    await updateCounters();
}



/* =========================================================
   FORM EVENTS
========================================================= */


function setupForms() {

    Object
        .entries(
            configs
        )
        .forEach(
            ([
                type,
                config
            ]) => {


                const form =
                    $(
                        config.formId
                    );


                if (form) {

                    form.addEventListener(
                        "submit",
                        (event) => {


                            saveType(
                                type,
                                event
                            );

                        }
                    );
                }

            }
        );
}



/* =========================================================
   COUNTERS
========================================================= */


async function countTable(
    table
) {

    const {
        count,
        error
    } =
        await db

            .from(
                table
            )

            .select(
                "*",
                {

                    count:
                        "exact",

                    head:
                        true

                }
            );


    if (error) {

        return 0;
    }


    return (
        count ||
        0
    );
}



async function updateCounters() {

    const [
        cases,
        news,
        vacancies,
        publications
    ] =
        await Promise.all([

            countTable(
                "cases"
            ),

            countTable(
                "news"
            ),

            countTable(
                "vacancies"
            ),

            countTable(
                "publications"
            )

        ]);


    if (
        $("casesCount")
    ) {

        $("casesCount")
            .textContent =
            cases;
    }


    if (
        $("newsCount")
    ) {

        $("newsCount")
            .textContent =
            news;
    }


    if (
        $("vacanciesCount")
    ) {

        $("vacanciesCount")
            .textContent =
            vacancies;
    }


    if (
        $("publicationsCount")
    ) {

        $("publicationsCount")
            .textContent =
            publications;
    }
}



/* =========================================================
   LOAD ALL
========================================================= */


async function loadAll() {

    await Promise.all([

        loadType(
            "cases"
        ),

        loadType(
            "news"
        ),

        loadType(
            "vacancies"
        ),

        loadType(
            "publications"
        ),

        updateCounters()

    ]);
}



/* =========================================================
   AUTH EVENTS
========================================================= */


function setupAuth() {

    if (
        loginForm
    ) {

        loginForm.addEventListener(
            "submit",
            async (
                event
            ) => {


                event.preventDefault();


                const email =

                    loginEmail
                        ?.value
                        .trim()

                    || "";


                const password =

                    loginPassword
                        ?.value

                    || "";


                if (
                    !email ||
                    !password
                ) {

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


    if (
        logoutButton
    ) {

        logoutButton.addEventListener(
            "click",
            async () => {


                await db.auth
                    .signOut();


                if (
                    loginForm
                ) {

                    loginForm
                        .reset();
                }


                showLogin(
                    "თქვენ გამოხვედით სისტემიდან."
                );

            }
        );
    }
}




/* =========================================================
   SITE BUILDER — custom sections and content blocks
========================================================= */
const builderList = $("siteBuilderList");
const builderSectionForm = $("builderSectionForm");
const builderSectionStatus = $("builderSectionStatus");

async function loadSiteBuilder() {
    if (!builderList || !db) return;
    builderList.innerHTML = '<p class="form-status">სექციები იტვირთება...</p>';
    try {
        const { data: sections, error } = await db
            .from("site_sections")
            .select("*")
            .order("sort_order", { ascending: true });
        if (error) throw error;

        const { data: blocks, error: blocksError } = await db
            .from("site_blocks")
            .select("*")
            .order("sort_order", { ascending: true });
        if (blocksError) throw blocksError;

        if (!sections?.length) {
            builderList.innerHTML = '<p class="builder-help">სექციები ჯერ არ არის. ზემოთ დაამატეთ პირველი სექცია.</p>';
            return;
        }

        builderList.innerHTML = sections.map(section => {
            const safeId = escapeHTML(section.id);
            const sectionBlocks = (blocks || []).filter(block => String(block.section_id) === String(section.id));
            return `
                <article class="builder-section-card" data-builder-section="${safeId}">
                    <div class="builder-section-heading">
                        <div>
                            <h4>${escapeHTML(section.title || "უსათაურო სექცია")}</h4>
                            <p>${escapeHTML(section.subtitle || "")}</p>
                            <small>${section.is_published ? "გამოქვეყნებულია" : "დამალულია"} · ${sectionBlocks.length} ბლოკი</small>
                        </div>
                        <div class="builder-actions">
                            <button class="secondary-button" type="button" data-builder-add-block="${safeId}">+ ბლოკი</button>
                            <button class="secondary-button" type="button" data-builder-edit-section="${safeId}">რედაქტირება</button>
                            <button class="secondary-button" type="button" data-builder-toggle-section="${safeId}" data-published="${section.is_published ? "true" : "false"}">${section.is_published ? "დამალვა" : "გამოქვეყნება"}</button>
                            <button class="icon-button" type="button" aria-label="სექციის წაშლა" data-builder-delete-section="${safeId}">×</button>
                        </div>
                    </div>
                    <div class="builder-block-list">
                        ${sectionBlocks.length ? sectionBlocks.map(block => `
                            <div class="builder-block-row" data-builder-block="${escapeHTML(block.id)}">
                                <div class="builder-block-copy">
                                    <strong>${escapeHTML(block.title || "უსათაურო ბლოკი")}</strong>
                                    <p>${escapeHTML(shortenText(block.body || "", 180))}</p>
                                    <small>${block.is_published ? "გამოქვეყნებულია" : "დამალულია"}${block.image_url ? " · ფოტოთი" : ""}</small>
                                </div>
                                <div class="builder-actions">
                                    <button class="secondary-button" type="button" data-builder-edit-block="${escapeHTML(block.id)}">რედაქტირება</button>
                                    <button class="secondary-button" type="button" data-builder-toggle-block="${escapeHTML(block.id)}" data-published="${block.is_published ? "true" : "false"}">${block.is_published ? "დამალვა" : "გამოქვეყნება"}</button>
                                    <button class="icon-button" type="button" aria-label="ბლოკის წაშლა" data-builder-delete-block="${escapeHTML(block.id)}">×</button>
                                </div>
                            </div>
                        `).join("") : '<p class="builder-help">ამ სექციაში ბლოკები ჯერ არ არის.</p>'}
                    </div>
                </article>`;
        }).join("");
    } catch (error) {
        console.error("Site builder load failed:", error);
        builderList.innerHTML = `<p class="form-status error">კონსტრუქტორის ჩატვირთვა ვერ მოხერხდა. შეამოწმეთ Supabase-ში site_sections და site_blocks ცხრილები. ${escapeHTML(error.message || "")}</p>`;
    }
}

if (builderSectionForm) {
    builderSectionForm.addEventListener("submit", async event => {
        event.preventDefault();
        const title = $("builderSectionTitle")?.value.trim() || "";
        const subtitle = $("builderSectionSubtitle")?.value.trim() || "";
        if (!title) return;
        setStatus(builderSectionStatus, "სექცია ემატება...");
        try {
            const { data: current, error: readError } = await db
                .from("site_sections").select("sort_order").order("sort_order", { ascending: false }).limit(1);
            if (readError) throw readError;
            const sortOrder = (Number(current?.[0]?.sort_order) || 0) + 10;
            const { error } = await db.from("site_sections").insert({
                title, subtitle, sort_order: sortOrder, is_published: true
            });
            if (error) throw error;
            builderSectionForm.reset();
            setStatus(builderSectionStatus, "სექცია დაემატა.", "success");
            await loadSiteBuilder();
        } catch (error) {
            console.error(error);
            setStatus(builderSectionStatus, "ვერ დაემატა. " + (error.message || "შეამოწმეთ ცხრილების კონფიგურაცია."), "error");
        }
    });
}

if (builderList) {
    builderList.addEventListener("click", async event => {
        const button = event.target.closest("button");
        if (!button) return;
        const ask = (message, initial = "") => window.prompt(message, initial);
        try {
            if (button.dataset.builderAddBlock) {
                const sectionId = button.dataset.builderAddBlock;
                const title = ask("ბლოკის სათაური:");
                if (title === null || !title.trim()) return;
                const body = ask("ბლოკის ტექსტი (არასავალდებულო):", "");
                if (body === null) return;
                const imageUrl = ask("ფოტოს საჯარო URL (არასავალდებულო):", "");
                if (imageUrl === null) return;
                const linkUrl = ask("ბმული (არასავალდებულო):", "");
                if (linkUrl === null) return;
                const { data: rows, error: readError } = await db
                    .from("site_blocks").select("sort_order").eq("section_id", sectionId)
                    .order("sort_order", { ascending: false }).limit(1);
                if (readError) throw readError;
                const { error } = await db.from("site_blocks").insert({
                    section_id: sectionId, title: title.trim(), body: body.trim(),
                    image_url: imageUrl.trim() || null, link_url: linkUrl.trim() || null,
                    sort_order: (Number(rows?.[0]?.sort_order) || 0) + 10, is_published: true
                });
                if (error) throw error;
                await loadSiteBuilder();
            } else if (button.dataset.builderEditSection) {
                const id = button.dataset.builderEditSection;
                const { data: row, error: readError } = await db.from("site_sections").select("*").eq("id", id).single();
                if (readError) throw readError;
                const title = ask("სექციის სათაური:", row.title || "");
                if (title === null || !title.trim()) return;
                const subtitle = ask("სექციის მოკლე აღწერა:", row.subtitle || "");
                if (subtitle === null) return;
                const { error } = await db.from("site_sections").update({ title: title.trim(), subtitle: subtitle.trim() }).eq("id", id);
                if (error) throw error;
                await loadSiteBuilder();
            } else if (button.dataset.builderToggleSection) {
                const id = button.dataset.builderToggleSection;
                const next = button.dataset.published !== "true";
                const { error } = await db.from("site_sections").update({ is_published: next }).eq("id", id);
                if (error) throw error;
                await loadSiteBuilder();
            } else if (button.dataset.builderDeleteSection) {
                if (!confirm("წავშალოთ ეს სექცია და მასთან დაკავშირებული ყველა ბლოკი?")) return;
                const { error } = await db.from("site_sections").delete().eq("id", button.dataset.builderDeleteSection);
                if (error) throw error;
                await loadSiteBuilder();
            } else if (button.dataset.builderEditBlock) {
                const id = button.dataset.builderEditBlock;
                const { data: row, error: readError } = await db.from("site_blocks").select("*").eq("id", id).single();
                if (readError) throw readError;
                const title = ask("ბლოკის სათაური:", row.title || "");
                if (title === null || !title.trim()) return;
                const body = ask("ბლოკის ტექსტი:", row.body || "");
                if (body === null) return;
                const imageUrl = ask("ფოტოს საჯარო URL:", row.image_url || "");
                if (imageUrl === null) return;
                const linkUrl = ask("ბმული:", row.link_url || "");
                if (linkUrl === null) return;
                const { error } = await db.from("site_blocks").update({
                    title: title.trim(), body: body.trim(),
                    image_url: imageUrl.trim() || null, link_url: linkUrl.trim() || null
                }).eq("id", id);
                if (error) throw error;
                await loadSiteBuilder();
            } else if (button.dataset.builderToggleBlock) {
                const next = button.dataset.published !== "true";
                const { error } = await db.from("site_blocks").update({ is_published: next }).eq("id", button.dataset.builderToggleBlock);
                if (error) throw error;
                await loadSiteBuilder();
            } else if (button.dataset.builderDeleteBlock) {
                if (!confirm("წავშალოთ ეს ბლოკი?")) return;
                const { error } = await db.from("site_blocks").delete().eq("id", button.dataset.builderDeleteBlock);
                if (error) throw error;
                await loadSiteBuilder();
            }
        } catch (error) {
            console.error("Site builder action failed:", error);
            alert("მოქმედება ვერ შესრულდა: " + (error.message || "შეამოწმეთ Supabase-ის ცხრილები და უფლებები."));
        }
    });
}

/* =========================================================
   FULL SITE CONTENT EDITOR
   Edits keyed static text, image sources/alt text and link URLs.
========================================================= */
const siteContentList = $("siteContentList");
const siteContentStatus = $("siteContentStatus");
const siteContentSearch = $("siteContentSearch");
const siteContentType = $("siteContentType");
let siteContentItems = [];
let siteContentOverrides = new Map();

function contentItemType(item) {
    if (item.tag === "img") return "image";
    if (item.tag === "a") return "link";
    return "text";
}

function getContentLabel(el, index) {
    const section = el.closest("section[id]");
    const sectionName = section?.querySelector("h1,h2,h3")?.textContent?.trim()
        || section?.id || "საიტის საერთო ნაწილი";
    const text = (el.tagName === "IMG" ? (el.getAttribute("alt") || el.getAttribute("src") || "ფოტო") : el.textContent || "")
        .trim().replace(/\s+/g, " ");
    const compact = text.slice(0, 90);
    return `${sectionName} · ${el.tagName.toLowerCase()} · ${compact || `ელემენტი ${index + 1}`}`;
}

async function loadSiteContentEditor() {
    if (!siteContentList || !db) return;
    setStatus(siteContentStatus, "საიტის ელემენტები იტვირთება...");
    siteContentList.innerHTML = '<p class="builder-help">იტვირთება...</p>';
    try {
        const response = await fetch(`index.html?cms_scan=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("index.html ვერ ჩაიტვირთა. გახსენით საიტი ლოკალური სერვერით ან ჰოსტინგიდან.");
        const source = await response.text();
        const parsed = new DOMParser().parseFromString(source, "text/html");
        const elements = Array.from(parsed.querySelectorAll("[data-cms-key]"));
        siteContentItems = elements.map((el, index) => ({
            key: el.getAttribute("data-cms-key"),
            tag: el.tagName.toLowerCase(),
            label: getContentLabel(el, index),
            text: (el.children.length === 0 ? (el.textContent || "").trim() : ""),
            href: el.tagName === "A" ? (el.getAttribute("href") || "") : "",
            src: el.tagName === "IMG" ? (el.getAttribute("src") || "") : "",
            alt: el.tagName === "IMG" ? (el.getAttribute("alt") || "") : ""
        })).filter(item => item.text || item.href || item.src || item.alt);
        const { data, error } = await db.from("site_content").select("key,value");
        if (error) throw error;
        siteContentOverrides = new Map((data || []).map(row => [row.key, row.value]));
        renderSiteContentEditor();
        setStatus(siteContentStatus, `${siteContentItems.length} ელემენტი მზადაა რედაქტირებისთვის.`, "success");
    } catch (error) {
        console.error("Full site content editor failed:", error);
        setStatus(siteContentStatus, "საიტის სრული რედაქტირება ვერ ჩაიტვირთა: " + (error.message || "შეცდომა"), "error");
        siteContentList.innerHTML = '<p class="builder-help">შეამოწმეთ Supabase-ში site_content ცხრილი და SQL setup.</p>';
    }
}

function renderSiteContentEditor() {
    if (!siteContentList) return;
    const q = (siteContentSearch?.value || "").trim().toLocaleLowerCase();
    const type = siteContentType?.value || "all";
    const filtered = siteContentItems.filter(item => {
        const saved = siteContentOverrides.get(item.key) || {};
        const haystack = `${item.label} ${item.text} ${item.href} ${item.src} ${saved.text || ""} ${saved.href || ""} ${saved.src || ""}`.toLocaleLowerCase();
        return (!q || haystack.includes(q)) && (type === "all" || contentItemType(item) === type);
    });
    if (!filtered.length) {
        siteContentList.innerHTML = '<p class="builder-help">შესაბამისი ელემენტი ვერ მოიძებნა.</p>';
        return;
    }
    siteContentList.innerHTML = filtered.map(item => {
        const saved = siteContentOverrides.get(item.key) || {};
        const text = saved.text ?? item.text;
        const href = saved.href ?? item.href;
        const src = saved.src ?? item.src;
        const alt = saved.alt ?? item.alt;
        return `<article class="form-card" data-site-content-card="${escapeHTML(item.key)}" style="display:block;margin-bottom:14px">\n` +
            `<div class="form-card-head"><h4>${escapeHTML(item.label)}</h4><small>${escapeHTML(item.key)}</small></div>\n` +
            `${item.text !== "" ? `<label><span>ტექსტი</span><textarea data-content-field="text" rows="2">${escapeHTML(text)}</textarea></label>` : ""}\n` +
            `${item.tag === "a" ? `<label><span>ბმულის მისამართი</span><input data-content-field="href" value="${escapeHTML(href)}" placeholder="#contact ან https://..." /></label>` : ""}\n` +
            `${item.tag === "img" ? `<label><span>ფოტოს URL</span><input data-content-field="src" value="${escapeHTML(src)}" placeholder="images/photo.jpg ან https://..." /></label><label><span>ახალი ფოტოს ატვირთვა</span><input data-content-file type="file" accept="image/*" /></label><label><span>ფოტოს აღწერა (alt)</span><input data-content-field="alt" value="${escapeHTML(alt)}" /></label>` : ""}\n` +
            `<div class="item-actions" style="justify-content:flex-end;margin-top:10px"><button class="primary-button compact" type="button" data-save-site-content="${escapeHTML(item.key)}">შენახვა</button><button class="secondary-button" type="button" data-reset-site-content="${escapeHTML(item.key)}">საწყისზე დაბრუნება</button></div></article>`;
    }).join("");
}

if (siteContentSearch) siteContentSearch.addEventListener("input", renderSiteContentEditor);
if (siteContentType) siteContentType.addEventListener("change", renderSiteContentEditor);
$("reloadSiteContent")?.addEventListener("click", loadSiteContentEditor);
if (siteContentList) siteContentList.addEventListener("click", async event => {
    const saveButton = event.target.closest("[data-save-site-content]");
    const resetButton = event.target.closest("[data-reset-site-content]");
    const button = saveButton || resetButton;
    if (!button) return;
    const key = button.dataset.saveSiteContent || button.dataset.resetSiteContent;
    const item = siteContentItems.find(entry => entry.key === key);
    if (!item) return;
    try {
        if (resetButton) {
            if (!confirm("დავაბრუნოთ ეს ელემენტი საიტის საწყის ვერსიაზე?")) return;
            const { error } = await db.from("site_content").delete().eq("key", key);
            if (error) throw error;
            siteContentOverrides.delete(key);
        } else {
            const card = button.closest("[data-site-content-card]");
            const value = {};
            card.querySelectorAll("[data-content-field]").forEach(field => value[field.dataset.contentField] = field.value.trim());
            setStatus(siteContentStatus, "ცვლილება ინახება...");
            const imageFile = card.querySelector("[data-content-file]")?.files?.[0];
            if (imageFile) {
                if (!imageFile.type.startsWith("image/")) throw new Error("ატვირთეთ მხოლოდ ფოტოს ფაილი.");
                const uploadedUrl = await uploadFile(imageFile, "site-content");
                if (!uploadedUrl) throw new Error("ფოტოს ატვირთვა ვერ მოხერხდა.");
                value.src = uploadedUrl;
            }
            const { error } = await db.from("site_content").upsert({ key, value }, { onConflict: "key" });
            if (error) throw error;
            siteContentOverrides.set(key, value);
        }
        renderSiteContentEditor();
        setStatus(siteContentStatus, resetButton ? "საწყისი მნიშვნელობა აღდგა." : "შენახულია. საიტზე ცვლილება გამოჩნდება განახლების შემდეგ.", "success");
    } catch (error) {
        console.error("Content save failed:", error);
        setStatus(siteContentStatus, "შენახვა ვერ მოხერხდა: " + (error.message || "შეამოწმეთ Supabase-ის უფლებები."), "error");
    }
});

document.querySelectorAll('[data-panel="siteContentPanel"]').forEach(button => {
    button.addEventListener("click", () => { if (db) loadSiteContentEditor(); });
});

/* =========================================================
   START
========================================================= */


async function startAdmin() {

    try {

        setStatus(
            loginStatus,
            "იტვირთება..."
        );


        db =
            await createSupabaseClient();


        setupNavigation();


        setupFormToggles();


        setupSearchAndFilters();


        setupForms();


        setupAuth();


        await checkSession();


        if (
            !adminApp ||
            adminApp.hidden
        ) {

            setStatus(
                loginStatus,
                ""
            );
        }


        console.log(
            "Criminal Law Center admin loaded successfully."
        );

    } catch (error) {

        console.error(
            "Admin startup error:",
            error
        );


        showLogin(

            error?.message ||

            "ადმინისტრაციული პანელი ვერ ჩაიტვირთა.",

            "error"

        );
    }
}



/* =========================================================
   RUN
========================================================= */


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startAdmin
    );

} else {

    startAdmin();
}