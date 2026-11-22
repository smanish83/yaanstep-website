/* Yaanstep Sprouts topic: Opposites. Original drawings, written 22 Nov 2026. */
(window.YS_TOPICS = window.YS_TOPICS || {})['opposites'] = {
  id: 'opposites',
  name: 'Opposites',
  ages: '4-7',
  blurb: 'Learn pairs of opposite words, like big and small or hot and cold.',
  intro: 'Opposites are words that mean very different things. Big and small are opposites.',
  items: [
    {
      id: 'big', name: 'big', move: 'grow', group: 'size',
      say: 'An elephant is big. Big is the opposite of small.',
      art: '<path d="M0 61h64" stroke="#3f9e5a" stroke-width="3"/><g fill="#9aa5ad" stroke="#17332c" stroke-width="2"><rect x="21" y="44" width="8" height="16"/><rect x="31" y="44" width="8" height="16"/><rect x="42" y="44" width="8" height="16"/><rect x="51" y="42" width="8" height="18"/><ellipse cx="38" cy="35" rx="22" ry="16"/><circle cx="16" cy="29" r="13"/></g><path d="M59 30q5 4 3 10" stroke="#17332c" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 34c-5 6-5 14 0 20" stroke="#17332c" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 34c-5 6-5 14 0 20" stroke="#9aa5ad" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="28" rx="8" ry="12" fill="#b8c1c7" stroke="#17332c" stroke-width="2"/><circle cx="11" cy="26" r="2" fill="#17332c"/>'
    },
    {
      id: 'small', name: 'small', group: 'size',
      say: 'A mouse is small. Small is the opposite of big.',
      art: '<path d="M0 61h64" stroke="#3f9e5a" stroke-width="3"/><path d="M42 53q10 2 12-6" stroke="#a8998a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g fill="#b8b0a8" stroke="#17332c" stroke-width="1.5"><ellipse cx="34" cy="53" rx="9" ry="6"/><circle cx="25" cy="51" r="5"/></g><circle cx="27" cy="46" r="3" fill="#f4a3b6" stroke="#17332c" stroke-width="1.5"/><circle cx="23.5" cy="50" r="1" fill="#17332c"/><circle cx="20.5" cy="52" r="1.1" fill="#e8607a"/>'
    },
    {
      id: 'hot', name: 'hot', group: 'temperature',
      say: 'This drink is hot, so we wait before we sip. Hot is the opposite of cold.',
      art: '<path d="M22 18q-4-4 0-8t0-8M32 18q-4-4 0-8t0-8M42 18q-4-4 0-8t0-8" stroke="#e8781f" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 30h5a7 7 0 0 1 0 14h-5" stroke="#17332c" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 24h34v26a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8z" fill="#d6453d" stroke="#17332c" stroke-width="2"/><ellipse cx="29" cy="25" rx="15" ry="2.5" fill="#8a5a33"/>'
    },
    {
      id: 'cold', name: 'cold', group: 'temperature',
      say: 'Snow is cold. Cold is the opposite of hot.',
      art: '<path d="M0 61h64" stroke="#cfe8f5" stroke-width="3"/><path d="M10 6v10M5 11h10M6.5 7.5l7 7M13.5 7.5l-7 7M54 18v10M49 23h10M50.5 19.5l7 7M57.5 19.5l-7 7" stroke="#4b8be8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="46" r="14" fill="#fff" stroke="#17332c" stroke-width="2"/><circle cx="32" cy="22" r="10" fill="#fff" stroke="#17332c" stroke-width="2"/><rect x="22" y="30" width="20" height="5" rx="2" fill="#d6453d"/><rect x="34" y="33" width="5" height="10" rx="2" fill="#d6453d"/><circle cx="28" cy="20" r="1.6" fill="#17332c"/><circle cx="36" cy="20" r="1.6" fill="#17332c"/><polygon points="32,23 41,25 32,27" fill="#e8781f"/><circle cx="32" cy="45" r="1.8" fill="#17332c"/><circle cx="32" cy="52" r="1.8" fill="#17332c"/>'
    },
    {
      id: 'up', name: 'up', move: 'float', group: 'up-down',
      say: 'The balloon floats up, up, up. Up is the opposite of down.',
      art: '<path d="M14 57V12M5 21l9-9l9 9" stroke="#3f9e5a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 31q-4 8 0 14t0 12" stroke="#17332c" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="40" cy="18" rx="11" ry="13" fill="#d6453d" stroke="#17332c" stroke-width="2"/><polygon points="37,33 43,33 40,30" fill="#d6453d" stroke="#17332c" stroke-width="2"/><ellipse cx="36" cy="13" rx="2.5" ry="4" fill="#f08a8a"/>'
    },
    {
      id: 'down', name: 'down', move: 'bounce', group: 'up-down',
      say: 'The ball falls down to the ground. Down is the opposite of up.',
      art: '<path d="M0 61h64" stroke="#3f9e5a" stroke-width="3"/><path d="M14 8v44M5 43l9 9l9-9" stroke="#2f6fd0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 24v8M35 28v6M49 28v6" stroke="#b8c1c7" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="50" r="10" fill="#f7c948" stroke="#17332c" stroke-width="2"/><path d="M32 50h20M42 40q-6 10 0 20" stroke="#e8781f" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    {
      id: 'full', name: 'full', group: 'full-empty',
      say: 'This glass is full of juice. Full is the opposite of empty.',
      art: '<path d="M16 8h32l-4 50H20z" fill="#e6f3fa"/><path d="M17 13h30l-3 44H20z" fill="#f29a45"/><g fill="#ffd0a0"><circle cx="26" cy="30" r="1.5"/><circle cx="36" cy="42" r="1.5"/><circle cx="31" cy="22" r="1.2"/></g><path d="M16 8h32l-4 50H20z" fill="none" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/>'
    },
    {
      id: 'empty', name: 'empty', group: 'full-empty',
      say: 'This glass is empty, with nothing inside. Empty is the opposite of full.',
      art: '<path d="M16 8h32l-4 50H20z" fill="#e6f3fa"/><path d="M22 14l3 38" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 8h32l-4 50H20z" fill="none" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/>'
    },
    {
      id: 'fast', name: 'fast', move: 'drive', group: 'speed',
      say: 'The rabbit runs fast. Fast is the opposite of slow.',
      art: '<path d="M2 30h12M4 38h10M2 46h12" stroke="#4b8be8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 44q-10 4-12 12h12z" fill="#d9cdbf" stroke="#17332c" stroke-width="2"/><ellipse cx="34" cy="40" rx="14" ry="9" fill="#d9cdbf" stroke="#17332c" stroke-width="2"/><path d="M42 45l12 6" stroke="#17332c" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 45l12 6" stroke="#d9cdbf" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="36" r="4" fill="#fff" stroke="#17332c" stroke-width="1.5"/><path d="M44 25c-6-6-8-14-6-18c4 2 8 10 8 18zM49 24c-2-8 0-15 4-18c3 4 1 12-2 18z" fill="#d9cdbf" stroke="#17332c" stroke-width="2"/><circle cx="49" cy="31" r="8" fill="#d9cdbf" stroke="#17332c" stroke-width="2"/><circle cx="52" cy="29" r="1.6" fill="#17332c"/><circle cx="56.5" cy="32" r="1.4" fill="#e8607a"/>'
    },
    {
      id: 'slow', name: 'slow', move: 'drive', group: 'speed',
      say: 'The snail moves slowly. Slow is the opposite of fast.',
      art: '<path d="M0 58h64" stroke="#3f9e5a" stroke-width="3"/><path d="M52 37l-2-10M56 38l3-9" stroke="#17332c" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="26" r="2" fill="#17332c"/><circle cx="59" cy="28" r="2" fill="#17332c"/><path d="M6 56q0-5 6-5h30q3-10 8-15q8 0 8 7q0 13-12 13z" fill="#a6d07a" stroke="#17332c" stroke-width="2"/><circle cx="54" cy="42" r="1.6" fill="#17332c"/><circle cx="28" cy="38" r="14" fill="#e8a24a" stroke="#17332c" stroke-width="2"/><path d="M30 39a3 3 0 1 0-4-3a6 6 0 1 0 9-5a9 9 0 0 0-8-2" stroke="#b86d1a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    {
      id: 'open', name: 'open', group: 'open-closed',
      say: 'The door is open, so we can walk through. Open is the opposite of closed.',
      art: '<rect x="18" y="6" width="30" height="54" fill="#cfe8f5" stroke="#17332c" stroke-width="2"/><rect x="19" y="44" width="28" height="15" fill="#6cc66c"/><circle cx="38" cy="18" r="5" fill="#f7c948"/><polygon points="18,6 6,12 6,58 18,60" fill="#b8742e" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="36" r="1.8" fill="#f7c948"/><path d="M0 61h64" stroke="#8a5a33" stroke-width="3"/>'
    },
    {
      id: 'closed', name: 'closed', group: 'open-closed',
      say: 'The door is closed. Closed is the opposite of open.',
      art: '<rect x="18" y="6" width="30" height="54" fill="#b8742e" stroke="#17332c" stroke-width="2"/><g fill="#c9844a" stroke="#8a5a33" stroke-width="1.5"><rect x="22" y="11" width="22" height="17" rx="2"/><rect x="22" y="35" width="22" height="20" rx="2"/></g><circle cx="42" cy="31.5" r="2.2" fill="#f7c948" stroke="#17332c" stroke-width="1"/><path d="M0 61h64" stroke="#8a5a33" stroke-width="3"/>'
    },
    {
      id: 'day', name: 'day', group: 'day-night',
      say: 'In the day, the sun shines and the sky is bright. Day is the opposite of night.',
      art: '<rect x="2" y="2" width="60" height="60" rx="8" fill="#cfe8f5"/><path d="M2 46h60v8a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8z" fill="#6cc66c"/><path d="M32 6v5M32 37v5M14 24h5M45 24h5M19 11l3.5 3.5M41.5 33.5l3.5 3.5M45 11l-3.5 3.5M22.5 33.5L19 37" stroke="#e8a21c" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="24" r="9" fill="#f7c948"/><g fill="#fff"><circle cx="47" cy="44" r="5"/><circle cx="53" cy="42" r="6"/><circle cx="58" cy="45" r="4"/></g><rect x="2" y="2" width="60" height="60" rx="8" fill="none" stroke="#17332c" stroke-width="2"/>'
    },
    {
      id: 'night', name: 'night', group: 'day-night',
      say: 'At night, the sky is dark, and we may see the moon and stars. Night is the opposite of day.',
      art: '<rect x="2" y="2" width="60" height="60" rx="8" fill="#1f2f5a"/><path d="M2 46h60v8a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8z" fill="#2f5f3f"/><path d="M38 10a13 13 0 1 0 10 21a11 11 0 0 1-10-21z" fill="#f2d675"/><g fill="#f7c948"><circle cx="12" cy="12" r="1.5"/><circle cx="22" cy="24" r="1.2"/><circle cx="54" cy="12" r="1.5"/><circle cx="10" cy="34" r="1.2"/><circle cx="54" cy="38" r="1.2"/><polygon points="20,4 21.5,8 25.5,8.5 22.5,11 23.5,15 20,13 16.5,15 17.5,11 14.5,8.5 18.5,8"/></g><rect x="2" y="2" width="60" height="60" rx="8" fill="none" stroke="#17332c" stroke-width="2"/>'
    },
    {
      id: 'wet', name: 'wet', group: 'wet-dry',
      say: 'This shirt is wet and dripping. Wet is the opposite of dry.',
      art: '<path d="M0 9h64" stroke="#8a5a33" stroke-width="2"/><path d="M22 10l-12 7l4 8l6-3v24h24V22l6 3l4-8l-12-7c-2 3-5 5-10 5s-8-2-10-5z" fill="#2f6fd0" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/><rect x="20" y="5" width="4" height="8" rx="1" fill="#f7c948"/><rect x="40" y="5" width="4" height="8" rx="1" fill="#f7c948"/><path d="M24 49c-2 4-2.5 6 0 6s2-2 0-6z" fill="#4b8be8"/><path d="M32 52c-2 4-2.5 6 0 6s2-2 0-6z" fill="#4b8be8"/><path d="M40 49c-2 4-2.5 6 0 6s2-2 0-6z" fill="#4b8be8"/><ellipse cx="32" cy="61" rx="18" ry="2.5" fill="#9fd0f0"/>'
    },
    {
      id: 'dry', name: 'dry', group: 'wet-dry',
      say: 'This shirt dried in the warm sun. Dry is the opposite of wet.',
      art: '<path d="M0 9h64" stroke="#8a5a33" stroke-width="2"/><path d="M22 10l-12 7l4 8l6-3v24h24V22l6 3l4-8l-12-7c-2 3-5 5-10 5s-8-2-10-5z" fill="#8fb8e8" stroke="#17332c" stroke-width="2" stroke-linejoin="round"/><rect x="20" y="5" width="4" height="8" rx="1" fill="#f7c948"/><rect x="40" y="5" width="4" height="8" rx="1" fill="#f7c948"/><path d="M52 44v-3M52 61v3M43 52.5h-3M61 52.5h3M45.5 46l-2-2M58.5 46l2-2M45.5 59l-2 2M58.5 59l2 2" stroke="#e8a21c" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="52.5" r="5.5" fill="#f7c948"/>'
    },
    {
      id: 'happy', name: 'happy', move: 'bounce', group: 'happy-sad',
      say: 'This face looks happy, with a big smile. Happy is the opposite of sad.',
      art: '<circle cx="32" cy="32" r="26" fill="#c68642" stroke="#17332c" stroke-width="2"/><circle cx="23" cy="28" r="3" fill="#17332c"/><circle cx="41" cy="28" r="3" fill="#17332c"/><path d="M20 38q12 12 24 0" stroke="#17332c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="37" r="3.5" fill="#f4a3a3"/><circle cx="47" cy="37" r="3.5" fill="#f4a3a3"/>'
    },
    {
      id: 'sad', name: 'sad', group: 'happy-sad',
      say: 'This face looks sad. Sad is the opposite of happy.',
      art: '<circle cx="32" cy="32" r="26" fill="#c68642" stroke="#17332c" stroke-width="2"/><circle cx="23" cy="28" r="3" fill="#17332c"/><circle cx="41" cy="28" r="3" fill="#17332c"/><path d="M16 22L27 18M48 22L37 18" stroke="#17332c" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 47q10-9 20 0" stroke="#17332c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 33c-3 5-3.5 8 0 8s3-3 0-8z" fill="#4b8be8"/>'
    },
    {
      id: 'tall', name: 'tall', group: 'height',
      say: 'This tower is tall. Tall is the opposite of short.',
      art: '<path d="M0 60h64" stroke="#3f9e5a" stroke-width="3"/><rect x="22" y="8" width="20" height="10" rx="1.5" fill="#d6453d" stroke="#17332c" stroke-width="2"/><rect x="22" y="18" width="20" height="10" rx="1.5" fill="#f7c948" stroke="#17332c" stroke-width="2"/><rect x="22" y="28" width="20" height="10" rx="1.5" fill="#2f6fd0" stroke="#17332c" stroke-width="2"/><rect x="22" y="38" width="20" height="10" rx="1.5" fill="#3f9e5a" stroke="#17332c" stroke-width="2"/><rect x="22" y="48" width="20" height="10" rx="1.5" fill="#f29a45" stroke="#17332c" stroke-width="2"/>'
    },
    {
      id: 'short', name: 'short', group: 'height',
      say: 'This tower is short. Short is the opposite of tall.',
      art: '<path d="M0 60h64" stroke="#3f9e5a" stroke-width="3"/><rect x="22" y="38" width="20" height="10" rx="1.5" fill="#9b6fd6" stroke="#17332c" stroke-width="2"/><rect x="22" y="48" width="20" height="10" rx="1.5" fill="#3fb5a8" stroke="#17332c" stroke-width="2"/>'
    },
    {
      id: 'heavy', name: 'heavy', group: 'weight',
      say: 'A big rock is heavy and hard to lift. Heavy is the opposite of light.',
      art: '<path d="M0 58h64" stroke="#8a5a33" stroke-width="3"/><path d="M6 57c-2-14 6-30 22-34c14-3 28 6 30 22c1 6 0 10-2 12z" fill="#8a9096" stroke="#17332c" stroke-width="2"/><g fill="#737a80"><ellipse cx="24" cy="40" rx="4" ry="3"/><ellipse cx="42" cy="33" rx="3" ry="2"/><ellipse cx="40" cy="48" rx="5" ry="3"/></g><g fill="#cfc4b4"><circle cx="3" cy="55" r="2.5"/><circle cx="61" cy="55" r="2.5"/></g>'
    },
    {
      id: 'light', name: 'light', move: 'float', group: 'weight',
      say: 'A feather is light and easy to lift. Light is the opposite of heavy.',
      art: '<path d="M16 54C14 34 30 12 54 8C52 30 36 50 16 54z" fill="#f4a3b6" stroke="#17332c" stroke-width="2"/><path d="M10 60L50 12" stroke="#17332c" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 34l-6-2M36 27l-6-3M42 20l-5-3M26 40l2 6M33 33l3 6M40 25l3 6" stroke="#e8607a" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    {
      id: 'loud', name: 'loud', move: 'wiggle', group: 'sound',
      say: 'A drum can be loud. Loud is the opposite of quiet.',
      art: '<path d="M14 6l14 20M50 6L36 26" stroke="#8a5a33" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 32v16c0 5 9 8 20 8s20-3 20-8V32" fill="#d6453d" stroke="#17332c" stroke-width="2"/><path d="M13 41l6 7l6-7l6 7l6-7l6 7l6-7" stroke="#f7c948" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="32" cy="32" rx="20" ry="6" fill="#fff4d6" stroke="#17332c" stroke-width="2"/><path d="M56 24q5 6 0 12M60 19q7 11 0 22M8 24q-5 6 0 12M4 19q-7 11 0 22" stroke="#e8781f" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    {
      id: 'quiet', name: 'quiet', group: 'sound',
      say: 'Shh! We are quiet when someone is sleeping. Quiet is the opposite of loud.',
      art: '<circle cx="32" cy="30" r="24" fill="#c68642" stroke="#17332c" stroke-width="2"/><path d="M19 26q4 3 8 0M37 26q4 3 8 0" stroke="#17332c" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="41" r="2.5" fill="#7a2a24"/><rect x="21" y="51" width="22" height="18" rx="6" fill="#c68642" stroke="#17332c" stroke-width="2"/><path d="M25 56h14M25 60h14" stroke="#8a5a33" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="29.5" y="31" width="5" height="25" rx="2.5" fill="#c68642" stroke="#17332c" stroke-width="2"/><rect x="30.5" y="32.5" width="3" height="3" rx="1" fill="#e0ac69"/>'
    }
  ],
  questions: [
    { q: 'What is the opposite of big?', ans: ['small'], pool: ['wet', 'night', 'fast'] },
    { q: 'What is the opposite of hot?', ans: ['cold'], pool: ['up', 'full', 'loud'] },
    { q: 'What is the opposite of up?', ans: ['down'], pool: ['big', 'dry', 'happy'] },
    { q: 'What is the opposite of full?', ans: ['empty'], pool: ['hot', 'tall', 'open'] },
    { q: 'What is the opposite of fast?', ans: ['slow'], pool: ['cold', 'closed', 'day'] },
    { q: 'What is the opposite of open?', ans: ['closed'], pool: ['wet', 'small', 'heavy'] },
    { q: 'What is the opposite of day?', ans: ['night'], pool: ['big', 'wet', 'fast'] },
    { q: 'What is the opposite of wet?', ans: ['dry'], pool: ['loud', 'down', 'tall'] },
    { q: 'What is the opposite of happy?', ans: ['sad'], pool: ['open', 'cold', 'fast'] },
    { q: 'What is the opposite of tall?', ans: ['short'], pool: ['empty', 'hot', 'open'] },
    { q: 'What is the opposite of heavy?', ans: ['light'], pool: ['slow', 'open', 'wet'] },
    { q: 'What is the opposite of loud?', ans: ['quiet'], pool: ['big', 'dry', 'day'] }
  ]
};
