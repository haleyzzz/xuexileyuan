/* phonics-data.js —— 自然拼读串记卡数据源（离线可读）
 * window.PHONICS 数组，每个元音音素一组：
 *   id      : 标识
 *   letter  : 字母
 *   sound   : 音标
 *   kind    : '短元音' | '长元音'
 *   families: [ { rime, words:[ {w, ipa, cn, core?} ] } ]
 * core:true 表示「考纲核心词汇」（小学一年级重点）。
 */
window.PHONICS = [
  /* ===================== 短元音 ===================== */
  { id:'a_ae', letter:'a', sound:'/æ/', kind:'短元音', families:[
    { rime:'-at', words:[
      {w:'cat',ipa:'/kæt/',cn:'猫',core:true}, {w:'hat',ipa:'/hæt/',cn:'帽子',core:true},
      {w:'bat',ipa:'/bæt/',cn:'蝙蝠'}, {w:'mat',ipa:'/mæt/',cn:'垫子'},
      {w:'rat',ipa:'/ræt/',cn:'老鼠'}, {w:'fat',ipa:'/fæt/',cn:'胖的'},
      {w:'sat',ipa:'/sæt/',cn:'坐'}, {w:'pat',ipa:'/pæt/',cn:'轻拍'} ] },
    { rime:'-an', words:[
      {w:'man',ipa:'/mæn/',cn:'男人',core:true}, {w:'map',ipa:'/mæp/',cn:'地图',core:true},
      {w:'can',ipa:'/kæn/',cn:'能'}, {w:'fan',ipa:'/fæn/',cn:'扇子'},
      {w:'pan',ipa:'/pæn/',cn:'平底锅'}, {w:'ran',ipa:'/ræn/',cn:'跑'}, {w:'van',ipa:'/væn/',cn:'厢式车'} ] },
    { rime:'-ap', words:[
      {w:'cap',ipa:'/kæp/',cn:'帽子'}, {w:'nap',ipa:'/næp/',cn:'小睡'},
      {w:'tap',ipa:'/tæp/',cn:'轻敲'} ] },
    { rime:'-ad', words:[
      {w:'dad',ipa:'/dæd/',cn:'爸爸',core:true}, {w:'bad',ipa:'/bæd/',cn:'坏的'},
      {w:'sad',ipa:'/sæd/',cn:'伤心的'}, {w:'mad',ipa:'/mæd/',cn:'生气的'} ] },
    { rime:'-ag', words:[
      {w:'bag',ipa:'/bæg/',cn:'包',core:true}, {w:'tag',ipa:'/tæg/',cn:'标签'}, {w:'rag',ipa:'/ræg/',cn:'破布'} ] },
    { rime:'-am', words:[
      {w:'jam',ipa:'/dʒæm/',cn:'果酱',core:true}, {w:'ram',ipa:'/ræm/',cn:'公羊'}, {w:'ham',ipa:'/hæm/',cn:'火腿'} ] }
  ]},
  { id:'e_e', letter:'e', sound:'/e/', kind:'短元音', families:[
    { rime:'-et', words:[
      {w:'pet',ipa:'/pet/',cn:'宠物'}, {w:'net',ipa:'/net/',cn:'网'},
      {w:'wet',ipa:'/wet/',cn:'湿的'}, {w:'vet',ipa:'/vet/',cn:'兽医'},
      {w:'jet',ipa:'/dʒet/',cn:'喷气式飞机'}, {w:'set',ipa:'/set/',cn:'一套'} ] },
    { rime:'-en', words:[
      {w:'pen',ipa:'/pen/',cn:'钢笔',core:true}, {w:'ten',ipa:'/ten/',cn:'十'},
      {w:'hen',ipa:'/hen/',cn:'母鸡'}, {w:'den',ipa:'/den/',cn:'兽穴'}, {w:'men',ipa:'/men/',cn:'男人们'} ] },
    { rime:'-ed', words:[
      {w:'red',ipa:'/red/',cn:'红色的',core:true}, {w:'bed',ipa:'/bed/',cn:'床'},
      {w:'fed',ipa:'/fed/',cn:'喂养'}, {w:'led',ipa:'/led/',cn:'带领'} ] },
    { rime:'-eg', words:[
      {w:'leg',ipa:'/leɡ/',cn:'腿',core:true}, {w:'peg',ipa:'/peɡ/',cn:'衣夹'},
      {w:'egg',ipa:'/eɡ/',cn:'蛋'} ] },
    { rime:'-em', words:[ {w:'gem',ipa:'/dʒem/',cn:'宝石'} ] }
  ]},
  { id:'i_ih', letter:'i', sound:'/ɪ/', kind:'短元音', families:[
    { rime:'-it', words:[
      {w:'sit',ipa:'/sɪt/',cn:'坐',core:true}, {w:'bit',ipa:'/bɪt/',cn:'一点'},
      {w:'fit',ipa:'/fɪt/',cn:'合适'}, {w:'hit',ipa:'/hɪt/',cn:'打'},
      {w:'kit',ipa:'/kɪt/',cn:'工具包'}, {w:'lit',ipa:'/lɪt/',cn:'点燃的'}, {w:'pit',ipa:'/pɪt/',cn:'坑'} ] },
    { rime:'-in', words:[
      {w:'pin',ipa:'/pɪn/',cn:'针',core:true}, {w:'win',ipa:'/wɪn/',cn:'赢'},
      {w:'tin',ipa:'/tɪn/',cn:'罐头'}, {w:'bin',ipa:'/bɪn/',cn:'垃圾桶'},
      {w:'fin',ipa:'/fɪn/',cn:'鱼鳍'}, {w:'sin',ipa:'/sɪn/',cn:'罪'} ] },
    { rime:'-ig', words:[
      {w:'pig',ipa:'/pɪɡ/',cn:'猪',core:true}, {w:'big',ipa:'/bɪɡ/',cn:'大的',core:true},
      {w:'dig',ipa:'/dɪɡ/',cn:'挖'}, {w:'wig',ipa:'/wɪɡ/',cn:'假发'}, {w:'fig',ipa:'/fɪɡ/',cn:'无花果'} ] },
    { rime:'-ip', words:[
      {w:'lip',ipa:'/lɪp/',cn:'嘴唇'}, {w:'tip',ipa:'/tɪp/',cn:'尖'},
      {w:'sip',ipa:'/sɪp/',cn:'小口喝'}, {w:'dip',ipa:'/dɪp/',cn:'蘸'}, {w:'hip',ipa:'/hɪp/',cn:'臀部'} ] },
    { rime:'-id', words:[
      {w:'did',ipa:'/dɪd/',cn:'做（过去）'}, {w:'hid',ipa:'/hɪd/',cn:'藏'},
      {w:'lid',ipa:'/lɪd/',cn:'盖子'}, {w:'rid',ipa:'/rɪd/',cn:'摆脱'} ] }
  ]},
  { id:'o_o', letter:'o', sound:'/ɒ/', kind:'短元音', families:[
    { rime:'-ot', words:[
      {w:'top',ipa:'/tɒp/',cn:'顶部',core:true}, {w:'hot',ipa:'/hɒt/',cn:'热的'},
      {w:'pot',ipa:'/pɒt/',cn:'锅'}, {w:'dot',ipa:'/dɒt/',cn:'点'},
      {w:'lot',ipa:'/lɒt/',cn:'许多'}, {w:'cot',ipa:'/kɒt/',cn:'小床'}, {w:'got',ipa:'/ɡɒt/',cn:'得到'} ] },
    { rime:'-op', words:[
      {w:'mop',ipa:'/mɒp/',cn:'拖把'}, {w:'hop',ipa:'/hɒp/',cn:'跳'},
      {w:'pop',ipa:'/pɒp/',cn:'爆开'}, {w:'cop',ipa:'/kɒp/',cn:'警察'} ] },
    { rime:'-og', words:[
      {w:'dog',ipa:'/dɒɡ/',cn:'狗',core:true}, {w:'log',ipa:'/lɒɡ/',cn:'原木'},
      {w:'fog',ipa:'/fɒɡ/',cn:'雾'}, {w:'hog',ipa:'/hɒɡ/',cn:'猪'} ] },
    { rime:'-ox', words:[ {w:'box',ipa:'/bɒks/',cn:'盒子',core:true}, {w:'fox',ipa:'/fɒks/',cn:'狐狸'} ] },
    { rime:'-od', words:[ {w:'rod',ipa:'/rɒd/',cn:'杆'}, {w:'nod',ipa:'/nɒd/',cn:'点头'} ] }
  ]},
  { id:'u_uh', letter:'u', sound:'/ʌ/', kind:'短元音', families:[
    { rime:'-ut', words:[
      {w:'cut',ipa:'/kʌt/',cn:'切'}, {w:'nut',ipa:'/nʌt/',cn:'坚果'},
      {w:'hut',ipa:'/hʌt/',cn:'小屋'}, {w:'but',ipa:'/bʌt/',cn:'但是'}, {w:'rut',ipa:'/rʌt/',cn:'车辙'} ] },
    { rime:'-un', words:[
      {w:'sun',ipa:'/sʌn/',cn:'太阳',core:true}, {w:'run',ipa:'/rʌn/',cn:'跑',core:true},
      {w:'bun',ipa:'/bʌn/',cn:'小圆面包'}, {w:'fun',ipa:'/fʌn/',cn:'有趣'}, {w:'gun',ipa:'/ɡʌn/',cn:'枪'} ] },
    { rime:'-ug', words:[
      {w:'bug',ipa:'/bʌɡ/',cn:'虫子',core:true}, {w:'mug',ipa:'/mʌɡ/',cn:'马克杯'},
      {w:'rug',ipa:'/rʌɡ/',cn:'地毯'}, {w:'hug',ipa:'/hʌɡ/',cn:'拥抱'}, {w:'jug',ipa:'/dʒʌɡ/',cn:'壶'} ] },
    { rime:'-um', words:[ {w:'hum',ipa:'/hʌm/',cn:'嗡嗡'}, {w:'gum',ipa:'/ɡʌm/',cn:'口香糖'}, {w:'sum',ipa:'/sʌm/',cn:'总和'} ] },
    { rime:'-ub', words:[ {w:'sub',ipa:'/sʌb/',cn:'潜水艇'}, {w:'tub',ipa:'/tʌb/',cn:'桶'}, {w:'cub',ipa:'/kʌb/',cn:'幼兽'} ] }
  ]},

  /* ===================== 长元音（magic e） ===================== */
  { id:'a_ay', letter:'a', sound:'/eɪ/', kind:'长元音', families:[
    { rime:'-ake', words:[
      {w:'cake',ipa:'/keɪk/',cn:'蛋糕',core:true}, {w:'lake',ipa:'/leɪk/',cn:'湖'},
      {w:'make',ipa:'/meɪk/',cn:'做'}, {w:'take',ipa:'/teɪk/',cn:'拿'},
      {w:'bake',ipa:'/beɪk/',cn:'烤'}, {w:'wake',ipa:'/weɪk/',cn:'醒'}, {w:'snake',ipa:'/sneɪk/',cn:'蛇'} ] },
    { rime:'-ame', words:[
      {w:'name',ipa:'/neɪm/',cn:'名字',core:true}, {w:'game',ipa:'/ɡeɪm/',cn:'游戏',core:true},
      {w:'same',ipa:'/seɪm/',cn:'相同的'}, {w:'came',ipa:'/keɪm/',cn:'来'}, {w:'fame',ipa:'/feɪm/',cn:'名声'} ] },
    { rime:'-ate', words:[
      {w:'gate',ipa:'/ɡeɪt/',cn:'大门'}, {w:'late',ipa:'/leɪt/',cn:'迟的'},
      {w:'rate',ipa:'/reɪt/',cn:'比率'}, {w:'date',ipa:'/deɪt/',cn:'日期'}, {w:'hate',ipa:'/heɪt/',cn:'讨厌'} ] },
    { rime:'-ane', words:[ {w:'cane',ipa:'/keɪn/',cn:'手杖'}, {w:'lane',ipa:'/leɪn/',cn:'小路'}, {w:'plane',ipa:'/pleɪn/',cn:'飞机'} ] },
    { rime:'-ace', words:[ {w:'face',ipa:'/feɪs/',cn:'脸'}, {w:'race',ipa:'/reɪs/',cn:'赛跑'}, {w:'lace',ipa:'/leɪs/',cn:'鞋带'} ] }
  ]},
  { id:'e_ee', letter:'e', sound:'/iː/', kind:'长元音', families:[
    { rime:'-ee', words:[
      {w:'see',ipa:'/siː/',cn:'看见',core:true}, {w:'tree',ipa:'/triː/',cn:'树',core:true},
      {w:'bee',ipa:'/biː/',cn:'蜜蜂'}, {w:'three',ipa:'/θriː/',cn:'三'} ] },
    { rime:'-eet', words:[
      {w:'feet',ipa:'/fiːt/',cn:'脚'}, {w:'meet',ipa:'/miːt/',cn:'遇见'},
      {w:'greet',ipa:'/ɡriːt/',cn:'问候'}, {w:'sheet',ipa:'/ʃiːt/',cn:'床单'}, {w:'street',ipa:'/striːt/',cn:'街道'} ] },
    { rime:'-een', words:[ {w:'seen',ipa:'/siːn/',cn:'看见（过去）'}, {w:'green',ipa:'/ɡriːn/',cn:'绿色'}, {w:'queen',ipa:'/kwiːn/',cn:'女王'} ] },
    { rime:'-eed', words:[ {w:'need',ipa:'/niːd/',cn:'需要'}, {w:'seed',ipa:'/siːd/',cn:'种子'}, {w:'feed',ipa:'/fiːd/',cn:'喂'}, {w:'weed',ipa:'/wiːd/',cn:'杂草'} ] },
    { rime:'-eel', words:[ {w:'feel',ipa:'/fiːl/',cn:'感觉'}, {w:'peel',ipa:'/piːl/',cn:'剥皮'}, {w:'reel',ipa:'/riːl/',cn:'卷轴'} ] }
  ]},
  { id:'i_ai', letter:'i', sound:'/aɪ/', kind:'长元音', families:[
    { rime:'-ike', words:[
      {w:'bike',ipa:'/baɪk/',cn:'自行车',core:true}, {w:'like',ipa:'/laɪk/',cn:'喜欢',core:true},
      {w:'hike',ipa:'/haɪk/',cn:'徒步'}, {w:'strike',ipa:'/straɪk/',cn:'击打'} ] },
    { rime:'-ime', words:[ {w:'time',ipa:'/taɪm/',cn:'时间',core:true}, {w:'lime',ipa:'/laɪm/',cn:'青柠'}, {w:'dime',ipa:'/daɪm/',cn:'一角硬币'}, {w:'crime',ipa:'/kraɪm/',cn:'犯罪'} ] },
    { rime:'-ine', words:[ {w:'line',ipa:'/laɪn/',cn:'线'}, {w:'fine',ipa:'/faɪn/',cn:'好的'}, {w:'nine',ipa:'/naɪn/',cn:'九',core:true}, {w:'mine',ipa:'/maɪn/',cn:'我的'}, {w:'vine',ipa:'/vaɪn/',cn:'藤'} ] },
    { rime:'-ide', words:[ {w:'ride',ipa:'/raɪd/',cn:'骑'}, {w:'side',ipa:'/saɪd/',cn:'边'}, {w:'hide',ipa:'/haɪd/',cn:'藏'}, {w:'wide',ipa:'/waɪd/',cn:'宽的'} ] },
    { rime:'-ite', words:[ {w:'kite',ipa:'/kaɪt/',cn:'风筝',core:true}, {w:'bite',ipa:'/baɪt/',cn:'咬'}, {w:'site',ipa:'/saɪt/',cn:'地点'}, {w:'white',ipa:'/waɪt/',cn:'白色的'} ] }
  ]},
  { id:'o_ow', letter:'o', sound:'/əʊ/', kind:'长元音', families:[
    { rime:'-oke', words:[ {w:'coke',ipa:'/kəʊk/',cn:'可乐'}, {w:'joke',ipa:'/dʒəʊk/',cn:'笑话'}, {w:'woke',ipa:'/wəʊk/',cn:'醒（过去）'}, {w:'poke',ipa:'/pəʊk/',cn:'戳'} ] },
    { rime:'-ote', words:[ {w:'note',ipa:'/nəʊt/',cn:'笔记',core:true}, {w:'vote',ipa:'/vəʊt/',cn:'投票'}, {w:'wrote',ipa:'/rəʊt/',cn:'写（过去）'} ] },
    { rime:'-ope', words:[ {w:'hope',ipa:'/həʊp/',cn:'希望',core:true}, {w:'rope',ipa:'/rəʊp/',cn:'绳子'}, {w:'cope',ipa:'/kəʊp/',cn:'应付'}, {w:'mope',ipa:'/məʊp/',cn:'闷闷不乐'} ] },
    { rime:'-ose', words:[ {w:'nose',ipa:'/nəʊz/',cn:'鼻子',core:true}, {w:'rose',ipa:'/rəʊz/',cn:'玫瑰'}, {w:'pose',ipa:'/pəʊz/',cn:'摆姿势'}, {w:'hose',ipa:'/həʊz/',cn:'软管'} ] },
    { rime:'-ole', words:[ {w:'hole',ipa:'/həʊl/',cn:'洞'}, {w:'mole',ipa:'/məʊl/',cn:'痣'}, {w:'pole',ipa:'/pəʊl/',cn:'杆'}, {w:'role',ipa:'/rəʊl/',cn:'角色'} ] }
  ]},
  { id:'u_you', letter:'u', sound:'/juː/', kind:'长元音', families:[
    { rime:'-ube', words:[ {w:'cube',ipa:'/kjuːb/',cn:'立方体'}, {w:'tube',ipa:'/tjuːb/',cn:'管子',core:true}, {w:'cue',ipa:'/kjuː/',cn:'暗示'} ] },
    { rime:'-une', words:[ {w:'tune',ipa:'/tjuːn/',cn:'曲调'}, {w:'June',ipa:'/dʒuːn/',cn:'六月'}, {w:'dune',ipa:'/djuːn/',cn:'沙丘'} ] },
    { rime:'-ute', words:[ {w:'cute',ipa:'/kjuːt/',cn:'可爱的',core:true}, {w:'mute',ipa:'/mjuːt/',cn:'沉默的'}, {w:'flute',ipa:'/fluːt/',cn:'长笛'} ] },
    { rime:'-use', words:[ {w:'use',ipa:'/juːz/',cn:'使用'}, {w:'fuse',ipa:'/fjuːz/',cn:'保险丝'}, {w:'muse',ipa:'/mjuːz/',cn:'沉思'} ] },
    { rime:'-ule', words:[ {w:'mule',ipa:'/mjuːl/',cn:'骡子'}, {w:'rule',ipa:'/ruːl/',cn:'规则'} ] }
  ]},
  /* ===================== 辅音组合 Digraphs ===================== */
  { id:'sh', letter:'sh', sound:'/ʃ/', kind:'辅音组合', families:[
    { rime:'-ip', words:[ {w:'ship',ipa:'/ʃɪp/',cn:'船',core:true} ] },
    { rime:'-op', words:[ {w:'shop',ipa:'/ʃɒp/',cn:'商店',core:true} ] },
    { rime:'-ut', words:[ {w:'shut',ipa:'/ʃʌt/',cn:'关上'} ] },
    { rime:'-ish', words:[ {w:'fish',ipa:'/fɪʃ/',cn:'鱼',core:true}, {w:'dish',ipa:'/dɪʃ/',cn:'盘子'}, {w:'wish',ipa:'/wɪʃ/',cn:'希望'} ] },
    { rime:'-ell', words:[ {w:'shell',ipa:'/ʃel/',cn:'贝壳'} ] },
    { rime:'-ort', words:[ {w:'short',ipa:'/ʃɔːt/',cn:'短的'} ] }
  ]},
  { id:'ch', letter:'ch', sound:'/tʃ/', kind:'辅音组合', families:[
    { rime:'-ip', words:[ {w:'chip',ipa:'/tʃɪp/',cn:'薯片'} ] },
    { rime:'-op', words:[ {w:'chop',ipa:'/tʃɒp/',cn:'砍'} ] },
    { rime:'-in', words:[ {w:'chin',ipa:'/tʃɪn/',cn:'下巴'} ] },
    { rime:'-ick', words:[ {w:'chick',ipa:'/tʃɪk/',cn:'小鸡',core:true}, {w:'check',ipa:'/tʃek/',cn:'检查'} ] },
    { rime:'-air', words:[ {w:'chair',ipa:'/tʃeə/',cn:'椅子',core:true} ] },
    { rime:'-urch', words:[ {w:'church',ipa:'/tʃɜːtʃ/',cn:'教堂'} ] }
  ]},
  { id:'th', letter:'th', sound:'/θ/ /ð/', kind:'辅音组合', families:[
    { rime:'-in', words:[ {w:'thin',ipa:'/θɪn/',cn:'瘦的'}, {w:'this',ipa:'/ðɪs/',cn:'这个',core:true} ] },
    { rime:'-at', words:[ {w:'that',ipa:'/ðæt/',cn:'那个',core:true} ] },
    { rime:'-ick', words:[ {w:'thick',ipa:'/θɪk/',cn:'厚的'} ] },
    { rime:'-ree', words:[ {w:'three',ipa:'/θriː/',cn:'三',core:true} ] },
    { rime:'-umb', words:[ {w:'thumb',ipa:'/θʌm/',cn:'拇指'} ] },
    { rime:'-ath', words:[ {w:'math',ipa:'/mæθ/',cn:'数学'}, {w:'with',ipa:'/wɪð/',cn:'和（介词）'} ] }
  ]},
  { id:'wh', letter:'wh', sound:'/w/', kind:'辅音组合', families:[
    { rime:'-at', words:[ {w:'what',ipa:'/wɒt/',cn:'什么',core:true} ] },
    { rime:'-en', words:[ {w:'when',ipa:'/wen/',cn:'什么时候'}, {w:'wheel',ipa:'/wiːl/',cn:'轮子'} ] },
    { rime:'-ere', words:[ {w:'where',ipa:'/weə/',cn:'哪里',core:true} ] },
    { rime:'-ich', words:[ {w:'which',ipa:'/wɪtʃ/',cn:'哪一个'} ] },
    { rime:'-ite', words:[ {w:'white',ipa:'/waɪt/',cn:'白色的'} ] }
  ]},
  { id:'ph', letter:'ph', sound:'/f/', kind:'辅音组合', families:[
    { rime:'-oto', words:[ {w:'photo',ipa:'/fəʊtəʊ/',cn:'照片'} ] },
    { rime:'-one', words:[ {w:'phone',ipa:'/fəʊn/',cn:'电话',core:true} ] },
    { rime:'-ant', words:[ {w:'elephant',ipa:'/ˈelɪfənt/',cn:'大象',core:true} ] },
    { rime:'-aph', words:[ {w:'graph',ipa:'/ɡrɑːf/',cn:'图表'} ] }
  ]},
  /* ===================== 辅音连缀 Blends ===================== */
  { id:'bl', letter:'bl', sound:'/bl/', kind:'辅音连缀', families:[
    { rime:'-ack', words:[ {w:'black',ipa:'/blæk/',cn:'黑色的',core:true} ] },
    { rime:'-ue', words:[ {w:'blue',ipa:'/bluː/',cn:'蓝色',core:true} ] },
    { rime:'-ock', words:[ {w:'block',ipa:'/blɒk/',cn:'方块'} ] },
    { rime:'-anket', words:[ {w:'blanket',ipa:'/ˈblæŋkɪt/',cn:'毯子'} ] },
    { rime:'-ink', words:[ {w:'blink',ipa:'/blɪŋk/',cn:'眨眼'} ] }
  ]},
  { id:'cl', letter:'cl', sound:'/kl/', kind:'辅音连缀', families:[
    { rime:'-ock', words:[ {w:'clock',ipa:'/klɒk/',cn:'时钟',core:true} ] },
    { rime:'-ap', words:[ {w:'clap',ipa:'/klæp/',cn:'拍手'} ] },
    { rime:'-ean', words:[ {w:'clean',ipa:'/kliːn/',cn:'干净的',core:true} ] },
    { rime:'-oud', words:[ {w:'cloud',ipa:'/klaʊd/',cn:'云'} ] },
    { rime:'-aw', words:[ {w:'claw',ipa:'/klɔː/',cn:'爪子'} ] }
  ]},
  { id:'fl', letter:'fl', sound:'/fl/', kind:'辅音连缀', families:[
    { rime:'-ag', words:[ {w:'flag',ipa:'/flæɡ/',cn:'旗帜'} ] },
    { rime:'-at', words:[ {w:'flat',ipa:'/flæt/',cn:'公寓'} ] },
    { rime:'-ower', words:[ {w:'flower',ipa:'/ˈflaʊə/',cn:'花',core:true} ] },
    { rime:'-ame', words:[ {w:'flame',ipa:'/fleɪm/',cn:'火焰'} ] }
  ]},
  { id:'br', letter:'br', sound:'/br/', kind:'辅音连缀', families:[
    { rime:'-own', words:[ {w:'brown',ipa:'/braʊn/',cn:'棕色的',core:true} ] },
    { rime:'-ead', words:[ {w:'bread',ipa:'/bred/',cn:'面包',core:true} ] },
    { rime:'-ush', words:[ {w:'brush',ipa:'/brʌʃ/',cn:'刷子'} ] },
    { rime:'-ick', words:[ {w:'brick',ipa:'/brɪk/',cn:'砖'} ] },
    { rime:'-anch', words:[ {w:'branch',ipa:'/brɑːntʃ/',cn:'树枝'} ] }
  ]},
  { id:'cr', letter:'cr', sound:'/kr/', kind:'辅音连缀', families:[
    { rime:'-ab', words:[ {w:'crab',ipa:'/kræb/',cn:'螃蟹'} ] },
    { rime:'-y', words:[ {w:'cry',ipa:'/kraɪ/',cn:'哭'} ] },
    { rime:'-op', words:[ {w:'crop',ipa:'/krɒp/',cn:'庄稼'} ] },
    { rime:'-own', words:[ {w:'crown',ipa:'/kraʊn/',cn:'皇冠'} ] },
    { rime:'-oss', words:[ {w:'cross',ipa:'/krɒs/',cn:'十字'} ] }
  ]},
  { id:'fr', letter:'fr', sound:'/fr/', kind:'辅音连缀', families:[
    { rime:'-og', words:[ {w:'frog',ipa:'/frɒɡ/',cn:'青蛙',core:true} ] },
    { rime:'-iend', words:[ {w:'friend',ipa:'/frend/',cn:'朋友',core:true} ] },
    { rime:'-uit', words:[ {w:'fruit',ipa:'/fruːt/',cn:'水果'} ] },
    { rime:'-ee', words:[ {w:'free',ipa:'/friː/',cn:'自由的'} ] },
    { rime:'-om', words:[ {w:'from',ipa:'/frɒm/',cn:'从'} ] }
  ]},
  { id:'st', letter:'st', sound:'/st/', kind:'辅音连缀', families:[
    { rime:'-ar', words:[ {w:'star',ipa:'/stɑː/',cn:'星星',core:true} ] },
    { rime:'-op', words:[ {w:'stop',ipa:'/stɒp/',cn:'停止',core:true} ] },
    { rime:'-one', words:[ {w:'stone',ipa:'/stəʊn/',cn:'石头'} ] },
    { rime:'-orm', words:[ {w:'storm',ipa:'/stɔːm/',cn:'暴风雨'} ] },
    { rime:'-ick', words:[ {w:'stick',ipa:'/stɪk/',cn:'棍子'} ] }
  ]},
  { id:'sp', letter:'sp', sound:'/sp/', kind:'辅音连缀', families:[
    { rime:'-ider', words:[ {w:'spider',ipa:'/ˈspaɪdə/',cn:'蜘蛛'} ] },
    { rime:'-in', words:[ {w:'spin',ipa:'/spɪn/',cn:'旋转'} ] },
    { rime:'-ot', words:[ {w:'spot',ipa:'/spɒt/',cn:'斑点'} ] },
    { rime:'-eak', words:[ {w:'speak',ipa:'/spiːk/',cn:'说话',core:true} ] },
    { rime:'-ell', words:[ {w:'spell',ipa:'/spel/',cn:'拼写',core:true} ] }
  ]},
  { id:'sm', letter:'sm', sound:'/sm/', kind:'辅音连缀', families:[
    { rime:'-all', words:[ {w:'small',ipa:'/smɔːl/',cn:'小的',core:true} ] },
    { rime:'-oke', words:[ {w:'smoke',ipa:'/sməʊk/',cn:'烟'} ] },
    { rime:'-ile', words:[ {w:'smile',ipa:'/smaɪl/',cn:'微笑',core:true} ] },
    { rime:'-ell', words:[ {w:'smell',ipa:'/smel/',cn:'闻'} ] },
    { rime:'-art', words:[ {w:'smart',ipa:'/smɑːt/',cn:'聪明的'} ] }
  ]},
  { id:'sn', letter:'sn', sound:'/sn/', kind:'辅音连缀', families:[
    { rime:'-ake', words:[ {w:'snake',ipa:'/sneɪk/',cn:'蛇',core:true} ] },
    { rime:'-ow', words:[ {w:'snow',ipa:'/snəʊ/',cn:'雪',core:true} ] },
    { rime:'-ail', words:[ {w:'snail',ipa:'/sneɪl/',cn:'蜗牛'} ] },
    { rime:'-ap', words:[ {w:'snap',ipa:'/snæp/',cn:'折断'} ] },
    { rime:'-eeze', words:[ {w:'sneeze',ipa:'/sniːz/',cn:'打喷嚏'} ] }
  ]},
  { id:'sw', letter:'sw', sound:'/sw/', kind:'辅音连缀', families:[
    { rime:'-im', words:[ {w:'swim',ipa:'/swɪm/',cn:'游泳',core:true} ] },
    { rime:'-ing', words:[ {w:'swing',ipa:'/swɪŋ/',cn:'秋千'} ] },
    { rime:'-eet', words:[ {w:'sweet',ipa:'/swiːt/',cn:'甜的',core:true} ] },
    { rime:'-an', words:[ {w:'swan',ipa:'/swɒn/',cn:'天鹅'} ] },
    { rime:'-eep', words:[ {w:'sweep',ipa:'/swiːp/',cn:'扫'} ] }
  ]},
  /* ===================== r-controlled (Bossy R) ===================== */
  { id:'ar', letter:'ar', sound:'/ɑː/', kind:'r-controlled', families:[
    { rime:'-ar', words:[ {w:'car',ipa:'/kɑː/',cn:'汽车',core:true}, {w:'star',ipa:'/stɑː/',cn:'星星',core:true}, {w:'card',ipa:'/kɑːd/',cn:'卡片'} ] },
    { rime:'-arm', words:[ {w:'farm',ipa:'/fɑːm/',cn:'农场'}, {w:'arm',ipa:'/ɑːm/',cn:'手臂'} ] },
    { rime:'-ark', words:[ {w:'park',ipa:'/pɑːk/',cn:'公园'}, {w:'dark',ipa:'/dɑːk/',cn:'黑暗的'} ] }
  ]},
  { id:'or', letter:'or', sound:'/ɔː/', kind:'r-controlled', families:[
    { rime:'-ork', words:[ {w:'fork',ipa:'/fɔːk/',cn:'叉子'} ] },
    { rime:'-orn', words:[ {w:'corn',ipa:'/kɔːn/',cn:'玉米'}, {w:'horn',ipa:'/hɔːn/',cn:'角'}, {w:'horse',ipa:'/hɔːs/',cn:'马'} ] },
    { rime:'-or', words:[ {w:'for',ipa:'/fɔː/',cn:'为了'}, {w:'morning',ipa:'/ˈmɔːnɪŋ/',cn:'早晨',core:true} ] }
  ]},
  { id:'er', letter:'er', sound:'/ɜː/', kind:'r-controlled', families:[
    { rime:'-er', words:[ {w:'her',ipa:'/hɜː/',cn:'她的'}, {w:'fern',ipa:'/fɜːn/',cn:'蕨类'} ] },
    { rime:'-erm', words:[ {w:'term',ipa:'/tɜːm/',cn:'学期'} ] },
    { rime:'-etter', words:[ {w:'letter',ipa:'/ˈletə/',cn:'信',core:true} ] },
    { rime:'-ister', words:[ {w:'sister',ipa:'/ˈsɪstə/',cn:'姐妹',core:true} ] }
  ]},
  { id:'ir', letter:'ir', sound:'/ɜː/', kind:'r-controlled', families:[
    { rime:'-ird', words:[ {w:'bird',ipa:'/bɜːd/',cn:'鸟',core:true} ] },
    { rime:'-irl', words:[ {w:'girl',ipa:'/ɡɜːl/',cn:'女孩',core:true} ] },
    { rime:'-irt', words:[ {w:'shirt',ipa:'/ʃɜːt/',cn:'衬衫'} ] },
    { rime:'-irst', words:[ {w:'first',ipa:'/fɜːst/',cn:'第一',core:true}, {w:'dirty',ipa:'/ˈdɜːti/',cn:'脏的'} ] }
  ]},
  { id:'ur', letter:'ur', sound:'/ɜː/', kind:'r-controlled', families:[
    { rime:'-urse', words:[ {w:'nurse',ipa:'/nɜːs/',cn:'护士',core:true} ] },
    { rime:'-urple', words:[ {w:'purple',ipa:'/ˈpɜːpl/',cn:'紫色的'} ] },
    { rime:'-urt', words:[ {w:'hurt',ipa:'/hɜːt/',cn:'受伤'} ] },
    { rime:'-urn', words:[ {w:'turn',ipa:'/tɜːn/',cn:'转动',core:true} ] },
    { rime:'-url', words:[ {w:'curl',ipa:'/kɜːl/',cn:'卷曲'} ] }
  ]},
  /* ===================== 元音组合 Vowel Teams ===================== */
  { id:'ea', letter:'ea', sound:'/iː/', kind:'元音组合', families:[
    { rime:'-eat', words:[ {w:'eat',ipa:'/iːt/',cn:'吃',core:true}, {w:'meat',ipa:'/miːt/',cn:'肉'}, {w:'heat',ipa:'/hiːt/',cn:'热'} ] },
    { rime:'-ea', words:[ {w:'tea',ipa:'/tiː/',cn:'茶'}, {w:'sea',ipa:'/siː/',cn:'海',core:true} ] },
    { rime:'-ead', words:[ {w:'read',ipa:'/riːd/',cn:'阅读',core:true}, {w:'beat',ipa:'/biːt/',cn:'敲打'} ] },
    { rime:'-eaf', words:[ {w:'leaf',ipa:'/liːf/',cn:'叶子'} ] }
  ]},
  { id:'ai_ay', letter:'ai/ay', sound:'/eɪ/', kind:'元音组合', families:[
    { rime:'-ain', words:[ {w:'rain',ipa:'/reɪn/',cn:'雨',core:true}, {w:'train',ipa:'/treɪn/',cn:'火车',core:true}, {w:'mail',ipa:'/meɪl/',cn:'邮件'} ] },
    { rime:'-ail', words:[ {w:'sail',ipa:'/seɪl/',cn:'航行'} ] },
    { rime:'-ay', words:[ {w:'day',ipa:'/deɪ/',cn:'白天',core:true}, {w:'play',ipa:'/pleɪ/',cn:'玩',core:true}, {w:'way',ipa:'/weɪ/',cn:'路'} ] }
  ]},
  { id:'oa', letter:'oa', sound:'/əʊ/', kind:'元音组合', families:[
    { rime:'-oat', words:[ {w:'boat',ipa:'/bəʊt/',cn:'船',core:true}, {w:'coat',ipa:'/kəʊt/',cn:'外套'}, {w:'goat',ipa:'/ɡəʊt/',cn:'山羊'}, {w:'float',ipa:'/fləʊt/',cn:'漂浮'} ] },
    { rime:'-oad', words:[ {w:'road',ipa:'/rəʊd/',cn:'路',core:true} ] },
    { rime:'-oap', words:[ {w:'soap',ipa:'/səʊp/',cn:'肥皂'} ] }
  ]},
  { id:'oo_short', letter:'oo', sound:'/ʊ/', kind:'元音组合', families:[
    { rime:'-ook', words:[ {w:'book',ipa:'/bʊk/',cn:'书',core:true}, {w:'cook',ipa:'/kʊk/',cn:'厨师'}, {w:'look',ipa:'/lʊk/',cn:'看',core:true} ] },
    { rime:'-ood', words:[ {w:'good',ipa:'/ɡʊd/',cn:'好的',core:true}, {w:'foot',ipa:'/fʊt/',cn:'脚'} ] }
  ]},
  { id:'oo_long', letter:'oo', sound:'/uː/', kind:'元音组合', families:[
    { rime:'-oon', words:[ {w:'moon',ipa:'/muːn/',cn:'月亮',core:true} ] },
    { rime:'-ood', words:[ {w:'food',ipa:'/fuːd/',cn:'食物',core:true} ] },
    { rime:'-oom', words:[ {w:'room',ipa:'/ruːm/',cn:'房间'} ] },
    { rime:'-ool', words:[ {w:'school',ipa:'/skuːl/',cn:'学校',core:true}, {w:'zoo',ipa:'/zuː/',cn:'动物园'} ] }
  ]},
  { id:'ou_ow', letter:'ou/ow', sound:'/aʊ/', kind:'元音组合', families:[
    { rime:'-ouse', words:[ {w:'house',ipa:'/haʊs/',cn:'房子',core:true}, {w:'mouse',ipa:'/maʊs/',cn:'老鼠',core:true} ] },
    { rime:'-out', words:[ {w:'out',ipa:'/aʊt/',cn:'在外面'} ] },
    { rime:'-ow', words:[ {w:'cow',ipa:'/kaʊ/',cn:'奶牛'}, {w:'how',ipa:'/haʊ/',cn:'怎样'}, {w:'now',ipa:'/naʊ/',cn:'现在'}, {w:'brown',ipa:'/braʊn/',cn:'棕色'} ] }
  ]},
  { id:'oi_oy', letter:'oi/oy', sound:'/ɔɪ/', kind:'元音组合', families:[
    { rime:'-oil', words:[ {w:'oil',ipa:'/ɔɪl/',cn:'油'}, {w:'coin',ipa:'/kɔɪn/',cn:'硬币'}, {w:'boil',ipa:'/bɔɪl/',cn:'煮沸'} ] },
    { rime:'-oy', words:[ {w:'boy',ipa:'/bɔɪ/',cn:'男孩',core:true}, {w:'toy',ipa:'/tɔɪ/',cn:'玩具'}, {w:'joy',ipa:'/dʒɔɪ/',cn:'欢乐'} ] }
  ]},
  { id:'au_aw', letter:'au/aw', sound:'/ɔː/', kind:'元音组合', families:[
    { rime:'-au', words:[ {w:'author',ipa:'/ˈɔːθə/',cn:'作者'}, {w:'autumn',ipa:'/ˈɔːtəm/',cn:'秋天',core:true}, {w:'cause',ipa:'/kɔːz/',cn:'引起'} ] },
    { rime:'-aw', words:[ {w:'law',ipa:'/lɔː/',cn:'法律'}, {w:'saw',ipa:'/sɔː/',cn:'看见（过去）'}, {w:'draw',ipa:'/drɔː/',cn:'画',core:true}, {w:'paw',ipa:'/pɔː/',cn:'爪子'} ] }
  ]},
  { id:'ue_ui', letter:'ue/ui', sound:'/uː/', kind:'元音组合', families:[
    { rime:'-ue', words:[ {w:'blue',ipa:'/bluː/',cn:'蓝色',core:true}, {w:'glue',ipa:'/ɡluː/',cn:'胶水'} ] },
    { rime:'-uit', words:[ {w:'suit',ipa:'/suːt/',cn:'西装'}, {w:'fruit',ipa:'/fruːt/',cn:'水果',core:true} ] },
    { rime:'-ew', words:[ {w:'new',ipa:'/njuː/',cn:'新的',core:true} ] }
  ]},
  /* ===================== 词尾规律 Endings ===================== */
  { id:'end_ck', letter:'-ck', sound:'/k/', kind:'词尾规律', families:[
    { rime:'-ack', words:[ {w:'back',ipa:'/bæk/',cn:'背',core:true} ] },
    { rime:'-uck', words:[ {w:'duck',ipa:'/dʌk/',cn:'鸭子',core:true}, {w:'luck',ipa:'/lʌk/',cn:'运气'} ] },
    { rime:'-ock', words:[ {w:'rock',ipa:'/rɒk/',cn:'岩石'}, {w:'sock',ipa:'/sɒk/',cn:'袜子'} ] },
    { rime:'-ick', words:[ {w:'tick',ipa:'/tɪk/',cn:'滴答'} ] }
  ]},
  { id:'end_ng', letter:'-ng', sound:'/ŋ/', kind:'词尾规律', families:[
    { rime:'-ing', words:[ {w:'ring',ipa:'/rɪŋ/',cn:'戒指'}, {w:'king',ipa:'/kɪŋ/',cn:'国王',core:true}, {w:'wing',ipa:'/wɪŋ/',cn:'翅膀'}, {w:'sing',ipa:'/sɪŋ/',cn:'唱',core:true} ] },
    { rime:'-ong', words:[ {w:'song',ipa:'/sɒŋ/',cn:'歌'}, {w:'long',ipa:'/lɒŋ/',cn:'长的',core:true} ] }
  ]},
  { id:'end_nk', letter:'-nk', sound:'/ŋk/', kind:'词尾规律', families:[
    { rime:'-ank', words:[ {w:'bank',ipa:'/bæŋk/',cn:'银行'} ] },
    { rime:'-ink', words:[ {w:'sink',ipa:'/sɪŋk/',cn:'下沉'}, {w:'pink',ipa:'/pɪŋk/',cn:'粉色'}, {w:'think',ipa:'/θɪŋk/',cn:'思考',core:true}, {w:'drink',ipa:'/drɪŋk/',cn:'喝',core:true}, {w:'link',ipa:'/lɪŋk/',cn:'链接'} ] }
  ]},

  /* ===================== Magic e（元音+辅音+e） ===================== */
  { id:'a_e', letter:'a-e', sound:'/eɪ/', kind:'长元音', families:[
    { rime:'-ake', words:[ {w:'cake',ipa:'/keɪk/',cn:'蛋糕',core:true}, {w:'make',ipa:'/meɪk/',cn:'制作',core:true}, {w:'lake',ipa:'/leɪk/',cn:'湖'}, {w:'snake',ipa:'/sneɪk/',cn:'蛇'} ] },
    { rime:'-ame', words:[ {w:'name',ipa:'/neɪm/',cn:'名字',core:true}, {w:'game',ipa:'/ɡeɪm/',cn:'游戏',core:true}, {w:'same',ipa:'/seɪm/',cn:'相同的'} ] },
    { rime:'-ate', words:[ {w:'late',ipa:'/leɪt/',cn:'迟的'}, {w:'gate',ipa:'/ɡeɪt/',cn:'大门'}, {w:'plate',ipa:'/pleɪt/',cn:'盘子',core:true} ] }
  ]},
  { id:'i_e', letter:'i-e', sound:'/aɪ/', kind:'长元音', families:[
    { rime:'-ike', words:[ {w:'bike',ipa:'/baɪk/',cn:'自行车',core:true}, {w:'like',ipa:'/laɪk/',cn:'喜欢',core:true}, {w:'kite',ipa:'/kaɪt/',cn:'风筝',core:true} ] },
    { rime:'-ime', words:[ {w:'time',ipa:'/taɪm/',cn:'时间',core:true}, {w:'lime',ipa:'/laɪm/',cn:'酸橙'} ] },
    { rime:'-ine', words:[ {w:'fine',ipa:'/faɪn/',cn:'好的',core:true}, {w:'nine',ipa:'/naɪn/',cn:'九',core:true}, {w:'line',ipa:'/laɪn/',cn:'线'} ] }
  ]},
  { id:'o_e', letter:'o-e', sound:'/əʊ/', kind:'长元音', families:[
    { rime:'-ome', words:[ {w:'home',ipa:'/həʊm/',cn:'家',core:true}, {w:'nose',ipa:'/nəʊz/',cn:'鼻子',core:true} ] },
    { rime:'-ose', words:[ {w:'rose',ipa:'/rəʊz/',cn:'玫瑰'}, {w:'close',ipa:'/kləʊz/',cn:'关闭',core:true} ] },
    { rime:'-one', words:[ {w:'bone',ipa:'/bəʊn/',cn:'骨头'}, {w:'stone',ipa:'/stəʊn/',cn:'石头'}, {w:'phone',ipa:'/fəʊn/',cn:'电话',core:true} ] }
  ]},
  { id:'u_e', letter:'u-e', sound:'/juː/', kind:'长元音', families:[
    { rime:'-ute', words:[ {w:'cute',ipa:'/kjuːt/',cn:'可爱的'}, {w:'flute',ipa:'/fluːt/',cn:'笛子'} ] },
    { rime:'-ule', words:[ {w:'mule',ipa:'/mjuːl/',cn:'骡子'}, {w:'rule',ipa:'/ruːl/',cn:'规则',core:true} ] },
    { rime:'-use', words:[ {w:'use',ipa:'/juːz/',cn:'使用',core:true} ] }
  ]},

  /* ===================== 其他高频组合 ===================== */
  { id:'igh', letter:'igh', sound:'/aɪ/', kind:'元音组合', families:[
    { rime:'-igh', words:[ {w:'high',ipa:'/haɪ/',cn:'高的'}, {w:'night',ipa:'/naɪt/',cn:'夜晚',core:true}, {w:'light',ipa:'/laɪt/',cn:'灯；轻的',core:true}, {w:'right',ipa:'/raɪt/',cn:'正确的',core:true}, {w:'bright',ipa:'/braɪt/',cn:'明亮的'} ] }
  ]},
  { id:'tch', letter:'-tch', sound:'/tʃ/', kind:'词尾规律', families:[
    { rime:'-atch', words:[ {w:'watch',ipa:'/wɒtʃ/',cn:'手表；看',core:true}, {w:'catch',ipa:'/kætʃ/',cn:'抓住',core:true}, {w:'match',ipa:'/mætʃ/',cn:'比赛；火柴'} ] }
  ]},
  { id:'dge', letter:'-dge', sound:'/dʒ/', kind:'词尾规律', families:[
    { rime:'-edge', words:[ {w:'bridge',ipa:'/brɪdʒ/',cn:'桥'}, {w:'fridge',ipa:'/frɪdʒ/',cn:'冰箱',core:true}, {w:'edge',ipa:'/edʒ/',cn:'边缘'} ] }
  ]},
  { id:'kn', letter:'kn', sound:'/n/', kind:'辅音组合', families:[
    { rime:'kn-', words:[ {w:'knife',ipa:'/naɪf/',cn:'小刀'}, {w:'know',ipa:'/nəʊ/',cn:'知道',core:true}, {w:'knee',ipa:'/niː/',cn:'膝盖'} ] }
  ]},
  { id:'wr', letter:'wr', sound:'/r/', kind:'辅音组合', families:[
    { rime:'wr-', words:[ {w:'write',ipa:'/raɪt/',cn:'写',core:true}, {w:'wrong',ipa:'/rɒŋ/',cn:'错误的'}, {w:'wrist',ipa:'/rɪst/',cn:'手腕'} ] }
  ]},
  { id:'qu', letter:'qu', sound:'/kw/', kind:'辅音组合', families:[
    { rime:'qu-', words:[ {w:'queen',ipa:'/kwiːn/',cn:'女王'}, {w:'quick',ipa:'/kwɪk/',cn:'快的'}, {w:'quiet',ipa:'/ˈkwaɪət/',cn:'安静的',core:true} ] }
  ]},
  { id:'y_end', letter:'y(词尾)', sound:'/aɪ/ /ɪ/', kind:'元音组合', families:[
    { rime:'-y(单音节)', words:[ {w:'my',ipa:'/maɪ/',cn:'我的',core:true}, {w:'fly',ipa:'/flaɪ/',cn:'飞',core:true}, {w:'sky',ipa:'/skaɪ/',cn:'天空',core:true}, {w:'cry',ipa:'/kraɪ/',cn:'哭',core:true} ] },
    { rime:'-y(多音节)', words:[ {w:'happy',ipa:'/ˈhæpi/',cn:'开心的',core:true}, {w:'sunny',ipa:'/ˈsʌni/',cn:'晴朗的',core:true}, {w:'baby',ipa:'/ˈbeɪbi/',cn:'婴儿',core:true}, {w:'family',ipa:'/ˈfæməli/',cn:'家庭',core:true} ] }
  ]},
  { id:'air', letter:'air/are', sound:'/eə/', kind:'元音组合', families:[
    { rime:'-air', words:[ {w:'air',ipa:'/eə/',cn:'空气'}, {w:'hair',ipa:'/heə/',cn:'头发',core:true}, {w:'chair',ipa:'/tʃeə/',cn:'椅子',core:true}, {w:'stair',ipa:'/steə/',cn:'楼梯'} ] },
    { rime:'-are', words:[ {w:'care',ipa:'/keə/',cn:'关心'}, {w:'share',ipa:'/ʃeə/',cn:'分享',core:true}, {w:'square',ipa:'/skweə/',cn:'正方形'} ] }
  ]},
  { id:'ear', letter:'ear/eer', sound:'/ɪə/', kind:'元音组合', families:[
    { rime:'-ear', words:[ {w:'ear',ipa:'/ɪə/',cn:'耳朵',core:true}, {w:'hear',ipa:'/hɪə/',cn:'听见',core:true}, {w:'near',ipa:'/nɪə/',cn:'附近',core:true}, {w:'year',ipa:'/jɪə/',cn:'年',core:true} ] },
    { rime:'-eer', words:[ {w:'deer',ipa:'/dɪə/',cn:'鹿'}, {w:'cheer',ipa:'/tʃɪə/',cn:'欢呼'} ] }
  ]}

];
