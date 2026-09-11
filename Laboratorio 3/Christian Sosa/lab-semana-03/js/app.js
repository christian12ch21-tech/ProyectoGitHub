const form = document.getElementById("profileForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const bioInput = document.getElementById("bio");
const counter = document.getElementById("counter");

const result = document.getElementById("result");
const resultName = document.getElementById("resultName");
const resultEmail = document.getElementById("resultEmail");
const resultPhone = document.getElementById("resultPhone");
const resultBio = document.getElementById("resultBio");
const resultWords = document.getElementById("resultWords");
const resultUnicode = document.getElementById("resultUnicode");
const resultHashtags = document.getElementById("resultHashtags");

function normalizeName(name) {
    return name
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map(word => {
            if (word.length === 0) {
                return "";
            }

            return word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase();
        })
        .join(" ");
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailRegex.test(email);
}

function normalizePhone(phone) {
    return phone.replace(/\s+/g, "");
}

function validatePhone(phone) {
    const phoneRegex = /^9\d{8}$/u;
    return phoneRegex.test(phone);
}

function countWords(text) {
    const cleanText = text.trim();

    if (cleanText === "") {
        return 0;
    }

    return cleanText.split(/\s+/u).length;
}

function countUnicodePoints(text) {
    return [...text].length;
}

function extractHashtags(text) {
    const hashtagRegex = /#[\p{L}\p{N}_]+/gu;
    const matches = text.match(hashtagRegex) || [];

    const uniqueHashtags = [...new Set(
        matches.map(tag => tag.toLowerCase())
    )];

    return uniqueHashtags;
}

function updateCounter() {
    counter.textContent = `${bioInput.value.length}/300 unidades UTF-16`;
}

bioInput.addEventListener("input", updateCounter);

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = fullNameInput.value;
    const email = emailInput.value.trim().toLowerCase();
    const phone = normalizePhone(phoneInput.value);
    const bio = bioInput.value;

    if (!validateEmail(email)) {
        alert("El correo electrónico no tiene un formato válido.");
        return;
    }

    if (!validatePhone(phone)) {
        alert("El teléfono debe tener 9 dígitos y comenzar con 9.");
        return;
    }

    const normalizedName = normalizeName(name);
    const words = countWords(bio);
    const unicodePoints = countUnicodePoints(bio);
    const hashtags = extractHashtags(bio);

    resultName.textContent = normalizedName;
    resultEmail.textContent = email;
    resultPhone.textContent = phone;
    resultBio.textContent = bio.trim() || "Sin biografía";
    resultWords.textContent = words;
    resultUnicode.textContent = unicodePoints;

    if (hashtags.length === 0) {
        resultHashtags.textContent = "Ninguno";
    } else {
        resultHashtags.textContent = hashtags.join(", ");
    }

    result.hidden = false;
});

form.addEventListener("reset", function () {
    result.hidden = true;
    updateCounter();
});

updateCounter();
