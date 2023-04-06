const themeBtn = document.querySelector('.theme-btn');
const body = document.body;
const localStorageKey = 'theme';
const savedTheme = localStorage.getItem(localStorageKey);

// Set the initial theme based on saved preference or default to light-theme
if (savedTheme) {
    body.classList.add(savedTheme);
    setThemeIcon(savedTheme);
} else {
    body.classList.add('light-theme');
    setThemeIcon('light-theme');
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    if (body.classList.contains('dark-theme')) {
        setThemeIcon('dark-theme');
        localStorage.setItem(localStorageKey, 'dark-theme');
    } else {
        setThemeIcon('light-theme');
        localStorage.setItem(localStorageKey, 'light-theme');
    }
});

// Set the theme icon based on the current theme
function setThemeIcon(theme) {
    const iconLight = themeBtn.querySelector('.material-symbols-sharp:nth-child(1)');
    const iconDark = themeBtn.querySelector('.material-symbols-sharp:nth-child(2)');
    if (theme === 'dark-theme') {
        iconLight.classList.remove('active');
        iconDark.classList.add('active');
    } else {
        iconLight.classList.add('active');
        iconDark.classList.remove('active');
    }
}

// Show or hide sidebar
const menuButton = document.querySelector('#menu-btn');
const closeButton = document.querySelector('#close-btn');
const sidebar = document.querySelector('aside');

function showSidebar() {
    sidebar.style.display = 'block';
}

function hideSidebar() {
    sidebar.style.display = 'none';
}

menuButton.addEventListener('click', showSidebar);
closeButton.addEventListener('click', hideSidebar);