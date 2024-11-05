// ОТРАБОТКА МЕНЮ
function toggleMenu() {
    const menu =document.querySelector(".menu-links"); 
    const icon =document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function sendMail() {
    var params = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        message : document.getElementById("message").value
    }

    emailjs
    .send("service_20pigze", "template_jm79tde", params)
    .then((res) => {
       document.getElementById("name").value = "";
       document.getElementById("email").value = "";
       document.getElementById("message").value = "";
       console.log(res);
       alert("Message sent successfully!");
    })
    .catch((err) => console.log(err));
}

// ПРИМЕНЕНИЕ ФИЛЬТРА К КАРТОЧКАМ ПРОЕКТА
// Инициализация MixItUp
const mixer = mixitup('.mixitup-container');

// Обработчик кликов для кнопок фильтров
const filters = document.querySelectorAll('.filter-btn');

filters.forEach(filterBtn => {
    filterBtn.addEventListener('click', () => {
        // Удалить активный класс у всех кнопок
        filters.forEach(btn => btn.classList.remove('active'));
        // Добавить активный класс к нажатой кнопке
        filterBtn.classList.add('active');

        // Получаем id кнопки для фильтрации
        const filterValue = filterBtn.getAttribute('id') === 'all' ? '*' : `.${filterBtn.getAttribute('id')}`;

        // Применяем фильтрацию
        mixer.filter(filterValue);
    });
});


// СМЕНА ТЕМЫ САЙТА
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Проверка сохраненных предпочтений пользователя по теме сайта
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
}

// Обработчик переключения темы
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Сохранение предпочтений пользователя
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark-mode');
    } else {
        localStorage.setItem('theme', '');
    }
});


// ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА САЙТА
document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('langToggle');
    const langText = langToggle.querySelector('.lang-text');
    let currentLang = localStorage.getItem('language') || 'en';

    // Инициализация начального состояния
    updateLanguageUI(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        updateLanguageUI(currentLang);
        localStorage.setItem('language', currentLang);
    });

    function updateLanguageUI(lang) {
        langText.textContent = lang === 'en' ? 'ENG' : 'RUS';
        langToggle.classList.toggle('ru', lang === 'ru');
        
        // Обновление текста на странице
        for (let key in LanguageDataArr) {
            const elements = document.querySelectorAll(`[class*="${key}"]`);
            elements.forEach((element) => {
                if (LanguageDataArr[key][lang]) {
                    element.innerHTML = LanguageDataArr[key][lang];
                }
            });
        }
    }
});