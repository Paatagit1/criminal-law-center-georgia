import { supabase } from "./supabase.js";


// =====================================================
// ELEMENTS
// =====================================================

const loginPage = document.getElementById("loginPage");
const adminPanel = document.getElementById("adminPanel");

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");
const adminEmail = document.getElementById("adminEmail");

const pageTitle = document.getElementById("pageTitle");

const newItemButton = document.getElementById("newItemButton");

const editorPanel = document.getElementById("editorPanel");
const editorTitle = document.getElementById("editorTitle");

const closeEditorButton = document.getElementById("closeEditorButton");
const cancelButton = document.getElementById("cancelButton");

const contentForm = document.getElementById("contentForm");
const dynamicFields = document.getElementById("dynamicFields");

const saveButton = document.getElementById("saveButton");

const itemsContainer = document.getElementById("itemsContainer");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");

const searchInput = document.getElementById("searchInput");

const toast = document.getElementById("toast");

const navigationButtons = document.querySelectorAll(".nav-item");


// =====================================================
// STATE
// =====================================================

let currentSection = "news";

let currentItems = [];

let editingId = null;

let toastTimer;


// =====================================================
// SECTIONS
// =====================================================

const sections = {

  // ===================================================
  // NEWS
  // ===================================================

  news: {

    title: "სიახლეები",

    fields: [

      {
        name: "title_ka",
        label: "სათაური — ქართული",
        type: "text",
        required: true
      },

      {
        name: "title_en",
        label: "Title — English",
        type: "text"
      },

      {
        name: "title_ru",
        label: "Заголовок — Русский",
        type: "text"
      },

      {
        name: "content_ka",
        label: "ტექსტი — ქართული",
        type: "textarea",
        full: true
      },

      {
        name: "content_en",
        label: "Content — English",
        type: "textarea",
        full: true
      },

      {
        name: "content_ru",
        label: "Текст — Русский",
        type: "textarea",
        full: true
      },

      {
        name: "image_url",
        label: "ფოტოს URL",
        type: "url",
        full: true
      },

      {
        name: "published",
        label: "გამოქვეყნებული",
        type: "checkbox"
      }

    ]

  },


  // ===================================================
  // PUBLICATIONS
  // ===================================================

  publications: {

    title: "პუბლიკაციები",

    fields: [

      {
        name: "title_ka",
        label: "სათაური — ქართული",
        type: "text",
        required: true
      },

      {
        name: "title_en",
        label: "Title — English",
        type: "text"
      },

      {
        name: "title_ru",
        label: "Заголовок — Русский",
        type: "text"
      },

      {
        name: "description_ka",
        label: "აღწერა — ქართული",
        type: "textarea",
        full: true
      },

      {
        name: "description_en",
        label: "Description — English",
        type: "textarea",
        full: true
      },

      {
        name: "description_ru",
        label: "Описание — Русский",
        type: "textarea",
        full: true
      },

      {
        name: "author",
        label: "ავტორი",
        type: "text"
      },

      {
        name: "publication_date",
        label: "გამოქვეყნების თარიღი",
        type: "date"
      },

      {
        name: "image_url",
        label: "ფოტოს URL",
        type: "url"
      },

      {
        name: "file_url",
        label: "PDF / ფაილის URL",
        type: "url"
      },

      {
        name: "published",
        label: "გამოქვეყნებული",
        type: "checkbox"
      }

    ]

  },


  // ===================================================
  // VACANCIES
  // ===================================================

  vacancies: {

    title: "ვაკანსიები",

    fields: [

      {
        name: "title_ka",
        label: "ვაკანსიის დასახელება — ქართული",
        type: "text",
        required: true
      },

      {
        name: "title_en",
        label: "Vacancy title — English",
        type: "text"
      },

      {
        name: "title_ru",
        label: "Название вакансии — Русский",
        type: "text"
      },

      {
        name: "description_ka",
        label: "აღწერა — ქართული",
        type: "textarea",
        full: true
      },

      {
        name: "description_en",
        label: "Description — English",
        type: "textarea",
        full: true
      },

      {
        name: "description_ru",
        label: "Описание — Русский",
        type: "textarea",
        full: true
      },

      {
        name: "location",
        label: "ადგილმდებარეობა",
        type: "text"
      },

      {
        name: "deadline",
        label: "განაცხადების ბოლო ვადა",
        type: "date"
      },

      {
        name: "published",
        label: "გამოქვეყნებული",
        type: "checkbox"
      }

    ]

  },


  // ===================================================
  // CASES
  // ===================================================

  cases: {

    title: "საქმეები",

    fields: [

      {
        name: "title_ka",
        label: "საქმის სათაური — ქართული",
        type: "text",
        required: true
      },

      {
        name: "title_en",
        label: "Case title — English",
        type: "text"
      },

      {
        name: "title_ru",
        label: "Название дела — Русский",
        type: "text"
      },

      {
        name: "description_ka",
        label: "საქმის აღწერა — ქართული",
        type: "textarea",
        full: true
      },

      {
        name: "description_en",
        label: "Description — English",
        type: "textarea",
        full: true
      },

      {
        name: "description_ru",
        label: "Описание — Русский",
        type: "textarea",
        full: true
      },

      {
        name: "category",
        label: "საქმის კატეგორია",
        type: "text"
      },

      {
        name: "image_url",
        label: "ფოტოს URL",
        type: "url",
        full: true
      },

      {
        name: "published",
        label: "გამოქვეყნებული",
        type: "checkbox"
      }

    ]

  }

};


// =====================================================
// INITIALIZE
// =====================================================

initialize();


async function initialize() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getSession();


    if (error) {

      console.error(
        "Session error:",
        error
      );

      showLogin();

      return;

    }


    const session =
      data.session;


    if (!session) {

      showLogin();

      return;

    }


    await checkAdmin(
      session
    );

  }

  catch (error) {

    console.error(
      "Initialization error:",
      error
    );

    showLogin();

  }

}


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const emailInput =
      document.getElementById(
        "email"
      );

    const passwordInput =
      document.getElementById(
        "password"
      );


    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;


    loginMessage.textContent =
      "";


    if (!email || !password) {

      loginMessage.textContent =
        "შეავსეთ ელფოსტა და პაროლი.";

      return;

    }


    loginButton.disabled =
      true;


    loginButton.textContent =
      "შესვლა...";


    try {

      const {
        data,
        error
      } =
        await supabase.auth
          .signInWithPassword({

            email: email,

            password: password

          });


      if (error) {

        console.error(
          "Login error:",
          error
        );


        loginMessage.textContent =
          error.message ||
          "ავტორიზაცია ვერ მოხერხდა.";

        return;

      }


      if (!data.session) {

        loginMessage.textContent =
          "სესია ვერ შეიქმნა.";

        return;

      }


      await checkAdmin(
        data.session
      );

    }

    catch (error) {

      console.error(
        "Unexpected login error:",
        error
      );


      loginMessage.textContent =
        error.message ||
        "დაფიქსირდა შეცდომა.";

    }

    finally {

      loginButton.disabled =
        false;


      loginButton.textContent =
        "შესვლა";

    }

  }
);


// =====================================================
// CHECK ADMIN
// =====================================================

async function checkAdmin(
  session
) {

  try {

    const {
      data,
      error
    } =
      await supabase.rpc(
        "is_admin"
      );


    if (error) {

      console.error(
        "is_admin error:",
        error
      );


      await supabase.auth
        .signOut();


      showLogin();


      loginMessage.textContent =
        error.message ||
        "ადმინისტრატორის შემოწმება ვერ მოხერხდა.";

      return;

    }


    if (data !== true) {

      await supabase.auth
        .signOut();


      showLogin();


      loginMessage.textContent =
        "ამ ანგარიშს ადმინისტრატორის უფლება არ აქვს.";

      return;

    }


    adminEmail.textContent =
      session.user.email ||
      "Administrator";


    showAdmin();


    await loadItems();

  }

  catch (error) {

    console.error(
      "Admin verification error:",
      error
    );


    showLogin();


    loginMessage.textContent =
      error.message ||
      "ადმინისტრატორის შემოწმება ვერ მოხერხდა.";

  }

}


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

  loginPage.classList.remove(
    "hidden"
  );


  adminPanel.classList.add(
    "hidden"
  );

}


// =====================================================
// SHOW ADMIN
// =====================================================

function showAdmin() {

  loginPage.classList.add(
    "hidden"
  );


  adminPanel.classList.remove(
    "hidden"
  );

}


// =====================================================
// LOGOUT
// =====================================================

logoutButton.addEventListener(
  "click",
  async () => {

    try {

      const {
        error
      } =
        await supabase.auth
          .signOut();


      if (error) {

        throw error;

      }


      window.location.reload();

    }

    catch (error) {

      console.error(
        "Logout error:",
        error
      );


      showToast(
        error.message ||
        "გასვლა ვერ მოხერხდა.",
        true
      );

    }

  }
);


// =====================================================
// NAVIGATION
// =====================================================

navigationButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      async () => {

        navigationButtons
          .forEach(
            (item) => {

              item.classList.remove(
                "active"
              );

            }
          );


        button.classList.add(
          "active"
        );


        currentSection =
          button.dataset.section;


        pageTitle.textContent =
          sections[
            currentSection
          ].title;


        searchInput.value =
          "";


        closeEditor();


        await loadItems();

      }
    );

  }
);


// =====================================================
// NEW ITEM
// =====================================================

newItemButton.addEventListener(
  "click",
  () => {

    editingId =
      null;


    editorTitle.textContent =
      "ახალი ჩანაწერი";


    buildForm();


    editorPanel.classList.remove(
      "hidden"
    );


    editorPanel.scrollIntoView({

      behavior:
        "smooth",

      block:
        "start"

    });

  }
);


// =====================================================
// CLOSE EDITOR
// =====================================================

closeEditorButton.addEventListener(
  "click",
  closeEditor
);


cancelButton.addEventListener(
  "click",
  closeEditor
);


function closeEditor() {

  editingId =
    null;


  contentForm.reset();


  dynamicFields.innerHTML =
    "";


  editorPanel.classList.add(
    "hidden"
  );

}


// =====================================================
// BUILD FORM
// =====================================================

function buildForm(
  item = null
) {

  dynamicFields.innerHTML =
    "";


  const fields =
    sections[
      currentSection
    ].fields;


  fields.forEach(
    (field) => {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "form-group";


      if (field.full) {

        wrapper.classList.add(
          "full-width"
        );

      }


      // =================================================
      // CHECKBOX
      // =================================================

      if (
        field.type ===
        "checkbox"
      ) {

        wrapper.classList.add(
          "checkbox-group"
        );


        const input =
          document.createElement(
            "input"
          );


        input.type =
          "checkbox";


        input.id =
          field.name;


        input.name =
          field.name;


        if (item) {

          input.checked =
            Boolean(
              item[
                field.name
              ]
            );

        }

        else {

          input.checked =
            true;

        }


        const label =
          document.createElement(
            "label"
          );


        label.setAttribute(
          "for",
          field.name
        );


        label.textContent =
          field.label;


        wrapper.appendChild(
          input
        );


        wrapper.appendChild(
          label
        );


        dynamicFields.appendChild(
          wrapper
        );


        return;

      }


      // =================================================
      // LABEL
      // =================================================

      const label =
        document.createElement(
          "label"
        );


      label.setAttribute(
        "for",
        field.name
      );


      label.textContent =
        field.label;


      let input;


      // =================================================
      // TEXTAREA
      // =================================================

      if (
        field.type ===
        "textarea"
      ) {

        input =
          document.createElement(
            "textarea"
          );

      }

      // =================================================
      // INPUT
      // =================================================

      else {

        input =
          document.createElement(
            "input"
          );


        input.type =
          field.type ||
          "text";

      }


      input.id =
        field.name;


      input.name =
        field.name;


      if (field.required) {

        input.required =
          true;

      }


      if (
        item &&
        item[field.name] !==
          null &&
        item[field.name] !==
          undefined
      ) {

        input.value =
          item[
            field.name
          ];

      }


      wrapper.appendChild(
        label
      );


      wrapper.appendChild(
        input
      );


      dynamicFields.appendChild(
        wrapper
      );

    }
  );

}


// =====================================================
// SAVE ITEM
// =====================================================

contentForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    saveButton.disabled =
      true;


    saveButton.textContent =
      "ინახება...";


    try {

      // =================================================
      // CHECK CURRENT SESSION
      // =================================================

      const {
        data: sessionData,
        error: sessionError
      } =
        await supabase.auth
          .getSession();


      if (sessionError) {

        throw sessionError;

      }


      if (
        !sessionData.session
      ) {

        throw new Error(
          "Admin session არ არსებობს. თავიდან გაიარეთ ავტორიზაცია."
        );

      }


      console.log(
        "Logged in user:",
        sessionData.session.user
      );


      // =================================================
      // CHECK ADMIN AGAIN
      // =================================================

      const {
        data: adminCheck,
        error: adminCheckError
      } =
        await supabase.rpc(
          "is_admin"
        );


      console.log(
        "Admin check:",
        adminCheck
      );


      if (adminCheckError) {

        throw adminCheckError;

      }


      if (
        adminCheck !== true
      ) {

        throw new Error(
          "ამ მომხმარებელს Admin უფლება არ აქვს."
        );

      }


      // =================================================
      // CREATE PAYLOAD
      // =================================================

      const payload = {};


      sections[
        currentSection
      ]
        .fields
        .forEach(
          (field) => {

            const element =
              document.getElementById(
                field.name
              );


            if (!element) {

              return;

            }


            if (
              field.type ===
              "checkbox"
            ) {

              payload[
                field.name
              ] =
                element.checked;

            }

            else {

              const value =
                element.value.trim();


              payload[
                field.name
              ] =
                value === ""
                  ? null
                  : value;

            }

          }
        );


      console.log(
        "Saving to table:",
        currentSection
      );


      console.log(
        "Payload:",
        payload
      );


      let result;


      // =================================================
      // UPDATE
      // =================================================

      if (
        editingId !==
        null
      ) {

        result =
          await supabase
            .from(
              currentSection
            )
            .update(
              payload
            )
            .eq(
              "id",
              editingId
            )
            .select();

      }


      // =================================================
      // INSERT
      // =================================================

      else {

        result =
          await supabase
            .from(
              currentSection
            )
            .insert([
              payload
            ])
            .select();

      }


      console.log(
        "Supabase result:",
        result
      );


      // =================================================
      // ERROR
      // =================================================

      if (result.error) {

        console.error(
          "Save error:",
          result.error
        );


        const errorMessage =
          getErrorMessage(
            result.error
          );


        showToast(
          errorMessage,
          true
        );


        return;

      }


      // =================================================
      // SUCCESS
      // =================================================

      const wasEditing =
        editingId !==
        null;


      console.log(
        "Saved data:",
        result.data
      );


      closeEditor();


      showToast(
        wasEditing
          ? "ჩანაწერი წარმატებით განახლდა."
          : "ჩანაწერი წარმატებით დაემატა."
      );


      await loadItems();

    }

    catch (error) {

      console.error(
        "Unexpected save error:",
        error
      );


      showToast(
        getErrorMessage(
          error
        ),
        true
      );

    }

    finally {

      saveButton.disabled =
        false;


      saveButton.textContent =
        "შენახვა";

    }

  }
);


// =====================================================
// LOAD ITEMS
// =====================================================

async function loadItems() {

  loadingState.classList.remove(
    "hidden"
  );


  emptyState.classList.add(
    "hidden"
  );


  itemsContainer.innerHTML =
    "";


  try {

    const {
      data,
      error
    } =
      await supabase
        .from(
          currentSection
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false
          }
        );


    loadingState.classList.add(
      "hidden"
    );


    if (error) {

      console.error(
        "Load error:",
        error
      );


      showToast(
        getErrorMessage(
          error
        ),
        true
      );


      return;

    }


    currentItems =
      data || [];


    renderItems(
      currentItems
    );

  }

  catch (error) {

    console.error(
      "Unexpected load error:",
      error
    );


    loadingState.classList.add(
      "hidden"
    );


    showToast(
      getErrorMessage(
        error
      ),
      true
    );

  }

}


// =====================================================
// RENDER ITEMS
// =====================================================

function renderItems(
  items
) {

  itemsContainer.innerHTML =
    "";


  if (
    !items ||
    items.length === 0
  ) {

    emptyState.classList.remove(
      "hidden"
    );

    return;

  }


  emptyState.classList.add(
    "hidden"
  );


  items.forEach(
    (item) => {

      // =================================================
      // CARD
      // =================================================

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "item-card";


      // =================================================
      // INFO
      // =================================================

      const information =
        document.createElement(
          "div"
        );


      information.className =
        "item-information";


      // =================================================
      // META
      // =================================================

      const meta =
        document.createElement(
          "div"
        );


      meta.className =
        "item-meta";


      // =================================================
      // STATUS
      // =================================================

      const badge =
        document.createElement(
          "span"
        );


      badge.className =
        item.published
          ? "status-badge published"
          : "status-badge draft";


      badge.textContent =
        item.published
          ? "გამოქვეყნებული"
          : "Draft";


      // =================================================
      // DATE
      // =================================================

      const date =
        document.createElement(
          "span"
        );


      date.className =
        "item-date";


      date.textContent =
        formatDate(
          item.created_at
        );


      meta.appendChild(
        badge
      );


      meta.appendChild(
        date
      );


      // =================================================
      // TITLE
      // =================================================

      const title =
        document.createElement(
          "h4"
        );


      title.className =
        "item-title";


      title.textContent =
        item.title_ka ||
        item.title_en ||
        item.title_ru ||
        "უსათაურო ჩანაწერი";


      // =================================================
      // DESCRIPTION
      // =================================================

      const description =
        document.createElement(
          "p"
        );


      description.className =
        "item-description";


      const descriptionText =
        item.content_ka ||
        item.description_ka ||
        item.content_en ||
        item.description_en ||
        item.category ||
        item.author ||
        item.location ||
        "";


      description.textContent =
        shortenText(
          descriptionText,
          220
        );


      information.appendChild(
        meta
      );


      information.appendChild(
        title
      );


      if (
        descriptionText
      ) {

        information.appendChild(
          description
        );

      }


      // =================================================
      // ACTIONS
      // =================================================

      const actions =
        document.createElement(
          "div"
        );


      actions.className =
        "item-actions";


      // =================================================
      // EDIT BUTTON
      // =================================================

      const editButton =
        document.createElement(
          "button"
        );


      editButton.type =
        "button";


      editButton.className =
        "edit-button";


      editButton.textContent =
        "რედაქტირება";


      editButton.addEventListener(
        "click",
        () => {

          editItem(
            item.id
          );

        }
      );


      // =================================================
      // DELETE BUTTON
      // =================================================

      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.type =
        "button";


      deleteButton.className =
        "delete-button";


      deleteButton.textContent =
        "წაშლა";


      deleteButton.addEventListener(
        "click",
        () => {

          deleteItem(
            item.id
          );

        }
      );


      actions.appendChild(
        editButton
      );


      actions.appendChild(
        deleteButton
      );


      card.appendChild(
        information
      );


      card.appendChild(
        actions
      );


      itemsContainer.appendChild(
        card
      );

    }
  );

}


// =====================================================
// EDIT ITEM
// =====================================================

function editItem(
  id
) {

  const item =
    currentItems.find(
      (entry) =>
        entry.id === id
    );


  if (!item) {

    showToast(
      "ჩანაწერი ვერ მოიძებნა.",
      true
    );

    return;

  }


  editingId =
    id;


  editorTitle.textContent =
    "ჩანაწერის რედაქტირება";


  buildForm(
    item
  );


  editorPanel.classList.remove(
    "hidden"
  );


  editorPanel.scrollIntoView({

    behavior:
      "smooth",

    block:
      "start"

  });

}


// =====================================================
// DELETE ITEM
// =====================================================

async function deleteItem(
  id
) {

  const confirmed =
    window.confirm(
      "ნამდვილად გსურთ ამ ჩანაწერის წაშლა?"
    );


  if (!confirmed) {

    return;

  }


  try {

    const {
      error
    } =
      await supabase
        .from(
          currentSection
        )
        .delete()
        .eq(
          "id",
          id
        );


    if (error) {

      console.error(
        "Delete error:",
        error
      );


      showToast(
        getErrorMessage(
          error
        ),
        true
      );


      return;

    }


    showToast(
      "ჩანაწერი წარმატებით წაიშალა."
    );


    await loadItems();

  }

  catch (error) {

    console.error(
      "Unexpected delete error:",
      error
    );


    showToast(
      getErrorMessage(
        error
      ),
      true
    );

  }

}


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
  "input",
  () => {

    const value =
      searchInput.value
        .trim()
        .toLowerCase();


    if (!value) {

      renderItems(
        currentItems
      );

      return;

    }


    const filteredItems =
      currentItems.filter(
        (item) => {

          const searchable =
            [

              item.title_ka,

              item.title_en,

              item.title_ru,

              item.content_ka,

              item.content_en,

              item.content_ru,

              item.description_ka,

              item.description_en,

              item.description_ru,

              item.author,

              item.category,

              item.location

            ]

              .filter(
                Boolean
              )

              .join(
                " "
              )

              .toLowerCase();


          return searchable.includes(
            value
          );

        }
      );


    renderItems(
      filteredItems
    );

  }
);


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return date.toLocaleDateString(
    "ka-GE",
    {

      year:
        "numeric",

      month:
        "short",

      day:
        "numeric"

    }
  );

}


// =====================================================
// SHORTEN TEXT
// =====================================================

function shortenText(
  text,
  limit
) {

  if (!text) {

    return "";

  }


  const cleanText =
    String(
      text
    ).trim();


  if (
    cleanText.length <=
    limit
  ) {

    return cleanText;

  }


  return (
    cleanText.slice(
      0,
      limit
    ) +
    "..."
  );

}


// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(
  error
) {

  if (!error) {

    return "უცნობი შეცდომა.";

  }


  console.error(
    "Full Supabase error:",
    error
  );


  const parts = [];


  if (
    error.message
  ) {

    parts.push(
      error.message
    );

  }


  if (
    error.details
  ) {

    parts.push(
      error.details
    );

  }


  if (
    error.hint
  ) {

    parts.push(
      "Hint: " +
      error.hint
    );

  }


  if (
    error.code
  ) {

    parts.push(
      "Code: " +
      error.code
    );

  }


  if (
    parts.length === 0
  ) {

    return "დაფიქსირდა უცნობი შეცდომა.";

  }


  return parts.join(
    " | "
  );

}


// =====================================================
// TOAST
// =====================================================

function showToast(
  message,
  isError = false
) {

  clearTimeout(
    toastTimer
  );


  toast.textContent =
    message;


  toast.classList.toggle(
    "error",
    isError
  );


  toast.classList.add(
    "show"
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      6000
    );

}