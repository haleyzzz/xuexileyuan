/* =========================================================================
 * readers-data.js —— 分级阅读数据源（程序化生成 1000 本）
 *
 * 设计：
 *  - 30 个主题词库（动物/颜色/家庭/食物/自然/交通/太空/恐龙…），每个主题含
 *    名词(nouns)/形容词(adjs)/动词(verbs)/科普小知识(facts)。
 *  - 14 个阅读级别，覆盖幼儿（3岁）到小学六年级（12岁），每级含年龄段+年级标签。
 *  - 4 档句子模板（band 0~3），难度随级别递增，符合分级阅读"重复句式"教学法。
 *  - 每本书用「书 ID 播种的确定性随机(mulberry32)」生成，保证每次打开内容一致。
 *
 * 产出：window.READERS（1000 本数组）、window.READER_LEVELS（14 级元信息）
 * 单本书结构：{ id, title, level, levelName, age, grade, emoji, type, pages:[{emoji,text}], tip }
 * ========================================================================= */
(function () {
  'use strict';

  /* ---------- 工具 ---------- */
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  // 确定性随机：同一种子永远得到同一序列，保证同一本书内容稳定
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- 主题词库（30 个） ---------- */
  var THEMES = [
    { key:'cat',    emoji:'🐱', nouns:['cat','kitten'],          adjs:['small','soft','cute','funny'],        verbs:['run','play','sleep','jump'], facts:['Cats say meow.','Cats like to nap.'] },
    { key:'dog',    emoji:'🐶', nouns:['dog','puppy'],           adjs:['big','happy','brown','friendly'],     verbs:['run','play','wag','bark'],  facts:['Dogs are loyal friends.','Dogs say woof.'] },
    { key:'bear',   emoji:'🐻', nouns:['bear'],                 adjs:['big','brown','fuzzy','round'],        verbs:['walk','sleep','eat','play'], facts:['Bears sleep in winter.','Bears love honey.'] },
    { key:'rabbit', emoji:'🐰', nouns:['rabbit','bunny'],        adjs:['small','soft','white','cute'],        verbs:['hop','run','hide','eat'],   facts:['Rabbits hop very fast.','Rabbits like carrots.'] },
    { key:'fish',   emoji:'🐟', nouns:['fish'],                 adjs:['small','blue','fast','silly'],        verbs:['swim','hide','jump','play'], facts:['Fish breathe in water.','Fish swim in groups.'] },
    { key:'bird',   emoji:'🐦', nouns:['bird'],                 adjs:['small','red','blue','pretty'],        verbs:['fly','sing','hop','eat'],   facts:['Birds build nests.','Birds sing songs.'] },
    { key:'elephant',emoji:'🐘',nouns:['elephant'],             adjs:['big','gray','kind','slow'],          verbs:['walk','trumpet','eat','play'],facts:['Elephants have trunks.','Elephants are huge.'] },
    { key:'lion',   emoji:'🦁', nouns:['lion'],                 adjs:['big','brave','golden','strong'],      verbs:['roar','run','rest','play'], facts:['Lions are big cats.','Lions roar loud.'] },
    { key:'monkey', emoji:'🐵', nouns:['monkey'],               adjs:['small','brown','funny','smart'],      verbs:['climb','jump','eat','play'], facts:['Monkeys climb trees.','Monkeys love bananas.'] },
    { key:'penguin',emoji:'🐧', nouns:['penguin'],              adjs:['small','black','white','funny'],      verbs:['slide','swim','waddle','eat'],facts:['Penguins cannot fly.','Penguins live in cold places.'] },
    { key:'red',    emoji:'🔴', nouns:['red ball','red apple','red car'], adjs:['red','bright','round','shiny'], verbs:['roll','shine','go','spin'], facts:['Red is a warm color.','Red apples are sweet.'] },
    { key:'blue',   emoji:'🔵', nouns:['blue sky','blue boat','blue ball'], adjs:['blue','calm','cool','big'], verbs:['float','shine','go','roll'], facts:['Blue is a calm color.','The sky is blue.'] },
    { key:'green',  emoji:'🟢', nouns:['green frog','green leaf','green tree'], adjs:['green','small','tall','fresh'], verbs:['hop','grow','wave','rest'], facts:['Green is the color of leaves.','Frogs are green.'] },
    { key:'yellow', emoji:'🟡', nouns:['yellow sun','yellow duck','yellow star'], adjs:['yellow','bright','happy','warm'], verbs:['shine','swim','twinkle','go'], facts:['The sun is yellow.','Ducks are yellow.'] },
    { key:'family', emoji:'👨‍👩‍👧',nouns:['mom','dad','baby','sister'],       adjs:['kind','happy','small','big'],       verbs:['hug','play','read','help'], facts:['Family loves you.','We help each other.'] },
    { key:'food',   emoji:'🍎', nouns:['apple','banana','pizza','bread'], adjs:['red','yellow','yummy','warm'], verbs:['grow','bake','eat','share'], facts:['Fruit is healthy.','We share food.'] },
    { key:'school', emoji:'🏫', nouns:['teacher','book','desk','pen'],    adjs:['new','small','big','clean'],       verbs:['read','write','draw','play'], facts:['School is fun.','We learn at school.'] },
    { key:'numbers',emoji:'🔢', nouns:['one','two','three','four'],      adjs:['first','next','small','big'],      verbs:['count','add','show','play'], facts:['We count with numbers.','Math is fun.'] },
    { key:'weather',emoji:'☀️', nouns:['sun','rain','cloud','snow'],     adjs:['warm','wet','white','cold'],      verbs:['shine','fall','float','rest'], facts:['Rain helps plants.','Snow is cold and white.'] },
    { key:'body',   emoji:'🧍', nouns:['hand','foot','eye','ear'],        adjs:['small','big','kind','strong'],     verbs:['wave','walk','see','hear'], facts:['We see with eyes.','We walk with feet.'] },
    { key:'truck',  emoji:'🚚', nouns:['truck','car','bus','boat'],      adjs:['big','red','blue','fast'],        verbs:['go','drive','ride','stop'], facts:['Trucks carry things.','Buses take us places.'] },
    { key:'train',  emoji:'🚂', nouns:['train','plane','rocket','ship'], adjs:['long','fast','high','big'],        verbs:['go','fly','ride','sail'], facts:['Trains run on tracks.','Rockets go to space.'] },
    { key:'farm',   emoji:'🚜', nouns:['cow','pig','hen','duck'],        adjs:['big','small','white','pink'],      verbs:['moo','oink','cluck','quack'], facts:['Cows give milk.','Hens lay eggs.'] },
    { key:'zoo',    emoji:'🦁', nouns:['tiger','zebra','giraffe','panda'], adjs:['big','striped','tall','black'], verbs:['roar','run','eat','play'], facts:['Zoos have many animals.','Giraffes have long necks.'] },
    { key:'ocean',  emoji:'🐳', nouns:['whale','dolphin','shark','crab'],adjs:['big','blue','small','fast'],      verbs:['swim','dive','hide','pinch'], facts:['Whales are huge.','Dolphins are smart.'] },
    { key:'space',  emoji:'🚀', nouns:['star','moon','planet','rocket'], adjs:['bright','far','round','fast'],    verbs:['shine','float','go','spin'], facts:['Stars are far away.','The moon shines at night.'] },
    { key:'dino',   emoji:'🦕', nouns:['dino','trex','longneck','stego'],adjs:['big','green','tall','small'],     verbs:['walk','roar','eat','rest'], facts:['Dinosaurs lived long ago.','Some dinosaurs were huge.'] },
    { key:'happy',  emoji:'😊', nouns:['smile','laugh','friend','party'],adjs:['happy','big','warm','kind'],      verbs:['smile','play','hug','sing'], facts:['Smiles are nice.','Friends are fun.'] },
    { key:'book',   emoji:'📚', nouns:['book','story','word','picture'], adjs:['new','small','big','colorful'],   verbs:['read','draw','show','learn'], facts:['Books teach us.','We read every day.'] },
    { key:'music',  emoji:'🎵', nouns:['song','drum','bell','piano'],    adjs:['loud','soft','happy','bright'],   verbs:['sing','play','ring','listen'],facts:['Music is fun.','We sing songs.'] }
  ];

  /* ---------- 14 个阅读级别（幼儿3岁 → 小学6年级） ---------- */
  var LEVELS = [
    { code:'L1',  name:'幼儿启蒙', age:'3-4岁',  grade:'学前',   band:0, pages:[4,5] },
    { code:'L2',  name:'幼儿起步', age:'4-5岁',  grade:'学前',   band:0, pages:[4,5] },
    { code:'L3',  name:'幼小衔接', age:'5-6岁',  grade:'学前',   band:0, pages:[5,6] },
    { code:'L4',  name:'一年级上', age:'6-7岁',  grade:'G1上',   band:1, pages:[5,6] },
    { code:'L5',  name:'一年级下', age:'7岁',    grade:'G1下',   band:1, pages:[6,7] },
    { code:'L6',  name:'二年级上', age:'7-8岁',  grade:'G2上',   band:1, pages:[6,7] },
    { code:'L7',  name:'二年级下', age:'8岁',    grade:'G2下',   band:1, pages:[6,8] },
    { code:'L8',  name:'三年级上', age:'8-9岁',  grade:'G3上',   band:2, pages:[6,8] },
    { code:'L9',  name:'三年级下', age:'9岁',    grade:'G3下',   band:2, pages:[7,8] },
    { code:'L10', name:'四年级',   age:'9-10岁', grade:'G4',     band:2, pages:[7,9] },
    { code:'L11', name:'五年级上', age:'10-11岁',grade:'G5上',   band:3, pages:[7,9] },
    { code:'L12', name:'五年级下', age:'11岁',   grade:'G5下',   band:3, pages:[8,10] },
    { code:'L13', name:'六年级上', age:'11-12岁',grade:'G6上',   band:3, pages:[8,10] },
    { code:'L14', name:'六年级下', age:'12岁',   grade:'G6下',   band:3, pages:[8,12] }
  ];

  /* ---------- 句子模板（按 band，重复句式教学法） ---------- */
  var TPL = {
    0: [ // 幼儿：极简单句
      function (t) { return 'I see a ' + t.rn() + '.'; },
      function (t) { return 'The ' + t.rn() + ' is ' + t.ra() + '.'; },
      function (t) { return 'Look at the ' + t.rn() + '!'; },
      function (t) { return 'A ' + t.rn() + ' can ' + t.rv() + '.'; },
      function (t) { return 'This is my ' + t.rn() + '.'; },
      function (t) { return 'The ' + t.rn() + ' is ' + t.ra() + '.'; }
    ],
    1: [ // 一二年级：一句带连接
      function (t) { return 'The ' + t.rn() + ' is ' + t.ra() + '. It can ' + t.rv() + '.'; },
      function (t) { return 'I have a ' + t.rn() + '. The ' + t.rn() + ' is ' + t.ra() + '.'; },
      function (t) { return 'We see the ' + t.rn() + '. It is ' + t.ra() + ' and ' + t.ra() + '.'; },
      function (t) { return 'The ' + t.rn() + ' and the ' + t.rn2() + ' are ' + t.ra() + '.'; },
      function (t) { return cap(t.rn()) + ' can ' + t.rv() + '. ' + cap(t.rn2()) + ' can ' + t.rv() + '.'; }
    ],
    2: [ // 三四年级：两句组合
      function (t) { return 'The ' + t.rn() + ' is ' + t.ra() + '. It likes to ' + t.rv() + ' all day.'; },
      function (t) { return 'My ' + t.rn() + ' is ' + t.ra() + '. We play and ' + t.rv() + ' together.'; },
      function (t) { return 'In the morning, the ' + t.rn() + ' is ' + t.ra() + '. At night it can ' + t.rv() + '.'; },
      function (t) { return 'A ' + t.ra() + ' ' + t.rn() + ' can ' + t.rv() + '. It is fun to watch.'; }
    ],
    3: [ // 五六年级：短段落
      function (t) { return 'The ' + t.rn() + ' is a ' + t.ra() + ' animal. It can ' + t.rv() + ' and ' + t.rv() + '. Many children like it.'; },
      function (t) { return 'Long ago, a ' + t.ra() + ' ' + t.rn() + ' lived by the sea. It liked to ' + t.rv() + ' every day.'; },
      function (t) { return 'We can ' + t.rv() + ' with a ' + t.rn() + '. A ' + t.ra() + ' ' + t.rn() + ' makes us happy.'; }
    ]
  };

  var TITLE_PATTERNS = [
    function (th) { return 'My ' + cap(th.nouns[0]); },
    function (th) { return 'The ' + cap(th.adjs[0]) + ' ' + th.nouns[0]; },
    function (th) { return 'A ' + cap(th.nouns[0]) + ' Story'; },
    function (th) { return 'Little ' + cap(th.nouns[0]); },
    function (th) { return 'The ' + cap(th.nouns[0]) + ' Book'; },
    function (th) { return cap(th.nouns[0]) + ' and Friends' }
  ];

  /* ---------- 生成 1000 本 ---------- */
  function buildReaders() {
    var TOTAL = 1400;
    var base = Math.floor(TOTAL / LEVELS.length);     // 71
    var rem = TOTAL - base * LEVELS.length;            // 6
    var counts = LEVELS.map(function (_, i) { return base + (i < rem ? 1 : 0); });

    var out = [];
    var usedTitles = {};
    var id = 0;
    for (var li = 0; li < LEVELS.length; li++) {
      var lv = LEVELS[li];
      for (var k = 0; k < counts[li]; k++) {
        var theme = THEMES[id % THEMES.length];
        // 书 ID 播种，确定性
        var seed = (Math.imul(id + 1, 2654435761)) >>> 0;
        var rnd = mulberry32(seed);
        var pick = function (a) { return a[Math.floor(rnd() * a.length)]; };
        var c = {
          rn:  function () { return pick(theme.nouns); },
          rn2: function () { return pick(theme.nouns); },
          ra:  function () { return pick(theme.adjs); },
          rv:  function () { return pick(theme.verbs); }
        };
        var pmin = lv.pages[0], pmax = lv.pages[1];
        var npages = pmin + Math.floor(rnd() * (pmax - pmin + 1));
        var pages = [];
        var tpls = TPL[lv.band];
        for (var p = 0; p < npages; p++) {
          var text = tpls[Math.floor(rnd() * tpls.length)](c);
          pages.push({ emoji: theme.emoji, text: text });
        }
        var pidx = Math.floor(rnd() * TITLE_PATTERNS.length);
        var core = TITLE_PATTERNS[pidx](theme);
        var baseTitle = core + ' (' + lv.code + ')';
        var title = baseTitle, tnum = 2;
        while (usedTitles[title]) { title = core + ' (' + lv.code + ' ' + tnum + ')'; tnum++; }
        usedTitles[title] = true;
        var isNon = (id % 3 === 0);
        var tip = isNon
          ? (theme.facts ? pick(theme.facts) : '鼓励孩子跟读每一句，注意单词发音。')
          : '鼓励孩子跟读每一句，注意单词发音。';
        out.push({
          id: 'b' + String(id).padStart(4, '0'),
          title: title,
          level: lv.code,
          levelName: lv.name,
          age: lv.age,
          grade: lv.grade,
          emoji: theme.emoji,
          type: isNon ? 'nonfiction' : 'fiction',
          pages: pages,
          tip: tip
        });
        id++;
      }
    }
    return out;
  }

  window.READERS = buildReaders();
  window.READER_LEVELS = LEVELS;
})();
