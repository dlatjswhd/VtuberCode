
class VTuberProfile extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('div');
        container.style.textAlign = 'center';

        const avatar = document.createElement('img');
        avatar.src = 'https://via.placeholder.com/150';
        avatar.alt = 'VTuber Avatar';
        avatar.style.width = '150px';
        avatar.style.height = '150px';
        avatar.style.borderRadius = '50%';

        const name = document.createElement('h2');
        name.textContent = this.getAttribute('name');

        const description = document.createElement('p');
        description.textContent = this.getAttribute('description');

        container.appendChild(avatar);
        container.appendChild(name);
        container.appendChild(description);

        shadow.appendChild(container);
    }
}

customElements.define('vtuber-profile', VTuberProfile);

// Placeholder data
const videos = [
    { title: 'Video 1', thumbnail: 'https://via.placeholder.com/300x150' },
    { title: 'Video 2', thumbnail: 'https://via.placeholder.com/300x150' },
    { title: 'Video 3', thumbnail: 'https://via.placeholder.com/300x150' },
];

const schedule = {
    Monday: '10 PM - 12 AM',
    Wednesday: '10 PM - 12 AM',
    Friday: '10 PM - 12 AM',
};

const socialLinks = {
    Twitter: '#',
    YouTube: '#',
    Twitch: '#',
};

// Populate sections
const videoGallery = document.querySelector('.video-gallery');
videos.forEach(video => {
    const videoElement = document.createElement('div');
    videoElement.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" style="width:100%">
        <p>${video.title}</p>
    `;
    videoGallery.appendChild(videoElement);
});

const scheduleContainer = document.querySelector('.schedule-container');
for (const day in schedule) {
    const scheduleElement = document.createElement('div');
    scheduleElement.innerHTML = `<strong>${day}:</strong> ${schedule[day]}`;
    scheduleContainer.appendChild(scheduleElement);
}

const socialLinksContainer = document.querySelector('.social-links');
for (const platform in socialLinks) {
    const linkElement = document.createElement('a');
    linkElement.href = socialLinks[platform];
    linkElement.textContent = platform;
    linkElement.style.margin = '0 10px';
    linkElement.style.color = 'white';
    linkElement.style.textDecoration = 'none';
    socialLinksContainer.appendChild(linkElement);
}
