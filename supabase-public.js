"use strict";

const PUBLIC_SUPABASE_URL =
    "https://oaphygvtdayllubygjut.supabase.co";

const PUBLIC_SUPABASE_KEY =
    "sb_publishable_z56PmTmBFKzQD9tviwL7mA_wGeMEe_H";

function escapePublicHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatPublicDate(value) {
    if (!value) return "";

    try {
        return new Intl.DateTimeFormat("ka-GE", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(new Date(value));
    } catch {
        return "";
    }
}

function getPublicSupabaseClient() {
    if (!window.supabase) {
        console.error("Supabase library is not loaded.");
        return null;
    }

    return window.supabase.createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_KEY
    );
}

async function loadNews() {
    const db = getPublicSupabaseClient();
    if (!db) return;

    const newsSection =
        document.getElementById("news");

    if (!newsSection) {
        console.error("News section not found.");
        return;
    }

    const grid =
        newsSection.querySelector(".news-resource-grid");

    if (!grid) {
        console.error("News grid not found.");
        return;
    }

    const { data, error } = await db
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error(
            "News loading error:",
            error
        );
        return;
    }

    if (!data || data.length === 0) {
        console.log("No published news found.");
        return;
    }

    grid.innerHTML = data
        .map((item) => {

            const title =
                escapePublicHTML(
                    item.title || ""
                );

            const description =
                escapePublicHTML(
                    item.description || ""
                );

            const date =
                formatPublicDate(
                    item.created_at
                );

            const image = item.image_url
                ? `
                    <img
                        src="${escapePublicHTML(item.image_url)}"
                        alt="${title}"
                        loading="lazy"
                        style="
                            width:100%;
                            height:220px;
                            object-fit:cover;
                            margin-bottom:20px;
                        "
                    >
                `
                : "";

            return `
                <article class="news-resource-card">

                    ${image}

                    <span class="news-resource-type">
                        ცენტრის სიახლე
                    </span>

                    <h4>
                        ${title}
                    </h4>

                    ${
                        description
                            ? `<p>${description}</p>`
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

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadNews();
    }
);