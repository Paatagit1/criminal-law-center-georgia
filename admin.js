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
        "პუბლიკაციები"

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