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

// filters

const filters = document.querySelectorAll('.filter-btn');

filters.forEach(filterBtn => {
    filterBtn.addEventListener('click', () => {
        let id = filterBtn.getAttribute('id');
        let projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            if(card.getAttribute('data-tags').includes(id)){
                card.classList.remove('hide');
            } else{
                card.classList.add('hide');
            }
        })

        filters.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
    })
})



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

// Код для переключения языка
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