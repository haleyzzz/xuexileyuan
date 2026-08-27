/* grades.js — 7 级年级难度体系（0=幼儿园 ~ 6=六年级）
 * 全站统一标尺（数值）：单词(words) / 短文(essays) / 分级阅读(readers) 共用。
 * 孩子档案(accounts.js)用 grade 字段(0~6)关联；阅读与单词均按年级筛选，
 * 保证哥哥(Zachary=4 四年级)与弟弟(Zoran=0 幼儿园)看到各自适龄、独立完整的内容。
 */
window.GRADES = [
  { code:0, label:'幼儿园', short:'K', min:3,  max:6,  band:0, words:[50,100] },
  { code:1, label:'一年级', short:'1', min:6,  max:7,  band:1, words:[80,140] },
  { code:2, label:'二年级', short:'2', min:7,  max:8,  band:1, words:[120,180] },
  { code:3, label:'三年级', short:'3', min:8,  max:9,  band:2, words:[160,240] },
  { code:4, label:'四年级', short:'4', min:9,  max:10, band:2, words:[200,320] },
  { code:5, label:'五年级', short:'5', min:10, max:11, band:3, words:[240,400] },
  { code:6, label:'六年级', short:'6', min:11, max:12, band:3, words:[300,500] }
];
window.GRADE_ORDER = window.GRADES.map(function (g) { return g.code; }); // [0,1,2,3,4,5,6]
window.gradeIndex = function (c) { return window.GRADE_ORDER.indexOf(c); };
window.gradeLabel = function (c) {
  var i = window.gradeIndex(c); return i >= 0 ? window.GRADES[i].label : ('G' + c);
};
window.gradeWordRange = function (c) {
  var i = window.gradeIndex(c); return i >= 0 ? window.GRADES[i].words : [50, 100];
};
/* 以 code(0~6) 为中心、跨度 span 的年级列表（适龄 ±1 筛选，给孩子挑战/复习空间） */
window.gradeRange = function (c, span) {
  span = (span == null) ? 1 : span;
  var i = window.gradeIndex(c);
  if (i < 0) return [c];
  var out = [];
  for (var d = -span; d <= span; d++) {
    var j = i + d;
    if (j >= 0 && j < window.GRADES.length) out.push(window.GRADE_ORDER[j]);
  }
  return out;
};
/* 分级阅读旧 grade 字符串(学前 / G1上 / G6下 …) → 数值 code 映射 */
window.readerGradeToCode = function (g) {
  if (!g) return 0;
  if (g.indexOf('学前') >= 0) return 0;
  var m = g.match(/G(\d)/);
  if (m) return +m[1];
  return 0;
};
