(() => {
  "use strict";

  const STORAGE_KEY = "northstar-simple-crm-v2";
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const initials = name => String(name || "?").trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();

  const DEMO = {
    settings: { brandName: "DivineSpace", accent: "#6c5ce7", logo: "", demoMode: true },
    contacts: [
      { id: "c1", name: "Maya Reynolds", title: "Operations Director", companyId: "co1", email: "maya@brightpath.io", phone: "(415) 555-0142", city: "San Francisco, CA", status: "Customer" },
      { id: "c2", name: "Ethan Brooks", title: "Founder", companyId: "co2", email: "ethan@cedarlabs.com", phone: "(512) 555-0187", city: "Austin, TX", status: "Prospect" },
      { id: "c3", name: "Olivia Chen", title: "Office Manager", companyId: "co3", email: "olivia@northwindhealth.com", phone: "(617) 555-0123", city: "Boston, MA", status: "Customer" },
      { id: "c4", name: "Marcus Johnson", title: "General Manager", companyId: "co4", email: "marcus@atlasworks.co", phone: "(312) 555-0169", city: "Chicago, IL", status: "Prospect" },
      { id: "c5", name: "Sofia Martinez", title: "Owner", companyId: "co5", email: "sofia@harborandpine.com", phone: "(503) 555-0138", city: "Portland, OR", status: "Lead" },
      { id: "c6", name: "Noah Williams", title: "IT Director", companyId: "co6", email: "noah@summitfreight.com", phone: "(303) 555-0194", city: "Denver, CO", status: "Prospect" }
    ],
    companies: [
      { id: "co1", name: "BrightPath Systems", industry: "Software", size: "51-200", city: "San Francisco, CA", website: "brightpath.io", status: "Customer" },
      { id: "co2", name: "Cedar Labs", industry: "Technology", size: "11-50", city: "Austin, TX", website: "cedarlabs.com", status: "Prospect" },
      { id: "co3", name: "Northwind Health", industry: "Healthcare", size: "201-500", city: "Boston, MA", website: "northwindhealth.com", status: "Customer" },
      { id: "co4", name: "Atlas Works", industry: "Manufacturing", size: "51-200", city: "Chicago, IL", website: "atlasworks.co", status: "Prospect" },
      { id: "co5", name: "Harbor & Pine", industry: "Retail", size: "11-50", city: "Portland, OR", website: "harborandpine.com", status: "Lead" },
      { id: "co6", name: "Summit Freight", industry: "Logistics", size: "201-500", city: "Denver, CO", website: "summitfreight.com", status: "Prospect" }
    ],
    tasks: [
      { id: "t1", kind: "Task", title: "Call Ethan about onboarding", contactId: "c2", companyId: "co2", due: "2026-10-11", details: "Confirm the preferred start date.", done: false },
      { id: "t2", kind: "Note", title: "Maya prefers annual reviews", contactId: "c1", companyId: "co1", due: "", details: "Schedule the next account review for early September.", done: false },
      { id: "t3", kind: "Task", title: "Prepare Northwind account summary", contactId: "c3", companyId: "co3", due: "2026-10-15", details: "Include current contacts and open requests.", done: false },
      { id: "t4", kind: "Note", title: "Atlas Works office hours", contactId: "c4", companyId: "co4", due: "", details: "Best time to reach Marcus is before 10 AM.", done: true },
      { id: "t5", kind: "Task", title: "Update Summit contact details", contactId: "c6", companyId: "co6", due: "2026-10-14", details: "Confirm the new main phone number.", done: false }
    ]
  };

  const cloneDemo = () => JSON.parse(JSON.stringify(DEMO));
  let state;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDemo(); } catch { state = cloneDemo(); }
  ["contacts", "companies", "tasks"].forEach(key => { if (!Array.isArray(state[key])) state[key] = []; });
  state.settings = { ...DEMO.settings, ...(state.settings || {}) };
  // Retain saved records and custom branding while upgrading the former demo name.
  if (state.settings.brandName === "Northstar") state.settings.brandName = DEMO.settings.brandName;

  let activeView = "dashboard";
  let selectedContact = null;
  let selectedCompany = null;
  let modalSubmitHandler = null;
  const root = document.getElementById("viewRoot");
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");

  const headings = {
    dashboard: ["Good morning", "Your relationships and next steps, kept simple."],
    contacts: ["Contacts", "People, details, and context in one clean list."],
    companies: ["Companies", "The organizations connected to your contacts."],
    tasks: ["Tasks / Notes", "Keep the next step and useful context close by."],
    reports: ["Reports", "A practical snapshot of your current records."],
    settings: ["Settings", "Brand the workspace and manage local demo data."],
    how: ["How it works", "A deliberately small CRM with a clear data model."]
  };

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function company(id) { return state.companies.find(item => item.id === id); }
  function contact(id) { return state.contacts.find(item => item.id === id); }
  function task(id) { return state.tasks.find(item => item.id === id); }
  function toast(message) {
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    document.getElementById("toastRegion").appendChild(element);
    setTimeout(() => element.remove(), 2400);
  }

  function setBrand() {
    const { brandName, accent, logo } = state.settings;
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-dark", shadeColor(accent, -18));
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(accent));
    document.getElementById("brandName").textContent = brandName;
    const mark = document.getElementById("brandMark");
    mark.innerHTML = logo ? `<img src="${logo}" alt="${escapeHTML(brandName)} logo">` : escapeHTML(initials(brandName).slice(0, 1));
  }
  function hexToRgb(hex) { const number = parseInt(hex.replace("#", ""), 16); return `${number >> 16},${(number >> 8) & 255},${number & 255}`; }
  function shadeColor(hex, amount) { return "#" + hex.replace("#", "").match(/../g).map(value => Math.max(0, Math.min(255, parseInt(value, 16) + amount)).toString(16).padStart(2, "0")).join(""); }

  function navigate(view) {
    activeView = view;
    document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === view));
    [pageTitle.textContent, pageSubtitle.textContent] = headings[view];
    document.getElementById("sidebar").classList.remove("open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    ({ dashboard: renderDashboard, contacts: renderContacts, companies: renderCompanies, tasks: renderTasks, reports: renderReports, settings: renderSettings, how: renderHow })[activeView]();
  }

  function stat(label, value, meta, tone = "") { return `<div class="card stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-meta ${tone}">${meta}</div></div>`; }
  function empty(title, text) { return `<div class="empty"><strong>${title}</strong><span>${text}</span></div>`; }
  function formatDate(date) { return date ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No due date"; }

  function renderDashboard() {
    const openTasks = state.tasks.filter(item => !item.done);
    const doneTasks = state.tasks.filter(item => item.done);
    const nextTasks = [...openTasks].sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999")).slice(0, 5);
    const recentContacts = state.contacts.slice(-5).reverse();
    root.innerHTML = `
      <section class="grid stats-grid">
        ${stat("Contacts", state.contacts.length, "People in your workspace", "up")}
        ${stat("Companies", state.companies.length, "Connected organizations", "up")}
        ${stat("Open tasks", openTasks.length, openTasks.length ? "Items that need attention" : "All caught up", openTasks.length ? "down" : "up")}
        ${stat("Completed", doneTasks.length, "Tasks and notes finished", "up")}
      </section>
      <section class="grid dashboard-grid">
        <div class="card card-pad"><div class="card-title"><div><h2>Next tasks</h2><p>Open items ordered by due date</p></div><button class="link-btn spacer" data-go="tasks">See all</button></div><div class="task-list">${nextTasks.length ? nextTasks.map(taskRow).join("") : empty("Nothing open", "Add a task or note when you need one.")}</div></div>
        <div class="grid compact-stack">
          <div class="card card-pad"><div class="card-title"><div><h2>Recent contacts</h2><p>Your latest saved people</p></div><button class="link-btn spacer" data-go="contacts">View contacts</button></div><div class="mini-list">${recentContacts.length ? recentContacts.map(item => `<button class="mini-row" data-go-contact="${item.id}"><span class="avatar">${initials(item.name)}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(company(item.companyId)?.name || "No company")}</small></span><b>›</b></button>`).join("") : empty("No contacts yet", "Add your first contact to begin.")}</div></div>
          <div class="card card-pad"><div class="card-title"><div><h2>Quick actions</h2><p>Only the essentials</p></div></div><div class="quick-grid"><button class="quick-card" data-action="add-contact"><strong>＋ Contact</strong><span>Add a person</span></button><button class="quick-card" data-action="add-company"><strong>＋ Company</strong><span>Add an organization</span></button><button class="quick-card" data-action="add-task"><strong>＋ Task / Note</strong><span>Capture a next step</span></button><button class="quick-card" data-action="export-all"><strong>↓ Export</strong><span>Download all records</span></button></div></div>
        </div>
      </section>`;
    bindCommonActions();
  }

  function renderContacts(query = "", status = "All") {
    const needle = query.toLowerCase();
    const filtered = state.contacts.filter(item => `${item.name} ${item.email} ${item.phone} ${company(item.companyId)?.name || ""}`.toLowerCase().includes(needle) && (status === "All" || item.status === status));
    if (!filtered.some(item => item.id === selectedContact)) selectedContact = filtered[0]?.id || null;
    root.innerHTML = `<div class="toolbar"><div class="search-wrap"><input id="contactSearch" value="${escapeHTML(query)}" placeholder="Search name, company, phone, or email" aria-label="Search contacts"></div><select id="contactFilter" aria-label="Filter contacts"><option>All</option>${["Lead", "Prospect", "Customer"].map(option => `<option ${status === option ? "selected" : ""}>${option}</option>`).join("")}</select><button class="btn secondary" data-action="export-contacts">↓ Export CSV</button><button class="btn primary" data-action="add-contact">＋ Add contact</button></div>
      <div class="split-view"><div class="card table-card"><div class="mobile-records">${filtered.map(contactCard).join("")}</div><div class="desktop-table"><table class="data-table"><thead><tr><th>Contact</th><th>Company</th><th>Status</th><th>Location</th><th></th></tr></thead><tbody>${filtered.map(item => `<tr><td><div class="person"><span class="avatar">${initials(item.name)}</span><div><button class="link-btn" data-contact="${item.id}">${escapeHTML(item.name)}</button><div class="sub">${escapeHTML(item.title)}</div></div></div></td><td>${escapeHTML(company(item.companyId)?.name || "Unassigned")}</td><td><span class="pill ${item.status === "Customer" ? "good" : item.status === "Lead" ? "warn" : ""}">${escapeHTML(item.status)}</span></td><td>${escapeHTML(item.city)}</td><td><button class="link-btn" data-contact="${item.id}">View</button></td></tr>`).join("")}</tbody></table></div>${filtered.length ? "" : empty("No contacts found", "Try another search or filter.")}</div>${contactDetail(selectedContact)}</div>`;
    bindCommonActions();
    document.getElementById("contactSearch").addEventListener("input", event => renderContacts(event.target.value, document.getElementById("contactFilter").value));
    document.getElementById("contactFilter").addEventListener("change", event => renderContacts(document.getElementById("contactSearch").value, event.target.value));
    document.querySelectorAll("[data-contact]").forEach(button => button.addEventListener("click", () => { selectedContact = button.dataset.contact; renderContacts(document.getElementById("contactSearch")?.value || "", document.getElementById("contactFilter")?.value || "All"); }));
  }

  function contactCard(item) { return `<button class="record-card" data-contact="${item.id}"><span class="avatar">${initials(item.name)}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(company(item.companyId)?.name || "Unassigned")} · ${escapeHTML(item.status)}</small></span><b>›</b></button>`; }
  function contactDetail(id) {
    const item = contact(id);
    if (!item) return `<aside class="card detail-panel">${empty("Select a contact", "Contact details appear here.")}</aside>`;
    const related = state.tasks.filter(entry => entry.contactId === item.id);
    return `<aside class="card detail-panel"><div class="person detail-heading"><span class="avatar large">${initials(item.name)}</span><div><h2>${escapeHTML(item.name)}</h2><div class="sub">${escapeHTML(item.title)}</div></div></div><div class="detail-list"><div class="detail-item"><span>Company</span><strong>${escapeHTML(company(item.companyId)?.name || "Unassigned")}</strong></div><div class="detail-item"><span>Email</span><strong>${escapeHTML(item.email || "Not provided")}</strong></div><div class="detail-item"><span>Phone</span><strong>${escapeHTML(item.phone || "Not provided")}</strong></div><div class="detail-item"><span>Location</span><strong>${escapeHTML(item.city || "Not provided")}</strong></div><div class="detail-item"><span>Tasks / Notes</span><strong>${related.length}</strong></div></div><div class="detail-actions"><button class="btn secondary" data-action="edit-contact" data-id="${item.id}">Edit</button><button class="btn primary" data-action="add-task" data-contact-id="${item.id}">＋ Task / Note</button></div></aside>`;
  }

  function renderCompanies(query = "", industry = "All") {
    const industries = [...new Set(state.companies.map(item => item.industry).filter(Boolean))].sort();
    const needle = query.toLowerCase();
    const filtered = state.companies.filter(item => `${item.name} ${item.city} ${item.website}`.toLowerCase().includes(needle) && (industry === "All" || item.industry === industry));
    if (!filtered.some(item => item.id === selectedCompany)) selectedCompany = filtered[0]?.id || null;
    root.innerHTML = `<div class="toolbar"><div class="search-wrap"><input id="companySearch" value="${escapeHTML(query)}" placeholder="Search companies, locations, or websites" aria-label="Search companies"></div><select id="companyFilter" aria-label="Filter companies"><option>All</option>${industries.map(option => `<option ${industry === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select><button class="btn secondary" data-action="export-companies">↓ Export CSV</button><button class="btn primary" data-action="add-company">＋ Add company</button></div>
      <div class="split-view"><div class="card table-card"><div class="mobile-records">${filtered.map(companyCard).join("")}</div><div class="desktop-table"><table class="data-table"><thead><tr><th>Company</th><th>Industry</th><th>Size</th><th>Contacts</th><th></th></tr></thead><tbody>${filtered.map(item => `<tr><td><button class="link-btn" data-company="${item.id}">${escapeHTML(item.name)}</button><div class="sub">${escapeHTML(item.city)}</div></td><td>${escapeHTML(item.industry)}</td><td>${escapeHTML(item.size)}</td><td>${state.contacts.filter(person => person.companyId === item.id).length}</td><td><button class="link-btn" data-company="${item.id}">View</button></td></tr>`).join("")}</tbody></table></div>${filtered.length ? "" : empty("No companies found", "Try another search or filter.")}</div>${companyDetail(selectedCompany)}</div>`;
    bindCommonActions();
    document.getElementById("companySearch").addEventListener("input", event => renderCompanies(event.target.value, document.getElementById("companyFilter").value));
    document.getElementById("companyFilter").addEventListener("change", event => renderCompanies(document.getElementById("companySearch").value, event.target.value));
    document.querySelectorAll("[data-company]").forEach(button => button.addEventListener("click", () => { selectedCompany = button.dataset.company; renderCompanies(document.getElementById("companySearch")?.value || "", document.getElementById("companyFilter")?.value || "All"); }));
  }

  function companyCard(item) { return `<button class="record-card" data-company="${item.id}"><span class="avatar square">${initials(item.name)}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.industry)} · ${state.contacts.filter(person => person.companyId === item.id).length} contacts</small></span><b>›</b></button>`; }
  function companyDetail(id) {
    const item = company(id);
    if (!item) return `<aside class="card detail-panel">${empty("Select a company", "Company details appear here.")}</aside>`;
    const people = state.contacts.filter(person => person.companyId === item.id);
    const related = state.tasks.filter(entry => entry.companyId === item.id);
    return `<aside class="card detail-panel"><span class="avatar large square">${initials(item.name)}</span><h2>${escapeHTML(item.name)}</h2><div class="sub">${escapeHTML(item.industry)} · ${escapeHTML(item.size)} employees</div><div class="detail-list"><div class="detail-item"><span>Website</span><strong>${escapeHTML(item.website || "Not provided")}</strong></div><div class="detail-item"><span>Location</span><strong>${escapeHTML(item.city || "Not provided")}</strong></div><div class="detail-item"><span>Status</span><strong>${escapeHTML(item.status)}</strong></div><div class="detail-item"><span>Contacts</span><strong>${people.map(person => escapeHTML(person.name)).join(", ") || "No contacts yet"}</strong></div><div class="detail-item"><span>Tasks / Notes</span><strong>${related.length}</strong></div></div><div class="detail-actions"><button class="btn secondary" data-action="edit-company" data-id="${item.id}">Edit</button><button class="btn primary" data-action="add-contact" data-company-id="${item.id}">＋ Contact</button></div></aside>`;
  }

  function renderTasks(query = "", filter = "Open", kind = "All") {
    const needle = query.toLowerCase();
    const items = state.tasks.filter(item => `${item.title} ${item.details} ${contact(item.contactId)?.name || ""} ${company(item.companyId)?.name || ""}`.toLowerCase().includes(needle) && (filter === "All" || (filter === "Open" ? !item.done : item.done)) && (kind === "All" || item.kind === kind)).sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"));
    root.innerHTML = `<div class="toolbar"><div class="search-wrap"><input id="taskSearch" value="${escapeHTML(query)}" placeholder="Search tasks, notes, people, or companies" aria-label="Search tasks and notes"></div><select id="taskStateFilter" aria-label="Filter by status"><option ${filter === "Open" ? "selected" : ""}>Open</option><option ${filter === "Done" ? "selected" : ""}>Done</option><option ${filter === "All" ? "selected" : ""}>All</option></select><select id="taskKindFilter" aria-label="Filter by type"><option>All</option><option ${kind === "Task" ? "selected" : ""}>Task</option><option ${kind === "Note" ? "selected" : ""}>Note</option></select><button class="btn secondary" data-action="export-tasks">↓ Export CSV</button><button class="btn primary" data-action="add-task">＋ Add task / note</button></div><div class="card card-pad"><div class="card-title"><div><h2>Tasks and notes</h2><p>${items.length} matching ${items.length === 1 ? "item" : "items"}</p></div></div><div class="task-list">${items.length ? items.map(taskRow).join("") : empty("No items found", "Change the filters or add a task or note.")}</div></div>`;
    bindCommonActions();
    const rerender = () => renderTasks(document.getElementById("taskSearch").value, document.getElementById("taskStateFilter").value, document.getElementById("taskKindFilter").value);
    document.getElementById("taskSearch").addEventListener("input", rerender);
    document.getElementById("taskStateFilter").addEventListener("change", rerender);
    document.getElementById("taskKindFilter").addEventListener("change", rerender);
  }

  function taskRow(item) {
    const person = contact(item.contactId);
    const organization = company(item.companyId);
    const context = [person?.name, organization?.name].filter(Boolean).join(" · ") || "General";
    const overdue = !item.done && item.due && item.due < today();
    return `<div class="task-row ${item.done ? "done" : ""}"><button class="check-btn" data-toggle-task="${item.id}" aria-label="${item.done ? "Reopen" : "Complete"} ${escapeHTML(item.kind.toLowerCase())}">${item.done ? "✓" : ""}</button><span class="task-icon">${item.kind === "Note" ? "≡" : "✓"}</span><div class="task-copy"><div><span class="pill">${escapeHTML(item.kind)}</span> <strong>${escapeHTML(item.title)}</strong></div><div class="sub">${escapeHTML(context)}${item.details ? ` · ${escapeHTML(item.details)}` : ""}</div></div><span class="pill ${item.done ? "good" : overdue ? "bad" : ""}">${formatDate(item.due)}</span><button class="icon-action" data-action="edit-task" data-id="${item.id}" aria-label="Edit ${escapeHTML(item.kind.toLowerCase())}">Edit</button><button class="icon-action danger-text" data-delete-task="${item.id}" aria-label="Delete ${escapeHTML(item.kind.toLowerCase())}">Delete</button></div>`;
  }

  function renderReports() {
    const statusRows = ["Lead", "Prospect", "Customer"].map(label => ({ label, count: state.contacts.filter(item => item.status === label).length }));
    const industries = [...new Set(state.companies.map(item => item.industry).filter(Boolean))].map(label => ({ label, count: state.companies.filter(item => item.industry === label).length })).sort((a, b) => b.count - a.count).slice(0, 6);
    const maxStatus = Math.max(...statusRows.map(item => item.count), 1);
    const maxIndustry = Math.max(...industries.map(item => item.count), 1);
    const open = state.tasks.filter(item => !item.done).length;
    const done = state.tasks.filter(item => item.done).length;
    root.innerHTML = `<section class="grid stats-grid">${stat("Contacts", state.contacts.length, "Total people", "up")}${stat("Companies", state.companies.length, "Total organizations", "up")}${stat("Open tasks", open, "Still in progress", open ? "down" : "up")}${stat("Completed", done, "Finished items", "up")}</section><section class="grid report-grid"><div class="card card-pad"><div class="card-title"><div><h2>Contacts by status</h2><p>Your relationship mix</p></div><button class="btn small secondary" data-action="export-contacts">↓ Export</button></div><div class="bar-list">${statusRows.map(item => reportBar(item.label, item.count, maxStatus)).join("")}</div></div><div class="card card-pad"><div class="card-title"><div><h2>Companies by industry</h2><p>Top represented categories</p></div><button class="btn small secondary" data-action="export-companies">↓ Export</button></div><div class="bar-list">${industries.length ? industries.map(item => reportBar(item.label, item.count, maxIndustry)).join("") : empty("No company data", "Add a company to see this report.")}</div></div></section><section class="card card-pad report-summary"><div><span class="eyebrow">Completion snapshot</span><h2>${open + done ? Math.round(done / (open + done) * 100) : 0}% of tasks and notes completed</h2><p>Reports update immediately when records change.</p></div><div class="donut" style="--progress:${open + done ? Math.round(done / (open + done) * 100) : 0}"><strong>${done}</strong><span>done</span></div></section>`;
    bindCommonActions();
  }
  function reportBar(label, count, max) { return `<div class="bar-row"><strong>${escapeHTML(label)}</strong><div class="bar-track"><span style="width:${count / max * 100}%"></span></div><b>${count}</b></div>`; }

  function renderSettings() {
    root.innerHTML = `<div class="grid settings-grid"><section class="card card-pad"><div class="card-title"><div><h2>White label preview</h2><p>Change the workspace name, logo, and accent color</p></div></div><div class="logo-preview"><div class="brand-mark" id="settingsLogo">${state.settings.logo ? `<img src="${state.settings.logo}" alt="Uploaded logo">` : escapeHTML(initials(state.settings.brandName).slice(0, 1))}</div></div><div class="form-group"><label for="brandInput">Workspace name</label><input class="field" id="brandInput" value="${escapeHTML(state.settings.brandName)}" maxlength="30"></div><div class="form-group"><label for="accentInput">Brand color</label><div class="color-row"><input id="accentPicker" type="color" value="${state.settings.accent}"><input class="field" id="accentInput" value="${state.settings.accent}" maxlength="7"></div></div><div class="toolbar"><button class="btn secondary" id="uploadLogo">↑ Upload logo</button>${state.settings.logo ? `<button class="btn secondary" id="removeLogo">Remove logo</button>` : ""}</div></section><section class="card card-pad"><div class="card-title"><div><h2>Demo data and storage</h2><p>Records stay in this browser using localStorage</p></div></div><div class="toggle-row"><div><strong>Demo data</strong><div class="sub">Clear sample records or restore the full sample workspace</div></div><button class="toggle ${state.settings.demoMode ? "on" : ""}" id="demoToggle" aria-label="Toggle demo data"></button></div><div class="toggle-row"><div><strong>Export workspace</strong><div class="sub">Download contacts, companies, tasks, and notes</div></div><button class="btn small secondary" data-action="export-all">Download CSV</button></div><div class="toggle-row"><div><strong>Reset workspace</strong><div class="sub">Restore the original records and brand settings</div></div><button class="btn small danger" id="resetData">Reset all</button></div></section></div>`;
    bindCommonActions();
    bindSettings();
  }

  function bindSettings() {
    const brand = document.getElementById("brandInput");
    const color = document.getElementById("accentInput");
    const picker = document.getElementById("accentPicker");
    brand.addEventListener("input", () => { state.settings.brandName = brand.value.trim() || "CRM"; save(); setBrand(); document.getElementById("settingsLogo").innerHTML = state.settings.logo ? `<img src="${state.settings.logo}" alt="Uploaded logo">` : escapeHTML(initials(state.settings.brandName).slice(0, 1)); });
    const applyColor = value => { if (!/^#[0-9a-f]{6}$/i.test(value)) return; state.settings.accent = value; color.value = value; picker.value = value; save(); setBrand(); };
    color.addEventListener("change", () => applyColor(color.value));
    picker.addEventListener("input", () => applyColor(picker.value));
    document.getElementById("uploadLogo").addEventListener("click", () => document.getElementById("logoUpload").click());
    document.getElementById("removeLogo")?.addEventListener("click", () => { state.settings.logo = ""; save(); setBrand(); renderSettings(); toast("Logo removed"); });
    document.getElementById("demoToggle").addEventListener("click", () => {
      if (state.settings.demoMode) {
        if (!confirm("Clear sample records and keep your brand settings?")) return;
        state.contacts = []; state.companies = []; state.tasks = []; state.settings.demoMode = false;
      } else {
        const brandSettings = { ...state.settings, demoMode: true };
        state = cloneDemo(); state.settings = brandSettings;
      }
      selectedContact = null; selectedCompany = null; save(); renderSettings(); toast(state.settings.demoMode ? "Demo data restored" : "Demo data cleared");
    });
    document.getElementById("resetData").addEventListener("click", () => { if (!confirm("Reset every record and brand setting to the original demo?")) return; state = cloneDemo(); selectedContact = null; selectedCompany = null; save(); setBrand(); renderSettings(); toast("Workspace reset"); });
  }

  function renderHow() {
    const features = [
      ["▦", "Simple relationships", "A company can have many contacts. Tasks and notes can connect to either one, both, or remain general."],
      ["✓", "Tasks and notes", "Capture a next step or useful context, then mark it complete, reopen it, edit it, or delete it."],
      ["⌕", "Fast discovery", "Search contacts, companies, tasks, and notes as you type. Focus lists with practical status, industry, and type filters."],
      ["↗", "Useful reporting", "See contact, company, open task, and completed item counts without adding sales process complexity."],
      ["↓", "CSV ownership", "Export a focused list or the complete workspace to files that open in standard spreadsheet tools."],
      ["◫", "Browser persistence", "localStorage keeps changes on this device after refresh. Demo reset returns the workspace to its sample state."],
      ["⚙", "White label settings", "Change the workspace name, logo, and color. Your selected identity is saved with the rest of the workspace."],
      ["◎", "Easy production upgrade", "A production version can replace localStorage with secure accounts, a database, permissions, backups, and shared access."]
    ];
    root.innerHTML = `<section class="how-hero"><span class="eyebrow">Intentionally simple</span><h2>Keep track of people, organizations, and what comes next.</h2><p>This CRM avoids unnecessary sales tooling. It gives a small business a compact place for contacts, companies, tasks, and notes, with every visible control ready to use.</p><button class="btn primary" data-go="contacts">Explore contacts</button></section><section class="grid how-grid">${features.map(feature => `<article class="card feature-card"><div class="feature-icon">${feature[0]}</div><h3>${feature[1]}</h3><p>${feature[2]}</p></article>`).join("")}</section><section class="card relationship"><div class="card-title"><div><h2>A small connected data model</h2><p>One clear relationship keeps every view consistent</p></div></div><div class="relationship-flow"><div class="relation-node">Company</div><span class="relation-arrow">→</span><div class="relation-node">Contacts</div><span class="relation-arrow">→</span><div class="relation-node">Tasks / Notes</div></div><p class="sub center-note">Tasks and notes may also connect directly to a company or stay general. All records share one browser data store.</p></section><section class="upgrade card"><div><span class="eyebrow">Production path</span><h2>Ready to grow when the business is.</h2><p>Move the same simple model to a hosted database, add authentication and permissions, then enable shared records and backups without changing the core workflow.</p></div><a class="btn secondary" href="../complex/index.html">View complex CRM →</a></section>`;
    bindCommonActions();
  }

  function bindCommonActions() {
    document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
    document.querySelectorAll("[data-go-contact]").forEach(button => button.addEventListener("click", () => { selectedContact = button.dataset.goContact; navigate("contacts"); }));
    document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "add-contact") openContactModal(null, button.dataset.companyId || "");
      if (action === "edit-contact") openContactModal(contact(button.dataset.id));
      if (action === "add-company") openCompanyModal();
      if (action === "edit-company") openCompanyModal(company(button.dataset.id));
      if (action === "add-task") openTaskModal(null, button.dataset.contactId || "", button.dataset.companyId || "");
      if (action === "edit-task") openTaskModal(task(button.dataset.id));
      if (action === "export-all") exportAll();
      if (action.startsWith("export-") && action !== "export-all") exportCSV(action.replace("export-", ""));
    }));
    document.querySelectorAll("[data-toggle-task]").forEach(button => button.addEventListener("click", () => {
      const item = task(button.dataset.toggleTask); if (!item) return;
      const filters = activeView === "tasks" ? [document.getElementById("taskSearch")?.value || "", document.getElementById("taskStateFilter")?.value || "Open", document.getElementById("taskKindFilter")?.value || "All"] : null;
      item.done = !item.done; save(); filters ? renderTasks(...filters) : render(); toast(item.done ? `${item.kind} completed` : `${item.kind} reopened`);
    }));
    document.querySelectorAll("[data-delete-task]").forEach(button => button.addEventListener("click", () => {
      const item = task(button.dataset.deleteTask); if (!item || !confirm(`Delete this ${item.kind.toLowerCase()}?`)) return;
      const filters = activeView === "tasks" ? [document.getElementById("taskSearch")?.value || "", document.getElementById("taskStateFilter")?.value || "Open", document.getElementById("taskKindFilter")?.value || "All"] : null;
      state.tasks = state.tasks.filter(entry => entry.id !== item.id); save(); filters ? renderTasks(...filters) : render(); toast(`${item.kind} deleted`);
    }));
  }

  function openModal(title, eyebrow, body, submitLabel, handler) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalEyebrow").textContent = eyebrow;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalSubmit").textContent = submitLabel;
    modalSubmitHandler = handler;
    const backdrop = document.getElementById("modalBackdrop");
    backdrop.classList.add("open"); backdrop.setAttribute("aria-hidden", "false");
    setTimeout(() => backdrop.querySelector("input,select")?.focus(), 30);
  }
  function closeModal() { const backdrop = document.getElementById("modalBackdrop"); backdrop.classList.remove("open"); backdrop.setAttribute("aria-hidden", "true"); modalSubmitHandler = null; }
  const field = (label, name, type = "text", value = "", extra = "", required = true) => `<div class="form-group"><label for="f-${name}">${label}</label><input class="field" id="f-${name}" name="${name}" type="${type}" value="${escapeHTML(value)}" ${extra} ${required ? "required" : ""}></div>`;
  const selectField = (label, name, options, value = "") => `<div class="form-group"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}">${options.map(option => `<option value="${escapeHTML(option.value ?? option)}" ${(option.value ?? option) === value ? "selected" : ""}>${escapeHTML(option.label ?? option)}</option>`).join("")}</select></div>`;

  function openContactModal(existing = null, companyId = "") {
    const item = existing || { name: "", title: "", companyId, status: "Lead", email: "", phone: "", city: "" };
    const body = `<div class="form-grid">${field("Full name", "name", "text", item.name)}${field("Job title", "title", "text", item.title, "", false)}${selectField("Company", "companyId", [{ value: "", label: "Unassigned" }, ...state.companies.map(entry => ({ value: entry.id, label: entry.name }))], item.companyId)}${selectField("Status", "status", ["Lead", "Prospect", "Customer"], item.status)}${field("Email address", "email", "email", item.email, "", false)}${field("Phone", "phone", "tel", item.phone, "", false)}${field("City and state", "city", "text", item.city, 'placeholder="Austin, TX"', false)}</div>${existing ? `<button type="button" class="btn danger" id="deleteContact">Delete contact</button>` : ""}`;
    openModal(existing ? "Edit contact" : "New contact", existing ? "Update details" : "Add a person", body, existing ? "Save changes" : "Add contact", form => { const data = Object.fromEntries(new FormData(form)); if (existing) Object.assign(existing, data); else { const created = { id: uid("c"), ...data }; state.contacts.push(created); selectedContact = created.id; } save(); closeModal(); render(); toast(existing ? "Contact updated" : "Contact added"); });
    document.getElementById("deleteContact")?.addEventListener("click", () => { if (!confirm("Delete this contact? Related tasks and notes will remain unassigned.")) return; state.contacts = state.contacts.filter(entry => entry.id !== existing.id); state.tasks.forEach(entry => { if (entry.contactId === existing.id) entry.contactId = ""; }); selectedContact = null; save(); closeModal(); render(); toast("Contact deleted"); });
  }

  function openCompanyModal(existing = null) {
    const item = existing || { name: "", industry: "", size: "1-10", city: "", website: "", status: "Lead" };
    const body = `<div class="form-grid">${field("Company name", "name", "text", item.name)}${field("Industry", "industry", "text", item.industry)}${selectField("Company size", "size", ["1-10", "11-50", "51-200", "201-500", "501+"], item.size)}${selectField("Status", "status", ["Lead", "Prospect", "Customer"], item.status)}${field("City and state", "city", "text", item.city, "", false)}${field("Website", "website", "text", item.website, 'placeholder="example.com"', false)}</div>${existing ? `<button type="button" class="btn danger" id="deleteCompany">Delete company</button>` : ""}`;
    openModal(existing ? "Edit company" : "New company", existing ? "Update organization" : "Add an organization", body, existing ? "Save changes" : "Add company", form => { const data = Object.fromEntries(new FormData(form)); if (existing) Object.assign(existing, data); else { const created = { id: uid("co"), ...data }; state.companies.push(created); selectedCompany = created.id; } save(); closeModal(); render(); toast(existing ? "Company updated" : "Company added"); });
    document.getElementById("deleteCompany")?.addEventListener("click", () => { if (!confirm("Delete this company? Contacts, tasks, and notes will remain unassigned.")) return; state.companies = state.companies.filter(entry => entry.id !== existing.id); state.contacts.forEach(entry => { if (entry.companyId === existing.id) entry.companyId = ""; }); state.tasks.forEach(entry => { if (entry.companyId === existing.id) entry.companyId = ""; }); selectedCompany = null; save(); closeModal(); render(); toast("Company deleted"); });
  }

  function openTaskModal(existing = null, contactId = "", companyId = "") {
    const chosenContact = contact(contactId);
    const item = existing || { kind: "Task", title: "", contactId, companyId: companyId || chosenContact?.companyId || "", due: today(), details: "", done: false };
    const body = `<div class="form-grid">${selectField("Type", "kind", ["Task", "Note"], item.kind)}${field("Due date", "due", "date", item.due, "", false)}<div class="full">${field("Title", "title", "text", item.title)}</div>${selectField("Contact", "contactId", [{ value: "", label: "No contact" }, ...state.contacts.map(entry => ({ value: entry.id, label: entry.name }))], item.contactId)}${selectField("Company", "companyId", [{ value: "", label: "No company" }, ...state.companies.map(entry => ({ value: entry.id, label: entry.name }))], item.companyId)}<div class="form-group full"><label for="f-details">Details</label><textarea id="f-details" name="details" rows="4" placeholder="Add useful context">${escapeHTML(item.details)}</textarea></div></div>${existing ? `<button type="button" class="btn danger" id="deleteTask">Delete ${escapeHTML(item.kind.toLowerCase())}</button>` : ""}`;
    openModal(existing ? `Edit ${item.kind.toLowerCase()}` : "New task or note", existing ? "Update item" : "Capture the next step", body, existing ? "Save changes" : "Add item", form => { const data = Object.fromEntries(new FormData(form)); if (existing) Object.assign(existing, data); else state.tasks.push({ id: uid("t"), ...data, done: false }); save(); closeModal(); render(); toast(existing ? "Item updated" : `${data.kind} added`); });
    document.getElementById("deleteTask")?.addEventListener("click", () => { if (!confirm(`Delete this ${existing.kind.toLowerCase()}?`)) return; state.tasks = state.tasks.filter(entry => entry.id !== existing.id); save(); closeModal(); render(); toast(`${existing.kind} deleted`); });
  }

  function exportCSV(type) {
    const rows = state[type] || [];
    if (!rows.length) { toast(`No ${type} to export`); return; }
    const headers = [...new Set(rows.flatMap(Object.keys))];
    const csv = [headers.join(","), ...rows.map(row => headers.map(header => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    download(`${type}.csv`, csv, "text/csv"); toast(`${type[0].toUpperCase() + type.slice(1)} exported`);
  }
  function exportAll() {
    const sections = ["contacts", "companies", "tasks"].map(type => { const rows = state[type]; if (!rows.length) return `# ${type}\n`; const headers = [...new Set(rows.flatMap(Object.keys))]; return `# ${type}\n${headers.join(",")}\n${rows.map(row => headers.map(header => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(",")).join("\n")}`; }).join("\n\n");
    download("divinespace-simple-crm-export.csv", sections, "text/csv"); toast("Workspace exported");
  }
  function download(name, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url); }

  document.getElementById("mainNav").addEventListener("click", event => { const button = event.target.closest("[data-view]"); if (button) navigate(button.dataset.view); });
  document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.add("open"));
  document.getElementById("closeSidebar").addEventListener("click", () => document.getElementById("sidebar").classList.remove("open"));
  document.getElementById("sidebarScrim").addEventListener("click", () => document.getElementById("sidebar").classList.remove("open"));
  document.getElementById("quickContact").addEventListener("click", () => openContactModal());
  document.getElementById("quickTask").addEventListener("click", () => openTaskModal());
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalCancel").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", event => { if (event.target === event.currentTarget) closeModal(); });
  document.getElementById("modalForm").addEventListener("submit", event => { event.preventDefault(); if (modalSubmitHandler) modalSubmitHandler(event.currentTarget); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
  document.getElementById("logoUpload").addEventListener("change", event => { const file = event.target.files[0]; if (!file) return; if (file.size > 1024 * 1024) { toast("Choose an image under 1 MB"); return; } const reader = new FileReader(); reader.onload = () => { state.settings.logo = reader.result; save(); setBrand(); if (activeView === "settings") renderSettings(); toast("Logo updated"); }; reader.readAsDataURL(file); event.target.value = ""; });

  setBrand();
  render();
})();
