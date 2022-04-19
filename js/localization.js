// язык по умолчанию
const defaultLocale = "uk";

// текущий язык
let locale;

// перевод на текущем языке
let translations = {};

document.addEventListener("DOMContentLoaded", () => {
    setLocale(defaultLocale);

    bindLocaleSwitcher(defaultLocale);
});

// установка языка по переключателю
function bindLocaleSwitcher(value) {
    const switcher = document.getElementById('switcher');
    switcher.value = value;
    switcher.onchange = (e) => {
        setLocale(e.target.value);
    }
}

// установка языка
function setLocale(newLocale) {
    if (newLocale === locale) { return; }

    if (newLocale === 'uk') {
        translations = uk;
    }
    if (newLocale === 'en') {
        translations = en;
    }
    locale = newLocale;

    translatePage();
    translateTexts();
}

// перевод каждого элемента с отмеченными классами на странице
function translatePage() {
    for (let key of Object.keys(translations)) {
        if (key !== 'texts') {
            translateElements(key);
        }
    }
}

// перевод всех элементов страницы по указанному имени класса
function translateElements(className) {
    let elements = document.getElementsByClassName(className);
    let arr = Array.prototype.slice.call(elements, 0);
    arr.forEach(element => {
        element.textContent = translations[className];
        if (element.tagName === 'IMG') {
            element.src = translations[className];
        }
    });
}
