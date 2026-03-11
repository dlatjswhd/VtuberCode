
const translations = {
    ko: {
        "vtuber-name": "버튜버 이름",
        "nav-about": "정보",
        "nav-videos": "비디오",
        "nav-schedule": "일정",
        "nav-social": "소셜",
        "header-videos": "최신 비디오",
        "header-schedule": "방송 일정",
        "header-social": "팔로우 해주세요!",
        "header-contact": "제휴 문의",
        "label-email": "이메일 주소:",
        "label-message": "문의 내용:",
        "btn-submit": "보내기",
        "vtuber-desc": "버튜버에 대한 간략하고 매력적인 설명입니다.",
        "Monday": "월요일",
        "Wednesday": "수요일",
        "Friday": "금요일",
        "video-title": "비디오",
    },
    en: {
        "vtuber-name": "VTuber Name",
        "nav-about": "About",
        "nav-videos": "Videos",
        "nav-schedule": "Schedule",
        "nav-social": "Social",
        "header-videos": "Latest Videos",
        "header-schedule": "Streaming Schedule",
        "header-social": "Follow Me!",
        "header-contact": "Contact for Business",
        "label-email": "Your Email:",
        "label-message": "Your Message:",
        "btn-submit": "Send",
        "vtuber-desc": "A brief and engaging description of the VTuber.",
        "Monday": "Monday",
        "Wednesday": "Wednesday",
        "Friday": "Friday",
        "video-title": "Video",
    }
};

class VTuberProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['name', 'description'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const nameText = this.getAttribute('name') || '';
        const descText = this.getAttribute('description') || '';

        this.shadowRoot.innerHTML = `
            <style>
                .container { text-align: center; }
                img { width: 150px; height: 150px; border-radius: 50%; }
                h2 { margin-top: 10px; }
            </style>
            <div class="container">
                <img src="https://via.placeholder.com/150" alt="VTuber Avatar">
                <h2>${nameText}</h2>
                <p>${descText}</p>
            </div>
        `;
    }
}

customElements.define('vtuber-profile', VTuberProfile);

const videos = [
    { id: 1, thumbnail: 'https://via.placeholder.com/300x150' },
    { id: 2, thumbnail: 'https://via.placeholder.com/300x150' },
    { id: 3, thumbnail: 'https://via.placeholder.com/300x150' },
];

const scheduleData = {
    Monday: '10 PM - 12 AM',
    Wednesday: '10 PM - 12 AM',
    Friday: '10 PM - 12 AM',
};

const socialLinks = {
    Twitter: '#',
    YouTube: '#',
    Twitch: '#',
};

function updateLanguage(lang) {
    // Update static elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update VTuber Profile
    const profile = document.getElementById('profile');
    if (profile) {
        profile.setAttribute('name', translations[lang]['vtuber-name']);
        profile.setAttribute('description', translations[lang]['vtuber-desc']);
    }

    // Update Videos
    const videoGallery = document.querySelector('.video-gallery');
    videoGallery.innerHTML = '';
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.innerHTML = `
            <img src="${video.thumbnail}" alt="Video" style="width:100%">
            <p>${translations[lang]['video-title']} ${video.id}</p>
        `;
        videoGallery.appendChild(videoElement);
    });

    // Update Schedule
    const scheduleContainer = document.querySelector('.schedule-container');
    scheduleContainer.innerHTML = '';
    for (const day in scheduleData) {
        const scheduleElement = document.createElement('div');
        const translatedDay = translations[lang][day] || day;
        scheduleElement.innerHTML = `<strong>${translatedDay}:</strong> ${scheduleData[day]}`;
        scheduleContainer.appendChild(scheduleElement);
    }

    // Update Social Links (platforms don't change names usually)
    const socialLinksContainer = document.querySelector('.social-links');
    socialLinksContainer.innerHTML = '';
    for (const platform in socialLinks) {
        const linkElement = document.createElement('a');
        linkElement.href = socialLinks[platform];
        linkElement.textContent = platform;
        linkElement.style.margin = '0 10px';
        linkElement.style.color = 'white';
        linkElement.style.textDecoration = 'none';
        socialLinksContainer.appendChild(linkElement);
    }

    localStorage.setItem('preferred-lang', lang);
}

const langSelect = document.getElementById('lang-select');
langSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Initialize language
const savedLang = localStorage.getItem('preferred-lang') || 'en';
langSelect.value = savedLang;
updateLanguage(savedLang);
