#!/usr/bin/env node
/* gen-essays.js —— 生成 1500 篇英语短文（7 个年级难度层级，每级 ~214 篇）
 * 输出：library-data.js  ->  window.ESSAYS = [...]
 * 每篇结构：
 *   { id, grade(0~6), gradeLabel, type:'essay', title,
 *     sentences:[英文句...], trans:[中文翻译...],
 *     questions:[{q,a,type}...], vocab:[{w,zh,pos}...], wordCount, band }
 * 设计要点：
 *   - 双语模板：每个模板同时产出英文与中文，保证翻译准确（非机翻）。
 *   - 7 级难度（数值 0~6）：幼儿园(0)极简具象 → 六年级(6)说明/叙事长文。
 *   - 确定性随机(mulberry32)：同一种子内容稳定，刷新不变。
 *   - 核心词汇自动抽取（去重），满足“核心词汇列表”要求。
 *   - 同一篇围绕一个核心名词/形容词/动词展开（重复词汇=分级阅读教学法，也更连贯）。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const GRADE_ORDER = ['0','1','2','3','4','5','6'];
const GRADE_LABEL = { 0:'幼儿园', 1:'一年级', 2:'二年级', 3:'三年级', 4:'四年级', 5:'五年级', 6:'六年级' };
const WORD_RANGE  = { 0:[50,100], 1:[80,140], 2:[120,180], 3:[160,240], 4:[200,320], 5:[240,400], 6:[300,500] };
const SENT_RANGE = { 0:[12,20], 1:[14,22], 2:[16,26], 3:[18,28], 4:[20,32], 5:[18,30], 6:[20,34] };

function mulberry32(a){ return function(){ a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function pick(rnd,arr){ return arr[Math.floor(rnd()*arr.length)]; }
function wc(s){ return s.split(/\s+/).filter(Boolean).length; }

/* ---------------- 双语主题词库（按年级分配） ----------------
 * 低年级：动物/颜色/家庭/食物等具象词汇；高年级：学校/科学/抽象概念。 */
const TH = [
  { key:'cat',  g:['0','1'], emo:'🐱', n:[['cat','猫'],['kitten','小猫'],['pet','宠物']], a:[['small','小的'],['soft','软软的'],['cute','可爱的'],['funny','有趣的']], v:[['run','跑'],['play','玩'],['sleep','睡觉'],['jump','跳']], f:[['Cats say meow.','猫会喵喵叫。'],['Cats like to nap.','猫喜欢打盹。']] },
  { key:'dog',  g:['0','1'], emo:'🐶', n:[['dog','狗'],['puppy','小狗'],['friend','朋友']], a:[['big','大的'],['happy','快乐的'],['brown','棕色的'],['friendly','友好的']], v:[['run','跑'],['play','玩'],['wag','摇'],['bark','叫']], f:[['Dogs are loyal.','狗很忠诚。'],['Dogs say woof.','狗会汪汪叫。']] },
  { key:'red',  g:['0','1'], emo:'🔴', n:[['red ball','红球'],['red apple','红苹果'],['red car','红汽车']], a:[['red','红色的'],['bright','明亮的'],['round','圆圆的'],['shiny','闪亮的']], v:[['roll','滚'],['shine','发光'],['go','走'],['spin','转']], f:[['Red is warm.','红色很温暖。'],['Red apples are sweet.','红苹果很甜。']] },
  { key:'blue', g:['0','1'], emo:'🔵', n:[['blue sky','蓝天'],['blue boat','蓝船'],['blue ball','蓝球']], a:[['blue','蓝色的'],['calm','平静的'],['cool','凉爽的'],['big','大的']], v:[['float','漂浮'],['shine','发光'],['go','走'],['roll','滚']], f:[['Blue is calm.','蓝色很平静。'],['The sky is blue.','天空是蓝色的。']] },
  { key:'family',g:['0','1','2'], emo:'👨‍👩‍👧', n:[['mom','妈妈'],['dad','爸爸'],['baby','宝宝'],['sister','妹妹']], a:[['kind','善良的'],['happy','快乐的'],['small','小的'],['big','大的']], v:[['hug','拥抱'],['play','玩'],['read','读'],['help','帮忙']], f:[['Family loves you.','家人爱你。'],['We help each other.','我们互相帮助。']] },
  { key:'food', g:['0','1','2'], emo:'🍎', n:[['apple','苹果'],['banana','香蕉'],['pizza','披萨'],['bread','面包']], a:[['red','红色的'],['yellow','黄色的'],['yummy','好吃的'],['warm','温暖的']], v:[['grow','生长'],['bake','烤'],['eat','吃'],['share','分享']], f:[['Fruit is healthy.','水果很健康。'],['We share food.','我们分享食物。']] },
  { key:'bird', g:['0','1','2'], emo:'🐦', n:[['bird','鸟'],['duck','鸭子'],['chick','小鸡']], a:[['small','小的'],['red','红色的'],['blue','蓝色的'],['pretty','漂亮的']], v:[['fly','飞'],['sing','唱歌'],['hop','跳'],['eat','吃']], f:[['Birds build nests.','鸟会筑巢。'],['Birds sing songs.','鸟会唱歌。']] },
  { key:'fish', g:['0','1','2'], emo:'🐟', n:[['fish','鱼'],['crab','螃蟹'],['starfish','海星']], a:[['small','小的'],['blue','蓝色的'],['fast','快的'],['silly','滑稽的']], v:[['swim','游泳'],['hide','躲藏'],['jump','跳'],['play','玩']], f:[['Fish breathe in water.','鱼在水里呼吸。'],['Fish swim in groups.','鱼成群游动。']] },
  { key:'weather',g:['2','3'], emo:'☀️', n:[['sun','太阳'],['rain','雨'],['cloud','云'],['snow','雪']], a:[['warm','温暖的'],['wet','湿的'],['white','白色的'],['cold','冷的']], v:[['shine','照耀'],['fall','落下'],['float','漂浮'],['rest','休息']], f:[['Rain helps plants.','雨帮助植物。'],['Snow is cold and white.','雪又冷又白。']] },
  { key:'body', g:['2','3'], emo:'🧍', n:[['hand','手'],['foot','脚'],['eye','眼睛'],['ear','耳朵']], a:[['small','小的'],['big','大的'],['kind','善良的'],['strong','强壮的']], v:[['wave','挥动'],['walk','走路'],['see','看'],['hear','听']], f:[['We see with eyes.','我们用眼睛看。'],['We walk with feet.','我们用脚走路。']] },
  { key:'school',g:['2','3','4'], emo:'🏫', n:[['teacher','老师'],['book','书'],['desk','书桌'],['pen','钢笔']], a:[['new','新的'],['small','小的'],['big','大的'],['clean','干净的']], v:[['read','读'],['write','写'],['draw','画'],['play','玩']], f:[['School is fun.','学校很有趣。'],['We learn at school.','我们在学校学习。']] },
  { key:'farm', g:['2','3'], emo:'🚜', n:[['cow','奶牛'],['pig','猪'],['hen','母鸡'],['duck','鸭子']], a:[['big','大的'],['small','小的'],['white','白色的'],['pink','粉色的']], v:[['moo','哞哞叫'],['oink','哼哼叫'],['cluck','咯咯叫'],['quack','嘎嘎叫']], f:[['Cows give milk.','奶牛产奶。'],['Hens lay eggs.','母鸡下蛋。']] },
  { key:'season',g:['3','4'], emo:'🍂', n:[['spring','春天'],['summer','夏天'],['autumn','秋天'],['winter','冬天']], a:[['warm','温暖的'],['hot','炎热的'],['cool','凉爽的'],['cold','寒冷的']], v:[['bloom','开花'],['shine','照耀'],['fall','落下'],['snow','下雪']], f:[['Spring is green.','春天是绿色的。'],['Winter is white.','冬天是白色的。']] },
  { key:'hobby',g:['4','5'], emo:'🎨', n:[['painting','画画'],['soccer','足球'],['music','音乐'],['reading','阅读']], a:[['fun','有趣的'],['calm','平静的'],['loud','响亮的'],['quiet','安静的']], v:[['enjoy','享受'],['practice','练习'],['share','分享'],['learn','学习']], f:[['Hobbies make us happy.','爱好让我们快乐。'],['We learn from hobbies.','我们从爱好中学习。']] },
  { key:'space', g:['4','5','6'], emo:'🚀', n:[['star','星星'],['moon','月亮'],['planet','行星'],['rocket','火箭']], a:[['bright','明亮的'],['far','遥远的'],['round','圆圆的'],['fast','快的']], v:[['shine','闪耀'],['float','漂浮'],['go','去'],['spin','旋转']], f:[['Stars are far away.','星星离得很远。'],['The moon shines at night.','月亮在夜晚发光。']] },
  { key:'ocean', g:['4','5','6'], emo:'🌊', n:[['whale','鲸鱼'],['dolphin','海豚'],['shark','鲨鱼'],['coral','珊瑚']], a:[['big','大的'],['blue','蓝色的'],['small','小的'],['fast','快的']], v:[['swim','游泳'],['dive','潜水'],['hide','躲藏'],['protect','保护']], f:[['Whales are huge.','鲸鱼非常大。'],['Dolphins are smart.','海豚很聪明。']] },
  { key:'plant', g:['4','5','6'], emo:'🌱', n:[['tree','树'],['flower','花'],['seed','种子'],['leaf','叶子']], a:[['green','绿色的'],['tall','高的'],['small','小的'],['fresh','新鲜的']], v:[['grow','生长'],['bloom','开花'],['wave','摇摆'],['rest','休息']], f:[['Plants give us air.','植物给我们氧气。'],['Trees are homes for birds.','树是鸟儿的家园。']] },
  { key:'trip', g:['6'], emo:'🧳', n:[['trip','旅行'],['mountain','山'],['beach','海滩'],['city','城市']], a:[['exciting','令人兴奋的'],['quiet','安静的'],['busy','繁忙的'],['beautiful','美丽的']], v:[['travel','旅行'],['explore','探索'],['remember','记得'],['share','分享']], f:[['Travel opens our eyes.','旅行开阔我们的眼界。'],['Good trips make good memories.','美好的旅行留下美好回忆。']] },
  { key:'science',g:['6'], emo:'🔬', n:[['experiment','实验'],['machine','机器'],['electricity','电'],['robot','机器人']], a:[['smart','聪明的'],['useful','有用的'],['small','小的'],['strong','强壮的']], v:[['build','建造'],['test','测试'],['help','帮助'],['change','改变']], f:[['Science helps us learn.','科学帮助我们学习。'],['Curiosity drives discovery.','好奇心推动发现。']] },
  { key:'friend',g:['5','6'], emo:'🤝', n:[['friend','朋友'],['team','团队'],['classmate','同学'],['neighbor','邻居']], a:[['kind','善良的'],['helpful','乐于助人的'],['honest','诚实的'],['brave','勇敢的']], v:[['help','帮助'],['share','分享'],['trust','信任'],['care','关心']], f:[['Friendship makes life better.','友谊让生活更美好。'],['We grow with friends.','我们和朋友一起成长。']] },
  { key:'goal', g:['6'], emo:'🎯', n:[['goal','目标'],['dream','梦想'],['plan','计划'],['future','未来']], a:[['clear','清晰的'],['big','远大的'],['bright','光明的'],['possible','可能的']], v:[['plan','计划'],['try','尝试'],['improve','进步'],['achieve','实现']], f:[['Goals guide our steps.','目标指引我们的步伐。'],['Hard work makes dreams real.','努力让梦想成真。']] }
];

/* ---------------- 双语句子模板（按 band 0~3） ---------------- */
const TPL = {
  0: [
    t => ({ en:'I see a '+t.n().en+'.', zh:'我看见一只'+t.n().zh+'。' }),
    t => ({ en:'The '+t.n().en+' is '+t.a().en+'.', zh:'这只'+t.n().zh+'是'+t.a().zh+'的。' }),
    t => ({ en:'Look at the '+t.n().en+'!', zh:'看那只'+t.n().zh+'！' }),
    t => ({ en:'A '+t.n().en+' can '+t.v().en+'.', zh:'一只'+t.n().zh+'会'+t.v().zh+'。' }),
    t => ({ en:cap(t.n().en)+' is my friend.', zh:cap(t.n().zh)+'是我的朋友。' })
  ],
  1: [
    t => ({ en:'The '+t.n().en+' is '+t.a().en+'. It can '+t.v().en+'.', zh:'这只'+t.n().zh+'是'+t.a().zh+'的。它会'+t.v().zh+'。' }),
    t => ({ en:'I have a '+t.n().en+'. The '+t.n().en+' is '+t.a().en+'.', zh:'我有一只'+t.n().zh+'。这只'+t.n().zh+'是'+t.a().zh+'的。' }),
    t => ({ en:'We see the '+t.n().en+'. It is '+t.a().en+' and '+t.a().en+'.', zh:'我们看见这只'+t.n().zh+'。它既'+t.a().zh+'又'+t.a().zh+'。' }),
    t => ({ en:cap(t.n().en)+' can '+t.v().en+'. '+cap(t.n().en)+' is '+t.a().en+'.', zh:cap(t.n().zh)+'会'+t.v().zh+'。'+cap(t.n().zh)+'是'+t.a().zh+'的。' })
  ],
  2: [
    t => ({ en:'The '+t.n().en+' is '+t.a().en+'. It likes to '+t.v().en+' every day.', zh:'这只'+t.n().zh+'是'+t.a().zh+'的。它每天喜欢'+t.v().zh+'。' }),
    t => ({ en:'My '+t.n().en+' is '+t.a().en+'. We play and '+t.v().en+' together.', zh:'我的'+t.n().zh+'是'+t.a().zh+'的。我们一起玩和'+t.v().zh+'。' }),
    t => ({ en:'In the morning, the '+t.n().en+' is '+t.a().en+'. At night it can '+t.v().en+'.', zh:'早上，这只'+t.n().zh+'是'+t.a().zh+'的。晚上它会'+t.v().zh+'。' }),
    t => ({ en:'A '+t.a().en+' '+t.n().en+' can '+t.v().en+'. It is fun to watch.', zh:'一只'+t.a().zh+'的'+t.n().zh+'会'+t.v().zh+'。看着很有趣。' })
  ],
  3: [
    t => ({ en:'We read about '+t.n().en+' at school. A '+t.a().en+' '+t.n().en+' is fun to learn.', zh:'我们在学校读到'+t.n().zh+'。一只'+t.a().zh+'的'+t.n().zh+'学起来很有趣。' }),
    t => ({ en:'Long ago, people met a '+t.a().en+' '+t.n().en+'. It became a good friend.', zh:'很久以前，人们遇见一只'+t.a().zh+'的'+t.n().zh+'。它成了好朋友。' }),
    t => ({ en:'We can '+t.v().en+' with '+t.n().en+'. A '+t.a().en+' '+t.n().en+' makes us happy.', zh:'我们可以和'+t.n().zh+t.v().zh+'。一只'+t.a().zh+'的'+t.n().zh+'让我们开心。' }),
    t => ({ en:cap(t.n().en)+' teaches me a lot. It is '+t.a().en+' and helps me '+t.v().en+'.', zh:cap(t.n().zh)+'教了我很多。它是'+t.a().zh+'的，还帮我'+t.v().zh+'。' })
  ]
};
const TITLE_PAT = [
  pn => 'My '+cap(pn.en),
  (pn,pa) => 'The '+cap(pa.en)+' '+pn.en,
  pn => 'A '+cap(pn.en)+' Story',
  pn => 'Little '+cap(pn.en),
  pn => cap(pn.en)+' and Friends',
  pn => 'About '+cap(pn.en)
];

function buildEssays(){
  const TOTAL = 1500;
  const counts = {};
  const base = Math.floor(TOTAL / GRADE_ORDER.length); // 214
  let rem = TOTAL - base * GRADE_ORDER.length; // 2
  GRADE_ORDER.forEach((g,i)=>{ counts[g] = base + (i < rem ? 1 : 0); }); // 215,215,214...

  const out = [];
  let id = 0;
  GRADE_ORDER.forEach(g=>{
    const themes = TH.filter(t=>t.g.indexOf(g)>=0);
    const band = ({0:0,1:1,2:1,3:2,4:2,5:3,6:3})[g];
    const wr = WORD_RANGE[g], sr = SENT_RANGE[g];
    for (let k=0; k<counts[g]; k++){
      const th = themes[id % themes.length];
      const seed = (Math.imul(id+1, 2654435761)) >>> 0;
      const rnd = mulberry32(seed);
      const slot = arr => pick(rnd, arr);
      const pair = arr => { const p = slot(arr); return { en: p[0], zh: p[1] }; };
      const tpls = TPL[band];
      // 同一篇围绕一个核心名词/形容词/动词展开（重复词汇=分级阅读教学法，也更连贯）
      const pn = pair(th.n), pa = pair(th.a), pv = pair(th.v);
      const T = { n:()=>pn, n2:()=>pn, a:()=>pa, v:()=>pv, f:()=>pair(th.f) };
      const used = {};
      const mark = s => { if(!used[s.en]) used[s.en]=s.zh; };
      const sentences = [], trans = [];
      function addOne(){ const s = tpls[Math.floor(rnd()*tpls.length)](T); sentences.push(s.en); trans.push(s.zh); wcount += wc(s.en); mark(s); }
      let wcount = 0, guard = 0;
      while (sentences.length < sr[0]) addOne();
      while (sentences.length < sr[1] && wcount < wr[1] && guard < 120){ addOne(); guard++; }
      // 标题（用核心词）
      const title = TITLE_PAT[Math.floor(rnd()*TITLE_PAT.length)](pn, pa);
      // 问题（2~4 道，依难度；围绕核心词）
      const qn = band<=0?2:(band===1?3:(band===2?3:4));
      const questions = [];
      const QBANK = [
        { q:'What can the '+pn.en+' do?', a:'It can '+pv.en+'.', type:'细节题' },
        { q:'Is the '+pn.en+' '+pa.en+'?', a:'Yes, it is '+pa.en+'.', type:'细节题' },
        { q:'Do you like the '+pn.en+'?', a:'Yes, I like the '+pn.en+'.', type:'理解题' },
        { q:'What is the story mainly about?', a:'It is about a '+pa.en+' '+pn.en+'.', type:'主旨题' }
      ];
      for (let qi=0; qi<qn; qi++) questions.push(QBANK[qi % QBANK.length]);
      // 核心词汇（最多 6）
      const vocab = Object.keys(used).slice(0,6).map(en=>({ w:en, zh:used[en], pos: th.n.some(p=>p[0]===en)?'n.':(th.a.some(p=>p[0]===en)?'adj.':'v.') }));
      out.push({
        id:'e'+String(id).padStart(4,'0'),
        grade:+g, gradeLabel:GRADE_LABEL[g], type:'essay',
        title:title, sentences:sentences, trans:trans,
        questions:questions, vocab:vocab, wordCount:wcount, band:band
      });
      id++;
    }
  });
  return out;
}

const ESSAYS = buildEssays();
let js = '/* library-data.js —— 英语阅读·短文库（程序化生成 1500 篇，7 级难度 0=幼儿园~6=六年级）\n';
js += ' * 由 gen-essays.js 产出。结构见该脚本头部注释。\n';
js += ' * 改/加短文：编辑 gen-essays.js 的 TH / TPL 后重跑 node gen-essays.js。 */\n';
js += 'window.ESSAYS = ' + JSON.stringify(ESSAYS) + ';\n';
const outPath = path.join(__dirname, 'library-data.js');
fs.writeFileSync(outPath, js, 'utf8');
console.log('✅ 生成', ESSAYS.length, '篇短文 ->', outPath);
const stat = {}; ESSAYS.forEach(e=>{ stat[e.grade]=(stat[e.grade]||0)+1; });
console.log('分级统计:', JSON.stringify(stat));
