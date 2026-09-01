"use strict";

document.documentElement.classList.add("js");

const siteHeader = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");
const floatingWhatsApp = document.getElementById("floatingWhatsApp");
const consultationForm = document.getElementById("consultationForm");

const WHATSAPP_NUMBER = "995599114141";

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

function openMenu() {
    if (!menuButton || !mainNavigation) return;

    mainNavigation.classList.add("open");
    menuButton.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "მენიუს დახურვა");
    document.body.classList.add("menu-open");
}

function closeMenu() {
    if (!menuButton || !mainNavigation) return;

    mainNavigation.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "მენიუს გახსნა");
    document.body.classList.remove("menu-open");
}

function toggleMenu() {
    if (!mainNavigation) return;

    mainNavigation.classList.contains("open")
        ? closeMenu()
        : openMenu();
}

if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
}

if (mainNavigation) {
    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) {
        closeMenu();
    }
});


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

} else {

    revealItems.forEach((item) => {
        item.classList.add("is-visible");
    });

}


/* =========================================================
   BIOGRAPHY DETAILS
========================================================= */

document.querySelectorAll(".bio-details").forEach((details) => {

    const summaryText =
        details.querySelector("summary span");

    const updateText = () => {

        if (!summaryText) {
            return;
        }

        summaryText.textContent =
            details.open
                ? "სრული ბიოგრაფიის დახურვა"
                : "სრული ბიოგრაფიის გახსნა";

    };

    details.addEventListener(
        "toggle",
        updateText
    );

    updateText();

});


/* =========================================================
   EUROPEAN COURT OF HUMAN RIGHTS LINKS
========================================================= */

const ECHR_ORIGIN =
    ["https:", "", "www.echr.coe.int"].join("/");

document
    .querySelectorAll("[data-echr-path]")
    .forEach((link) => {

        const path =
            link.getAttribute("data-echr-path");

        if (path) {
            link.href =
                `${ECHR_ORIGIN}${path}`;
        }

    });


/* =========================================================
   PAATA SHAVADZE PHOTO FALLBACK
========================================================= */

const paataImage =
    document.querySelector(
        "[data-paata-fallback]"
    );

if (paataImage) {

    paataImage.addEventListener(
        "error",
        () => {

            const fallbackOrigin =
                [
                    "https:",
                    "",
                    "gabo1gvaraka-cyber.github.io"
                ].join("/");

            const fallbackPath =
                "/paata-shavadze-lawyer/images/paata.jpg";

            paataImage.src =
                `${fallbackOrigin}${fallbackPath}`;

        },
        {
            once: true
        }
    );

}


/* =========================================================
   WHATSAPP
========================================================= */

function buildWhatsAppUrl(
    message = ""
) {

    const origin =
        ["https:", "", "wa.me"].join("/");

    const text =
        encodeURIComponent(message);

    return text
        ? `${origin}/${WHATSAPP_NUMBER}?text=${text}`
        : `${origin}/${WHATSAPP_NUMBER}`;

}


/* FLOATING WHATSAPP */

if (floatingWhatsApp) {

    floatingWhatsApp.href =
        buildWhatsAppUrl(
            "გამარჯობა, მსურს თინათინ წერეთლის სახელობის საქართველოს სისხლის სამართლის ეროვნულ ცენტრთან დაკავშირება."
        );

    floatingWhatsApp.target =
        "_blank";

    floatingWhatsApp.rel =
        "noopener noreferrer";

}


/* =========================================================
   CONSULTATION FORM
========================================================= */

if (consultationForm) {

    consultationForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const name =
                document
                    .getElementById(
                        "consultationName"
                    )
                    ?.value
                    .trim() || "";

            const phone =
                document
                    .getElementById(
                        "consultationPhone"
                    )
                    ?.value
                    .trim() || "";

            const message =
                document
                    .getElementById(
                        "consultationMessage"
                    )
                    ?.value
                    .trim() || "";

            const preparedMessage = [

                "გამარჯობა, მსურს სამართლებრივი კონსულტაცია.",

                "",

                `სახელი და გვარი: ${
                    name ||
                    "არ არის მითითებული"
                }`,

                `ტელეფონი: ${
                    phone ||
                    "არ არის მითითებული"
                }`,

                "",

                "საკითხი:",

                message ||
                    "არ არის მითითებული"

            ].join("\n");

            window.open(
                buildWhatsAppUrl(
                    preparedMessage
                ),
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const navLinks =
    Array.from(
        document.querySelectorAll(
            '.main-navigation a[href^="#"]'
        )
    );

const navSections =
    navLinks
        .map((link) => {

            const id =
                link.getAttribute("href");

            return id
                ? document.querySelector(id)
                : null;

        })
        .filter(Boolean);


function updateActiveNavigation() {

    const offset = 150;

    let currentId = "";

    navSections.forEach((section) => {

        if (
            window.scrollY >=
            section.offsetTop - offset
        ) {

            currentId =
                section.id;

        }

    });

    navLinks.forEach((link) => {

        const isActive =
            link.getAttribute("href") ===
            `#${currentId}`;

        link.classList.toggle(
            "active",
            isActive
        );

    });

}


/* =========================================================
   SCROLL STATE
========================================================= */

let scrollTicking = false;

function updateScrollState() {

    const scrollY =
        window.scrollY;

    const pageHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (siteHeader) {

        siteHeader.classList.toggle(
            "scrolled",
            scrollY > 10
        );

    }


    if (backToTop) {

        backToTop.classList.toggle(
            "show",
            scrollY > 650
        );

    }


    if (scrollProgress) {

        const progress =
            pageHeight > 0

                ? Math.min(
                    100,
                    Math.max(
                        0,
                        (scrollY / pageHeight) * 100
                    )
                )

                : 0;

        scrollProgress.style.width =
            `${progress}%`;

    }

    updateActiveNavigation();

}


function requestScrollUpdate() {

    if (scrollTicking) {
        return;
    }

    scrollTicking = true;

    window.requestAnimationFrame(
        () => {

            updateScrollState();

            scrollTicking = false;

        }
    );

}


window.addEventListener(
    "scroll",
    requestScrollUpdate,
    {
        passive: true
    }
);

window.addEventListener(
    "load",
    updateScrollState
);


/* =========================================================
   BACK TO TOP
========================================================= */

if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const selector =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !selector ||
                    selector === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        selector
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                const headerOffset =
                    90;

                const targetTop =
                    target
                        .getBoundingClientRect()
                        .top
                    +
                    window.scrollY
                    -
                    headerOffset;

                window.scrollTo({
                    top: targetTop,
                    behavior: "smooth"
                });

                history.replaceState(
                    null,
                    "",
                    selector
                );

            }
        );

    });


/* =========================================================
   FINAL VISIBILITY SAFEGUARD
========================================================= */

window.setTimeout(
    () => {

        document
            .querySelectorAll(
                ".reveal:not(.is-visible)"
            )
            .forEach((item) => {

                const rect =
                    item.getBoundingClientRect();

                if (
                    rect.top <
                    window.innerHeight *
                    1.15
                ) {

                    item.classList.add(
                        "is-visible"
                    );

                }

            });

    },
    700
);