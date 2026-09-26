export const profile = {
  name: 'Inuka Asith',
  first: 'Inuka',
  handle: 'inuka',
  github: 'InukaAsith',
  role: 'Full-Stack Developer & UCSC Undergraduate',
  tagline: "Let's build something that defies everything",
  location: 'Sri Lanka',
  email: 'inukaasith7@gmail.com',
  phone: '070 196 4410',
  avatar: '/img/avatar.webp',
  photo: '/img/img-real.webp',
  bio: [
    "I'm a passionate Full-Stack Developer and tech enthusiast who loves learning about technology and creating things I find interesting.",
    'I work across frontend web technologies, scripting, bots and backend design.',
    "Right now I'm focused on my Computer Science degree at UCSC, and building hobby projects whenever I get the time.",
  ],
}

export const socials = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/InukaAsith', user: '@InukaAsith' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/inukaasith', user: 'in/inukaasith' },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/inukaasith7', user: '@inukaasith7' },
  { id: 'email', label: 'Email', url: 'mailto:inukaasith7@gmail.com', user: 'inukaasith7@gmail.com' },
]

export const whatIDo = [
  { ico: 'code', icon: '🧑‍💻', title: 'Back End Development', text: 'Building scalable back end web applications with frameworks like Flask and Django.' },
  { ico: 'script', icon: '📜', title: 'Web Scripting & APIs', text: 'Writing scripts that automate tasks and integrate with web APIs.' },
  { ico: 'bot', icon: '🤖', title: 'Bots & Automation', text: 'Creating bots and automating tasks with Python and other languages.' },
  { ico: 'database', icon: '🗄️', title: 'Database Architecture', text: 'Designing and optimising databases with SQL, MongoDB and PostgreSQL.' },
]

export const skills = {
  Programming: ['C', 'C++', 'Python', 'Java', 'JavaScript'],
  Frontend: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript'],
  Backend: ['Flask', 'Django', 'FastAPI', 'RESTful APIs'],
  Databases: ['MySQL', 'MongoDB', 'SQLAlchemy', 'SQLite'],
}

export const techIcons = [
  ['Python', 'python-original.svg'], ['JavaScript', 'javascript-original.svg'], ['Java', 'java-original.svg'],
  ['C', 'c-original.svg'], ['C++', 'cplusplus-original.svg'], ['HTML', 'html5-original.svg'],
  ['CSS', 'css3-original.svg'], ['Tailwind', 'tailwindcss-original.svg'], ['Flask', 'flask-original.svg'],
  ['Django', 'django-plain.svg'], ['FastAPI', 'fastapi-original.svg'], ['MySQL', 'mysql-original.svg'],
  ['MongoDB', 'mongodb-original.svg'], ['SQLite', 'sqlite-original.svg'], ['SQLAlchemy', 'sqlalchemy-original.svg'],
].map(([name, file]) => ({ name, src: `/img/${file}` }))

export const projects = [
  {
    id: 'chatrooms', name: 'Chatrooms', ico: 'chat', category: 'Featured', repo: 'InukaAsith/Chatrooms',
    stars: 4, forks: 0, image: '/img/chat-project.webp', lang: 'JavaScript', platform: 'Web',
    tags: ['JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Flask'],
    desc: 'A real-time chat app with a modern interface and responsive design.',
    long: 'Interactive web-based chat application with real-time messaging. Rooms, live presence and a clean Tailwind UI backed by a Flask server   built to explore websockets and real-time UX.',
  },
  {
    id: 'portfolio-v1', name: 'Portfolio v1', ico: 'monitor', category: 'Featured', repo: 'InukaAsith/MyPortfolio',
    stars: 0, forks: 0, image: '/img/portfolio-v1-project.webp', lang: 'HTML/CSS', platform: 'Web', color: '#bf5af2', live: 'https://inukaasith.vercel.app/',
    tags: ['HTML', 'CSS', 'Vercel'],
    desc: 'My previous terminal-themed portfolio site.',
    long: 'The first version of my portfolio: a terminal-inspired, hand-written HTML/CSS site with about, projects and contact pages. Open it in Safari on this desktop to see where this one came from.',
  },
  {
    id: 'daisyxmusic', name: 'DaisyXMusic', ico: 'music', category: 'Biggest Hits', repo: 'InukaAsith/DaisyXMusic',
    stars: 205, forks: 807, image: '/img/daisyx-music-project.webp', lang: 'Python', platform: 'Telegram Bot', color: '#ff375f',
    tags: ['Python', 'Telegram', 'PyTgCalls', 'Music Bot'],
    desc: 'Plays music in Telegram group and channel voice chats.',
    long: 'A bot that streams music into Telegram group and channel voice chats. Powered by PyTgCalls with YouTube playback and playlist management. Forked 800+ times by the community.',
  },
  {
    id: 'daisyx', name: 'DaisyX', ico: 'flower', category: 'Biggest Hits', repo: 'InukaAsith/DaisyX',
    stars: 157, forks: 619, image: '/img/bot-project.webp', lang: 'Python', platform: 'Telegram Bot',
    tags: ['Python', 'Telethon', 'MongoDB', 'Heroku'],
    desc: 'Multifunctional group-management bot for Telegram.',
    long: 'A Telegram bot with advanced features for group management and automation   moderation, filters, notes, anti-spam and more. Used across many communities and forked 600+ times.',
  },
  {
    id: 'dtvfree', name: 'DTVfree', ico: 'tv', category: 'Biggest Hits', repo: 'InukaAsith/DTVfree',
    stars: 51, forks: 3, image: '/img/browser-project.webp', lang: 'Java', platform: 'Android TV',
    tags: ['Java', 'Android', 'Android TV'],
    desc: 'A web browser built for Android TV, remote-first.',
    long: 'A simple, functional web browser designed for Android TV: file downloading, a custom home page, remote-first navigation and an on-screen cursor. Browse the web comfortably from your couch.',
  },
  {
    id: 'anonymoussender', name: 'Anonymous Sender', ico: 'incognito', category: 'Learning', repo: 'InukaAsith/AnonymousSender',
    stars: 18, forks: 17, image: '/img/anonymous-project.webp', lang: 'Python', platform: 'Telegram Bot', color: '#5e5ce6',
    tags: ['Python', 'Telethon', 'Telegram API'],
    desc: 'A practice project exploring the Telegram message-sending API.',
    long: 'A practice project exploring the Telegram message-sending API: forward any message anonymously through a bot.',
  },
  {
    id: 'iohelper-c', name: 'iohelper-c', ico: 'thread', category: 'Learning', repo: 'InukaAsith/iohelper-c',
    stars: 1, forks: 0, image: '/img/c-project.webp', lang: 'C', platform: 'Library', color: '#64d2ff',
    tags: ['C', 'Library', 'I/O'],
    desc: 'Dynamic string input for C.',
    long: 'Dynamic string inputs for the C programming language   a small utility library that makes safe string handling in C programs painless.',
  },
  {
    id: 'vimplusplus', name: 'Vim++', ico: 'keyboard', category: 'Learning', repo: 'InukaAsith/Vim-plus-plus',
    stars: 1, forks: 0, lang: 'Vim Script', platform: 'Editor', color: '#30d158',
    tags: ['Vim Script', 'Editor', 'Productivity'],
    desc: 'A VS Code-like Vim setup.',
    long: 'A VS Code-like Vim experience with enhanced features and modern workflow improvements for Vim enthusiasts.',
  },
  {
    id: 'mysql-sample', name: 'MySQL Sample', ico: 'database', category: 'Learning', repo: 'InukaAsith/Mysql_sample',
    stars: 0, forks: 0, image: '/img/db-project.webp', lang: 'Python', platform: 'Database', color: '#ff9f0a',
    tags: ['Python', 'MySQL', 'Database'],
    desc: 'How MySQL works with Python   CRUD basics.',
    long: 'A simple example demonstrating how MySQL works with Python. An educational project covering database connectivity and CRUD operations.',
  },
]

export const education = [
  { year: '2024   Present', title: 'BSc in Computer Science', org: 'University of Colombo School of Computing', text: 'Currently pursuing undergraduate studies in Computer Science.' },
  { year: '2024', title: 'CS50x', org: 'Harvard University', text: "Completed Harvard's intensive introduction to computer science." },
  { year: '2023', title: 'GCE Advanced Level', org: 'Rahula College, Matara', text: "3 A's in the Mathematics stream · Island Rank 101" },
  { year: '2020', title: 'GCE Ordinary Level', org: 'Rahula College, Matara', text: "9 A's" },
]

export const certificates = [
  { year: '2024', title: 'CS50x   Harvard University', text: "Harvard's Introduction to Computer Science: C, Python, SQL, JavaScript, HTML, CSS and more.", image: '/img/certificate.webp', url: 'https://cs50.harvard.edu/certificates/677a8dea-93f8-467e-9f89-7d063f3ebbae', kind: 'Professional certificate' },
  { year: '2025', title: 'IEEEXtreme 25', text: 'Took part in the 25th edition of the IEEEXtreme 24-hour programming competition.', image: '/img/IEEXtreme.webp', url: 'https://certificate.ieeextreme.org/generate-email-certificate/m3z7GJMT7G9f1X', kind: 'Hackathon' },
]

export const achievements = [
  { ico: 'briefcase', icon: '💼', value: '10+', label: 'Projects' },
  { ico: 'star', icon: '⭐', value: '400+', label: 'GitHub Stars' },
  { ico: 'fork', icon: '🔀', value: '1.4k+', label: 'Forks' },
  { ico: 'certificate', icon: '📜', value: '1', label: 'Certificate' },
]

export const interests = [
  { ico: 'rocket', icon: '🚀', title: 'Innovation', text: 'I like building new solutions to problems I find interesting.' },
  { ico: 'puzzle', icon: '🧩', title: 'Problem Solving', text: 'I enjoy complex problems and finding fast, elegant solutions.' },
  { ico: 'laptop', icon: '💻', title: 'Hobbyist Programmer', text: 'Programming is my hobby   whenever I have time, I create stuff.' },
  { ico: 'wrench', icon: '🛠️', title: 'New Technologies', text: 'I love learning cutting-edge tech and making things with it.' },
]

export const beyondCode = [
  { ico: 'film', icon: '🎥', title: 'Movies & Films', text: 'Passionate about cinema and visual storytelling.' },
  { ico: 'book', icon: '📚', title: 'Reading', text: 'Always learning through books and articles.' },
  { ico: 'gamepad', icon: '🎮', title: 'Gaming', text: 'Exploring virtual worlds and strategy games.' },
]

export const wallpapers = [
  { id: 'dynamic', name: 'Golden Gate Dynamic', thumb: '/wall/sunset-thumb.webp', thumb2: '/wall/night-thumb.webp' },
  { id: 'sunset', name: 'Golden Gate Sunset', thumb: '/wall/sunset-thumb.webp' },
  { id: 'night', name: 'Golden Gate Night', thumb: '/wall/night-thumb.webp' },
  { id: 'sequoia', name: 'Sequoia Glow', css: 'radial-gradient(120% 90% at 20% 110%,#ff5f6d 0%,transparent 55%),radial-gradient(90% 80% at 90% 0%,#6a5cff 0%,transparent 60%),linear-gradient(160deg,#1b1045,#3a1c71 45%,#d76d77 80%,#ffaf7b)' },
  { id: 'graphite', name: 'Graphite', css: 'radial-gradient(80% 80% at 70% 20%,#3a3d46 0%,transparent 70%),linear-gradient(180deg,#1c1d22,#0d0e11)' },
]

export const accents = ['#0a84ff', '#bf5af2', '#ff375f', '#ff9f0a', '#ffd60a', '#30d158', '#8e8e93']
