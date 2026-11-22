/* Yaanstep Sprouts topic: Food. Original drawings, written 22 Nov 2026. */
(window.YS_TOPICS = window.YS_TOPICS || {})['food'] = {
  id: 'food',
  name: 'Food',
  ages: '3-7',
  blurb: 'Name everyday foods and sort them into fruit, vegetables, grains, milk foods and protein foods.',
  intro: 'Let\'s look at foods we eat every day. Some grow on plants, and some come from animals.',
  items: [
    {
      id: 'apple',
      name: 'apple',
      art: '<path d="M32 20c-6-5-21-4-21 12 0 14 10 25 17 25 2 0 3-1 4-1s2 1 4 1c7 0 17-11 17-25 0-16-15-17-21-12z" fill="#e0413a" stroke="#17332c" stroke-width="2.5"/><path d="M32 20c0-6 2-10 5-12" stroke="#17332c" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M35 14c4-6 12-7 15-3-3 5-11 6-15 3z" fill="#5bb04a" stroke="#17332c" stroke-width="2"/><ellipse cx="21" cy="30" rx="3" ry="5" fill="#f58a80"/>',
      say: 'An apple is a fruit. It grows on a tree.',
      move: 'bounce',
      group: 'fruit'
    },
    {
      id: 'banana',
      name: 'banana',
      art: '<path d="M12 18c2 24 24 36 44 26 2-1 1-5-1-4-17 6-33-4-37-22-1-3-6-3-6 0z" fill="#f7d33c" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M19 24c5 13 18 20 32 18" stroke="#e0b520" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="11" y="11" width="6" height="8" rx="1.5" fill="#7a5a26" stroke="#17332c" stroke-width="2"/><circle cx="56" cy="42" r="1.8" fill="#5a4320"/>',
      say: 'A banana is a yellow fruit. We peel it before we eat it.',
      move: 'wiggle',
      group: 'fruit'
    },
    {
      id: 'orange',
      name: 'orange',
      art: '<circle cx="32" cy="36" r="22" fill="#f59b2a" stroke="#17332c" stroke-width="2.5"/><path d="M32 14c2-5 8-8 14-6-2 6-8 8-14 6z" fill="#5bb04a" stroke="#17332c" stroke-width="2"/><ellipse cx="23" cy="28" rx="4" ry="6" fill="#fbbf6a"/><g fill="#d97d12"><circle cx="38" cy="30" r="1.3"/><circle cx="44" cy="38" r="1.3"/><circle cx="36" cy="44" r="1.3"/><circle cx="26" cy="46" r="1.3"/><circle cx="46" cy="47" r="1.3"/></g>',
      say: 'An orange is a juicy fruit. We peel it and eat the pieces inside.',
      move: 'spin',
      group: 'fruit'
    },
    {
      id: 'grapes',
      name: 'grapes',
      art: '<path d="M32 13V5" stroke="#6b4a26" stroke-width="3" stroke-linecap="round"/><path d="M33 8c5-5 13-4 15 0-5 4-11 4-15 0z" fill="#5bb04a" stroke="#17332c" stroke-width="2"/><g fill="#8e44ad" stroke="#17332c" stroke-width="2"><circle cx="20" cy="19" r="6.5"/><circle cx="32" cy="19" r="6.5"/><circle cx="44" cy="19" r="6.5"/><circle cx="20" cy="30" r="6.5"/><circle cx="32" cy="30" r="6.5"/><circle cx="44" cy="30" r="6.5"/><circle cx="26" cy="41" r="6.5"/><circle cx="38" cy="41" r="6.5"/><circle cx="32" cy="52" r="6.5"/></g><g fill="#c48ae0"><circle cx="30" cy="16" r="1.8"/><circle cx="18" cy="27" r="1.8"/><circle cx="36" cy="38" r="1.8"/><circle cx="30" cy="49" r="1.8"/></g>',
      say: 'Grapes are small round fruits. They grow in bunches on a vine.',
      move: 'wiggle',
      group: 'fruit'
    },
    {
      id: 'strawberry',
      name: 'strawberry',
      art: '<path d="M32 59C17 49 9 37 11 27c2-8 11-10 21-8 10-2 19 0 21 8 2 10-6 22-21 32z" fill="#e33b3b" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 21l9 1 6-11 6 11 9-1-5 7-10-2-10 2z" fill="#4caf50" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/><g fill="#ffe27a"><ellipse cx="22" cy="32" rx="1.4" ry="2"/><ellipse cx="32" cy="34" rx="1.4" ry="2"/><ellipse cx="42" cy="32" rx="1.4" ry="2"/><ellipse cx="26" cy="42" rx="1.4" ry="2"/><ellipse cx="38" cy="42" rx="1.4" ry="2"/><ellipse cx="32" cy="50" rx="1.4" ry="2"/></g>',
      say: 'A strawberry is a red fruit. It has tiny seeds on the outside.',
      move: 'bounce',
      group: 'fruit'
    },
    {
      id: 'watermelon',
      name: 'watermelon',
      art: '<path d="M5 22a27 27 0 0 0 54 0z" fill="#3a9a46" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M9 22a23 23 0 0 0 46 0z" fill="#e9f7d9"/><path d="M12 22a20 20 0 0 0 40 0z" fill="#f04e5e"/><g fill="#17332c"><ellipse cx="22" cy="29" rx="1.5" ry="2.5"/><ellipse cx="32" cy="33" rx="1.5" ry="2.5"/><ellipse cx="42" cy="29" rx="1.5" ry="2.5"/><ellipse cx="27" cy="38" rx="1.5" ry="2.5"/><ellipse cx="37" cy="38" rx="1.5" ry="2.5"/></g>',
      say: 'A watermelon is a big fruit. It is green outside and red inside.',
      move: 'float',
      group: 'fruit'
    },
    {
      id: 'carrot',
      name: 'carrot',
      art: '<path d="M32 21c-2-8-8-13-13-13 0 6 6 12 13 13zM32 21c-1-8 1-14 0-17-4 4-4 12 0 17zM32 21c2-8 8-13 13-13 0 6-6 12-13 13z" fill="#4caf50" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/><path d="M21 21h22l-9 37c-1 3-3 3-4 0z" fill="#f28a1e" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M25 30h5M34 37h5M27 45h4" stroke="#c96a10" stroke-width="2" stroke-linecap="round"/>',
      say: 'A carrot is a vegetable. It grows under the ground.',
      move: 'grow',
      group: 'vegetable'
    },
    {
      id: 'broccoli',
      name: 'broccoli',
      art: '<path d="M25 59l3-22h8l3 22z" fill="#9ccc65" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><g fill="#3d9a3f" stroke="#17332c" stroke-width="2.5"><circle cx="19" cy="30" r="11"/><circle cx="45" cy="30" r="11"/><circle cx="32" cy="20" r="12"/><circle cx="32" cy="34" r="10"/></g><g fill="#6cc46e"><circle cx="17" cy="27" r="2.5"/><circle cx="29" cy="16" r="2.5"/><circle cx="43" cy="27" r="2.5"/><circle cx="32" cy="32" r="2"/></g>',
      say: 'Broccoli is a green vegetable. It looks like a little tree.',
      move: 'grow',
      group: 'vegetable'
    },
    {
      id: 'peas',
      name: 'peas',
      art: '<path d="M5 42c10-20 42-28 54-20-8 20-42 28-54 20z" fill="#4e9e3a" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 40c9-12 34-19 42-16-6 12-33 19-42 16z" fill="#bfe6a0"/><g fill="#7ccf4f" stroke="#17332c" stroke-width="2"><circle cx="18" cy="37" r="5"/><circle cx="28" cy="33" r="5"/><circle cx="38" cy="30" r="5"/><circle cx="47" cy="27" r="4.5"/></g><path d="M59 22l3-6" stroke="#4e9e3a" stroke-width="3" stroke-linecap="round"/>',
      say: 'Peas are small green vegetables. They grow inside a pod.',
      move: 'bounce',
      group: 'vegetable'
    },
    {
      id: 'corn',
      name: 'corn',
      art: '<ellipse cx="32" cy="29" rx="12" ry="22" fill="#f7d33c" stroke="#17332c" stroke-width="2.5"/><path d="M21 19h22M20 26h24M20 33h24M21 40h22M26 9v42M32 7v44M38 9v42" stroke="#e0a81c" stroke-width="1.8"/><path d="M32 61C18 57 12 44 14 32c6 8 13 18 18 29z" fill="#5bb04a" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 61c14-4 20-17 18-29-6 8-13 18-18 29z" fill="#4caf50" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/>',
      say: 'Corn has rows of yellow kernels on a cob. We eat it as a vegetable.',
      move: 'wiggle',
      group: 'vegetable'
    },
    {
      id: 'bread',
      name: 'bread',
      art: '<path d="M11 28c-6-18 48-18 42 0v27H11z" fill="#d99a4e" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 29c-4-12 36-12 32 0v22H16z" fill="#fbe3b0"/><g fill="#efc98a"><circle cx="24" cy="34" r="1.5"/><circle cx="36" cy="31" r="1.5"/><circle cx="30" cy="42" r="1.5"/><circle cx="40" cy="45" r="1.5"/></g>',
      say: 'Bread is made from wheat flour. Wheat is a grain.',
      move: 'bounce',
      group: 'grain'
    },
    {
      id: 'rice',
      name: 'rice',
      art: '<path d="M10 34c2-16 42-16 44 0z" fill="#ffffff" stroke="#17332c" stroke-width="2.5"/><g fill="#d9dfe3"><ellipse cx="22" cy="28" rx="2.5" ry="1.2"/><ellipse cx="30" cy="24" rx="2.5" ry="1.2"/><ellipse cx="38" cy="27" rx="2.5" ry="1.2"/><ellipse cx="44" cy="31" rx="2.5" ry="1.2"/><ellipse cx="17" cy="32" rx="2.5" ry="1.2"/><ellipse cx="31" cy="31" rx="2.5" ry="1.2"/></g><path d="M7 34h50c0 14-11 22-25 22S7 48 7 34z" fill="#3d8bd9" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 41h36" stroke="#8cc4f2" stroke-width="2.5" stroke-linecap="round"/><rect x="24" y="55" width="16" height="4" rx="2" fill="#2c6cb0" stroke="#17332c" stroke-width="2"/>',
      say: 'Rice is a grain. Its tiny seeds get soft when we cook them.',
      move: 'bounce',
      group: 'grain'
    },
    {
      id: 'pasta',
      name: 'pasta',
      art: '<ellipse cx="32" cy="46" rx="29" ry="13" fill="#ffffff" stroke="#17332c" stroke-width="2.5"/><g fill="none" stroke="#b8860b" stroke-width="4.5" stroke-linecap="round"><ellipse cx="24" cy="40" rx="12" ry="6"/><ellipse cx="40" cy="40" rx="12" ry="6"/><ellipse cx="32" cy="36" rx="14" ry="7"/><ellipse cx="28" cy="32" rx="10" ry="5"/><ellipse cx="37" cy="32" rx="10" ry="5"/><path d="M14 42c-3 4-2 8 1 10M50 42c3 4 2 8-1 10"/></g><g fill="none" stroke="#f7d774" stroke-width="2.5" stroke-linecap="round"><ellipse cx="24" cy="40" rx="12" ry="6"/><ellipse cx="40" cy="40" rx="12" ry="6"/><ellipse cx="32" cy="36" rx="14" ry="7"/><ellipse cx="28" cy="32" rx="10" ry="5"/><ellipse cx="37" cy="32" rx="10" ry="5"/><path d="M14 42c-3 4-2 8 1 10M50 42c3 4 2 8-1 10"/></g><path d="M24 30c0-6 16-6 16 0 0 4-16 4-16 0z" fill="#d6453d" stroke="#17332c" stroke-width="2"/><circle cx="30" cy="29" r="1.5" fill="#f58a80"/>',
      say: 'Pasta is made from wheat flour. Noodles and spaghetti are pasta.',
      move: 'wiggle',
      group: 'grain'
    },
    {
      id: 'milk',
      name: 'milk',
      art: '<path d="M18 22l6-12h16l6 12v36H18z" fill="#ffffff" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 10l-6 12h28l-6-12" fill="#e7eef3" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><rect x="26" y="5" width="12" height="5" fill="#4b8be8" stroke="#17332c" stroke-width="2"/><rect x="18" y="32" width="28" height="16" fill="#4b8be8"/><path d="M32 35c-3 4-5 6-5 8a5 5 0 0 0 10 0c0-2-2-4-5-8z" fill="#ffffff"/><path d="M18 22v36h28V22" fill="none" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/>',
      say: 'Milk is a white drink. Most milk we buy comes from cows.',
      move: 'bounce',
      group: 'dairy'
    },
    {
      id: 'cheese',
      name: 'cheese',
      art: '<polygon points="5,40 44,18 59,30" fill="#fbd96a" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><polygon points="5,40 59,30 59,50 5,55" fill="#f7c03a" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><g fill="#e09a1c"><ellipse cx="18" cy="45" rx="4" ry="3"/><ellipse cx="34" cy="41" rx="3" ry="2.5"/><ellipse cx="48" cy="44" rx="4" ry="3"/><ellipse cx="28" cy="50" rx="2" ry="1.5"/><ellipse cx="38" cy="26" rx="3" ry="1.5"/></g>',
      say: 'Cheese is made from milk. It can be soft or hard.',
      move: 'wiggle',
      group: 'dairy'
    },
    {
      id: 'yogurt',
      name: 'yogurt',
      art: '<path d="M13 24h38l-5 33a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3z" fill="#f8bbd0" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M15 34h34l-1 7H16z" fill="#ec6f9a"/><ellipse cx="32" cy="24" rx="20" ry="5" fill="#ffffff" stroke="#17332c" stroke-width="2.5"/><path d="M40 22L52 5" stroke="#9aa7b0" stroke-width="4" stroke-linecap="round"/><ellipse cx="38" cy="23" rx="5" ry="2.5" fill="#c3cdd3" stroke="#17332c" stroke-width="1.5"/>',
      say: 'Yogurt is made from milk. It is soft and we eat it with a spoon.',
      move: 'bounce',
      group: 'dairy'
    },
    {
      id: 'egg',
      name: 'egg',
      art: '<ellipse cx="32" cy="35" rx="18" ry="24" fill="#fff4dc" stroke="#17332c" stroke-width="2.5"/><ellipse cx="25" cy="25" rx="4" ry="7" fill="#ffffff"/><ellipse cx="32" cy="58" rx="14" ry="3" fill="#e2d6bd"/>',
      say: 'Eggs come from hens. An egg is a protein food.',
      move: 'wiggle',
      group: 'protein'
    },
    {
      id: 'beans',
      name: 'beans',
      art: '<g fill="#a63d2e" stroke="#17332c" stroke-width="2"><ellipse cx="20" cy="22" rx="10" ry="7" transform="rotate(-25 20 22)"/><ellipse cx="44" cy="20" rx="10" ry="7" transform="rotate(20 44 20)"/><ellipse cx="32" cy="36" rx="10" ry="7" transform="rotate(-8 32 36)"/><ellipse cx="16" cy="46" rx="10" ry="7" transform="rotate(30 16 46)"/><ellipse cx="47" cy="47" rx="10" ry="7" transform="rotate(-30 47 47)"/></g><g fill="#d36a58"><ellipse cx="18" cy="20" rx="3" ry="1.5" transform="rotate(-25 18 20)"/><ellipse cx="42" cy="18" rx="3" ry="1.5" transform="rotate(20 42 18)"/><ellipse cx="30" cy="34" rx="3" ry="1.5"/><ellipse cx="14" cy="44" rx="3" ry="1.5" transform="rotate(30 14 44)"/><ellipse cx="45" cy="45" rx="3" ry="1.5" transform="rotate(-30 45 45)"/></g>',
      say: 'Beans are seeds that grow in pods. They are a protein food.',
      move: 'bounce',
      group: 'protein'
    },
    {
      id: 'fish',
      name: 'fish',
      art: '<polygon points="46,32 61,18 61,46" fill="#2a8fb8" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="28" cy="32" rx="23" ry="15" fill="#4fb3d9" stroke="#17332c" stroke-width="2.5"/><path d="M24 19c4-6 12-6 16 0" fill="#2a8fb8" stroke="#17332c" stroke-width="2"/><path d="M34 26c4 4 4 8 0 12M41 27c3 3 3 7 0 10" stroke="#2a8fb8" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="16" cy="29" r="3" fill="#17332c"/><circle cx="15" cy="28" r="1" fill="#ffffff"/><path d="M9 37q4 3 8 0" stroke="#17332c" stroke-width="2" fill="none" stroke-linecap="round"/>',
      say: 'Fish live in water. Fish is a protein food that many people eat.',
      move: 'float',
      group: 'protein'
    },
    {
      id: 'water',
      name: 'water',
      art: '<path d="M16 8h32l-4 48a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" fill="#eaf6fd" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round"/><path d="M19 22h26l-3.2 33a2 2 0 0 1-2 2H24.2a2 2 0 0 1-2-2z" fill="#7cc4f2"/><path d="M19 22h26" stroke="#3d8bd9" stroke-width="2"/><g fill="#ffffff"><circle cx="28" cy="34" r="2"/><circle cx="36" cy="44" r="1.6"/><circle cx="30" cy="50" r="1.2"/></g><path d="M23 12v6" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
      say: 'Water is a drink. We drink water when we are thirsty.',
      move: 'float',
      group: 'drink'
    }
  ],
  questions: [
    { q: 'Which one is a fruit?', ans: ['apple', 'banana', 'orange', 'grapes', 'strawberry', 'watermelon'], pool: ['carrot', 'broccoli', 'bread', 'rice', 'milk', 'cheese', 'egg', 'fish', 'water'], hint: 'Fruits grow from flowers and have seeds inside, like apples and grapes.' },
    { q: 'Which one is a vegetable?', ans: ['carrot', 'broccoli', 'peas', 'corn'], pool: ['apple', 'banana', 'strawberry', 'bread', 'pasta', 'milk', 'cheese', 'egg', 'fish', 'water'], hint: 'Carrots, broccoli, peas and corn are vegetables.' },
    { q: 'Which one is a grain food?', ans: ['bread', 'rice', 'pasta'], pool: ['apple', 'banana', 'carrot', 'broccoli', 'milk', 'cheese', 'yogurt', 'egg', 'fish', 'water'], hint: 'Bread, rice and pasta come from grains like wheat and rice.' },
    { q: 'Which one is made from milk?', ans: ['cheese', 'yogurt'], pool: ['apple', 'banana', 'grapes', 'carrot', 'broccoli', 'rice', 'egg', 'fish', 'water'], hint: 'Cheese and yogurt are made from milk.' },
    { q: 'Which one grows on a tree?', ans: ['apple', 'orange'], pool: ['carrot', 'strawberry', 'watermelon', 'grapes', 'peas', 'broccoli', 'milk', 'egg', 'fish'], hint: 'Apples and oranges grow on trees.' },
    { q: 'Which one is yellow?', ans: ['banana', 'corn'], pool: ['strawberry', 'broccoli', 'peas', 'grapes', 'watermelon', 'milk', 'fish', 'water'], hint: 'Bananas and corn are yellow, like the sun.' },
    { q: 'Which one do you peel before you eat it?', ans: ['banana', 'orange'], pool: ['grapes', 'strawberry', 'bread', 'rice', 'milk', 'yogurt', 'broccoli', 'water'], hint: 'We peel the skin off bananas and oranges.' },
    { q: 'Which one do we drink?', ans: ['water', 'milk'], pool: ['apple', 'banana', 'bread', 'rice', 'carrot', 'broccoli', 'cheese', 'egg'], hint: 'Water and milk are drinks.' }
  ]
};
