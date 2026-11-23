/* Yaanstep Sprouts: the word list for Opposites (opposites.html), 23 Nov 2026. Original list by the Yaanstep team.
   Manish played Opposites and found the words too few, so this adds a big checked list for the word games:
   - pairs: true opposites in groups, each with the youngest age it suits and its "sense" (what the two words are about).
     Words that share a sense are never offered together as choices, so a round never has two right answers
     (short: tall and long; light: heavy and dark) and never offers a word that means the same as the answer.
   - prefixes: words that turn into their opposite with one beginning (un, dis, in, im, ir, il), for ages 7 and up.
     "avoid" lists beginnings that would also make a real word, so they are never offered as wrong choices.
   - none: words with no opposite: what a thing is made of, and names of things.
   Some pairs were copied from the opposites in the picture dictionary (assets/words), each checked by hand.
   Kid-safe only: every word is checked against the site's blocked-word list by the tests. Nothing here is stored or sent.
   Each line below is "word opposite age sense [more senses]", lines joined by "|". */
(function (O) {
  'use strict';
  var GROUPS = {
    describe: 'Describing words',
    action: 'Action words',
    place: 'Where and which way',
    time: 'Time words',
    feel: 'Feelings and ways we are',
    more: 'Numbers, facts and more'
  };
  var RAW = {
    describe: [
      'big small 3 size|big little 3 size|large small 5 size|huge tiny 4 size|big tiny 4 size|small huge 4 size|giant tiny 5 size|enormous tiny 7 size|gigantic tiny 8 size',
      'giant miniature 9 size|colossal tiny 11 size|enormous minuscule 12 size',
      'tall short 3 height size|long short 3 length|wide narrow 5 width|thick thin 5 width|broad narrow 9 width|deep shallow 6 deep',
      'hot cold 3 temp|cold warm 3 temp|warm cool 4 temp|icy hot 6 temp|boiling freezing 7 temp|fast slow 3 speed|quick slow 4 speed|quickly slowly 6 speed',
      'heavy light 4 weight|light dark 4 bright|bright dark 5 bright|bright dim 7 bright',
      'hard soft 3 hard vol rough|firm soft 7 hard vol rough|loud quiet 3 vol|noisy quiet 5 vol|noisy silent 7 vol',
      'rough smooth 4 rough|bumpy smooth 5 rough|jagged smooth 9 rough sharp',
      'wet dry 3 wet|damp dry 6 wet|moist dry 9 wet|humid dry 10 wet|soaked dry 7 wet',
      'full empty 3 full|crowded empty 7 full',
      'clean dirty 3 clean|tidy messy 4 clean|neat messy 5 clean',
      'old new 3 agething|young old 3 ageperson|ancient modern 10 agething|recent ancient 10 agething',
      'open closed 3 open|awake asleep 3 sleep',
      'sweet sour 4 taste|sweet bitter 8 taste|spicy mild 8 spicy temp',
      'easy hard 4 easy|easy difficult 6 easy|simple complicated 8 easy|simple complex 10 easy',
      'straight curved 5 straight|straight crooked 6 straight|pointed rounded 7 point sharp straight|steep flat 8 steep rough',
      'safe dangerous 5 safe|safe risky 8 safe|harmless harmful 8 safe',
      'loose tight 5 tight|sharp blunt 6 sharp|tame wild 6 wild|domestic wild 9 wild',
      'fresh stale 7 fresh agething|fresh rotten 7 fresh agething|raw cooked 6 cooked|frozen melted 6 freeze temp|crisp soggy 7 crisp wet',
      'cheap expensive 7 price|plain fancy 7 fancy easy common|ordinary special 7 common|common rare 8 common',
      'real pretend 5 real|real fake 7 real|genuine fake 10 real|natural artificial 9 natural real',
      'public private 9 public|public secret 9 public|familiar strange 8 familiar common|famous unknown 8 famous familiar',
      'sunny cloudy 4 weather bright|calm stormy 6 weather|foggy clear 6 fog weather bright|blurry clear 7 fog',
      'solid hollow 8 hollow hard full|transparent opaque 10 see fog|boring interesting 6 interest excited',
      'careful careless 7 care|present absent 8 present|useful useless 6 use',
      'sturdy flimsy 9 sturdy hard|sturdy fragile 9 sturdy hard|stiff floppy 6 flex hard|stiff bendy 6 flex hard|flexible rigid 10 flex hard',
      'fine coarse 10 grain rough|dense sparse 11 dense|vacant occupied 10 occupied full|formal casual 9 formal|active passive 10 active',
      'exact approximate 10 exact|concave convex 11 cave|acute obtuse 10 angle|symmetrical asymmetrical 10 sym',
      'local global 10 local|urban rural 10 urban|junior senior 9 senior ageperson|strict lenient 11 strict'
    ],
    action: [
      'open close 3 open|open shut 4 open|push pull 3 push|give take 4 give|give receive 7 give|send receive 7 give',
      'buy sell 6 buy|purchase sell 10 buy|lend borrow 7 lend give|throw catch 4 throw vert|sit stand 3 sit|walk run 3 walkrun start',
      'stop go 3 stopgo start|start finish 4 start|start stop 4 start|begin end 5 start|start end 5 start|pause resume 10 start',
      'arrive leave 5 arrive|arrive depart 9 arrive|enter exit 6 arrive|stay leave 5 arrive|stay go 4 arrive|enter leave 5 arrive|embark disembark 11 arrive',
      'laugh cry 4 laugh|smile frown 4 laugh|whisper shout 5 vol|tiptoe stomp 6 vol',
      'wake sleep 4 sleep|remember forget 6 remember|fill empty 5 full|fill drain 8 full|fix break 5 fix build',
      'freeze melt 5 freeze temp|freeze thaw 8 freeze temp|freeze boil 7 freeze temp|heat cool 6 temp|float sink 5 vert',
      'rise fall 7 vert grow season|raise lower 7 vert grow|lift drop 5 vert grow|ascend descend 10 vert|climb descend 7 vert grow',
      'grow shrink 4 grow|increase decrease 8 grow|expand contract 11 grow|expand shrink 9 grow|stretch shrink 7 grow|enlarge reduce 10 grow',
      'lengthen shorten 9 length grow|widen narrow 10 width grow|brighten darken 9 bright|soften harden 9 hard|tighten loosen 8 tight',
      'accelerate decelerate 11 speed|hide show 5 hide|reveal conceal 11 hide|teach learn 5 teach|ask answer 4 ask',
      'accept refuse 8 accept|accept reject 10 accept|accept decline 10 accept|allow forbid 9 allow accept|permit prohibit 11 allow accept',
      'attach detach 9 attach mix|attract repel 10 attract push|gather scatter 8 gather mix|collect distribute 10 gather',
      'save spend 6 save buy|earn spend 7 save buy|work play 4 work|work rest 6 work sleep|lead follow 6 lead|hold release 8 hold vert',
      'notice ignore 8 notice|include exclude 10 include accept|admit deny 10 admit accept|encourage discourage 9 encourage',
      'inhale exhale 9 breathe|import export 10 export|inflate deflate 10 inflate grow|insert remove 8 insert give',
      'mix separate 8 mix|combine separate 10 mix|assemble dismantle 10 build mix|soak dry 8 wet',
      'appear vanish 8 appear hide|bloom wilt 7 bloom open|evaporate condense 10 evap'
    ],
    place: [
      'up down 3 vert happy|high low 3 vert height|over under 4 vert|above below 5 vert|above beneath 9 vert|top bottom 4 vert',
      'upstairs downstairs 5 vert|uphill downhill 6 vert|upward downward 8 vert|upper lower 8 vert|higher lower 6 vert height|overhead underfoot 9 vert|upstream downstream 9 vert',
      'ceiling floor 5 ceiling vert|in out 3 inout|on off 3 onoff inout|inside outside 4 inout|indoor outdoor 5 inout|indoors outdoors 6 inout',
      'inner outer 8 inout|inward outward 9 inout|internal external 10 inout|interior exterior 11 inout|entrance exit 6 arrive inout',
      'left right 5 left|port starboard 11 left|front back 5 front|front rear 9 front|forward backward 5 front|near far 4 near|here there 4 here near',
      'together apart 5 apart near|together alone 5 apart near|towards away 7 toward near',
      'north south 7 ns|northern southern 8 ns|east west 7 ew|eastern western 8 ew|vertical horizontal 9 orient'
    ],
    time: [
      'day night 3 day|daytime nighttime 4 day|morning evening 4 day|early late 5 early|earlier later 6 early|earliest latest 7 early|sooner later 7 early',
      'now later 5 now early|now then 6 now early|before after 5 early|beforehand afterwards 9 early|first last 5 early|initial final 9 early',
      'previous next 8 early|yesterday tomorrow 5 early|past future 7 early|sunrise sunset 5 day|dawn dusk 8 day',
      'noon midnight 7 day|midday midnight 7 day|always never 6 always|often rarely 8 always|frequently rarely 10 always',
      'summer winter 4 season|spring autumn 6 season|weekday weekend 6 week|temporary permanent 10 perm',
      'beginning end 6 early|arrival departure 8 arrive|nocturnal diurnal 10 day'
    ],
    feel: [
      'happy sad 3 happy|glad sad 4 happy|cheerful gloomy 7 happy bright|cheerful grumpy 6 happy calm|happiness sadness 6 happy',
      'calm worried 5 calm|calm nervous 6 calm|calm angry 4 calm happy|calm anxious 9 calm|relaxed tense 8 calm|relaxed worried 6 calm',
      'relaxed nervous 7 calm|relieved worried 8 calm|brave scared 4 calm|brave afraid 5 calm|bold shy 6 calm|bold timid 8 calm',
      'confident shy 7 calm|confident nervous 8 calm|shy outgoing 8 calm',
      'bored excited 5 excited calm|bored interested 6 excited|proud ashamed 7 proud happy|modest boastful 10 proud',
      'tired energetic 6 sleep excited|sleepy awake 4 sleep|gentle rough 5 gentle calm speed rough hard care|generous selfish 8 generous',
      'quiet talkative 7 talk calm|serious silly 6 silly|serious funny 6 silly|serious playful 7 silly|sensible silly 8 silly',
      'eager reluctant 10 eager excited|optimistic pessimistic 11 optimist happy|friendly hostile 10 friendly calm temp|cautious reckless 10 care calm'
    ],
    more: [
      'all none 5 all|everything nothing 5 all|everybody nobody 5 all|everywhere nowhere 6 all|both neither 8 all',
      'more less 4 more|more fewer 6 more|many few 4 more|most least 6 more|greater lesser 9 more',
      'same different 4 same|alike different 6 same|similar different 7 same|identical different 9 same',
      'true false 6 true real|fact fiction 9 fact real|fact opinion 10 fact|yes no 3 true|question answer 5 ask|problem solution 8 ask',
      'add subtract 6 add|plus minus 6 add|addition subtraction 7 add|multiply divide 8 mult|multiplication division 8 mult',
      'even odd 6 odd rough|whole part 7 whole|double half 7 double|maximum minimum 10 more|positive negative 9 add',
      'solid liquid 8 state hard|input output 9 input|singular plural 8 plural|synonym antonym 9 syn|prefix suffix 9 prefix',
      'uppercase lowercase 6 case|safety danger 6 safe|heat cold 6 temp|light darkness 5 bright|noise silence 7 vol',
      'host guest 7 host|buyer seller 8 buy|leader follower 8 lead|sender receiver 9 give|speaker listener 9 speak|hill valley 6 hill|ebb flow 11 tide|acid alkali 11 ph',
      'deciduous evergreen 11 leaf|conductor insulator 11 conduct|major minor 11 major|ancestor descendant 11 ancestor',
      'optional compulsory 11 compulsory'
    ]
  };

  var pairs = [];
  Object.keys(RAW).forEach(function (g) {
    RAW[g].join('|').split('|').forEach(function (line) {
      var p = line.trim().split(/\s+/);
      pairs.push({ a: p[0], b: p[1], age: +p[2], group: g, sense: p.slice(3) });
    });
  });

  /* Beginnings that make the opposite: "root prefix age [v|n] [avoid:x,y]", then the example sentence after "=". */
  var PRE = [
    'happy un 7=The puppy was unhappy when the rain began.',
    'kind un 7 avoid:in=It is unkind to laugh at someone who falls.',
    'fair un 7=It felt unfair when only one child got a turn.',
    'safe un 7=The thin ice on the pond is unsafe.',
    'lock un 7 v=Dad will unlock the door with his key.',
    'tie un 7 v=Can you untie the knot in your shoelace?',
    'zip un 7 v=Unzip your coat when you come inside.',
    'pack un 7 v=We unpack our bags after the trip.',
    'load un 7 v=The workers unload the boxes from the truck.',
    'wrap un 7 v avoid:in=I love to unwrap a present slowly.',
    'tidy un 7=My room is untidy after we build a den.',
    'well un 7=Sam felt unwell and stayed in bed.',
    'known un 8=The name of the artist is unknown.',
    'usual un 8=It is unusual to see snow in May.',
    'lucky un 7=It was unlucky that the kite got stuck in the tree.',
    'friendly un 7=The goose looked unfriendly and hissed.',
    'helpful un 7=Shouting is unhelpful when we need to think.',
    'fold un 7 v avoid:in=Unfold the map to find the river.',
    'even un 8=The path is uneven, so walk with care.',
    'button un 7 v=Unbutton your coat before you hang it up.',
    'true un 8=The story about a flying pig is untrue.',
    'certain un 9 avoid:in=We are uncertain if it will rain.',
    'comfortable un 8=These new shoes feel uncomfortable.',
    'clear un 8=The message was unclear, so we asked again.',
    'fit un 9=The old bike is unfit to ride until it is fixed.',
    'important un 9=Spots on the paper are unimportant; the words matter.',
    'believable un 9=The magic trick was unbelievable!',
    'finished un 8=My drawing is still unfinished.',
    'do un 7 v=You can undo the last step if you make a slip.',
    'welcome un 9=Ants at a picnic are unwelcome guests.',
    'popular un 9=Cold soup was unpopular at lunch.',
    'natural un 10=The bright blue apple looked unnatural.',
    'real un 9 avoid:ir=The dream felt unreal.',
    'wise un 10=It is unwise to play near a busy road.',
    'willing un 10=The cat was unwilling to get in the bath.',
    'healthy un 9=Too many sweets every day is unhealthy.',
    'cooked un 8=Uncooked rice is hard and dry.',
    'selfish un 9=It was unselfish of Mia to share her last grape.',
    'afraid un 9=The brave climber was unafraid of the height.',
    'tangle un 8 v=Can you untangle the string of the kite?',
    'plug un 8 v=Unplug the lamp before you move it.',
    'seen un 9=The fox moved through the grass unseen.',
    'roll un 8 v avoid:in=Unroll the mat for yoga.',
    'fasten un 9 v=Unfasten your seat belt when the car stops.',
    'seal un 9 v=Unseal the jar carefully.',
    'ripe un 8=Unripe bananas are green and hard.',
    'likely un 9=It is unlikely that a cat can read.',
    'necessary un 10=An umbrella is unnecessary on a sunny day.',
    'familiar un 9=The street looked unfamiliar in the dark.',
    'available un 10=The swings are unavailable while they are painted.',
    'readable un 9=The note got wet and was unreadable.',
    'truthful un 10=An untruthful answer makes it hard to trust.',
    'enthusiastic un 11=The team felt unenthusiastic about the rain.',
    'grateful un 9=It seems ungrateful to forget to say thank you.',
    'agree dis 7 v=My brother and I disagree about which game to play.',
    'appear dis 7 v=The sun will disappear behind the cloud.',
    'honest dis 8=It is dishonest to peek at the answers.',
    'obey dis 8 v=The puppy likes to disobey and run off.',
    'obedient dis 9=The disobedient goat ate the flowers.',
    'connect dis 8 v=Disconnect the toy from the charger.',
    'approve dis 9 v=Dad may disapprove of cake for breakfast.',
    'allow dis 10 v=The rules disallow running by the pool.',
    'loyal dis 10 avoid:un=A disloyal friend tells your secrets.',
    'continue dis 11 v=The shop will discontinue that toy.',
    'advantage dis 11 n=Running uphill is a disadvantage in a race.',
    'trust dis 10 v avoid:in=Some animals distrust people at first.',
    'respect dis 10 n avoid:in=Talking over someone shows disrespect.',
    'pleased dis 10 avoid:un=Grandpa was displeased when the gate was left open.',
    'possible im 7=Nobody can be in two places at once: it is impossible.',
    'polite im 8 avoid:un=It is impolite to talk with your mouth full.',
    'patient im 8 avoid:in=I feel impatient while I wait for my turn.',
    'perfect im 9=The vase has a small chip, so it is imperfect.',
    'proper im 10=It is improper to wear muddy boots in the house.',
    'mobile im 11=The heavy statue is immobile.',
    'practical im 11 avoid:un=Flip-flops are impractical for a snowy walk.',
    'balance im 11 n avoid:un,in=An imbalance of weight tipped the boat.',
    'visible in 8=The wind is invisible, but we see the trees move.',
    'correct in 8=That sum is incorrect, so let us check it again.',
    'complete in 8=The puzzle is incomplete; one piece is missing.',
    'active in 9 avoid:un=The volcano is inactive and quiet.',
    'dependent in 10=Our cat is independent and goes out on its own.',
    'accurate in 10=The old map was inaccurate.',
    'expensive in 10=The pencils were inexpensive.',
    'direct in 10=We took an indirect path around the lake.',
    'formal in 10=The party was informal, so we wore jeans.',
    'convenient in 10=Rain at the picnic was inconvenient.',
    'capable in 11 avoid:un=A baby is incapable of reading.',
    'edible in 10 avoid:un=Those berries are inedible, so leave them on the bush.',
    'audible in 10 avoid:un=The whisper was almost inaudible.',
    'considerate in 11 avoid:un=Leaving litter is inconsiderate.',
    'finite in 11=Counting goes on and on: the numbers are infinite.',
    'regular ir 9=The shape has sides of different lengths, so it is irregular.',
    'responsible ir 10=It is irresponsible to leave the gate open.',
    'relevant ir 11=That joke is irrelevant to the question.',
    'replaceable ir 11 avoid:un=Grandma\'s old letter is irreplaceable.',
    'resistible ir 11 avoid:un=The smell of fresh bread was irresistible.',
    'reversible ir 11 avoid:un=Baking a cake is irreversible: it cannot turn back into flour.',
    'logical il 10 avoid:un=It is illogical to wear a coat in a hot bath.',
    'legible il 10=The scribble was illegible.'
  ];
  var prefixes = PRE.map(function (line) {
    var i = line.indexOf('='), head = line.slice(0, i).trim().split(/\s+/), ex = line.slice(i + 1).trim();
    var o = { root: head[0], pre: head[1], age: +head[2], pos: 'adj', avoid: [], ex: ex };
    head.slice(3).forEach(function (t) {
      if (t === 'v') o.pos = 'verb';
      else if (t === 'n') o.pos = 'noun';
      else if (t.indexOf('avoid:') === 0) o.avoid = t.slice(6).split(',');
    });
    o.word = o.pre + o.root;
    return o;
  });

  /* Words with no opposite: what a thing is made of (made: the thing), and names of things (thing: two ways it can be). */
  var NONE = [
    'cotton made T-shirt|stone made wall|silk made scarf|clay made bowl|sand made castle|wax made candle|gold made ring',
    'silver made spoon|iron made gate|steel made bridge|cardboard made box|denim made jacket|tin made can|bamboo made fence',
    'straw made hat|concrete made path|brick made house|velvet made ribbon|copper made pan|nylon made rope|porcelain made cup',
    'wool made sock|plastic made bucket|wood made table|glass made bottle|paper made bag',
    'banana thing big:small|table thing old:new|carrot thing long:short|giraffe thing tall:short|umbrella thing open:closed',
    'kite thing high:low|piano thing loud:quiet|rabbit thing fast:slow|bread thing fresh:stale|pillow thing soft:hard',
    'bicycle thing old:new|shoe thing wet:dry|rocket thing fast:slow|turtle thing big:small|onion thing raw:cooked',
    'garden thing tidy:messy|river thing deep:shallow|train thing fast:slow|crayon thing long:short|teapot thing hot:cold',
    'window thing open:closed|soup thing hot:cold|zebra thing big:small|tent thing open:closed|apple thing sweet:sour',
    'chair thing old:new|dog thing happy:sad|tree thing tall:short|tiger thing awake:asleep|drum thing loud:quiet'
  ].join('|').split('|').map(function (line) {
    var p = line.trim().split(/\s+/);
    return p[1] === 'made' ? { w: p[0], kind: 'made', thing: p[2] } : { w: p[0], kind: 'thing', can: p[2].split(':') };
  });

  O.groups = GROUPS;
  O.wordPairs = pairs;
  O.prefixes = prefixes;
  O.noneWords = NONE;
})(window.YS_OPPOSITES = window.YS_OPPOSITES || {});
