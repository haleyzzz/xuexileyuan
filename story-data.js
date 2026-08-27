/* story-data.js —— 英语短文学习卡数据源（离线可读，断网也能打开）
 * 由 STORY_LESSONS 数组承载，每篇结构：
 *   title      : 英文标题
 *   level      : 难度/适用说明（中文）
 *   sentences  : 英文句子数组（逐句朗读 + 高亮）
 *   trans      : 与 sentences 一一对应的中文翻译
 *   questions  : 问题数组，每项 { q:英文问, a:英文答, type:题型(细节题/理解题/主旨题) }
 * 暴露全局 window.STORY_LESSONS，由 英语短文学习卡.html 加载并支持选书。 */
window.STORY_LESSONS = [

/* ===== 故事类（对标牛津树：家庭 / 动物 / 日常情景） ===== */

{
  title: "The Lost Red Balloon",
  level: "适合：小学三~六年级 · 课外趣味阅读（一般过去时）",
  sentences: [
    "One sunny afternoon, Lily was walking in the park.",
    "She was holding a big red balloon in her hand.",
    "Suddenly, a strong wind blew, and the balloon flew away.",
    "Lily cried and ran after it as fast as she could.",
    "The balloon landed on the roof of a small blue house.",
    "A kind old man opened the door and gave it back to her.",
    "Lily smiled and said thank you to the nice man.",
    "Then she went home happily with her red balloon."
  ],
  trans: [
    "一个晴朗的下午，莉莉正在公园里散步。",
    "她手里拿着一个红色的大气球。",
    "突然，一阵强风吹来，气球飞走了。",
    "莉莉哭着，尽可能快地追了上去。",
    "气球落在了一座蓝色小房子的屋顶上。",
    "一位善良的老人打开门，把气球还给了她。",
    "莉莉笑了，并向这位好心的老人道谢。",
    "然后她带着红气球开心地回家了。"
  ],
  questions: [
    { q:"Where was Lily walking?“, a:”She was walking in the park.“, type:”细节题" },
    { q:"What color was the balloon?“, a:”The balloon was red.“, type:”细节题" },
    { q:"Why did Lily run after the balloon?“, a:”Because a strong wind blew it away and she wanted it back.“, type:”理解题" },
    { q:"Who gave the balloon back to Lily?“, a:”A kind old man who lived in the blue house.“, type:”细节题" }
  ]
},

{
  title: "A New Friend",
  level: "适合：小学一年级 · 校园生活（一般现在时）",
  sentences: [
    "Ben is a new boy in my class.",
    "He has short black hair and a big smile.",
    "We play together at break time.",
    "He likes to draw cars and robots.",
    "Now we are good friends.",
    "I am happy to have a new friend."
  ],
  trans: [
    "本是我班里新来的男孩。",
    "他留着黑色短发，笑容很灿烂。",
    "课间休息时我们一起玩。",
    "他喜欢画汽车和机器人。",
    "现在我们成了好朋友。",
    "我很开心有了一个新朋友。"
  ],
  questions: [
    { q:"Who is the new boy in class?“, a:”Ben is the new boy.“, type:”细节题" },
    { q:"What does Ben like to draw?“, a:”He likes to draw cars and robots.“, type:”细节题" },
    { q:"How does the writer feel about the new friend?“, a:”The writer is happy to have a new friend.“, type:”理解题" }
  ]
},

{
  title: "My Little Cat",
  level: "适合：小学一年级 · 宠物（一般现在时）",
  sentences: [
    "I have a little cat named Mimi.",
    "She is white and very soft.",
    "Mimi likes to sleep on my bed.",
    "Every morning she wakes me up.",
    "We play with a red ball.",
    "I love my little cat."
  ],
  trans: [
    "我有一只叫咪咪的小猫。",
    "她是白色的，毛很软。",
    "咪咪喜欢睡在我的床上。",
    "每天早上她都会叫醒我。",
    "我们一起玩一个红色的球。",
    "我爱我的小猫。"
  ],
  questions: [
    { q:"What is the cat's name?“, a:”The cat's name is Mimi.“, type:”细节题" },
    { q:"What color is Mimi?“, a:”Mimi is white.“, type:”细节题" },
    { q:"What does the writer love?“, a:”The writer loves the little cat.“, type:”理解题" }
  ]
},

{
  title: "The Rainy Day",
  level: "适合：小学一年级 · 天气（一般过去时）",
  sentences: [
    "Yesterday it rained all day.",
    "I could not go outside to play.",
    "Mom and I made a paper boat.",
    "We put it in a small pool of water.",
    "The boat floated on the water.",
    "It was a fun rainy day at home."
  ],
  trans: [
    "昨天下了一整天的雨。",
    "我不能到外面去玩。",
    "我和妈妈做了一只纸船。",
    "我们把船放进水洼里。",
    "小船浮在水面上。",
    "这是在家度过的有趣的下雨天。"
  ],
  questions: [
    { q:"What was the weather like yesterday?“, a:”It rained all day yesterday.“, type:”细节题" },
    { q:"What did the writer and Mom make?“, a:”They made a paper boat.“, type:”细节题" },
    { q:"Where did they put the boat?“, a:”They put it in a small pool of water.“, type:”细节题" }
  ]
},

{
  title: "Tom's Birthday",
  level: "适合：小学二年级 · 生日聚会（一般过去时）",
  sentences: [
    "Tom had a birthday party last Sunday.",
    "His friends came to his house.",
    "They ate cake and drank juice.",
    "Tom opened many nice gifts.",
    "He got a blue bicycle from his dad.",
    "Everyone sang and laughed together."
  ],
  trans: [
    "上周日汤姆举办了一个生日聚会。",
    "他的朋友们来到了他家。",
    "他们吃了蛋糕，喝了果汁。",
    "汤姆拆开了许多精美的礼物。",
    "他从爸爸那里得到了一辆蓝色的自行车。",
    "大家一起唱歌、欢笑。"
  ],
  questions: [
    { q:"When did Tom have his party?“, a:”Last Sunday.“, type:”细节题" },
    { q:"What did Tom get from his dad?“, a:”He got a blue bicycle.“, type:”细节题" },
    { q:"How did the children feel at the party?“, a:”They felt happy and laughed together.“, type:”理解题" }
  ]
},

{
  title: "A Trip to the Zoo",
  level: "适合：小学二年级 · 动物（一般过去时）",
  sentences: [
    "We went to the zoo with our teacher.",
    "We saw elephants, monkeys and tigers.",
    "The monkey ate a yellow banana.",
    "The elephant used its long nose to drink.",
    "My favorite animal was the panda.",
    "We took many photos and went home."
  ],
  trans: [
    "我们和老师一起去了动物园。",
    "我们看到了大象、猴子和老虎。",
    "猴子吃了一根黄色的香蕉。",
    "大象用它的长鼻子喝水。",
    "我最喜欢的动物是熊猫。",
    "我们拍了许多照片，然后回家了。"
  ],
  questions: [
    { q:"Who did the writer go to the zoo with?“, a:”With the teacher and classmates.“, type:”细节题" },
    { q:"What was the writer's favorite animal?“, a:”The panda was the favorite.“, type:”细节题" },
    { q:"What did the elephant use to drink?“, a:”It used its long nose.“, type:”细节题" }
  ]
},

{
  title: "Helping Mom",
  level: "适合：小学二年级 · 家庭（一般现在时）",
  sentences: [
    "Mom is busy every evening.",
    "I help her wash the dishes.",
    "Dad waters the flowers.",
    "My sister cleans her small desk.",
    "We work together at home.",
    "Mom says we are good children."
  ],
  trans: [
    "妈妈每天晚上都很忙。",
    "我帮她洗碗。",
    "爸爸给花浇水。",
    "妹妹收拾她的小书桌。",
    "我们在家里一起干活。",
    "妈妈说我们是好孩子。"
  ],
  questions: [
    { q:"What does the writer help Mom do?“, a:”Wash the dishes.“, type:”细节题" },
    { q:"What does Dad do at home?“, a:”He waters the flowers.“, type:”细节题" },
    { q:"Why does Mom say they are good children?“, a:”Because they work together and help at home.“, type:”理解题" }
  ]
},

{
  title: "The Friendly Dog",
  level: "适合：小学三年级 · 动物（一般现在时）",
  sentences: [
    "There is a friendly dog in our street.",
    "His name is Coco and he is brown.",
    "Coco waits for children after school.",
    "He wags his tail when he sees us.",
    "We give him clean water every day.",
    "Coco is everyone's good friend."
  ],
  trans: [
    "我们街上有一只友好的狗。",
    "他叫可可，是棕色的。",
    "可可每天放学后等孩子们。",
    "他见到我们就摇尾巴。",
    "我们每天给他干净的饮水。",
    "可可是大家的好朋友。"
  ],
  questions: [
    { q:"What is the dog's name and color?“, a:”His name is Coco and he is brown.“, type:”细节题" },
    { q:"What does Coco do when he sees the children?“, a:”He wags his tail.“, type:”细节题" },
    { q:"How do the children help Coco?“, a:”They give him clean water every day.“, type:”理解题" }
  ]
},

{
  title: "Lost in the Park",
  level: "适合：小学三年级 · 安全（一般过去时）",
  sentences: [
    "Last weekend I lost my mom in the park.",
    "I felt afraid and began to cry.",
    "A nice woman asked me my name.",
    "She took me to the park office.",
    "Mom found me there ten minutes later.",
    "Now I always hold Mom's hand outside."
  ],
  trans: [
    "上周末我在公园里和妈妈走散了。",
    "我很害怕，哭了起来。",
    "一位好心的阿姨问了我的名字。",
    "她把我带到了公园管理处。",
    "十分钟后妈妈在那里找到了我。",
    "现在我出门总是牵着妈妈的手。"
  ],
  questions: [
    { q:"Where did the writer lose Mom?“, a:”In the park.“, type:”细节题" },
    { q:"Who helped the writer?“, a:”A nice woman took him to the park office.“, type:”细节题" },
    { q:"What does the writer do now outside?“, a:”He always holds Mom's hand.“, type:”理解题" }
  ]
},

{
  title: "My Brother's Robot",
  level: "适合：小学三年级 · 想象（一般现在时）",
  sentences: [
    "My brother has a small blue robot.",
    "The robot can walk and talk.",
    "It helps him clean his room.",
    "Sometimes it tells funny jokes.",
    "We play games with the robot.",
    "It is a clever and happy little friend."
  ],
  trans: [
    "我哥哥有一个蓝色的小机器人。",
    "这个机器人会走路，也会说话。",
    "它帮哥哥收拾房间。",
    "有时它会讲有趣的笑话。",
    "我们和机器人一起玩游戏。",
    "它是一个聪明又快乐的小伙伴。"
  ],
  questions: [
    { q:"What can the robot do?“, a:”It can walk, talk and help clean the room.“, type:”细节题" },
    { q:"What does the robot sometimes tell?“, a:”It tells funny jokes.“, type:”细节题" },
    { q:"How is the robot described?“, a:”Clever and happy.“, type:”理解题" }
  ]
},

{
  title: "The School Play",
  level: "适合：小学四年级 · 活动（一般过去时）",
  sentences: [
    "Our school had a play last month.",
    "I acted as a little red fox.",
    "My friend Lucy was a white rabbit.",
    "We practiced for three weeks.",
    "Many parents came to watch us.",
    "Everyone clapped at the end."
  ],
  trans: [
    "我们学校上个月演了一出戏。",
    "我扮演一只红色的小狐狸。",
    "我的朋友露西是一只白兔子。",
    "我们练习了三个星期。",
    "许多家长来看我们的演出。",
    "最后大家都为我们鼓掌。"
  ],
  questions: [
    { q:"What role did the writer play?“, a:”A little red fox.“, type:”细节题" },
    { q:"How long did they practice?“, a:”For three weeks.“, type:”细节题" },
    { q:"Who came to watch the play?“, a:”Many parents came to watch.“, type:”理解题" }
  ]
},

{
  title: "A Visit to Grandma",
  level: "适合：小学四年级 · 亲情（一般过去时）",
  sentences: [
    "We visited Grandma in the countryside.",
    "She lives in a small white house.",
    "Grandma cooked tasty noodles for us.",
    "We picked red apples in her garden.",
    "In the evening we watched the stars.",
    "It was a warm and happy weekend."
  ],
  trans: [
    "我们去乡下看望奶奶。",
    "她住在一座白色的小房子里。",
    "奶奶给我们煮了好吃的面条。",
    "我们在她的园子里摘红苹果。",
    "晚上我们一起看星星。",
    "那是一个温暖又快乐的周末。"
  ],
  questions: [
    { q:"Where does Grandma live?“, a:”In a small white house in the countryside.“, type:”细节题" },
    { q:"What did they pick in the garden?“, a:”Red apples.“, type:”细节题" },
    { q:"How was the weekend?“, a:”Warm and happy.“, type:”理解题" }
  ]
},

{
  title: "The Science Fair",
  level: "适合：小学五年级 · 科学（一般过去时）",
  sentences: [
    "Our school held a science fair on Friday.",
    "I made a model of a volcano.",
    "When I poured vinegar in, it erupted.",
    "Red foam ran down the sides.",
    "My teacher said it was a good model.",
    "I won a blue ribbon for my work."
  ],
  trans: [
    "我们学校周五举办了一场科学展。",
    "我做了一个火山模型。",
    "当我倒入醋的时候，它喷发了。",
    "红色的泡沫顺着山体流下。",
    "老师说这是一个很好的模型。",
    "我凭借作品赢得了一条蓝丝带。"
  ],
  questions: [
    { q:"What did the writer make for the fair?“, a:”A model of a volcano.“, type:”细节题" },
    { q:"What made the volcano erupt?“, a:”Pouring vinegar into it.“, type:”细节题" },
    { q:"What did the writer win?“, a:”A blue ribbon.“, type:”理解题" }
  ]
},

{
  title: "Our Class Pet",
  level: "适合：小学五年级 · 责任（一般现在时）",
  sentences: [
    "Our class has a pet turtle named Speedy.",
    "Speedy lives in a glass tank with water.",
    "Every Monday I feed him green leaves.",
    "He sleeps most of the afternoon.",
    "We take turns cleaning his home.",
    "Speedy teaches us to be careful and kind."
  ],
  trans: [
    "我们班有一只叫“小快”的宠物乌龟。",
    "小快住在一个有水的玻璃缸里。",
    "每个星期一我喂他绿叶子。",
    "他下午大部分时间都在睡觉。",
    "我们轮流清理他的家。",
    "小快教会我们要细心和善良。"
  ],
  questions: [
    { q:"What is the class pet and its name?“, a:”A turtle named Speedy.“, type:”细节题" },
    { q:"What does the writer feed Speedy?“, a:”Green leaves.“, type:”细节题" },
    { q:"What does Speedy teach the class?“, a:”To be careful and kind.“, type:”理解题" }
  ]
},

{
  title: "The Missing Homework",
  level: "适合：小学六年级 · 成长（一般过去时）",
  sentences: [
    "I could not find my homework this morning.",
    "I looked in my bag and under the bed.",
    "Then I remembered I left it at Grandma's.",
    "I told the truth to my teacher.",
    "She asked me to bring it tomorrow.",
    "I learned to keep my things in one place."
  ],
  trans: [
    "今天早上我找不到我的作业了。",
    "我翻了书包，又看了床底下。",
    "后来我想起是落在奶奶家了。",
    "我向老师说了实话。",
    "她让我明天带去。",
    "我学会了把东西放在固定的地方。"
  ],
  questions: [
    { q:"Where did the writer leave the homework?“, a:”At Grandma's house.“, type:”细节题" },
    { q:"What did the writer tell the teacher?“, a:”The truth about the missing homework.“, type:”细节题" },
    { q:"What did the writer learn?“, a:”To keep things in one place.“, type:”理解题" }
  ]
},

/* ===== 非虚构类（对标 NGL / 朗文：动物科普 / 自然 / 太空 / 地理） ===== */

{
  title: "Giant Pandas",
  level: "适合：小学一年级 · 动物科普",
  sentences: [
    "A panda is a black and white bear.",
    "Pandas live in the forests of China.",
    "They love to eat bamboo shoots.",
    "A panda can eat for ten hours a day.",
    "Baby pandas are small and pink.",
    "We must protect pandas and their home."
  ],
  trans: [
    "熊猫是一种黑白相间的熊。",
    "熊猫生活在中国的森林里。",
    "它们喜欢吃竹笋。",
    "一只熊猫一天能吃上十个小时。",
    "熊猫宝宝很小，而且是粉色的。",
    "我们必须保护熊猫和它们的家园。"
  ],
  questions: [
    { q:"What color is a panda?“, a:”Black and white.“, type:”细节题" },
    { q:"What do pandas love to eat?“, a:”Bamboo shoots.“, type:”细节题" },
    { q:"Where do pandas live?“, a:”In the forests of China.“, type:”细节题" }
  ]
},

{
  title: "The Sun",
  level: "适合：小学一年级 · 自然",
  sentences: [
    "The sun is a big star in the sky.",
    "It gives us light and warm heat.",
    "Plants need the sun to grow.",
    "The sun rises in the east.",
    "At night we cannot see the sun.",
    "The sun helps all life on Earth."
  ],
  trans: [
    "太阳是天空中一颗巨大的恒星。",
    "它给我们光和温暖。",
    "植物需要太阳才能生长。",
    "太阳从东方升起。",
    "夜晚我们看不见太阳。",
    "太阳帮助地球上的所有生命。"
  ],
  questions: [
    { q:"What does the sun give us?“, a:”Light and warm heat.“, type:”细节题" },
    { q:"Why do plants need the sun?“, a:”To grow.“, type:”细节题" },
    { q:"Where does the sun rise?“, a:”In the east.“, type:”细节题" }
  ]
},

{
  title: "How Bees Make Honey",
  level: "适合：小学二年级 · 科学",
  sentences: [
    "Bees fly from flower to flower.",
    "They collect sweet nectar with their tongues.",
    "Bees store nectar inside the hive.",
    "Their wings make the nectar thick.",
    "Slowly it becomes golden honey.",
    "Honey is a sweet food made by bees."
  ],
  trans: [
    "蜜蜂在花丛中飞来飞去。",
    "它们用舌头采集甜甜的花蜜。",
    "蜜蜂把花蜜储存在蜂巢里。",
    "它们扇动翅膀让花蜜变浓。",
    "慢慢地，花蜜变成了金色的蜂蜜。",
    "蜂蜜是蜜蜂酿成的甜食。"
  ],
  questions: [
    { q:"What do bees collect from flowers?“, a:”Sweet nectar.“, type:”细节题" },
    { q:"Where do bees store the nectar?“, a:”Inside the hive.“, type:”细节题" },
    { q:"What is honey?“, a:”A sweet food made by bees.“, type:”理解题" }
  ]
},

{
  title: "Volcanoes",
  level: "适合：小学三年级 · 地理",
  sentences: [
    "A volcano is a mountain with a hole.",
    "Deep inside, the earth is very hot.",
    "Hot rock becomes liquid called magma.",
    "Sometimes magma bursts out the top.",
    "It flows down as red, glowing lava.",
    "Volcanoes shape the land over time."
  ],
  trans: [
    "火山是一座有洞的山。",
    "地球深处非常热。",
    "滚烫的岩石变成叫“岩浆”的液体。",
    "有时岩浆会从山顶喷出来。",
    "它作为发红发光的熔岩流下山坡。",
    "火山随着时间改变着大地。"
  ],
  questions: [
    { q:"What is a volcano?“, a:”A mountain with a hole.“, type:”细节题" },
    { q:"What is the liquid rock inside called?“, a:”Magma.“, type:”细节题" },
    { q:"What flows down a volcano?“, a:”Red, glowing lava.“, type:”细节题" }
  ]
},

{
  title: "The Water Cycle",
  level: "适合：小学三年级 · 科学",
  sentences: [
    "The sun heats the water in rivers.",
    "Water rises up as invisible vapor.",
    "High in the sky it makes clouds.",
    "Clouds grow heavy and rain falls.",
    "Rain flows back to rivers and seas.",
    "This moving water is the water cycle."
  ],
  trans: [
    "太阳加热河流里的水。",
    "水化作看不见的水汽升上天空。",
    "在高空，水汽聚成了云。",
    "云变重了，雨就落下来。",
    "雨水又流回河流与大海。",
    "这循环流动的水就是水循环。"
  ],
  questions: [
    { q:"What does the sun do to river water?“, a:”Heats it so it rises as vapor.“, type:”细节题" },
    { q:"What forms high in the sky?“, a:”Clouds.“, type:”细节题" },
    { q:"What is the water cycle?“, a:”Water moving from rivers to sky to rain and back.“, type:”理解题" }
  ]
},

{
  title: "Stars at Night",
  level: "适合：小学四年级 · 太空",
  sentences: [
    "At night we see many small stars.",
    "Stars are huge balls of hot gas.",
    "They look tiny because they are far.",
    "The sun is also a star, up close.",
    "Some stars have planets around them.",
    "People study stars with big telescopes."
  ],
  trans: [
    "夜晚我们能看到许多小星星。",
    "恒星是巨大的炽热气体球。",
    "它们看起来很小，是因为离得很远。",
    "太阳也是一颗恒星，只是离我们近。",
    "有些恒星周围有行星环绕。",
    "人们用大望远镜研究星星。"
  ],
  questions: [
    { q:"Why do stars look tiny?“, a:”Because they are very far away.“, type:”细节题" },
    { q:"What is the sun?“, a:”A star that is close to us.“, type:”细节题" },
    { q:"How do people study stars?“, a:”With big telescopes.“, type:”细节题" }
  ]
},

{
  title: "Why Leaves Turn Red",
  level: "适合：小学四年级 · 自然",
  sentences: [
    "Leaves are green in spring and summer.",
    "Green comes from a color called chlorophyll.",
    "In autumn the weather gets cool.",
    "Trees slow down and stop making green.",
    "Yellow and red colors show through.",
    "That is why fall leaves are colorful."
  ],
  trans: [
    "春天和夏天树叶是绿色的。",
    "绿色来自一种叫“叶绿素”的物质。",
    "秋天天气变凉。",
    "树木放慢生长，不再制造绿色。",
    "黄色和红色就显现出来。",
    "这就是秋叶五彩缤纷的原因。"
  ],
  questions: [
    { q:"What makes leaves green?“, a:”A color called chlorophyll.“, type:”细节题" },
    { q:"Why do leaves change color in fall?“, a:”Trees stop making green, so yellow and red show.“, type:”细节题" },
    { q:"When are leaves green?“, a:”In spring and summer.“, type:”细节题" }
  ]
},

{
  title: "Polar Bears",
  level: "适合：小学四年级 · 动物",
  sentences: [
    "Polar bears live in the cold Arctic.",
    "They have thick white fur to keep warm.",
    "Their big paws help them walk on ice.",
    "Polar bears are strong swimmers.",
    "They hunt seals for their food.",
    "Warming ice threatens their home."
  ],
  trans: [
    "北极熊生活在寒冷的北极。",
    "它们有厚厚的白毛来保暖。",
    "大大的熊掌帮助它们在冰上行走。",
    "北极熊是强壮的游泳者。",
    "它们捕食海豹为食。",
    "冰川变暖正威胁着它们的家园。"
  ],
  questions: [
    { q:"Where do polar bears live?“, a:”In the cold Arctic.“, type:”细节题" },
    { q:"What helps them walk on ice?“, a:”Their big paws.“, type:”细节题" },
    { q:"What threatens polar bears?“, a:”Warming ice.“, type:”细节题" }
  ]
},

{
  title: "The Solar System",
  level: "适合：小学五年级 · 太空",
  sentences: [
    "Our solar system has one star and eight planets.",
    "The sun sits in the center of it.",
    "Earth is the third planet from the sun.",
    "Some planets are made of rock.",
    "Others are huge balls of gas.",
    "They all travel around the sun."
  ],
  trans: [
    "我们的太阳系有一颗恒星和八颗行星。",
    "太阳位于太阳系的中心。",
    "地球是距太阳第三远的行星。",
    "有些行星由岩石构成。",
    "另一些是巨大的气体球。",
    "它们都绕着太阳运行。"
  ],
  questions: [
    { q:"How many planets are in our solar system?“, a:”Eight planets.“, type:”细节题" },
    { q:"Which planet is Earth?“, a:”The third planet from the sun.“, type:”细节题" },
    { q:"What sits in the center?“, a:”The sun.“, type:”细节题" }
  ]
},

{
  title: "Oceans of the World",
  level: "适合：小学五年级 · 地理",
  sentences: [
    "Most of our planet is covered by ocean.",
    "There are five big oceans on Earth.",
    "Ocean water is salty, not sweet.",
    "Whales and dolphins live in the sea.",
    "Coral reefs are homes for small fish.",
    "Oceans give us food and fresh air."
  ],
  trans: [
    "我们星球的大部分被海洋覆盖。",
    "地球上有五大洋。",
    "海水是咸的，不是甜的。",
    "鲸鱼和海豚生活在海里。",
    "珊瑚礁是小鱼的家。",
    "海洋给我们食物和清新的空气。"
  ],
  questions: [
    { q:"How much of Earth is ocean?“, a:”Most of the planet is covered by ocean.“, type:”细节题" },
    { q:"How does ocean water taste?“, a:”Salty.“, type:”细节题" },
    { q:"What do oceans give us?“, a:”Food and fresh air.“, type:”理解题" }
  ]
},

{
  title: "How Plants Grow",
  level: "适合：小学五年级 · 科学",
  sentences: [
    "A plant starts life as a small seed.",
    "It needs water, soil and sunlight.",
    "The root grows down into the earth.",
    "The stem and leaves reach for light.",
    "Flowers make new seeds for the future.",
    "Plants make the oxygen we breathe."
  ],
  trans: [
    "植物从一颗小小的种子开始生命。",
    "它需要水、土壤和阳光。",
    "根向地里生长。",
    "茎和叶朝着光伸展。",
    "花朵为未来结出新的种子。",
    "植物制造我们呼吸的氧气。"
  ],
  questions: [
    { q:"What does a plant start as?“, a:”A small seed.“, type:”细节题" },
    { q:"What does a plant need to grow?“, a:”Water, soil and sunlight.“, type:”细节题" },
    { q:"What do plants make for us?“, a:”The oxygen we breathe.“, type:”理解题" }
  ]
},

{
  title: "Fossils Tell Stories",
  level: "适合：小学六年级 · 科学",
  sentences: [
    "Fossils are the remains of old life.",
    "They formed millions of years ago.",
    "A bone or leaf turned to stone slowly.",
    "Scientists dig fossils from rock.",
    "They tell us about dinosaurs and trees.",
    "Fossils are pages from Earth's diary."
  ],
  trans: [
    "化石是远古生命的遗迹。",
    "它们形成于数百万年前。",
    "骨头或叶子慢慢变成了石头。",
    "科学家从岩石中挖掘化石。",
    "它们向我们讲述恐龙和树木的故事。",
    "化石是地球日记里的一页页。"
  ],
  questions: [
    { q:"What are fossils?“, a:”Remains of old life from long ago.“, type:”细节题" },
    { q:"How do fossils form?“, a:”A bone or leaf slowly turns to stone.“, type:”细节题" },
    { q:"What do fossils tell us?“, a:”Stories about dinosaurs and ancient life.“, type:”理解题" }
  ]
},

{
  title: "What Is an Ecosystem",
  level: "适合：小学六年级 · 科学",
  sentences: [
    "An ecosystem is a community of life.",
    "Plants, animals and tiny bugs live together.",
    "They share one place, like a pond.",
    "Each one needs the others to live.",
    "Clean water and air keep it healthy.",
    "When one part is hurt, all are hurt."
  ],
  trans: [
    "生态系统是一个生命的大家庭。",
    "植物、动物和微小的昆虫共同生活。",
    "它们共享一个地方，比如一个池塘。",
    "每一个都需要彼此才能生存。",
    "干净的水和空气让它保持健康。",
    "当一部分受伤，全体都会受伤。"
  ],
  questions: [
    { q:"What is an ecosystem?“, a:”A community of living things sharing one place.“, type:”细节题" },
    { q:"What do the living things in it do?“, a:”They live together and need each other.“, type:”细节题" },
    { q:"What keeps an ecosystem healthy?“, a:”Clean water and air.“, type:”理解题" }
  ]
},

{
  title: "Mountains and Volcanoes",
  level: "适合：小学六年级 · 地理",
  sentences: [
    "Mountains are the highest lands on Earth.",
    "Some mountains were pushed up by rock.",
    "Volcanoes build mountains with lava.",
    "Snow sits on the tops of tall peaks.",
    "People climb them for adventure.",
    "Mountains hold rivers that give us water."
  ],
  trans: [
    "山脉是地球上最高的陆地。",
    "有些山脉是由岩石挤压抬升形成的。",
    "火山用熔岩堆出山脉。",
    "雪覆盖在高山的顶端。",
    "人们为探险而攀登它们。",
    "山脉孕育的河流给我们提供水源。"
  ],
  questions: [
    { q:"What are the highest lands on Earth?“, a:”Mountains.“, type:”细节题" },
    { q:"How do volcanoes build mountains?“, a:”With lava.“, type:”细节题" },
    { q:"What do mountain rivers give us?“, a:”Water.“, type:”细节题" }
  ]
},

{
  title: "Saving Our Earth",
  level: "适合：小学六年级 · 环保",
  sentences: [
    "Our Earth is the only home we have.",
    "People make too much trash every day.",
    "Smoke from cars warms the air.",
    "We can walk, recycle and plant trees.",
    "Clean rivers help fish and people.",
    "Small acts by many people save the Earth."
  ],
  trans: [
    "地球是我们唯一的家园。",
    "人们每天制造太多垃圾。",
    "汽车排出的烟让空气变暖。",
    "我们可以步行、回收、种树。",
    "干净的河流造福鱼和人类。",
    "许多人的小小行动能拯救地球。"
  ],
  questions: [
    { q:"What is our only home?“, a:”The Earth.“, type:”细节题" },
    { q:"What warms the air?“, a:”Smoke from cars.“, type:”细节题" },
    { q:"What can people do to help?“, a:”Walk, recycle and plant trees.“, type:”理解题" }
  ]
}

];
