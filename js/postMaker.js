
// номер первого абзаца текста на странице
let pageStartParagraph;

// общее количество абзацов на одной странице
let paragraphsCountPage;

// перевод всех найденных текстов
function translateTexts() {
    let allTexts = Object.keys(translations['texts']);
    allTexts.forEach(textName => {
        clearPage(textName);
        calculatePages(textName);
        createPagePost(textName);
        removeNeedlessNavigation('previous-' + textName, 'next-' + textName);
    });
}

// убирает ненужные элементы навигации для страницы (по определенным классам)
// например, классы: 'previous-[выбранный текст из файла]', next-[выбранный текст из файла]
function removeNeedlessNavigation(classNamePrevious, classNameNext) {
    let containerId = classNamePrevious.substring(classNamePrevious.indexOf('-') + 1);

    let elements = document.getElementsByClassName(classNamePrevious);
    let arr = Array.prototype.slice.call(elements, 0);
    arr.forEach(element => {
        if (pageStartParagraph === 1) {
            element.style.display = 'none';
        }
        else {
            element.style.display = 'block';
        }
    });

    containerId = classNameNext.substring(classNameNext.indexOf('-') + 1);

    elements = document.getElementsByClassName(classNameNext);
    arr = Array.prototype.slice.call(elements, 0);
    arr.forEach(element => {
        if ((pageStartParagraph+paragraphsCountPage) > getParagraphsLength(containerId)) {
            element.style.display = 'none';
        }
        else {
            element.style.display = 'block';
        }
    });
}

// создание следующей страницы при нажатии
function nextPage(containerId) {
    if ((pageStartParagraph+paragraphsCountPage) >= 1 && (pageStartParagraph+paragraphsCountPage) <= getParagraphsLength(containerId)) {
        pageStartParagraph += paragraphsCountPage;
        clearPage(containerId);
        createPagePost(containerId);
    }
    removeNeedlessNavigation('previous-' + containerId, 'next-' + containerId);
}

// создание предыдущей страницы при нажатии
function previousPage(containerId) {
    if ((pageStartParagraph-paragraphsCountPage) >= 1 && (pageStartParagraph-paragraphsCountPage) <= getParagraphsLength(containerId)) {
        pageStartParagraph -= paragraphsCountPage;
        clearPage(containerId);
        createPagePost(containerId);
    }
    removeNeedlessNavigation('previous-' + containerId, 'next-' + containerId);
}

// создание самой страницы
function createPagePost(containerId) {
    createTitle(containerId);
    createText(containerId, pageStartParagraph, pageStartParagraph+paragraphsCountPage-1);
}

// расчет количества абзацов на странице
function calculatePages(containerId) {
    let pagesCount;
    let obj = translations['texts'][containerId]["pagesCountPost"];

    if (obj !== null && obj !== undefined) {
        pagesCount = obj;
    }
    else {
        pagesCount = getParagraphsLength(containerId);
    }
    
    let totalLength = getParagraphsLength(containerId);
    paragraphsCountPage = Math.round(totalLength / pagesCount);
    pageStartParagraph = 1;
}

// создание тега h1 для страницы
function createTitle(containerId) {
    let container = document.getElementById(containerId);

    let title = document.createElement('h1');
    title.textContent = translations['texts'][containerId]["title"];
    container.appendChild(title);
}

// создание тегов p (и тегов img, если есть) для страницы
function createText(containerId, startParagraph, endParagraph) {
    let container = document.getElementById(containerId);

    for (i = startParagraph - 1; i < endParagraph; i++) 
    {
        if ((i) in Object.keys(translations['texts'][containerId]["paragraphs"])) 
        {
            let p = document.createElement('p');
            p.innerHTML = translations['texts'][containerId]["paragraphs"][i+1];
            container.appendChild(p);
        }
        
        let obj = translations['texts'][containerId]['images'];
        if (obj !== null && obj !== undefined) 
        {
            let resources = Object.entries(obj);
            for (const [key, value] of resources) {
                let p = value['afterParagraph'];
                
                if ((i+1) === p) {
                    createImage(containerId, key);
                }
            }
        }
    }
}

// создание тега img для страницы
function createImage(containerId, resourceNumber) {
    let container = document.getElementById(containerId);

    let img = document.createElement('img');
    img.alt = translations['texts'][containerId]['images'][resourceNumber]["description"];
    img.src = translations['texts'][containerId]['images'][resourceNumber]["path"];
    container.appendChild(img);
}

// очистка страницы (перед добавлением новой)
function clearPage(containerId) {
    let container = document.getElementById(containerId);
    container.textContent = '';
}

// подсчет количества всех абзацов текста 
function getParagraphsLength(containerId) {
    return Object.keys(translations['texts'][containerId]["paragraphs"]).length;
}