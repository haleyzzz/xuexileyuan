/* rewards.js — 积分银行 + 奖励商城核心逻辑
 * 积分余额 = 自动折算(学习时长 + 打卡完成项 + 掌握单词 + 连续跳绳) + 家长手动加分 − 已兑换
 * 所有进度按 child uid 隔离；奖励目录(reward_catalog_v1)为全局家长配置，两孩子共用。
 * 依赖：accounts.js（提供 USERS / 双账户隔离约定，本文件仅用 localStorage 直接读写）。
 */
(function () {
  'use strict';
  var R = window.Rewards || (window.Rewards = {});

  /* ---------- 安全读写 ---------- */
  function lsGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  /* ---------- 默认奖励目录（混合：实物 / 特权 / 虚拟），家长可在积分商城管理页改删 ---------- */
  var DEFAULT_CATALOG = [
    { id: 'tv30',    emoji: '📺', name: '多看动画片 30 分钟', cost: 20,  type: '特权' },
    { id: 'late15',  emoji: '🌙', name: '晚睡 15 分钟',       cost: 25,  type: '特权' },
    { id: 'icecream',emoji: '🍦', name: '冰淇淋一支',         cost: 30,  type: '实物' },
    { id: 'game20',  emoji: '🎮', name: '游戏时间 20 分钟',   cost: 40,  type: '特权' },
    { id: 'brave',   emoji: '🏅', name: '勇敢勋章',           cost: 50,  type: '虚拟' },
    { id: 'movie',   emoji: '🍿', name: '周末电影之夜',       cost: 60,  type: '特权' },
    { id: 'toy',     emoji: '🧸', name: '小玩具一个',         cost: 80,  type: '实物' },
    { id: 'star',    emoji: '👑', name: '学习之星',           cost: 100, type: '虚拟' },
    { id: 'book',    emoji: '📗', name: '绘本一本',           cost: 120, type: '实物' },
    { id: 'pizza',   emoji: '🍕', name: '披萨晚餐',           cost: 150, type: '实物' },
    { id: '100words',emoji: '🌟', name: '百词斩将',           cost: 200, type: '虚拟' }
  ];

  /* ---------- 自动折算来源 ---------- */
  // 学习时长模块名（与 study-time.js 的 KEYS、进度看板 _tl 对齐）。
  // 覆盖所有 StudyTime.track 实际调用的模块：单词认读(wordtrain-read)/拼写(spell)/听写(dictation)/
  // 自然拼读(phonics)/阅读(reader)/每日打卡(engci)/语法卡(grammar)/PEP(pep)；word、story 为兼容预留。
  var TIME_MODS = ['word', 'spell', 'dictation', 'story', 'reader', 'engci', 'phonics', 'pep', 'grammar', 'wordtrain-read'];
  // 打卡记录键（按 uid 拼接）
  function checkinKeys(uid) {
    return [
      'chineseCheckIn_' + uid + '_v1',
      'mathCheckIn_' + uid + '_v1',
      'scienceCheckIn_' + uid + '_v1',
      'engci_' + uid + '_history'
    ];
  }

  function countCheckinItems(uid) {
    var n = 0;
    checkinKeys(uid).forEach(function (k) {
      var d = lsGet(k, null); if (!d || typeof d !== 'object') return;
      if (d.records) {                       // 语/数/科：{records:{date:{taskId:1}}}
        for (var day in d.records) { var r = d.records[day]; if (r && typeof r === 'object') n += Object.keys(r).length; }
      } else {                               // 英语 engci：{date: 完成模块数(数字)}
        for (var day2 in d) {
          var v = d[day2];
          if (typeof v === 'number') n += v;
          else if (v && typeof v === 'object') n += Object.keys(v).length;
        }
      }
    });
    return n;
  }
  function countMastered(uid) {
    var a = lsGet('wordtrain_' + uid + '_read', []) || [];
    var b = lsGet('wordtrain_' + uid + '_mastered', []) || [];
    return (Array.isArray(a) ? a.length : 0) + (Array.isArray(b) ? b.length : 0);
  }
  function studySeconds(uid) {
    var s = 0;
    TIME_MODS.forEach(function (m) { s += Number(lsGet('time_' + uid + '_' + m, 0)) || 0; });
    return s;
  }

  // 折算为积分（规则：每5分钟=1分，每项打卡=1分，每个掌握单词=2分，连续跳绳每满7天=5分，亲子共读每天=3分）
  function earned(uid) {
    return Math.floor(studySeconds(uid) / 300) + countCheckinItems(uid) + countMastered(uid) * 2 + ropePts(uid) + readPts(uid);
  }
  function earnedBreakdown(uid) {
    return {
      timePts: Math.floor(studySeconds(uid) / 300),
      checkinPts: countCheckinItems(uid),
      wordPts: countMastered(uid) * 2,
      ropePts: ropePts(uid),
      ropeStreak: ropeStreak(uid),
      readPts: readPts(uid),
      readDays: readDays(uid),
      sec: studySeconds(uid)
    };
  }

  /* ---------- 亲子共读积分（v93 新增） ----------
   * 数据源：家长陪读页存的 parent_read_<uid>（日期数组，家长每天点一次「陪读打卡」即记一条）。
   * 规则：每陪读 1 天 = +3 分（与掌握单词同量级，体现亲子共读的时间价值）。
   * 这部分积分随 parent_read 数据自动折算进余额，无需手动加分、不与手动加分重复计。 */
  function readDays(uid) {
    try { var a = JSON.parse(localStorage.getItem('parent_read_' + uid)); return Array.isArray(a) ? a.length : 0; }
    catch (e) { return 0; }
  }
  function readPts(uid) { return readDays(uid) * 3; }

  /* ---------- 每日跳绳连续奖励（v80 调整力度） ----------
   * 数据源：weekplan_<uid>_weeks（统一打卡中心周计划）中 rope@YYYY-MM-DD 键。
   * 规则：连续每满 7 天 = +10 分；单个连续段满 30 天额外 +20 分（满月大奖）；
   * 单段满 100 天额外 +50 分（终极百天大奖）。
   * 积分写入固化键 reward_rope_<uid>，只增不减——
   * 周计划仅保留近 12 周，历史裁剪不会导致已获积分回撤。 */
  function ropeDates(uid) {
    var w = lsGet('weekplan_' + uid + '_weeks', {}) || {};
    var set = {};
    for (var wk in w) {
      if (!w[wk] || typeof w[wk] !== 'object') continue;
      for (var k in w[wk]) { if (k.indexOf('rope@') === 0) set[k.slice(5)] = 1; }
    }
    return Object.keys(set).sort();          // ISO 日期串字典序即时间序
  }
  function tsOf(s) { var t = Date.parse(s + 'T00:00:00'); return isNaN(t) ? null : t; }
  function ropeMilestones(dates) {           // 历史上「连续每满7天」的次数
    var ms = 0, run = 0, prev = null;
    for (var i = 0; i < dates.length; i++) {
      var t = tsOf(dates[i]); if (t === null) continue;
      run = (prev !== null && Math.round((t - prev) / 86400000) === 1) ? run + 1 : 1;
      prev = t;
      if (run % 7 === 0) ms++;
    }
    return ms;
  }
  function ropeCalc(dates) {                 // 积分：每满7天+10；满30天+20；满100天+50
    var pts = 0, run = 0, prev = null;
    for (var i = 0; i < dates.length; i++) {
      var t = tsOf(dates[i]); if (t === null) continue;
      run = (prev !== null && Math.round((t - prev) / 86400000) === 1) ? run + 1 : 1;
      prev = t;
      if (run % 7 === 0) pts += 10;
      if (run === 30) pts += 20;
      if (run === 100) pts += 50;
    }
    return pts;
  }
  function ropeStreak(uid) {                 // 当前连续天数（今天没打则从昨天起算）
    var ds = ropeDates(uid), map = {};
    for (var i = 0; i < ds.length; i++) { var t = tsOf(ds[i]); if (t !== null) map[t] = 1; }
    var d = new Date(); d.setHours(0, 0, 0, 0);
    if (!map[d.getTime()]) d.setDate(d.getDate() - 1);
    var n = 0;
    while (map[d.getTime()]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function ropePts(uid) {                    // 入账积分（只增不减）
    var pts = ropeCalc(ropeDates(uid));
    var banked = Number(lsGet('reward_rope_' + uid, 0)) || 0;
    if (pts > banked) { banked = pts; lsSet('reward_rope_' + uid, banked); }
    return banked;
  }

  /* ---------- 家长手动加分 ---------- */
  function bonusList(uid) { return lsGet('reward_bonus_' + uid, []) || []; }
  function bonusTotal(uid) { var l = bonusList(uid), s = 0; for (var i = 0; i < l.length; i++) s += (Number(l[i].n) || 0); return s; }
  function addBonus(uid, n, note) {
    n = Math.max(0, Math.floor(Number(n) || 0));
    if (n <= 0) return false;
    var l = bonusList(uid); l.push({ ts: Date.now(), n: n, note: note || '' });
    lsSet('reward_bonus_' + uid, l); return true;
  }

  /* ---------- 兑换记录 ---------- */
  function history(uid) { return lsGet('reward_redeem_' + uid, []) || []; }
  function spentTotal(uid) { var l = history(uid), s = 0; for (var i = 0; i < l.length; i++) s += (Number(l[i].cost) || 0); return s; }

  /* ---------- 余额 ---------- */
  function balance(uid) { return earned(uid) + bonusTotal(uid) - spentTotal(uid); }

  /* ---------- 奖励目录（全局） ---------- */
  function catalog() {
    var c = lsGet('reward_catalog_v1', null);
    if (c && Array.isArray(c) && c.length) return c;
    return DEFAULT_CATALOG.slice();
  }
  function setCatalog(arr) { if (Array.isArray(arr)) lsSet('reward_catalog_v1', arr); }
  function addReward(r) { var c = catalog(); c.push(r); setCatalog(c); }
  function updateReward(id, patch) {
    var c = catalog();
    for (var i = 0; i < c.length; i++) { if (c[i].id === id) { for (var k in patch) c[i][k] = patch[k]; break; } }
    setCatalog(c);
  }
  function removeReward(id) { setCatalog(catalog().filter(function (r) { return r.id !== id; })); }

  /* ---------- 兑换 ---------- */
  function redeem(uid, rewardId) {
    var c = catalog(), r = null;
    for (var i = 0; i < c.length; i++) { if (c[i].id === rewardId) { r = c[i]; break; } }
    if (!r) return { ok: false, msg: '奖励不存在' };
    var b = balance(uid);
    if (b < r.cost) return { ok: false, msg: '积分不足，还差 ' + (r.cost - b) + ' 分' };
    var l = history(uid);
    l.push({ id: r.id, emoji: r.emoji, name: r.name, cost: r.cost, ts: Date.now(), status: 'pending' });
    lsSet('reward_redeem_' + uid, l);
    return { ok: true, reward: r };
  }
  function markDone(uid, ts) {
    var l = history(uid);
    for (var i = 0; i < l.length; i++) { if (l[i].ts === ts) { l[i].status = 'done'; break; } }
    lsSet('reward_redeem_' + uid, l);
  }

  R.earned = earned;
  R.earnedBreakdown = earnedBreakdown;
  R.ropePts = ropePts;
  R.ropeStreak = ropeStreak;
  R.readPts = readPts;
  R.readDays = readDays;
  R.bonusTotal = bonusTotal;
  R.spentTotal = spentTotal;
  R.balance = balance;
  R.catalog = catalog;
  R.setCatalog = setCatalog;
  R.addReward = addReward;
  R.updateReward = updateReward;
  R.removeReward = removeReward;
  R.redeem = redeem;
  R.history = history;
  R.addBonus = addBonus;
  R.markDone = markDone;
  R.DEFAULT_CATALOG = DEFAULT_CATALOG;
})();
