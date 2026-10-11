"use strict";

const SUPABASE_URL =
    "https://oaphygvtdayllubygjut.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_z56PmTmBFKzQD9tviwL7mA_wGeMEe_H";

let db = null;


/* =========================================
   HELPERS
========================================= */

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatDate(value) {
    if (!value) return "";

    try {
        return new Intl.DateTimeFormat(
            "ka-GE",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        ).format(new Date(value));
    } catch {
        return "";
    }
}


async function createClient() {
    const module = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    return module.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}


async function fetchPublished(table) {
    const { data, error } =
        await db
            .from(table)
            .select("*")
            .eq("is_published", true)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {
        console.error(
            `${table} loading error:`,
            error
        );

        return [];
    }

    return data || [];
}


/* =========================================
   NEWS
========================================= */

async function loadNews() {

    const grid =
        document.querySelector(
            ".news-resource-grid"
        );

    if (!grid) {
        console.warn(
            "News grid not found."
        );
        return;
    }

    const data =
        await fetchPublished("news");

    if (!data.length) return;

    grid.innerHTML =
        data.map((item) => {

            const title =
                escapeHTML(
                    item.title || ""
                );

            const description =
                escapeHTML(
                    item.description || ""
                );

            const date =
                formatDate(
                    item.created_at
                );

            return `
                <article class="news-resource-card">

                    ${
                        item.image_url
                            ? `
                                <img
                                    src="${escapeHTML(item.image_url)}"
                                    alt="${title}"
                                    style="
                                        width:100%;
                                        height:220px;
                                        object-fit:cover;
                                        border-radius:18px;
                                        margin-bottom:18px;
                                    "
                                >
                            `
                            : ""
                    }

                    <span class="news-resource-type">
                        ცენტრის სიახლე
                    </span>

                    <h4>
                        ${title}
                    </h4>

                    ${
                        description
                            ? `
                                <p>
                                    ${description}
                                </p>
                            `
                            : ""
                    }

                    <small>
                        ${date || "გამოქვეყნებულია"}
                    </small>

                </article>
            `;
        })
        .join("");
}


/* =========================================
   CASES
========================================= */

async function loadCases() {

    const grid =
        document.querySelector(
            ".case-resource-grid"
        );

    if (!grid) {
        console.warn(
            "Cases grid not found."
        );
        return;
    }

    const data =
        await fetchPublished(
            "cases"
        );

    if (!data.length) return;

    grid.innerHTML =
        data.map((item) => {

            const title =
                escapeHTML(
                    item.title || ""
                );

            const description =
                escapeHTML(
                    item.description || ""
                );

            const category =
                escapeHTML(
                    item.category ||
                    "სისხლის სამართალი"
                );

            const result =
                escapeHTML(
                    item.result || ""
                );

            return `
                <article class="case-resource-card">

                    ${
                        item.image_url
                            ? `
                                <img
                                    src="${escapeHTML(item.image_url)}"
                                    alt="${title}"
                                    style="
                                        width:100%;
                                        height:230px;
                                        object-fit:cover;
                                        border-radius:18px;
                                        margin-bottom:18px;
                                    "
                                >
                            `
                            : ""
                    }

                    <div class="case-resource-top">

                        <span class="case-resource-type">
                            ${category}
                        </span>

                    </div>

                    <h4>
                        ${title}
                    </h4>

                    ${
                        description
                            ? `
                                <p>
                                    ${description}
                                </p>
                            `
                            : ""
                    }

                    ${
                        result
                            ? `
                                <p>
                                    <strong>
                                        შედეგი:
                                    </strong>

                                    ${result}
                                </p>
                            `
                            : ""
                    }

                </article>
            `;
        })
        .join("");
}


/* =========================================
   CREATE EXTRA PUBLIC SECTIONS
========================================= */

function createDynamicSections() {

    const main =
        document.querySelector(
            "main"
        );

    if (!main) return;


    let wrapper =
        document.getElementById(
            "dynamicContentSections"
        );


    if (!wrapper) {

        wrapper =
            document.createElement(
                "div"
            );

        wrapper.id =
            "dynamicContentSections";


        const contact =
            document.getElementById(
                "contact"
            );


        if (
            contact &&
            contact.parentNode
        ) {

            contact.parentNode.insertBefore(
                wrapper,
                contact
            );

        } else {

            main.appendChild(
                wrapper
            );
        }
    }


    if (
        !document.getElementById(
            "vacancies"
        )
    ) {

        wrapper.insertAdjacentHTML(
            "beforeend",
            `
            <section
                class="section dynamic-public-section"
                id="vacancies"
            >

                <div class="container">

                    <div class="section-heading">

                        <div>

                            <p class="eyebrow dark">
                                <span></span>
                                შესაძლებლობები
                            </p>

                            <h2 class="section-title">
                                ვაკანსიები
                            </h2>

                        </div>

                        <p class="section-intro">
                            ცენტრის მიმდინარე ვაკანსიები
                            და პროფესიული შესაძლებლობები.
                        </p>

                    </div>

                    <div
                        class="dynamic-public-grid"
                        id="vacanciesGrid"
                    ></div>

                </div>

            </section>
            `
        );
    }


    if (
        !document.getElementById(
            "publications"
        )
    ) {

        wrapper.insertAdjacentHTML(
            "beforeend",
            `
            <section
                class="section dynamic-public-section"
                id="publications"
            >

                <div class="container">

                    <div class="section-heading">

                        <div>

                            <p class="eyebrow dark">
                                <span></span>
                                სამეცნიერო საქმიანობა
                            </p>

                            <h2 class="section-title">
                                პუბლიკაციები
                            </h2>

                        </div>

                        <p class="section-intro">
                            ცენტრის სტატიები,
                            კვლევები და პროფესიული
                            პუბლიკაციები.
                        </p>

                    </div>

                    <div
                        class="dynamic-public-grid"
                        id="publicationsGrid"
                    ></div>

                </div>

            </section>
            `
        );
    }
}


/* =========================================
   VACANCIES
========================================= */

async function loadVacancies() {

const grid =
    document.querySelector(
        "#vacancies .vacancies-grid, [data-supabase-grid='vacancies'], #vacanciesGrid"
    );

if (!grid) {
    console.warn("Vacancies grid not found.");
    return;
}

    const data =
        await fetchPublished(
            "vacancies"
        );

    if (!data.length) {

        grid.innerHTML = `
            <div class="dynamic-empty">
                ამ ეტაპზე აქტიური ვაკანსია არ არის.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        data.map((item) => {

            const title =
                escapeHTML(
                    item.title || ""
                );

            const description =
                escapeHTML(
                    item.description || ""
                );

            const date =
                formatDate(
                    item.created_at
                );

            return `
                <article class="dynamic-public-card">

                    ${
                        item.image_url
                            ? `
                                <img
                                    src="${escapeHTML(item.image_url)}"
                                    alt="${title}"
                                >
                            `
                            : ""
                    }

                    <div class="dynamic-public-card-body">

                        <span class="dynamic-label">
                            ვაკანსია
                        </span>

                        <h3>
                            ${title}
                        </h3>

                        ${
                            description
                                ? `
                                    <p>
                                        ${description}
                                    </p>
                                `
                                : ""
                        }

                        ${
                            date
                                ? `
                                    <small>
                                        ${date}
                                    </small>
                                `
                                : ""
                        }

                    </div>

                </article>
            `;
        })
        .join("");
}


/* =========================================
   PUBLICATIONS
========================================= */

async function loadPublications() {

   const grid =
    document.querySelector(
        "#publications .publications-grid, [data-supabase-grid='publications'], #publicationsGrid"
    );

if (!grid) {
    console.warn("Publications grid not found.");
    return;
}
    const data =
        await fetchPublished(
            "publications"
        );


    if (!data.length) {

        grid.innerHTML = `
            <div class="dynamic-empty">
                ამ ეტაპზე პუბლიკაცია არ არის.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        data.map((item) => {

            const title =
                escapeHTML(
                    item.title || ""
                );

            const description =
                escapeHTML(
                    item.description || ""
                );

            const fileUrl =
                item.file_url
                    ? escapeHTML(
                        item.file_url
                    )
                    : "";


            return `
                <article class="dynamic-public-card">

                    ${
                        item.image_url
                            ? `
                                <img
                                    src="${escapeHTML(item.image_url)}"
                                    alt="${title}"
                                >
                            `
                            : ""
                    }

                    <div class="dynamic-public-card-body">

                        <span class="dynamic-label">
                            პუბლიკაცია
                        </span>

                        <h3>
                            ${title}
                        </h3>

                        ${
                            description
                                ? `
                                    <p>
                                        ${description}
                                    </p>
                                `
                                : ""
                        }

                        ${
                            fileUrl
                                ? `
                                    <a
                                        class="dynamic-file-button"
                                        href="${fileUrl}"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        დოკუმენტის გახსნა →
                                    </a>
                                `
                                : ""
                        }

                    </div>

                </article>
            `;
        })
        .join("");
}


/* =========================================
   STYLES
========================================= */

function addDynamicStyles() {

    if (
        document.getElementById(
            "dynamicSupabaseStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "dynamicSupabaseStyles";


    style.textContent = `

        .dynamic-public-section {
            position: relative;
        }


        .dynamic-public-grid {
            display: grid;
            grid-template-columns:
                repeat(
                    3,
                    minmax(0, 1fr)
                );
            gap: 24px;
            margin-top: 30px;
        }


        .dynamic-public-card {
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #dce6f3;
            border-radius: 22px;
            box-shadow:
                0 16px 38px
                rgba(7, 27, 51, 0.10);
        }


        .dynamic-public-card > img {
            display: block;
            width: 100%;
            height: 230px;
            object-fit: cover;
        }


        .dynamic-public-card-body {
            padding: 24px;
        }


        .dynamic-label {
            display: inline-block;
            margin-bottom: 12px;
            padding: 6px 10px;
            border-radius: 999px;
            background: #edf4ff;
            color: #1759aa;
            font-size: 12px;
            font-weight: 800;
        }


        .dynamic-public-card img {
            width: 100%;
            height: 220px;
            margin-bottom: 18px;
            border-radius: 14px;
            object-fit: cover;
        }


        .dynamic-public-card h3 {
            margin: 0 0 14px;
            color: #071b33;
            font-size: 21px;
            line-height: 1.4;
        }


        .dynamic-public-card p {
            margin: 0;
            color: #64748b;
            line-height: 1.75;
        }


        .dynamic-public-card small {
            display: block;
            margin-top: 16px;
            color: #8492a6;
        }


        .dynamic-file-button {
            display: inline-block;
            margin-top: 20px;
            padding: 11px 16px;
            border-radius: 11px;
            background: #1554b0;
            color: #ffffff;
            text-decoration: none;
            font-weight: 800;
        }


        .dynamic-empty {
            grid-column: 1 / -1;
            padding: 28px;
            border: 1px dashed #c8d6e8;
            border-radius: 18px;
            background: #ffffff;
            color: #6c7b90;
            text-align: center;
        }


        @media (max-width: 950px) {

            .dynamic-public-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }
        }


        @media (max-width: 650px) {

            .dynamic-public-grid {
                grid-template-columns: 1fr;
            }
        }
    `;


    document.head.appendChild(
        style
    );
}



/* =========================================
   ADMIN-MANAGED SITE BUILDER SECTIONS
========================================= */
async function loadBuilderSections() {
    const main = document.querySelector("main");
    if (!main || !db) return;
    const { data: sections, error } = await db
        .from("site_sections")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
    if (error) {
        // This table is installed through supabase-setup.sql; legacy site content still loads without it.
        console.info("Optional site builder sections are unavailable:", error.message);
        return;
    }
    if (!sections?.length) return;

    const { data: blocks, error: blockError } = await db
        .from("site_blocks")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
    if (blockError) {
        console.warn("Site builder blocks could not be loaded:", blockError.message);
        return;
    }

    let wrapper = document.getElementById("dynamicBuilderSections");
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "dynamicBuilderSections";
        const contact = document.getElementById("contact");
        if (contact?.parentNode) contact.parentNode.insertBefore(wrapper, contact);
        else main.appendChild(wrapper);
    }

    wrapper.innerHTML = sections.map(section => {
        const sectionBlocks = (blocks || []).filter(block => String(block.section_id) === String(section.id));
        const cards = sectionBlocks.map(block => {
            const title = escapeHTML(block.title || "");
            const body = escapeHTML(block.body || "");
            const image = safePublicUrl(block.image_url);
            const link = safePublicUrl(block.link_url);
            const card = `
                <article class="dynamic-public-card">
                    ${image ? `<img src="${escapeHTML(image)}" alt="${title}" loading="lazy">` : ""}
                    ${title ? `<h3>${title}</h3>` : ""}
                    ${body ? `<p>${body.replace(/\r?\n/g, "<br>")}</p>` : ""}
                    ${link ? `<a class="dynamic-file-button" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">დეტალურად ↗</a>` : ""}
                </article>`;
            return card;
        }).join("");
        return `
            <section class="section dynamic-public-section dynamic-builder-section">
                <div class="container">
                    <div class="section-heading">
                        <div><p class="eyebrow dark"><span></span> ცენტრის მასალები</p><h2 class="section-title">${escapeHTML(section.title || "")}</h2></div>
                        ${section.subtitle ? `<p class="section-intro">${escapeHTML(section.subtitle)}</p>` : ""}
                    </div>
                    <div class="dynamic-public-grid">${cards || '<p class="dynamic-empty">მასალა მალე დაემატება.</p>'}</div>
                </div>
            </section>`;
    }).join("");
}

function safePublicUrl(value) {
    if (!value) return "";
    try {
        const url = new URL(value, window.location.href);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

/* =========================================
   START
========================================= */

async function startSupabasePublic() {

    try {

        db =
            await createClient();


        addDynamicStyles();


        createDynamicSections();


        await Promise.all([

            loadNews(),

            loadCases(),

            loadVacancies(),

            loadPublications(),
            loadBuilderSections()

        ]);


        console.log(
            "All public Supabase content loaded."
        );

    } catch (error) {

        console.error(
            "Supabase public startup error:",
            error
        );
    }
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startSupabasePublic
    );

} else {

    startSupabasePublic();
}

/* =========================================
   STATIC SITE CONTENT OVERRIDES
   Requires public.site_content with key + jsonb value.
========================================= */
async function loadStaticSiteContentOverrides() {
    try {
        if (!db) db = await createClient();
        const { data, error } = await db.from("site_content").select("key,value");
        if (error) throw error;
        const values = new Map((data || []).map(row => [row.key, row.value || {}]));
        document.querySelectorAll("[data-cms-key]").forEach(el => {
            const value = values.get(el.getAttribute("data-cms-key"));
            if (!value) return;
            if (Object.prototype.hasOwnProperty.call(value, "text") && el.children.length === 0) el.textContent = value.text;
            if (el.tagName === "A" && Object.prototype.hasOwnProperty.call(value, "href")) el.setAttribute("href", value.href);
            if (el.tagName === "IMG") {
                if (Object.prototype.hasOwnProperty.call(value, "src") && value.src) el.setAttribute("src", value.src);
                if (Object.prototype.hasOwnProperty.call(value, "alt")) el.setAttribute("alt", value.alt);
            }
        });
    } catch (error) {
        console.warn("Static site content overrides not loaded:", error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadStaticSiteContentOverrides, { once: true });
} else {
    loadStaticSiteContentOverrides();
}
