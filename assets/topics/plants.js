/* Yaanstep Sprouts topic: Plants and how they grow. Original drawings, written 22 Nov 2026. */
(window.YS_TOPICS = window.YS_TOPICS || {})['plants'] = {
  id: 'plants',
  name: 'Plants and how they grow',
  ages: '4-8',
  blurb: 'Learn the parts of a plant, how a seed grows, and what every plant needs.',
  intro: 'Plants are living things. They grow from tiny seeds, and they need sunlight, water and air to grow.',
  items: [
    {
      id: 'seed',
      name: 'seed',
      art: '<rect width="64" height="64" fill="#dff1fb"/><rect y="40" width="64" height="24" fill="#a0703f"/><rect y="38" width="64" height="4" fill="#6fae4a"/><path d="M32 44c7 0 11 5 11 9s-5 7-11 7-11-3-11-7 4-9 11-9z" fill="#c98a3c" stroke="#17332c" stroke-width="2"/><path d="M27 50q5-3 10 0" stroke="#f3dcc0" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="52" r="2" fill="#7a5230"/><circle cx="52" cy="48" r="1.6" fill="#7a5230"/><circle cx="50" cy="58" r="2" fill="#7a5230"/>',
      say: 'A seed is where a new plant begins. With water and warmth, it starts to grow.',
      move: 'grow',
      group: 'plant'
    },
    {
      id: 'roots',
      name: 'roots',
      art: '<rect y="44" width="64" height="20" fill="#ead9c2"/><path d="M32 44V16M32 32q9-1 11 3" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 36c-5-7-15-8-21-4 5 6 15 8 21 4zM32 24c5-7 15-8 21-4-5 6-15 8-21 4z" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="44" cy="38" r="5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="6" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="38.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="36" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="28" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="25.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="12" r="3.5" fill="#eef0d8"/><path d="M32 44v16M32 48l-10 9M32 48l10 9M32 54l-6 6M32 54l6 6" stroke="#ffe14d" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M32 44v16M32 48l-10 9M32 48l10 9M32 54l-6 6M32 54l6 6" stroke="#e07b1a" stroke-width="4" stroke-linecap="round" fill="none"/>',
      say: 'Roots grow down into the soil. They hold the plant in place and take in water.',
      move: 'wiggle',
      group: 'part'
    },
    {
      id: 'stem',
      name: 'stem',
      art: '<rect y="44" width="64" height="20" fill="#ead9c2"/><path d="M32 44v16M32 48l-10 9M32 48l10 9M32 54l-6 6M32 54l6 6" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 36c-5-7-15-8-21-4 5 6 15 8 21 4zM32 24c5-7 15-8 21-4-5 6-15 8-21 4z" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="44" cy="38" r="5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="6" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="38.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="36" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="28" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="25.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="12" r="3.5" fill="#eef0d8"/><path d="M32 44V16M32 32q9-1 11 3" stroke="#ffe14d" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M32 44V16M32 32q9-1 11 3" stroke="#2bb24c" stroke-width="4" stroke-linecap="round" fill="none"/>',
      say: 'The stem holds the plant up. It carries water from the roots to the leaves.',
      move: 'wiggle',
      group: 'part'
    },
    {
      id: 'leaf',
      name: 'leaf',
      art: '<rect y="44" width="64" height="20" fill="#ead9c2"/><path d="M32 44v16M32 48l-10 9M32 48l10 9M32 54l-6 6M32 54l6 6" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 44V16M32 32q9-1 11 3" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="44" cy="38" r="5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="6" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="38.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="36" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="28" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="25.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="12" r="3.5" fill="#eef0d8"/><path d="M32 36c-5-7-15-8-21-4 5 6 15 8 21 4zM32 24c5-7 15-8 21-4-5 6-15 8-21 4z" fill="#ffe14d" stroke="#ffe14d" stroke-width="7"/><path d="M32 36c-5-7-15-8-21-4 5 6 15 8 21 4zM32 24c5-7 15-8 21-4-5 6-15 8-21 4z" fill="#2bb24c" stroke="#17332c" stroke-width="2"/>',
      say: 'Leaves use sunlight, air and water to make food for the plant.',
      move: 'wave',
      group: 'part'
    },
    {
      id: 'flower',
      name: 'flower',
      art: '<rect y="44" width="64" height="20" fill="#ead9c2"/><path d="M32 44v16M32 48l-10 9M32 48l10 9M32 54l-6 6M32 54l6 6" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 44V16M32 32q9-1 11 3" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 36c-5-7-15-8-21-4 5 6 15 8 21 4zM32 24c5-7 15-8 21-4-5 6-15 8-21 4z" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="44" cy="38" r="5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="12" r="13" fill="#ffe14d"/><circle cx="32" cy="6" r="4.5" fill="#ff4f9a" stroke="#17332c" stroke-width="2"/><circle cx="38.5" cy="10.5" r="4.5" fill="#ff4f9a" stroke="#17332c" stroke-width="2"/><circle cx="36" cy="17.5" r="4.5" fill="#ff4f9a" stroke="#17332c" stroke-width="2"/><circle cx="28" cy="17.5" r="4.5" fill="#ff4f9a" stroke="#17332c" stroke-width="2"/><circle cx="25.5" cy="10.5" r="4.5" fill="#ff4f9a" stroke="#17332c" stroke-width="2"/><circle cx="32" cy="12" r="3.5" fill="#ffd23f"/>',
      say: 'Many plants have flowers. Flowers help the plant make seeds.',
      move: 'wiggle',
      group: 'part'
    },
    {
      id: 'fruit',
      name: 'fruit',
      art: '<rect y="44" width="64" height="20" fill="#ead9c2"/><path d="M32 44v16M32 48l-10 9M32 48l10 9M32 54l-6 6M32 54l6 6" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 44V16M32 32q9-1 11 3" stroke="#bccbb9" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M32 36c-5-7-15-8-21-4 5 6 15 8 21 4zM32 24c5-7 15-8 21-4-5 6-15 8-21 4z" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="6" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="38.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="36" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="28" cy="17.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="25.5" cy="10.5" r="4.5" fill="#dfe8dc" stroke="#a9bba9" stroke-width="1.5"/><circle cx="32" cy="12" r="3.5" fill="#eef0d8"/><circle cx="44" cy="38" r="8.5" fill="#ffe14d"/><circle cx="44" cy="38" r="5" fill="#e8322b" stroke="#17332c" stroke-width="2"/>',
      say: 'A fruit grows from a flower. Most fruits have seeds inside.',
      move: 'bounce',
      group: 'part'
    },
    {
      id: 'sprout',
      name: 'sprout',
      art: '<rect width="64" height="64" fill="#dff1fb"/><rect y="40" width="64" height="24" fill="#a0703f"/><rect y="38" width="64" height="4" fill="#6fae4a"/><path d="M32 50V24" stroke="#3f9b4a" stroke-width="4" stroke-linecap="round"/><path d="M32 28c-3-8-13-11-19-6 3 7 12 9 19 6zM32 28c3-8 13-11 19-6-3 7-12 9-19 6z" fill="#7ccf4a" stroke="#17332c" stroke-width="2"/><path d="M32 50l-6 6M32 50l6 6M32 50v8" stroke="#f3dcc0" stroke-width="2" stroke-linecap="round"/>',
      say: 'A sprout is a baby plant. It pushes up out of the soil toward the light.',
      move: 'grow',
      group: 'plant'
    },
    {
      id: 'tree',
      name: 'tree',
      art: '<rect width="64" height="64" fill="#dff1fb"/><rect y="56" width="64" height="8" fill="#6fae4a"/><path d="M27 58l2-24h6l2 24z" fill="#8a5a33" stroke="#17332c" stroke-width="2"/><path d="M32 40l-7-6M32 44l7-7" stroke="#8a5a33" stroke-width="3"/><circle cx="32" cy="22" r="18" fill="#3f9e5a" stroke="#17332c" stroke-width="2"/><circle cx="22" cy="26" r="7" fill="#4fb36a"/><circle cx="40" cy="16" r="7" fill="#4fb36a"/><circle cx="38" cy="30" r="5" fill="#4fb36a"/>',
      say: 'A tree is a very big plant with a strong, woody trunk. Some trees live for hundreds of years.',
      move: 'grow',
      group: 'plant'
    },
    {
      id: 'cactus',
      name: 'cactus',
      art: '<rect width="64" height="64" fill="#fdeccb"/><circle cx="52" cy="10" r="6" fill="#f7c948"/><path d="M0 54q16-6 32-2t32-1v13H0z" fill="#e8c27a"/><path d="M27 56V16a5 5 0 0 1 10 0v40z" fill="#4caf50" stroke="#17332c" stroke-width="2"/><path d="M27 40h-6a4 4 0 0 1-4-4v-8a3 3 0 0 1 6 0v6h4zM37 34h5v-9a3 3 0 0 1 6 0v9a5 5 0 0 1-5 5h-6z" fill="#4caf50" stroke="#17332c" stroke-width="2"/><path d="M32 18v34M24 32v2M44 28v2" stroke="#2e7d32" stroke-width="1.5"/><circle cx="32" cy="11" r="3" fill="#ff4f9a"/>',
      say: 'A cactus can live in a dry desert. It keeps water inside its thick stem.',
      move: 'wiggle',
      group: 'plant'
    },
    {
      id: 'sunflower',
      name: 'sunflower',
      art: '<path d="M32 30v32" stroke="#3f9b4a" stroke-width="4"/><path d="M32 46c-4-6-12-7-17-3 4 5 12 6 17 3zM32 52c4-6 12-7 17-3-4 5-12 6-17 3z" fill="#5cb83f" stroke="#17332c" stroke-width="2"/><polygon points="32.0,2.0 34.0,9.2 38.9,3.6 37.6,11.0 44.5,8.0 40.1,14.1 47.6,14.4 41.0,18.0 47.6,21.6 40.1,21.9 44.5,28.0 37.6,25.0 38.9,32.4 34.0,26.8 32.0,34.0 30.0,26.8 25.1,32.4 26.4,25.0 19.5,28.0 23.9,21.9 16.4,21.6 23.0,18.0 16.4,14.4 23.9,14.1 19.5,8.0 26.4,11.0 25.1,3.6 30.0,9.2" fill="#f7c948" stroke="#d99a00" stroke-width="1.5" stroke-linejoin="round"/><circle cx="32" cy="18" r="7.5" fill="#7a4a1e" stroke="#17332c" stroke-width="2"/><circle cx="30" cy="16" r="1" fill="#c98a3c"/><circle cx="34" cy="18" r="1" fill="#c98a3c"/><circle cx="31" cy="21" r="1" fill="#c98a3c"/>',
      say: 'A sunflower is a tall plant with a big yellow flower. Its middle is full of seeds.',
      move: 'grow',
      group: 'plant'
    },
    {
      id: 'sunlight',
      name: 'sunlight',
      art: '<rect width="64" height="64" fill="#dff1fb"/><path d="M14 2v5M14 25v5M0 16h5M23 16h5M5 7l3 3M23 7l-3 3M5 25l3-3" stroke="#e8a21c" stroke-width="2.5" stroke-linecap="round"/><circle cx="14" cy="16" r="7" fill="#f7c948"/><path d="M26 26l10 10M20 30l6 12M30 20l12 6" stroke="#f7c948" stroke-width="2.5" stroke-dasharray="3 3" stroke-linecap="round"/><rect y="54" width="64" height="10" fill="#a0703f"/><path d="M46 54V38" stroke="#3f9b4a" stroke-width="3"/><path d="M46 42c-3-6-10-7-13-4 2 5 9 6 13 4zM46 40c3-6 10-7 13-4-2 5-9 6-13 4z" fill="#7ccf4a" stroke="#17332c" stroke-width="2"/>',
      say: 'Plants need sunlight. Their leaves use it to make food.',
      move: 'bounce',
      group: 'need'
    },
    {
      id: 'water',
      name: 'water',
      art: '<rect width="64" height="64" fill="#dff1fb"/><path d="M12 22q8-12 16 0" stroke="#2f7fc0" stroke-width="3" fill="none"/><path d="M28 38l14-14" stroke="#4bb3e8" stroke-width="5" stroke-linecap="round"/><ellipse cx="43" cy="23" rx="4" ry="2.5" fill="#2f7fc0" transform="rotate(-45 43 23)"/><rect x="6" y="22" width="26" height="22" rx="4" fill="#4bb3e8" stroke="#17332c" stroke-width="2"/><path d="M47 28v4M52 32v4M46 38v4M51 42v4" stroke="#2f7fc0" stroke-width="2.5" stroke-linecap="round"/><rect y="56" width="64" height="8" fill="#a0703f"/><path d="M50 56v-6" stroke="#3f9b4a" stroke-width="3"/><path d="M50 51c-2-4-7-5-9-3 1 4 6 5 9 3zM50 51c2-4 7-5 9-3-1 4-6 5-9 3z" fill="#7ccf4a" stroke="#17332c" stroke-width="2"/>',
      say: 'Plants need water. The roots take it in from the soil.',
      move: 'wiggle',
      group: 'need'
    },
    {
      id: 'soil',
      name: 'soil',
      art: '<rect width="64" height="64" fill="#dff1fb"/><path d="M4 58q6-26 28-28t28 28z" fill="#8a5a33" stroke="#17332c" stroke-width="2"/><circle cx="20" cy="48" r="2" fill="#5e3b1c"/><circle cx="32" cy="40" r="2.5" fill="#5e3b1c"/><circle cx="44" cy="50" r="2" fill="#5e3b1c"/><circle cx="28" cy="52" r="1.6" fill="#c9a27a"/><circle cx="40" cy="42" r="1.6" fill="#c9a27a"/><path d="M32 30v-8" stroke="#3f9b4a" stroke-width="3"/><path d="M32 24c-2-5-8-6-11-3 2 4 8 5 11 3zM32 24c2-5 8-6 11-3-2 4-8 5-11 3z" fill="#7ccf4a" stroke="#17332c" stroke-width="2"/><rect y="58" width="64" height="6" fill="#6b4423"/>',
      say: 'Many plants grow in soil. Soil holds the roots and has tiny bits that help plants stay healthy.',
      move: 'bounce',
      group: 'need'
    },
    {
      id: 'air',
      name: 'air',
      art: '<rect width="64" height="64" fill="#e9f6fd"/><path d="M4 18h30a6 6 0 1 0-6-6M4 30h44a6 6 0 1 1-6 6M4 44h24a5 5 0 1 0-5-5" stroke="#4bb3e8" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 14c-8 0-12 8-8 14 8 0 12-8 8-14z" fill="#7ccf4a" stroke="#17332c" stroke-width="2"/><path d="M54 14l-8 14" stroke="#17332c" stroke-width="1.5"/><path d="M40 64q2-8 6-12" stroke="#3f9b4a" stroke-width="2.5" fill="none"/><path d="M45 54c0-5 4-8 9-7-1 5-4 7-9 7z" fill="#7ccf4a" stroke="#17332c" stroke-width="2"/>',
      say: 'Plants need air too. Leaves take in air through tiny holes.',
      move: 'wave',
      group: 'need'
    }
  ],
  questions: [
    { q: 'Which part takes in water from the soil?', ans: ['roots'], pool: ['leaf', 'flower', 'fruit'], hint: 'Roots grow down into the soil and take in water.' },
    { q: 'Which part makes food from sunlight?', ans: ['leaf'], pool: ['roots', 'flower', 'seed'], hint: 'Green leaves use sunlight to make food for the plant.' },
    { q: 'What grows from a seed first?', ans: ['sprout'], pool: ['tree', 'flower', 'fruit'], hint: 'First a tiny sprout pushes up out of the soil.' },
    { q: 'Which plant can live in a dry desert and keeps water in its thick stem?', ans: ['cactus'], pool: ['sunflower', 'tree'], hint: 'A cactus keeps water inside, so it can live where it is very dry.' },
    { q: 'What do plants need to grow?', ans: ['sunlight', 'water', 'soil', 'air'], pool: ['fruit', 'flower', 'cactus', 'sunflower'], hint: 'Plants need sunlight, water, air, and most grow in soil.' }
  ],
  /* "See them all together" (Manish, 23 Nov 2026): one tomato plant, cut away at the ground so the roots show, with the
     sun, rain, air and soil around it and a seed just starting to grow. Each tap area is its own rectangle (x, y, w, h in
     picture pixels); none overlap and each is at least 44 px each way. */
  scene: {
    button: 'See them all together',
    small: 'One plant, above and below the ground. Tap a part to hear what it does.',
    title: 'A plant, above and below the ground',
    hint: 'Look up at the sky, and down under the ground.',
    prompt: 'Tap a part of the plant, or the sun, rain, air or soil, to hear what it does.',
    note: 'We cannot really see through soil. This picture shows the roots as if we could.',
    label: 'A tomato plant with a flower, a red tomato, green leaves and a stem above the ground, and roots under the ground. The sun shines, rain falls from a cloud, the wind blows, and a seed is starting to grow in the soil.',
    vb: '0 0 340 450',
    back: '<rect width="340" height="284" fill="#d9f1fb"/><rect y="280" width="340" height="170" fill="#8b5a2b"/><path d="M0 282H340" stroke="#5cb83f" stroke-width="8"/><path d="M60 82L112 160M78 66L140 120" stroke="#f7d548" stroke-width="3" stroke-dasharray="6 6" opacity=".8"/><g fill="#4bb3e8"><circle cx="150" cy="300" r="3"/><circle cx="196" cy="306" r="3"/><circle cx="174" cy="316" r="2.5"/></g>',
    objects: [
      { id: 'sunlight', x: 0, y: 0, w: 96, h: 96, compare: 'Leaves turn toward the light to catch more sunlight.',
        art: '<g stroke="#f7a541" stroke-width="4" stroke-linecap="round"><path d="M46 8v8M46 76v8M8 46h8M76 46h8M19 19l6 6M67 67l6 6M73 19l-6 6M25 67l-6 6"/></g><circle cx="46" cy="46" r="22" fill="#f7c948" stroke="#f7a541" stroke-width="3"/>' },
      { id: 'water', x: 244, y: 0, w: 96, h: 110, name: 'Rain', say: 'Rain gives plants water. The roots take it in from the soil.', compare: 'The stem carries the water up to the leaves.',
        art: '<path d="M258 58q-4-22 18-22q6-16 24-14q16-10 26 6q16 2 12 30z" fill="#ffffff" stroke="#9fb3c8" stroke-width="2"/><g stroke="#2f86c8" stroke-width="4" stroke-linecap="round"><path d="M268 70l-4 10M290 72l-4 10M312 70l-4 10M278 90l-4 10M300 92l-4 10M322 88l-4 10"/></g>' },
      { id: 'air', x: 0, y: 110, w: 96, h: 90, compare: 'Plants give out oxygen. That is the part of the air we breathe in.',
        art: '<g stroke="#5f8fb4" stroke-width="4" fill="none" stroke-linecap="round"><path d="M10 138H58q14 0 14-12t-12-8"/><path d="M18 158H74q14 0 14 12t-12 8"/><path d="M8 180H44"/></g>' },
      { id: 'flower', x: 120, y: 18, w: 100, h: 86, compare: 'Bees and butterflies visit flowers. They help flowers make seeds.',
        art: '<g fill="#f27aa8" stroke="#c94f7c" stroke-width="2"><circle cx="170" cy="40" r="14"/><circle cx="191" cy="56" r="14"/><circle cx="183" cy="80" r="14"/><circle cx="157" cy="80" r="14"/><circle cx="149" cy="56" r="14"/></g><circle cx="170" cy="62" r="12" fill="#f7d548" stroke="#d9a94e" stroke-width="2"/>' },
      { id: 'fruit', x: 200, y: 110, w: 90, h: 76, compare: 'This fruit is a tomato. Its seeds can grow into new tomato plants.',
        art: '<path d="M170 150Q206 120 240 132" stroke="#3e8e2f" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="242" cy="156" r="20" fill="#e2412e" stroke="#a8301f" stroke-width="2.5"/><path d="M232 138l10 6 10-6-4 8h-12z" fill="#3e8e2f"/><path d="M232 150q4-6 10-6" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>' },
      { id: 'leaf', x: 194, y: 192, w: 100, h: 70, name: 'Leaves', compare: 'Leaves are green. The green part catches the sunlight.',
        art: '<path d="M170 200Q140 156 102 178Q130 214 170 200Z" fill="#5cb83f" stroke="#2f6e22" stroke-width="2.5"/><path d="M170 200Q138 186 110 180" stroke="#2f6e22" stroke-width="2" fill="none"/><path d="M170 240Q220 190 270 216Q226 262 170 240Z" fill="#5cb83f" stroke="#2f6e22" stroke-width="2.5"/><path d="M170 240Q220 222 260 218" stroke="#2f6e22" stroke-width="2" fill="none"/>' },
      { id: 'stem', x: 146, y: 104, w: 48, h: 176, compare: 'A strong stem helps the leaves reach up to the sunlight.',
        art: '<path d="M170 92V282" stroke="#2f6e22" stroke-width="12" stroke-linecap="round"/><path d="M170 92V282" stroke="#4e9a3a" stroke-width="7" stroke-linecap="round"/>' },
      { id: 'roots', x: 110, y: 290, w: 120, h: 100, compare: 'Roots stay under the ground, so we do not often see them.',
        art: '<g stroke="#f1dcb0" stroke-width="5" fill="none" stroke-linecap="round"><path d="M170 282V378"/><path d="M170 300Q140 316 124 352"/><path d="M170 300Q200 316 216 352"/><path d="M170 330Q150 346 142 380"/><path d="M170 330Q190 346 198 380"/></g><g stroke="#f1dcb0" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M134 334l-10-2M206 334l10-2M146 362l-10 4M194 362l10 4"/></g>' },
      { id: 'soil', x: 0, y: 296, w: 104, h: 150, compare: 'Worms live in the soil. They help keep it soft.',
        art: '<g fill="#6b4422"><ellipse cx="22" cy="318" rx="8" ry="5"/><ellipse cx="84" cy="420" rx="10" ry="6"/><ellipse cx="30" cy="432" rx="6" ry="4"/><ellipse cx="80" cy="322" rx="5" ry="4"/></g><path d="M20 404q8-10 16 0t16 0t14-4" stroke="#e38fa0" stroke-width="7" fill="none" stroke-linecap="round"/>' },
      { id: 'seed', x: 240, y: 296, w: 100, h: 124, compare: 'This seed has just started to grow. A tiny root goes down, and a little shoot goes up.',
        art: '<path d="M290 378V312q0-10-10-8" stroke="#8fd16f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M290 392q-2 12 4 22" stroke="#f1dcb0" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="290" cy="386" rx="15" ry="10" fill="#e9c27a" stroke="#a87b32" stroke-width="2.5"/>' }
    ]
  }
};
