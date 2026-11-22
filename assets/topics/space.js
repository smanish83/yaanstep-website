/* Yaanstep Sprouts topic: Sun, moon and stars. Original drawings, written 22 Nov 2026. */
(window.YS_TOPICS = window.YS_TOPICS || {})['space'] = {
  id: 'space',
  name: 'Sun, moon and stars',
  ages: '5-8',
  blurb: 'Meet the Sun, the Moon, the stars and the eight planets, and fly into space with a rocket.',
  intro: 'Look up! Earth is one of eight planets that go around the Sun. Let us explore space.',
  items: [
    {
      id: 'sun',
      name: 'sun',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6" stroke="#f7a541" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="32" r="16" fill="#f7c948" stroke="#f7a541" stroke-width="2"/><circle cx="26" cy="29" r="2.4" fill="#17332c"/><circle cx="38" cy="29" r="2.4" fill="#17332c"/><path d="M25 37q7 6 14 0" stroke="#17332c" stroke-width="2" fill="none"/>',
      say: 'The Sun is a star. It gives us light and heat.',
      move: 'bounce',
      group: 'star'
    },
    {
      id: 'moon',
      name: 'moon',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="21" fill="#e6e3d8" stroke="#b9b4a5" stroke-width="2"/><circle cx="24" cy="24" r="5" fill="#cfcabb"/><circle cx="40" cy="38" r="7" fill="#cfcabb"/><circle cx="38" cy="20" r="3" fill="#cfcabb"/><circle cx="22" cy="40" r="3.5" fill="#cfcabb"/>',
      say: 'The Moon goes around Earth. It shines with light from the Sun.',
      move: 'float'
    },
    {
      id: 'earth',
      name: 'Earth',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="22" fill="#3d8fd1" stroke="#17332c" stroke-width="2"/><path d="M18 18c6-4 12-2 12 4s-6 6-4 12-6 6-10 2-6-14 2-18zM38 14c6 0 12 6 12 12-4 2-6-2-10 0s-6-4-4-8zM36 38c4-2 10 0 10 4s-4 8-8 8-6-8-2-12z" fill="#5cb83f"/><path d="M24 50h10M40 30h8" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>',
      say: 'We live on Earth, the third planet from the Sun. It has land, water and air.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'stars',
      name: 'stars',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><polygon points="20.0,8.0 23.2,15.6 31.4,16.3 25.1,21.7 27.1,29.7 20.0,25.4 12.9,29.7 14.9,21.7 8.6,16.3 16.8,15.6" fill="#f7d548" stroke="#f7a541" stroke-width="1.5"/><polygon points="46.0,21.0 48.4,26.7 54.6,27.2 49.9,31.3 51.3,37.3 46.0,34.0 40.7,37.3 42.1,31.3 37.4,27.2 43.6,26.7" fill="#f7d548" stroke="#f7a541" stroke-width="1.5"/><polygon points="24.0,41.0 25.9,45.5 30.7,45.8 27.0,49.0 28.1,53.7 24.0,51.1 19.9,53.7 21.0,49.0 17.3,45.8 22.1,45.5" fill="#f7d548" stroke="#f7a541" stroke-width="1.5"/><circle cx="50" cy="10" r="1.5" fill="#ffffff"/><circle cx="54" cy="52" r="1.5" fill="#ffffff"/><circle cx="8" cy="36" r="1.2" fill="#ffffff"/>',
      say: 'Stars are giant balls of hot, glowing gas. They look tiny because they are very far away.',
      move: 'wiggle',
      group: 'star'
    },
    {
      id: 'mercury',
      name: 'Mercury',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="14" fill="#a9a39a" stroke="#17332c" stroke-width="2"/><circle cx="27" cy="27" r="3" fill="#8c867c"/><circle cx="37" cy="35" r="4" fill="#8c867c"/><circle cx="28" cy="38" r="2" fill="#8c867c"/>',
      say: 'Mercury is the planet closest to the Sun. It is the smallest planet.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'venus',
      name: 'Venus',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="18" fill="#efcf7d" stroke="#17332c" stroke-width="2"/><path d="M18 26q14-6 28 0M16 34q16 4 32-2M20 42q12-4 24 0" stroke="#d9a94e" stroke-width="3" fill="none" stroke-linecap="round"/>',
      say: 'Venus is the second planet from the Sun. It is the hottest planet.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'mars',
      name: 'Mars',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="18" fill="#d2552f" stroke="#17332c" stroke-width="2"/><path d="M25 17q7-4 14 0q-7 3-14 0z" fill="#ffffff"/><circle cx="26" cy="32" r="4" fill="#a8401f"/><circle cx="38" cy="38" r="3" fill="#a8401f"/><circle cx="40" cy="26" r="2.5" fill="#a8401f"/>',
      say: 'Mars is called the red planet. It is covered in red dust and rocks.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="24" fill="#e8c59a" stroke="#17332c" stroke-width="2"/><ellipse cx="32" cy="18" rx="18.0" ry="3" fill="#c98a5a"/><ellipse cx="32" cy="27" rx="22.0" ry="3" fill="#b8754a"/><ellipse cx="32" cy="37" rx="22.0" ry="2.5" fill="#c98a5a"/><ellipse cx="32" cy="46" rx="18.0" ry="2.5" fill="#b8754a"/><ellipse cx="40" cy="42" rx="5" ry="3" fill="#d6453d" stroke="#a8401f" stroke-width="1"/>',
      say: 'Jupiter is the biggest planet. It has a giant storm called the Great Red Spot.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><g transform="rotate(-18 32 32)"><path d="M4 32A28 8 0 0 1 60 32" stroke="#e8d7a0" stroke-width="4" fill="none"/><circle cx="32" cy="32" r="14" fill="#e8c77a" stroke="#17332c" stroke-width="2"/><ellipse cx="32" cy="27" rx="11.6" ry="2" fill="#d9a94e"/><ellipse cx="32" cy="36" rx="11.9" ry="2" fill="#d9a94e"/><path d="M4 32A28 8 0 0 0 60 32" stroke="#e8d7a0" stroke-width="4" fill="none"/></g>',
      say: 'Saturn has bright rings. The rings are made of ice and rock.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><ellipse cx="32" cy="32" rx="4" ry="27" stroke="#c8f0f2" stroke-width="1.5" fill="none" transform="rotate(8 32 32)"/><circle cx="32" cy="32" r="17" fill="#9fe3e8" stroke="#17332c" stroke-width="2"/><path d="M28 17q-3 15 0 30" stroke="#86d3da" stroke-width="3" fill="none"/>',
      say: 'Uranus is a cold, blue-green planet. It spins tipped over on its side.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'neptune',
      name: 'Neptune',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><circle cx="32" cy="32" r="17" fill="#3b5fd9" stroke="#17332c" stroke-width="2"/><ellipse cx="26" cy="28" rx="5" ry="3" fill="#24399a"/><path d="M20 38q10 3 22-1M30 22h10" stroke="#a9c4ff" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
      say: 'Neptune is the planet farthest from the Sun. It is cold, blue and very windy.',
      move: 'spin',
      group: 'planet'
    },
    {
      id: 'rocket',
      name: 'rocket',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><path d="M26 50q6 14 12 0z" fill="#f7a541"/><path d="M29 50q3 7 6 0z" fill="#f7d548"/><path d="M24 38l-8 12h8zM40 38l8 12h-8z" fill="#d6453d" stroke="#17332c" stroke-width="2"/><path d="M32 6c-8 8-9 20-8 44h16c1-24 0-36-8-44z" fill="#f4f4f4" stroke="#17332c" stroke-width="2"/><path d="M27 16h10c-1-4-3-7-5-10-2 3-4 6-5 10z" fill="#d6453d"/><circle cx="32" cy="28" r="5" fill="#4bb3e8" stroke="#17332c" stroke-width="2"/>',
      say: 'A rocket blasts off into space. It can carry astronauts and machines.',
      move: 'bounce'
    },
    {
      id: 'astronaut',
      name: 'astronaut',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><rect x="16" y="26" width="6" height="16" rx="3" fill="#b8c4cc" stroke="#17332c" stroke-width="2"/><rect x="21" y="30" width="22" height="20" rx="5" fill="#f4f4f4" stroke="#17332c" stroke-width="2"/><path d="M21 34l-9-6M43 34l9-6" stroke="#f4f4f4" stroke-width="6" stroke-linecap="round"/><path d="M21 34l-9-6M43 34l9-6" stroke="#17332c" stroke-width="1" fill="none"/><path d="M26 50v8M38 50v8" stroke="#f4f4f4" stroke-width="7" stroke-linecap="round"/><rect x="27" y="36" width="10" height="6" rx="1" fill="#4bb3e8"/><circle cx="32" cy="20" r="12" fill="#f4f4f4" stroke="#17332c" stroke-width="2"/><circle cx="32" cy="20" r="8.5" fill="#c68642"/><circle cx="29" cy="19" r="1.4" fill="#17332c"/><circle cx="35" cy="19" r="1.4" fill="#17332c"/><path d="M29 23q3 2.5 6 0" stroke="#17332c" stroke-width="1.5" fill="none"/><path d="M26 14q3-3 7-3" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>',
      say: 'An astronaut is a person who travels to space. In a spaceship, astronauts float.',
      move: 'float'
    },
    {
      id: 'comet',
      name: 'comet',
      art: '<rect width="64" height="64" rx="10" fill="#1d2550"/><circle cx="8" cy="10" r="1" fill="#ffffff"/><circle cx="56" cy="8" r="1.2" fill="#ffffff"/><circle cx="54" cy="56" r="1" fill="#ffffff"/><circle cx="10" cy="54" r="1.2" fill="#ffffff"/><path d="M44 40L8 8M44 40L4 22M44 40L22 4" stroke="#7fd3f5" stroke-width="6" stroke-linecap="round" opacity="0.6"/><path d="M44 40L12 14M44 40L18 10" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/><circle cx="45" cy="41" r="8" fill="#e9f7fd" stroke="#7fd3f5" stroke-width="2"/>',
      say: 'A comet is a ball of ice and dust. Near the Sun, it grows a long, glowing tail.',
      move: 'drive'
    }
  ],
  questions: [
    { q: 'Which planet do we live on?', ans: ['earth'], pool: ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'], hint: 'We live on Earth, the third planet from the Sun.' },
    { q: 'Which is the biggest planet?', ans: ['jupiter'], pool: ['mercury', 'venus', 'earth', 'mars', 'saturn', 'uranus', 'neptune'], hint: 'Jupiter is the biggest planet of all.' },
    { q: 'Which planet has bright rings?', ans: ['saturn'], pool: ['mercury', 'venus', 'earth', 'mars'], hint: 'Saturn has big, bright rings of ice and rock.' },
    { q: 'Which is the red planet?', ans: ['mars'], pool: ['mercury', 'venus', 'earth', 'jupiter', 'saturn', 'uranus', 'neptune'], hint: 'Mars is covered in red dust, so it looks red.' },
    { q: 'Which is a star that gives us daylight?', ans: ['sun'], pool: ['moon', 'earth', 'mars', 'jupiter', 'comet'], hint: 'The Sun is a star. It gives us light and heat.' },
    { q: 'Which planet is closest to the Sun?', ans: ['mercury'], pool: ['venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'], hint: 'Mercury is the first planet from the Sun.' }
  ]
};
