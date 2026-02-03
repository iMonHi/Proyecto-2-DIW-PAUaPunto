
// Alerta botón Telegram
document.addEventListener("DOMContentLoaded", () => {
    const telegramBtn = document.getElementById("telegramBtn");

    telegramBtn.addEventListener("click", () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Esta página forma parte de un proyecto ficticio. No existe ningún canal de noticias en Telegram de PAUaPunto.",
        });
    });
});

// Fórmula matemática Bach
document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById("calcBtn");
    const result = document.getElementById("result");

    // Convertir a número
    function readNumber(id) {
        const el = document.getElementById(id);
        return Number(el.value);
    }

    // Comprobar que el valor está dentro del rango permitido
    function inRange(n, min, max) {
        return Number.isFinite(n) && n >= min && n <= max;
    }

    calcBtn.addEventListener("click", () => {
        const mb = readNumber('mb');
        const mfo = readNumber('mfo');
        const m1 = readNumber('m1');
        const m2 = readNumber('m2');
        const p1 = readNumber('p1');
        const p2 = readNumber('p2');

        // Validar notas introducidas
        const notasOk =
            inRange(mb, 0, 10) &&
            inRange(mfo, 0, 10) &&
            inRange(m1, 0, 10) &&
            inRange(m2, 0, 10);

        if (!notasOk) {
            result.value = "";
            Swal.fire({
                icon: "error",
                title: "Datos incorrectos",
                text: "Revisa MB, MFO, M1 y M2: deben ser números entre 0 y 10."
                });
            return;
        }

        const nota = (mb * 0.6 + mfo * 0.4) + (m1 * p1) + (m2 * p2);

        result.value = nota.toFixed(2);
    });
});
