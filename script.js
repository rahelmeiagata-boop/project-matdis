const examples = [
    {
        expr: "A ∨ ¬A",
        type: "Tautologi",
        desc: "Setiap kemungkinan menghasilkan nilai benar."
    },
    {
        expr: "A ∧ ¬A",
        type: "Kontradiksi",
        desc: "Setiap kemungkinan menghasilkan nilai salah."
    },
    {
        expr: "A ∧ B",
        type: "Kontingensi",
        desc: "Hasil bergantung pada nilai A dan B."
    },
    {
        expr: "A → B",
        type: "Kontingensi",
        desc: "Implikasi hanya salah saat A benar dan B salah."
    },
    {
        expr: "A ↔ B",
        type: "Kontingensi",
        desc: "Benar ketika kedua proposisi memiliki nilai sama."
    },
    {
        expr: "(A ∨ B) ∧ C",
        type: "Kontingensi",
        desc: "Gabungan OR dan AND dengan tiga variabel."
    }
];

let history = [];

let stats = {
    total: 0,
    tautology: 0,
    contradiction: 0,
    contingency: 0
};

const expressionInput = document.getElementById("expression");


// ===============================
// NORMALISASI EKSPRESI
// ===============================

function normalize(s) {
    return s
        .replace(/\s+/g, "")
        .replace(/!/g, "¬")
        .replace(/\~/g, "¬")
        .replace(/&&/g, "∧")
        .replace(/\|\|/g, "∨");
}


// ===============================
// MENCARI VARIABEL
// ===============================

function variablesOf(expr) {
    return [
        ...new Set(
            (expr.match(/[A-Za-z]/g) || [])
        )
    ].sort();
}


// ===============================
// MEMBUAT SEMUA KOMBINASI NILAI
// ===============================

function combinations(n) {
    const out = [];
    const total = 2 ** n;

    for (let i = 0; i < total; i++) {
        const row = [];

        for (let bit = n - 1; bit >= 0; bit--) {
            row.push(Boolean((i >> bit) & 1));
        }

        out.push(row);
    }

    return out;
}


// ===============================
// MENGHILANGKAN KURUNG TERLUAR
// ===============================

function stripOuter(s) {

    while (s.startsWith("(") && s.endsWith(")")) {

        let depth = 0;
        let closesAt = -1;

        for (let i = 0; i < s.length; i++) {

            if (s[i] === "(") {
                depth++;
            }

            if (s[i] === ")") {
                depth--;

                if (depth === 0) {
                    closesAt = i;
                    break;
                }
            }
        }

        if (closesAt === s.length - 1) {
            s = s.slice(1, -1);
        } else {
            break;
        }
    }

    return s;
}


// ===============================
// MENCARI OPERATOR UTAMA
// ===============================

function findMainOperator(s, ops) {

    let depth = 0;

    for (let i = s.length - 1; i >= 0; i--) {

        if (s[i] === ")") {
            depth++;
        }

        else if (s[i] === "(") {
            depth--;
        }

        else if (depth === 0 && ops.includes(s[i])) {
            return i;
        }
    }

    return -1;
}


// ===============================
// MENGHITUNG NILAI EKSPRESI
// ===============================

function evaluate(expr, ctx) {

    let s = stripOuter(expr);

    if (!s) {
        throw new Error("Ekspresi kosong");
    }

    // Negasi
    if (s[0] === "¬") {
        return !evaluate(s.slice(1), ctx);
    }

    // Bikondisional
    let idx = findMainOperator(s, ["↔"]);

    if (idx !== -1) {
        return (
            evaluate(s.slice(0, idx), ctx) ===
            evaluate(s.slice(idx + 1), ctx)
        );
    }

    // Implikasi
    idx = findMainOperator(s, ["→"]);

    if (idx !== -1) {
        return (
            !evaluate(s.slice(0, idx), ctx) ||
            evaluate(s.slice(idx + 1), ctx)
        );
    }

    // Disjungsi
    idx = findMainOperator(s, ["∨"]);

    if (idx !== -1) {
        return (
            evaluate(s.slice(0, idx), ctx) ||
            evaluate(s.slice(idx + 1), ctx)
        );
    }

    // Konjungsi
    idx = findMainOperator(s, ["∧"]);

    if (idx !== -1) {
        return (
            evaluate(s.slice(0, idx), ctx) &&
            evaluate(s.slice(idx + 1), ctx)
        );
    }

    // Variabel
    if (/^[A-Za-z]$/.test(s)) {
        return Boolean(ctx[s]);
    }

    throw new Error("Format ekspresi tidak dikenali");
}


// ===============================
// MENENTUKAN KLASIFIKASI
// ===============================

function classify(results) {

    const allTrue = results.every(Boolean);
    const allFalse = results.every(v => !v);

    if (allTrue) {
        return "tautology";
    }

    if (allFalse) {
        return "contradiction";
    }

    return "contingency";
}


// ===============================
// LABEL KLASIFIKASI
// ===============================

function label(type) {

    if (type === "tautology") {
        return "TAUTOLOGI";
    }

    if (type === "contradiction") {
        return "KONTRADIKSI";
    }

    return "KONTINGENSI";
}


// ===============================
// PENJELASAN HASIL
// ===============================

function explain(type) {

    if (type === "tautology") {
        return "Ekspresi termasuk tautologi karena seluruh kombinasi nilai kebenaran menghasilkan nilai benar.";
    }

    if (type === "contradiction") {
        return "Ekspresi termasuk kontradiksi karena seluruh kombinasi nilai kebenaran menghasilkan nilai salah.";
    }

    return "Ekspresi termasuk kontingensi karena terdapat kombinasi yang menghasilkan nilai benar dan nilai salah.";
}


// ===============================
// PROSES ANALISIS
// ===============================

function analyze() {

    const raw = expressionInput.value.trim();

    if (!raw) {
        alert("Masukkan ekspresi logika terlebih dahulu.");
        return;
    }

    const expr = normalize(raw);

    const vars = variablesOf(expr);

    if (!vars.length) {
        alert("Gunakan minimal satu variabel seperti A atau B.");
        return;
    }

    if (vars.length > 4) {
        alert("Maksimal 4 variabel untuk versi project ini.");
        return;
    }

    let rows = [];
    let results = [];

    try {

        combinations(vars.length).forEach(vals => {

            const ctx = {};

            vars.forEach((v, i) => {
                ctx[v] = vals[i];
            });

            const result = evaluate(expr, ctx);

            rows.push({
                vals,
                result
            });

            results.push(result);
        });

    } catch (e) {

        alert(
            "Ekspresi belum valid. Gunakan operator ¬, ∧, ∨, →, ↔ dan tanda kurung."
        );

        return;
    }

    const type = classify(results);

    renderTable(vars, expr, rows);
    renderResult(type, results);
    renderDetails(vars, expr, rows);
    addHistory(expr, type);
}


// ===============================
// MENAMPILKAN TABEL KEBENARAN
// ===============================

function renderTable(vars, expr, rows) {

    const table = document.getElementById("truthTable");

    table.innerHTML = `
        <thead>
            <tr>
                ${vars.map(v => `<th>${v}</th>`).join("")}
                <th>${expr}</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement("tbody");

    rows.forEach(row => {

        const tr = document.createElement("tr");

        row.vals.forEach(v => {

            const td = document.createElement("td");

            td.textContent = v ? "1" : "0";
            td.className = v ? "true" : "false";

            tr.appendChild(td);
        });

        const td = document.createElement("td");

        td.textContent = row.result ? "1" : "0";
        td.className = row.result ? "true" : "false";

        tr.appendChild(td);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    document.getElementById("rowCount").textContent =
        `${rows.length} baris`;
}


// ===============================
// MENAMPILKAN HASIL
// ===============================

function renderResult(type, results) {

    const trueCount = results.filter(Boolean).length;
    const falseCount = results.length - trueCount;

    const tp = Math.round(
        (trueCount / results.length) * 100
    );

    const fp = 100 - tp;

    const badge = document.getElementById("resultBadge");

    badge.className = `result-badge ${type}`;

    document.getElementById("classification").textContent =
        label(type);

    document.getElementById("explanation").textContent =
        explain(type);

    document.getElementById("truePercent").textContent =
        `${tp}%`;

    document.getElementById("falsePercent").textContent =
        `${fp}%`;

    document.getElementById("trueBar").style.width =
        `${tp}%`;

    document.getElementById("falseBar").style.width =
        `${fp}%`;

    const icon =
        type === "tautology"
            ? "✓"
            : type === "contradiction"
                ? "×"
                : "◐";

    document.querySelector(".badge-symbol").textContent =
        icon;

    stats.total++;
    stats[type]++;

    updateStats();
}


// ===============================
// DETAIL ANALISIS
// ===============================

function renderDetails(vars, expr, rows) {

    const results = rows.map(r => r.result);

    const trueCount = results.filter(Boolean).length;
    const falseCount = results.length - trueCount;

    const opNames = [];

    if (expr.includes("¬")) {
        opNames.push("NOT");
    }

    if (expr.includes("∧")) {
        opNames.push("AND");
    }

    if (expr.includes("∨")) {
        opNames.push("OR");
    }

    if (expr.includes("→")) {
        opNames.push("IMPLIKASI");
    }

    if (expr.includes("↔")) {
        opNames.push("BIKONDISIONAL");
    }

    document.getElementById("analysisDetails").innerHTML = `
        <div class="detail-item">
            <small>Variabel</small>
            <strong>${vars.join(", ")}</strong>
        </div>

        <div class="detail-item">
            <small>Total kombinasi</small>
            <strong>${rows.length}</strong>
        </div>

        <div class="detail-item">
            <small>Operator</small>
            <strong>${opNames.join(", ") || "-"}</strong>
        </div>

        <div class="detail-item">
            <small>Nilai benar</small>
            <strong>${trueCount}</strong>
        </div>

        <div class="detail-item">
            <small>Nilai salah</small>
            <strong>${falseCount}</strong>
        </div>

        <div class="detail-item">
            <small>Validasi</small>
            <strong>✓ Berhasil</strong>
        </div>
    `;
}


// ===============================
// MEMPERBARUI STATISTIK
// ===============================

function updateStats() {

    document.getElementById("statTotal").textContent =
        stats.total;

    document.getElementById("statTautology").textContent =
        stats.tautology;

    document.getElementById("statContradiction").textContent =
        stats.contradiction;

    document.getElementById("statContingency").textContent =
        stats.contingency;
}


// ===============================
// RIWAYAT ANALISIS
// ===============================

function addHistory(expr, type) {

    history.unshift({
        expr,
        type,
        time: new Date().toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )
    });

    history = history.slice(0, 10);

    renderHistory();
}


function renderHistory() {

    const box = document.getElementById("historyList");

    if (!history.length) {

        box.innerHTML =
            '<div class="empty">Belum ada analisis.</div>';

        return;
    }

    box.innerHTML = history.map(item => `
        <div class="history-row">

            <div>
                <div class="history-expression">
                    ${item.expr}
                </div>

                <div class="history-time">
                    ${item.time}
                </div>
            </div>

            <span class="history-class ${item.type}">
                ${label(item.type)}
            </span>

        </div>
    `).join("");
}


// ===============================
// MENAMPILKAN CONTOH
// ===============================

function renderExamples() {

    document.getElementById("quickExamples").innerHTML =
        examples.slice(0, 4).map(x => `
            <button
                class="quick-chip"
                data-expr="${x.expr}">
                ${x.expr}
            </button>
        `).join("");

    document.getElementById("exampleCards").innerHTML =
        examples.map(x => `
            <article class="example-card">

                <span class="tag">
                    ${x.type}
                </span>

                <h3>${x.expr}</h3>

                <p>${x.desc}</p>

                <button data-expr="${x.expr}">
                    Gunakan Ekspresi →
                </button>

            </article>
        `).join("");

    document
        .querySelectorAll("[data-expr]")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                expressionInput.value =
                    btn.dataset.expr;

                showPage("analyzer");

                analyze();
            });

        });
}


// ===============================
// PINDAH HALAMAN
// ===============================

function showPage(id) {

    document
        .querySelectorAll(".page-section")
        .forEach(s =>
            s.classList.add("hidden")
        );

    document
        .getElementById(id)
        .classList.remove("hidden");

    document
        .querySelectorAll(".nav-item")
        .forEach(n =>
            n.classList.toggle(
                "active",
                n.dataset.target === id
            )
        );
}


// ===============================
// NAVIGASI
// ===============================

document
    .querySelectorAll(".nav-item")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => showPage(btn.dataset.target)
        );

    });


// ===============================
// TOMBOL OPERATOR
// ===============================

document
    .querySelectorAll(".op-btn")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            const op = btn.dataset.op;

            const start =
                expressionInput.selectionStart;

            const end =
                expressionInput.selectionEnd;

            const value =
                expressionInput.value;

            const needsSpace =
                ["∧", "∨", "→", "↔"].includes(op);

            const insert =
                needsSpace
                    ? ` ${op} `
                    : op;

            expressionInput.value =
                value.slice(0, start) +
                insert +
                value.slice(end);

            expressionInput.focus();

            const pos =
                start + insert.length;

            expressionInput.setSelectionRange(
                pos,
                pos
            );
        });

    });


// ===============================
// TOMBOL ANALISIS
// ===============================

document
    .getElementById("analyzeBtn")
    .addEventListener(
        "click",
        analyze
    );


// Tekan Enter untuk menganalisis

expressionInput.addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            analyze();
        }

    }
);


// ===============================
// ATUR ULANG SEMUA
// ===============================

document
    .getElementById("clearAll")
    .addEventListener("click", () => {

        expressionInput.value = "";

        history = [];

        stats = {
            total: 0,
            tautology: 0,
            contradiction: 0,
            contingency: 0
        };

        updateStats();
        renderHistory();

    });


// ===============================
// HAPUS RIWAYAT
// ===============================

document
    .getElementById("clearHistory")
    .addEventListener(
        "click",
        () => {

            history = [];

            renderHistory();

        }
    );


// ===============================
// CONTOH ACAK
// ===============================

document
    .getElementById("randomExample")
    .addEventListener(
        "click",
        () => {

            const item =
                examples[
                Math.floor(
                    Math.random() *
                    examples.length
                )
                ];

            expressionInput.value =
                item.expr;

            analyze();

        }
    );


// ===============================
// JALANKAN SAAT WEBSITE DIBUKA
// ===============================

renderExamples();

renderHistory();