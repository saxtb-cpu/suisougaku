const LAST=[
  '田中','鈴木','佐藤','山田','渡辺','中村','小林','加藤','吉田','松本',
  '井上','木村','林','斎藤','清水','山口','池田','橋本','阿部','石川',
  '山本','前田','村上','長谷川','近藤','和田','石井','福田','大野','中川',
  '岡田','藤田','藤井','野口','高橋','伊藤','中島','小川','工藤','原田',
  '西村','松田','岡本','浜田','川口','斉藤','宮崎','菊地','白石','三浦',
  '谷口','今井','安藤','太田','水野','坂本','内田','永田','大塚','森田',
  '上田','千葉','関口','藤本','菅原','金子','島田','後藤','横山','増田',
  '星野','辻','平野','杉本','青木','片山','南','河野','新井','徳田',
];
const FIRST_F=[
  // 漢字系
  '桜','仁美','愛奈','葵','里奈','結衣','朱里','美紀','華','琴',
  '望','光','恵','舞','千尋','彩香','夏美','香織','恵美','美緒',
  '里緒','文香','星奈','優香','詩織','桃子','香奈','一花','遥','翼',
  '凛','麻衣','理沙','彩乃','奈々','真由','沙希','美咲','柚希','澪',
  '陽菜','花音','心春','日向','咲良','彩','柚月','莉子','紬','唯',
  '七海','菜摘','明日香','瑠奈','亜美','千夏','真凜','愛梨','桜子','玲奈',
  // ひらがな系
  'あかり','いずみ','うみ','えみ','おとは',
  'かのん','きらら','くるみ','このは','こまち',
  'さくら','しおり','すずな','せな','そら',
  'なつき','にこ','ののか','はな','ひより',
  'まなか','みう','むつみ','めい','もも',
  'ゆい','ゆか','よりこ','りの','るか',
];
const FIRST_M=[
  // 漢字系
  '太郎','健人','勇樹','陽翔','颯','陸','光輝','翔','蓮','春輝',
  '智也','大輝','雅人','純','弘樹','海斗','悠斗','彰','直哉','哲也',
  '圭','亮','真也','康平','悠','湊','蒼','颯太','昂','颯人',
  '蒼空','陽大','悠真','凌','律','奏','碧','樹','瑛太','朔',
  '一颯','旺太','翔太','大和','柊','陽斗','湊斗','悠人','将吾','誠',
  // ひらがな系
  'あきら','いつき','うた','おとや',
  'かいと','きよと','くうが','こうた',
  'さとし','じゅん','そうた','たいが',
  'なおき','はると','ひびき','ふうと',
  'まこと','みつき','むさし','やまと',
  'ゆうと','よしき','りく','れん',
];
const ADV_F=['田村 あき子','高木 由美','中森 信子','佐伯 美奈','杉浦 恵','宮本 直子','岩田 康子','桐島 千恵','松岡 理恵','福永 智子'];
const ADV_M=['中谷 敏行','岡野 俊介','三浦 勇気','吉川 誠二','黒岩 一郎','石橋 健','磯部 義夫','河合 稔','堀田 雅彦','宮田 良平'];
const SCH_PFX=['桜丘','緑陵','北星','南風','東明','西陽','青空','白鷹','若葉','光陵','翠嶺','朱雀','玄武','蒼龍','鳳凰','月見野','星ヶ丘','夕映え','黎明','旭川','梅が丘','桐林','瑞穂','銀河','曙'];
const SCH_SFX=['高校','第一高校','附属高校','学園高校','中学校'];
const SCH_FEAT=['強豪OB多数','専用練習棟あり','楽器設備充実','保護者会が活発','顧問の指導実績豊富','地域密着型','コンクール常連','歴史ある部活','音楽科設置','合宿施設完備','外部講師招聘実績','地区No.1の音響設備'];

// 特徴ごとのボーナス定義
const FEAT_BONUS={
  '強豪OB多数':{
    label:'強豪OB多数',
    desc:'OBのネットワークが豊富。技術指導や精神的サポートが充実。',
    memberBonus: m=>{ m.skill=Math.min(m.skill+3,99); m.potential=Math.min(m.potential+5,99); },
    weeklyFx:   g=>{ if(Math.random()<0.12) applyAll(g,{skill:1,morale:2}); }, // 月1回程度OBからアドバイス
    fundBonus:  0,
  },
  '専用練習棟あり':{
    label:'専用練習棟あり',
    desc:'いつでも使える練習環境がある。スタミナの回復が早い。',
    memberBonus: m=>{ m.stamina=Math.min(m.stamina+5,99); },
    weeklyFx:   g=>{ g.members.forEach(m=>m.stamina=Math.min(99,m.stamina+1)); },
    fundBonus:  0,
  },
  '楽器設備充実':{
    label:'楽器設備充実',
    desc:'質の高い楽器が揃っている。演奏力・表現力の初期値が高い。',
    memberBonus: m=>{ m.skill=Math.min(m.skill+4,99); m.expression=Math.min(m.expression+3,99); },
    weeklyFx:   null,
    fundBonus:  0,
  },
  '保護者会が活発':{
    label:'保護者会が活発',
    desc:'保護者のサポートが手厚い。資金面と士気が安定しやすい。',
    memberBonus: m=>{ m.morale=Math.min(m.morale+4,99); },
    weeklyFx:   null,
    fundBonus:  15000, // 毎月の追加補助
  },
  '顧問の指導実績豊富':{
    label:'顧問の指導実績豊富',
    desc:'経験豊富な顧問。練習効果が全体的に高まる。',
    memberBonus: m=>{ m.skill=Math.min(m.skill+2,99); m.expression=Math.min(m.expression+2,99); },
    weeklyFx:   g=>{ if(Math.random()<0.15) applyAll(g,{skill:1,ens:1}); },
    fundBonus:  0,
  },
  '地域密着型':{
    label:'地域密着型',
    desc:'地域からの支援が厚い。演奏機会が多く本番慣れしやすい。',
    memberBonus: m=>{ m.morale=Math.min(m.morale+3,99); m.stamina=Math.min(m.stamina+2,99); },
    weeklyFx:   null,
    fundBonus:  8000,
  },
  'コンクール常連':{
    label:'コンクール常連',
    desc:'コンクールの空気感を知っている。本番のスコアにボーナス。',
    memberBonus: m=>{ m.skill=Math.min(m.skill+3,99); },
    weeklyFx:   null,
    fundBonus:  0,
    compBonus:  4, // コンクールスコアに加算
  },
  '歴史ある部活':{
    label:'歴史ある部活',
    desc:'長年の伝統が部員の誇りになっている。士気と潜在力が高い。',
    memberBonus: m=>{ m.morale=Math.min(m.morale+5,99); m.potential=Math.min(m.potential+3,99); },
    weeklyFx:   null,
    fundBonus:  0,
  },
  '音楽科設置':{
    label:'音楽科設置',
    desc:'音楽専門の授業がある。技術・表現力の成長が速い。',
    memberBonus: m=>{ m.skill=Math.min(m.skill+3,99); m.expression=Math.min(m.expression+4,99); m.potential=Math.min(m.potential+4,99); },
    weeklyFx:   null,
    fundBonus:  0,
  },
  '合宿施設完備':{
    label:'合宿施設完備',
    desc:'合宿がいつでも実施可能。夏合宿の効果が大幅アップ。',
    memberBonus: m=>{ m.stamina=Math.min(m.stamina+4,99); },
    weeklyFx:   null,
    fundBonus:  0,
    campBonus:  true, // 夏合宿の効果1.5倍
  },
  '外部講師招聘実績':{
    label:'外部講師招聘実績',
    desc:'プロ講師のコネクションがある。外部講師の費用が割安。',
    memberBonus: m=>{ m.skill=Math.min(m.skill+2,99); },
    weeklyFx:   null,
    fundBonus:  0,
    teacherDiscount: 15000, // 外部講師費用の割引
  },
  '地区No.1の音響設備':{
    label:'地区No.1の音響設備',
    desc:'最高の音響環境で練習できる。アンサンブルと表現力が伸びやすい。',
    memberBonus: m=>{ m.expression=Math.min(m.expression+5,99); },
    weeklyFx:   g=>{ if(Math.random()<0.1) applyAll(g,{ens:1,morale:1}); },
    fundBonus:  0,
  },
};
const PARTS=['フルート','クラリネット','サックス','トランペット','トロンボーン','ホルン','チューバ','打楽器','オーボエ'];

// 自由曲の特性プール（毎年2つランダム選択）
const JIYU_TRAITS=[
  {trait:'dramatic',  traitLabel:'ドラマティック', traitDesc:'クライマックスへの盛り上がりが鍵。モチベーションと表現力が問われる。',
   scoreWeight:{skill:0.30,ensemble:0.25,song:0.30,morale:0.15}},
  {trait:'technical', traitLabel:'超絶技巧',       traitDesc:'高度な個人技が随所に要求される。スキルが高い部員ほど加点が大きい。',
   scoreWeight:{skill:0.55,ensemble:0.20,song:0.15,morale:0.10}},
  {trait:'lyrical',   traitLabel:'歌心重視',       traitDesc:'美しいメロディーラインと表現力が命。アンサンブルの繊細さが問われる。',
   scoreWeight:{skill:0.20,ensemble:0.45,song:0.25,morale:0.10}},
  {trait:'rhythmic',  traitLabel:'リズム重視',     traitDesc:'複雑なリズムパターンが続く。打楽器・全体のグルーヴ感が重要。',
   scoreWeight:{skill:0.35,ensemble:0.30,song:0.25,morale:0.10}},
  {trait:'stamina',   traitLabel:'長大曲',         traitDesc:'演奏時間が長くスタミナ勝負。後半まで集中力を維持できるかが鍵。',
   scoreWeight:{skill:0.25,ensemble:0.25,song:0.25,morale:0.25}},
  {trait:'ensemble',  traitLabel:'全体調和重視',   traitDesc:'パート間のバランスと統一感が評価の中心。アンサンブル力が直結する。',
   scoreWeight:{skill:0.20,ensemble:0.55,song:0.15,morale:0.10}},
  {trait:'solo',      traitLabel:'ソリスト勝負',   traitDesc:'特定パートのソロが多く、担当部員の実力が結果を左右する。',
   scoreWeight:{skill:0.50,ensemble:0.15,song:0.25,morale:0.10}},
  {trait:'modern',    traitLabel:'現代音楽的',     traitDesc:'不協和音・特殊奏法が多用される。難しいが審査員の印象に残りやすい。',
   scoreWeight:{skill:0.50,ensemble:0.25,song:0.15,morale:0.10}},
];
function pickJiyuTraits(){
  const shuffled=[...JIYU_TRAITS].sort(()=>Math.random()-0.5);
  return shuffled.slice(0,2);
}

// ================================================================
// 曲パラメーター（5軸）定義
// ================================================================
const SONG_PARAMS=[
  {key:'pitch',      label:'音程・ピッチ',       icon:'🎵', col:'#2a7a5a'},
  {key:'rhythm',     label:'リズム・アンサンブル',icon:'🥁', col:'#2a5fa8'},
  {key:'tempo',      label:'テンポ安定',          icon:'⏱', col:'#a06020'},
  {key:'expression', label:'表現・音楽性',        icon:'🎭', col:'#a04060'},
  {key:'balance',    label:'バランス',            icon:'🎚', col:'#1a8070'},
];

// 初期曲パラメーターオブジェクト生成
function newSongParams(base=0){
  return {pitch:base,rhythm:base,tempo:base,expression:base,balance:base};
}

// 5軸の平均値（旧songに相当）
function songAvg(sp){
  if(!sp) return 0;
  return Math.round((sp.pitch+sp.rhythm+sp.tempo+sp.expression+sp.balance)/5);
}

// 練習タグ→曲パラメーター上昇量マッピング
const PRAC_SONG_FX={
  basic:      {pitch:3, rhythm:0, tempo:1, expression:0, balance:1},
  ensemble:   {pitch:1, rhythm:3, tempo:1, expression:1, balance:3},
  song:       {pitch:2, rhythm:2, tempo:2, expression:3, balance:2},
  sectional:  {pitch:3, rhythm:1, tempo:2, expression:0, balance:2},
  sectional_sup:{pitch:2,rhythm:1,tempo:2, expression:0, balance:3},
  intense:    {pitch:1, rhythm:0, tempo:3, expression:1, balance:0},
  teacher:    {pitch:2, rhythm:2, tempo:2, expression:3, balance:2},
  mental:     {pitch:0, rhythm:1, tempo:0, expression:4, balance:1},
  recording:  {pitch:2, rhythm:3, tempo:2, expression:1, balance:2},
  analysis:   {pitch:1, rhythm:1, tempo:1, expression:3, balance:1},
  concert:    {pitch:1, rhythm:2, tempo:2, expression:2, balance:1},
};
const PART_W={フルート:12,クラリネット:18,サックス:12,トランペット:14,トロンボーン:10,ホルン:8,チューバ:5,打楽器:13,オーボエ:8};
const PART_COL={フルート:'#2a8aaa',クラリネット:'#3a7a50',サックス:'#a07020',トランペット:'#b04020',トロンボーン:'#7040a0',ホルン:'#1a6090',チューバ:'#804040',打楽器:'#606060',オーボエ:'#406040'};
const PART_BG={フルート:'#e8f5fa',クラリネット:'#edf7f1',サックス:'#fdf6e6',トランペット:'#fdf0ec',トロンボーン:'#f5eeff',ホルン:'#e8f3fa',チューバ:'#fdf0f0',打楽器:'#f5f5f5',オーボエ:'#edf5ee'};
const PERSONALITIES=['リーダーシップ型','縁の下の力持ち','天才肌','努力家','繊細なアーティスト','お調子者','クールな職人','热血漢','人見知り','ムードメーカー','完璧主義者','自由奔放','堅実派','ひらめき型','忍耐強い','おっとり型'];
const PERS_DESC={
'リーダーシップ型':'「みんなついてきて！」タイプ。パートをまとめるのが上手く、部員から頼りにされる。士気が上がりやすい。さぼりには厳しい。',
'縁の下の力持ち':'目立たないけど、誰よりも丁寧に準備している。困ったときにいつのまにか助けてくれる縁の下の存在。',
'天才肌':'センスが光る。練習しなくても弾けちゃうタイプだが、気分にムラがあり、やる気のない日は全然練習しない。',
'努力家':'「もう1回やらせてください！」と自主練が好き。コツコツ積み上げる。成長速度が速い。',
'繊細なアーティスト':'音楽への感受性が高く、表現力が抜群。でもプレッシャーに弱く、本番前日は胃が痛くなりがち。',
'お調子者':'ノリが良くてムードメーカーだが、油断すると練習中にふざけたり、スマホを触り始める。さぼりやすい。',
'クールな職人':'感情を表に出さないが、技術は本物。「まあ、やるけど」と言いながらきっちりこなす。',
'热血漢':'「絶対全国行くぞ！」と熱くて情熱的。空回りすることもあるが、その気持ちが部を動かす。',
'人見知り':'初めは話しかけにくい雰囲気があるが、仲良くなると面白くて頼れる。陰で努力するタイプ。',
'ムードメーカー':'休憩中の雑談で部員を笑わせる。場の空気を読む天才。士気の低下を防いでくれる。',
'完璧主義者':'「もっと揃えよう」と細かいところが気になる。技術は高いが、ストレスを溜め込みやすい。',
'自由奔放':'「なんで同じ曲ばっかりやるの？」と独自路線。ルールに縛られないが、独創的な表現力がある。さぼりやすい。',
'堅実派':'「地道にいこう」と着実なタイプ。リスクを取らないが、安定した演奏をする。',
'ひらめき型':'突然「こう吹いたらよくない？」と天才的な提案をする。イレギュラーな場面で強い。',
'忍耐強い':'どんなつらい練習でも折れない。「まだいける」と最後まで続ける。長期的な成長が期待できる。',
'おっとり型':'マイペースでのんびりしてるが、焦らない落ち着きがある。本番でどっしりしてる。',
};
const HOBBIES=['マンガ鑑賞','ゲーム（オンライン）','カラオケ','アニメ鑑賞','SNS・動画視聴','バドミントン','バスケ','ランニング','料理・お菓子作り','絵を描くこと','写真・動画編集','音楽鑑賞（J-POP）','K-POP鑑賞','読書（ラノベ）','プログラミング','バンド活動','ボランティア','友達とショッピング','映画鑑賞','ボードゲーム'];
const STRENGTHS_POOL=['高音域が得意','リズム感が抜群','暗譜が得意','音量コントロールが上手','初見演奏が強い','ソロに強い','アンサンブルの要','スタミナが抜群'];
const WEAKNESS_POOL=['低音が苦手','緊張しやすい','練習に根気がない','高音がかすれる','リズムが走りがち','人の前で緊張する','練習の集中が続かない','細かいニュアンスが苦手'];
const MONTHLY_EVENTS={
4:['入学式・新入生迎え','編成規模選択','新入部員受付（2年目〜）'],
5:['春季演奏会','アンサンブルコンテスト'],
6:['コンクール課題曲発表','地区合同強化練習'],
7:['地区大会（大編成のみ）','サマーコンサート'],
8:['県大会','夏合宿'],
9:['支部大会','アンコンエントリー'],
10:['全国大会（大編成のみ）または東日本大会（中編成）','定期演奏会準備'],
11:['定期演奏会','アンサンブルコンテスト予選'],
12:['冬季練習強化','年末発表会'],
1:['アンサンブルコンテスト本選','3年生引退準備'],
2:['3年生送別演奏会','新部長選出'],
3:['卒業式演奏','新年度準備'],
};
const COMP_T_MID={
'県大会（中編成）':   {金:62,銀:48,銅:33,passLine:62,passCount:5},
'支部大会（中編成）': {金:73,銀:59,銅:45,passLine:73,passCount:2},
'東日本大会':         {金:81,銀:68,銅:55,passLine:null,passCount:0},
};
const COMP_T_LARGE={
'地区大会（大編成）': {金:58,銀:44,銅:30,passLine:58,passCount:16},
'県大会（大編成）':   {金:68,銀:54,銅:40,passLine:68,passCount:6},
'支部大会（大編成）': {金:77,銀:63,銅:49,passLine:77,passCount:3},
'全国大会':           {金:87,銀:75,銅:62,passLine:null,passCount:0},
};
const COMP_SCHEDULE_MID  =[{m:8,name:'県大会（中編成）'},{m:9,name:'支部大会（中編成）'},{m:10,name:'東日本大会'}];
const COMP_SCHEDULE_LARGE=[{m:7,name:'地区大会（大編成）'},{m:8,name:'県大会（大編成）'},{m:9,name:'支部大会（大編成）'},{m:10,name:'全国大会'}];
const COMP_T={...({})}; // 動的に生成
const MN={4:'4月',5:'5月',6:'6月',7:'7月',8:'8月',9:'9月',10:'10月',11:'11月',12:'12月',1:'1月',2:'2月',3:'3月'};
const WEEKS_PER_MONTH=4;
const PRACTICES=[
{id:'basic',    icon:'🎵',name:'基礎練習',   desc:'音階・ロングトーン・スケールで土台を固める。曲精度には直接効かない。',         fx:{skill:2,ens:1,song:0, morale:0, stamina:2},cost:0,tag:'basic'},
{id:'ensemble', icon:'🎶',name:'合奏練習',   desc:'全体合奏。音のブレンドとバランスを磨く。曲精度も少し上がる。',                fx:{skill:1,ens:3,song:1, morale:1, stamina:1},cost:0,tag:'ensemble'},
{id:'song',     icon:'📜',name:'コンクール曲',desc:'課題曲・自由曲を徹底的に磨く。曲決定後のみ有効。続けると効果が落ちる。',      fx:{skill:0,ens:1,song:5, morale:1, stamina:1},cost:0,tag:'song'},
{id:'sectional',   icon:'🎼',name:'パート練習',         desc:'パートごとに細部を磨く。さぼるパートが出ることも。',                         fx:{skill:2,ens:0,song:2, morale:1, stamina:1},cost:0,tag:'sectional'},
{id:'sectional_sup',icon:'👁',name:'パート練習（顧問巡回）',desc:'顧問が各パートを巡回。技術は上がるが、部員のモチベは下がりやすい。',           fx:{skill:3,ens:0,song:2, morale:-2,stamina:1},cost:0,tag:'sectional'},
{id:'intense',  icon:'⚡',name:'個人特訓',   desc:'苦手箇所の集中克服。技術は上がるが士気が下がりやすい。さぼりが出やすい。',   fx:{skill:4,ens:0,song:0, morale:-4,stamina:2},cost:0,tag:'intense'},
{id:'teacher',  icon:'🎓',name:'外部講師',   desc:'プロの特別指導（費用要）。コンクール期間は効果1.6倍。',                       fx:{skill:5,ens:4,song:3, morale:3, stamina:1},cost:55000,tag:'teacher',seasonBonus:true},
{id:'mental',   icon:'💪',name:'メンタル強化',desc:'士気・チームワーク向上。本番のプレッシャーに備える。',                        fx:{skill:0,ens:1,song:0, morale:6, stamina:3},cost:0,tag:'mental'},
{id:'recording',icon:'🎙',name:'録音・振り返り',desc:'演奏を録音して客観的に分析。合奏と曲精度に効果的。',                        fx:{skill:1,ens:2,song:2, morale:0, stamina:0},cost:0,tag:'recording'},
{id:'analysis', icon:'🔍',name:'ライバル研究', desc:'他校の演奏を聴いて分析。曲精度と合奏に刺激を与える。',                       fx:{skill:1,ens:2,song:2, morale:1, stamina:0},cost:0,tag:'analysis'},
{id:'concert',  icon:'🎪',name:'ミニ演奏会',  desc:'地域での演奏。本番慣れと士気向上に。曲精度も少し上がる。',                   fx:{skill:1,ens:2,song:1, morale:5, stamina:1},cost:0,tag:'concert'},
];
function getPracticeEffective(p){
const fx={...p.fx};
if(p.seasonBonus && G.month>=7 && G.month<=10){
fx.skill=Math.round(fx.skill*1.6);
fx.ens=Math.round(fx.ens*1.6);
fx.song=Math.round(fx.song*1.6);
fx.morale=Math.round((fx.morale||0)*1.4);
fx._seasonBonus=true;
}
return fx;
}
const RAND_EVENTS=[
{icon:'☀️',title:'快晴の練習日和',       body:'最高の天気の中、練習に集中できた。',           col:'var(--green)', fx:g=>{applyAll(g,{morale:6,stamina:3})}},
{icon:'🌧',title:'雨で外練習が中止',      body:'予定の外練習が中止に。室内での調整になった。',  col:'var(--ink3)',  fx:g=>{applyAll(g,{skill:-1})}},
{icon:'🎸',title:'顧問が熱血指導',        body:'顧問の先生が特別練習を行ってくれた！',          col:'var(--blue)',  fx:g=>{applyAll(g,{skill:4,ens:3})}},
{icon:'🎷',title:'楽器が壊れた！',        body:'メンバーの楽器が破損。修理費がかかる。',        col:'var(--red)',   fx:g=>{g.funds-=30000}},
{icon:'🏆',title:'他校演奏に感化',        body:'強豪校の演奏を見て刺激を受けた。',              col:'var(--teal)',  fx:g=>{applyAll(g,{morale:8,skill:2})}},
{icon:'😴',title:'練習に集中できない',   body:'暑さ・疲れで集中力が続かない日があった。',       col:'var(--amber)', fx:g=>{applyAll(g,{morale:-5,stamina:-3})}},
{icon:'💰',title:'保護者から寄付',        body:'保護者会から部費の補助があった！',              col:'var(--gold)',  fx:g=>{g.funds+=70000}},
{icon:'🎉',title:'地域イベントに出演',    body:'地域のイベントに出演し、演奏経験を積んだ。',    col:'var(--green)', fx:g=>{applyAll(g,{ens:3,morale:6,song:2})}},
{icon:'📺',title:'メディア取材',          body:'地元テレビの取材が来た！部員のやる気が急上昇。',col:'var(--rose)',  fx:g=>{applyAll(g,{morale:7})}},
{icon:'😤',title:'部内で意見対立',        body:'練習方針を巡って部員間で意見がぶつかった。',    col:'var(--red)',   fx:g=>{applyAll(g,{morale:-8})}},
{icon:'🌸',title:'新しい友情',            body:'部員同士の絆が深まり、チームワークが向上！',    col:'var(--rose)',  fx:g=>{applyAll(g,{ens:4,morale:5})}},
{icon:'📚',title:'楽典の自習ブーム',      body:'理論を自主学習する部員が増え、表現力が向上。',  col:'var(--blue)',  fx:g=>{applyAll(g,{ens:3,skill:2})}},
{icon:'🎵',title:'オリジナルアレンジ',    body:'部員がアレンジを持ち込んだ。曲の精度が上がる。',col:'var(--teal)', fx:g=>{g.song=cap(g.song+5)}},
{icon:'🏋️',title:'合宿申請が通った',    body:'学校から合宿許可が下りた！集中練習ができる。',  col:'var(--green)', fx:g=>{applyAll(g,{skill:5,ens:4,stamina:5})}},
{icon:'💔',title:'主要メンバーが欠席',    body:'重要パートの部員が体調不良で欠席続き。',        col:'var(--red)',   fx:g=>{applyAll(g,{skill:-3,morale:-4})}},
{icon:'📯',title:'卒業生が訪問',          body:'OBが練習を見に来てアドバイスをくれた。',        col:'var(--gold)',  fx:g=>{applyAll(g,{skill:3,ens:2,morale:4})}},
{icon:'🏦',title:'備品購入費が発生',      body:'消耗品・楽譜の補充が必要になった。',            col:'var(--red)',   fx:g=>{g.funds-=15000},diff:['easy']},
{icon:'📋',title:'補助金申請が通った',    body:'市の文化振興補助金が採択された！',              col:'var(--gold)',  fx:g=>{g.funds+=50000},diff:['easy','mid']},
{icon:'🎪',title:'チャリティコンサート', body:'地域での有料演奏会で少し収益が出た。',           col:'var(--green)', fx:g=>{g.funds+=25000},diff:['easy','mid']},
{icon:'💸',title:'施設修繕費が発生',      body:'練習室の設備修繕が必要になった。',              col:'var(--red)',   fx:g=>{g.funds-=40000},diff:['easy']},
{icon:'🔥',title:'レギュラー争いが激化', body:'メンバー間の競争が激しくなり、空気が張り詰めた。',col:'var(--red)',  fx:g=>{applyAll(g,{morale:-6});g.conflictActive=true},diff:['hard']},
{icon:'🤝',title:'ライバルと和解',        body:'対立していた部員同士が話し合い、絆が深まった。',col:'var(--rose)', fx:g=>{applyAll(g,{morale:8,ens:3});g.conflictActive=false},diff:['hard']},
{icon:'🏅',title:'OBが特別指導',          body:'全国経験者のOBが直接指導してくれた。',          col:'var(--gold)',  fx:g=>{applyAll(g,{skill:5,ens:3})},diff:['hard']},

// ── 人間関係・ドラマ ──
{icon:'💬',title:'部員が悩みを打ち明けた',   body:'ある部員が練習後に顧問に相談。話を聞いてもらえて、気持ちが軽くなったようだ。',         col:'var(--rose)',  fx:g=>{applyAll(g,{morale:7})}},
{icon:'😭',title:'3年生が引退を意識し始めた', body:'受験を控えた3年生が「最後のコンクール」を意識し、練習への向き合い方が変わった。',      col:'var(--blue)',  fx:g=>{applyAll(g,{morale:5,skill:3})}},
{icon:'❤️',title:'パート内に友情が芽生えた',  body:'練習後に一緒に帰る部員が増えた。パートの雰囲気がぐっと和やかになっている。',            col:'var(--rose)',  fx:g=>{applyAll(g,{ens:6,morale:5})}},
{icon:'😠',title:'先輩が後輩に厳しく当たった',body:'指導が行き過ぎて後輩が萎縮してしまった。翌日、先輩は謝りに行ったようだ。',              col:'var(--red)',   fx:g=>{applyAll(g,{morale:-6,ens:-3})}},
{icon:'🤗',title:'部長がみんなを励ました',    body:'落ち込んだ練習の後、部長が全員に声をかけた。その言葉が部員の心に響いた。',              col:'var(--teal)',  fx:g=>{applyAll(g,{morale:5})}},
{icon:'🙈',title:'こっそり交際発覚',          body:'部内カップルの存在が明るみに。一時ざわついたが、「応援する！」という声が多かった。',    col:'var(--rose)',  fx:g=>{applyAll(g,{morale:4})}},
{icon:'😶',title:'無口な部員が急に饒舌に',    body:'いつも黙々と練習していた部員が突然語り出した。意外な一面にみんなびっくり。',            col:'var(--teal)',  fx:g=>{applyAll(g,{ens:3,morale:4})}},
{icon:'🥺',title:'1年生が辞めようとしていた', body:'つらそうにしていた1年生に先輩が声をかけた。翌週、その子は笑顔で来た。',               col:'var(--blue)',  fx:g=>{applyAll(g,{morale:6,ens:4})}},
{icon:'🔥',title:'パートリーダーが奮起',       body:'スランプ気味だったパートリーダーが「絶対に結果を出す」と宣言。部全体の空気が引き締まった。', col:'var(--gold)', fx:g=>{applyAll(g,{skill:4,morale:6})}},
{icon:'💤',title:'練習後に部員が居眠り',       body:'部室のソファで部員が爆睡していた。疲れている証拠だが、それだけ頑張っている証でもある。', col:'var(--amber)', fx:g=>{applyAll(g,{stamina:-2,morale:2})}},
// ── 追加マイナスイベント ──
{icon:'🤒',title:'風邪が部内で流行',        body:'季節の変わり目に風邪が蔓延。練習どころではない日が続いた。',                    col:'var(--red)',   fx:g=>{applyAll(g,{stamina:-6,morale:-4,skill:-2})}},
{icon:'😔',title:'スランプ期に突入',         body:'なぜかうまくいかない。音が出ない。そういう時期が来てしまった。',                  col:'var(--red)',   fx:g=>{applyAll(g,{skill:-4,morale:-5})}},
{icon:'🌡️',title:'猛暑で練習が消耗戦',      body:'冷房が追いつかない練習室で、体力を削りながらの練習が続いた。',                  col:'var(--amber)', fx:g=>{applyAll(g,{stamina:-7,morale:-3})}},
{icon:'😩',title:'練習のマンネリ感が漂う',   body:'同じことの繰り返しに、部員たちの目から少し光が消えた気がした。',                col:'var(--amber)', fx:g=>{applyAll(g,{morale:-6,ens:-2})}},
{icon:'📉',title:'合奏がまとまらない',        body:'なぜかバラバラな音が続いた。合わせれば合わせるほど、ズレていく感覚。',          col:'var(--red)',   fx:g=>{applyAll(g,{ens:-5,morale:-3})}},
{icon:'😤',title:'顧問と部員が衝突',         body:'練習方針を巡って顧問の先生と部員の意見がぶつかった。翌日の空気が重かった。',    col:'var(--red)',   fx:g=>{applyAll(g,{morale:-7,ens:-3})}},
{icon:'🏃',title:'部員が無断欠席',           body:'連絡なしに休む部員が続いた。残った部員のやる気にも影響が出始めた。',            col:'var(--red)',   fx:g=>{applyAll(g,{morale:-5,skill:-2})}},
{icon:'💢',title:'パート間で不満が爆発',     body:'ずっと抑えていた不満がついに表に出た。話し合いは夜遅くまで続いた。',            col:'var(--red)',   fx:g=>{applyAll(g,{morale:-8,ens:-5})}},
{icon:'🎵',title:'曲が難しすぎて停滞',       body:'選んだ曲の難易度が高く、なかなか仕上がらない。焦りが空回りしている。',          col:'var(--amber)', fx:g=>{applyAll(g,{skill:-2,morale:-4,song:-3})}},
{icon:'😰',title:'本番で大きなミス',         body:'演奏中に目立つミスが出てしまった。帰りのバスは静かだった。',                    col:'var(--red)',   fx:g=>{applyAll(g,{morale:-9,skill:-2})}},
{icon:'🌧️',title:'長雨で練習場所が使えない', body:'グラウンドも体育館も使えず、練習環境が大幅に制限された一週間だった。',         col:'var(--ink3)',  fx:g=>{applyAll(g,{stamina:-3,skill:-2})}},
{icon:'😞',title:'コンクール落選のショック', body:'結果発表の瞬間、会場が静まり返った。しばらく誰も話さなかった。',               col:'var(--red)',   fx:g=>{applyAll(g,{morale:-12,skill:2})}},

// ── 大会・コンクール関連 ──
{icon:'📣',title:'コンクール要項が届いた',     body:'今年のコンクールの詳細が発表された。課題曲を見た部員たちの顔が一瞬引き締まった。',     col:'var(--blue)',  fx:g=>{applyAll(g,{morale:5,skill:2})}},
{icon:'🎯',title:'強豪校の演奏を動画で研究',   body:'ライバル校の去年の演奏をみんなで見た。「負けたくない」という気持ちが高まった。',        col:'var(--teal)',  fx:g=>{applyAll(g,{skill:3,morale:6})}},
{icon:'😰',title:'コンクール直前に緊張が走る', body:'本番まで2週間を切り、練習室の空気がぴりっとした。いい緊張感が漂っている。',            col:'var(--amber)', fx:g=>{applyAll(g,{skill:3,morale:-3})}},
{icon:'🥇',title:'地区大会で好成績',           body:'地区大会で予想以上の評価を受けた！自信がついて練習へのモチベーションが急上昇。',        col:'var(--gold)',  fx:g=>{applyAll(g,{morale:9,skill:3})}},
{icon:'😢',title:'大会結果が振るわなかった',   body:'悔しい結果になった。でも帰りのバスで誰かが「来年こそ」とつぶやいた。',                  col:'var(--red)',   fx:g=>{applyAll(g,{morale:-8,skill:3})}},
{icon:'📝',title:'審査員からの講評が届いた',   body:'大会の審査員コメントが届いた。厳しい指摘もあったが、的確で次への指針になった。',         col:'var(--blue)',  fx:g=>{applyAll(g,{skill:5,ens:3})}},
{icon:'🎺',title:'招待演奏のオファーが来た',   body:'近隣の学校の文化祭から演奏依頼が届いた。本番経験を積む絶好のチャンス！',               col:'var(--green)', fx:g=>{applyAll(g,{ens:5,morale:7,song:3})}},
{icon:'🏟️',title:'大きなホールで練習できた',  body:'市民ホールを借りて練習できた。本番さながらの音響に部員たちの目が輝いた。',             col:'var(--teal)',  fx:g=>{applyAll(g,{ens:6,song:4,morale:8})}},

// ── 第三者からの評価・反響 ──
{icon:'👏',title:'通りがかりの人に褒められた', body:'練習中に窓の外から「素敵な演奏ですね」と声をかけられた。単純だけど嬉しい。',           col:'var(--green)', fx:g=>{applyAll(g,{morale:8})}},
{icon:'📰',title:'地元紙に掲載された',         body:'地元新聞に部の活動が紹介された。学校中で話題になり、部員たちは少し照れくさそう。',      col:'var(--gold)',  fx:g=>{applyAll(g,{morale:6})}},
{icon:'🏫',title:'他クラスから応援メッセージ', body:'コンクール前に他クラスの生徒から寄せ書きが届いた。部員たちの目に力が宿った。',          col:'var(--rose)',  fx:g=>{applyAll(g,{morale:5})}},
{icon:'👨‍🏫',title:'他の先生が見学に来た',      body:'音楽以外の先生が練習を見に来て「すごい」と言ってくれた。普段と違う緊張感があった。',   col:'var(--blue)',  fx:g=>{applyAll(g,{morale:5,skill:2})}},
{icon:'🌐',title:'SNSで演奏動画が拡散',        body:'演奏の動画がSNSで話題になった。コメント欄が温かい言葉であふれていた。',               col:'var(--teal)',  fx:g=>{applyAll(g,{morale:7}); g.funds+=10000}},
{icon:'🎓',title:'卒業生から激励メール',        body:'OGからメッセージが届いた。「あの頃を思い出した。頑張ってね」という一言が沁みた。',      col:'var(--gold)',  fx:g=>{applyAll(g,{morale:7,skill:2})}},

// ── 備品・お金系 ──
{icon:'🎻',title:'楽器を新調した',             body:'長年使っていた楽器を新しくした。音の響きが格段によくなった気がする。',                col:'var(--green)', fx:g=>{applyAll(g,{skill:4}); g.funds-=80000}},
{icon:'🎼',title:'楽譜を大量購入',             body:'新しいアンサンブル曲の楽譜を揃えた。練習の幅が広がりそうだ。',                          col:'var(--blue)',  fx:g=>{applyAll(g,{ens:3}); g.funds-=20000}},
{icon:'🏦',title:'学校から緊急補助金',         body:'学校の予算から特別補助が下りた。備品購入の悩みが一気に解決した。',                      col:'var(--gold)',  fx:g=>{g.funds+=60000}},
{icon:'🎪',title:'バザーで資金調達',           body:'部員たちが手作りグッズを販売した。思ったより売れて、みんな大喜び。',                    col:'var(--green)', fx:g=>{g.funds+=35000; applyAll(g,{morale:5})}},
{icon:'🔧',title:'楽器修理が重なった',         body:'複数の楽器が同時に不具合を起こし、修理費がかさんだ。',                                  col:'var(--red)',   fx:g=>{g.funds-=50000}},
{icon:'📦',title:'備品の寄付が届いた',         body:'地域の方から使わなくなった楽器や備品が寄贈された。部員たちが丁寧にお礼状を書いた。',    col:'var(--teal)',  fx:g=>{g.funds+=40000; applyAll(g,{morale:4})}},
{icon:'💴',title:'チケット販売が好調',         body:'定期演奏会のチケットが予想を上回るペースで売れている。本番へのプレッシャーも増した。',   col:'var(--gold)',  fx:g=>{g.funds+=45000; applyAll(g,{morale:6})}},

// ── 生徒の成長・進化 ──
{icon:'⭐',title:'突然の才能開花',             body:'目立たなかった部員が、ある日突然素晴らしいソロを披露した。練習室に拍手が起きた。',      col:'var(--gold)',  fx:g=>{applyAll(g,{skill:5,morale:8})}},
{icon:'📈',title:'1年生が急成長',             body:'入部当初は不安だった1年生が、みるみるうちに上達してきた。先輩たちが目を丸くしている。', col:'var(--green)', fx:g=>{applyAll(g,{skill:4,ens:3,morale:5})}},
{icon:'🎵',title:'自主練ブームが到来',         body:'放課後に自主練する部員が急増した。誰かが始めたことが、気づけば全体に広がっていた。',     col:'var(--teal)',  fx:g=>{applyAll(g,{skill:6,stamina:3})}},
{icon:'🧠',title:'理論を理解した部員が増えた', body:'和声や音楽理論を自分で勉強する部員が出てきた。演奏に深みが増してきている。',             col:'var(--blue)',  fx:g=>{applyAll(g,{skill:4,ens:4})}},
{icon:'🌱',title:'苦手克服宣言',               body:'苦手なフレーズを「絶対できるようにする」と宣言した部員がいた。その姿勢が周りに伝染した。', col:'var(--green)', fx:g=>{applyAll(g,{skill:5,morale:4})}},
{icon:'🎤',title:'部員がソロに挑戦',           body:'普段は目立たない部員がソロを志願した。勇気ある一歩に、みんなが温かい目を向けた。',      col:'var(--rose)',  fx:g=>{applyAll(g,{morale:7,song:3})}},
{icon:'🤝',title:'パート間の交流練習',         body:'普段は別々のパートが合同で練習した。お互いの音を聴き合い、アンサンブルが深まった。',    col:'var(--teal)',  fx:g=>{applyAll(g,{ens:7,morale:5})}},

// ── 笑える・明るい系 ──
{icon:'😂',title:'顧問が珍発言',               body:'顧問の先生が突然「音楽はラブレターだ！」と言い出した。部員たちは笑いをこらえるのに必死。', col:'var(--amber)', fx:g=>{applyAll(g,{morale:8})}},
{icon:'🐈',title:'野良猫が練習室に乱入',       body:'開いていた窓から猫が入ってきた。練習は一時中断したが、場が一気に和んだ。',             col:'var(--amber)', fx:g=>{applyAll(g,{morale:9,stamina:2})}},
{icon:'🍕',title:'差し入れ大会が始まった',     body:'誰かが練習後にお菓子を持ってきたのをきっかけに、差し入れブームが到来した。',            col:'var(--green)', fx:g=>{applyAll(g,{morale:10,stamina:4})}},
{icon:'🎤',title:'カラオケ大会で盛り上がった', body:'部活後のカラオケ大会が大盛況。翌日の練習は笑いが絶えなかった。',                        col:'var(--rose)',  fx:g=>{applyAll(g,{morale:6,ens:2})}},
{icon:'🌀',title:'楽譜が風で飛んだ',           body:'窓を開けたまま練習していたら楽譜が一斉に飛んだ。全員で回収しながら笑いが止まらなかった。', col:'var(--amber)', fx:g=>{applyAll(g,{morale:5})}},
{icon:'👑',title:'部内でニックネームが定着',   body:'誰かがつけたあだ名がいつの間にか全員に定着。呼ばれるたびにクスクス笑いが起きる。',      col:'var(--rose)',  fx:g=>{applyAll(g,{morale:7,ens:4})}},
{icon:'🥁',title:'ドラムが突然暴走',           body:'パーカッションが間違えて全力でドラムを叩き出した。一瞬静まり返った後、爆笑が起きた。',   col:'var(--amber)', fx:g=>{applyAll(g,{morale:8})}},
{icon:'🌈',title:'虹が見えてテンションUP',     body:'練習の休憩中に綺麗な虹が出た。「これは吉兆だ！」と盛り上がり、午後の練習が冴えた。',   col:'var(--teal)',  fx:g=>{applyAll(g,{morale:8,stamina:3})}},
];
function pickWeightedEvent(){
const pool=RAND_EVENTS.filter(e=>!e.diff||e.diff.includes(G.diff));
return pick(pool);
}
let G={};
let schoolData=null;
let selDiff_='easy';
let selPracId=null;
let memberFilter_=null;
function cap(v){return Math.min(100,Math.max(0,Math.round(v)))}
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function rndName(){return pick(LAST)+' '+(Math.random()<0.65?pick(FIRST_F):pick(FIRST_M))}
function applyAll(g,fx){
g.members.forEach(m=>{
// 全員に影響するが個人差あり：一部の部員はほぼ影響なし、一部は逆効果も
const roll=Math.random();
const affected = roll > 0.15; // 15%の部員はほぼ影響なし
if(!affected) return;
const sign = roll < 0.08 ? -1 : 1; // 8%の確率で効果が逆転
const indiv = 0.5 + Math.random(); // 0.5〜1.5倍の個人差
if(fx.skill)   m.skill     =cap(m.skill     +Math.round((fx.skill  +rnd(-3,2))*indiv*sign));
if(fx.ens)     m.expression=cap(m.expression+Math.round((fx.ens    +rnd(-3,2))*indiv*sign));
if(fx.morale)  m.morale    =cap(m.morale    +Math.round((fx.morale +rnd(-3,2))*indiv));
if(fx.stamina) m.stamina   =cap(m.stamina   +Math.round((fx.stamina+rnd(-2,1))*indiv));
});
}
// パート練習のさぼり・顧問巡回処理
function calcPartSaboriRate(part){
  const members = G.members.filter(m=>m.part===part);
  if(!members.length) return 0;
  const leader = members.find(m=>m.isPartLeader||m.isCaptain);
  // さぼりやすい性格
  const saboriPersonalities = ['お調子者','自由奔放','おっとり型'];
  const saboriCount = members.filter(m=>saboriPersonalities.includes(m.personality)).length;
  const avgMorale = members.reduce((a,m)=>a+m.morale,0)/members.length;
  // ベース確率：さぼり性格が多い・士気低い・リーダー不在で上昇
  let rate = 0.05;
  rate += (saboriCount / members.length) * 0.35;
  if(avgMorale < 40) rate += 0.20;
  else if(avgMorale < 55) rate += 0.10;
  if(!leader) rate += 0.15;
  // リーダーが完璧主義・努力家・リーダーシップ型なら抑制
  if(leader){
    if(['完璧主義者','努力家','リーダーシップ型'].includes(leader.personality)) rate -= 0.20;
    if(['お調子者','自由奔放'].includes(leader.personality)) rate += 0.10;
  }
  return Math.max(0, Math.min(0.85, rate));
}
function applyPracticeToMembers(fx){
// パート練習の場合：パートごとにさぼり判定
const isSectional    = G._currentPracTag === 'sectional';
const isSupervised   = G._currentPracTag === 'sectional_sup';
const saboriParts = {}; // パート名 → さぼったか
if(isSectional){
  PARTS.forEach(part=>{
    const rate = calcPartSaboriRate(part);
    saboriParts[part] = Math.random() < rate;
  });
  // さぼったパートをログに記録
  const saboriList = Object.entries(saboriParts).filter(([,v])=>v).map(([p])=>p);
  if(saboriList.length > 0){
    G._lastSaboriParts = saboriList;
  } else {
    G._lastSaboriParts = [];
  }
} else {
  G._lastSaboriParts = [];
}
G.members.forEach(m=>{
const pers=m.personality;
const effortBonus = pers==='努力家'?1.2 : pers==='天才肌'?(Math.random()<0.4?1.8:0.5) : pers==='完璧主義者'?1.1 : 1.0;
const moraleBonus = pers==='ムードメーカー'?1.2 : pers==='リーダーシップ型'?1.1 : pers==='お調子者'?1.1 : 1.0;
const moralePenalty = pers==='完璧主義者'?1.3 : pers==='繊細なアーティスト'?1.2 : 1.0;
const staminaFactor = m.stamina < 30 ? 0.4 : m.stamina < 50 ? 0.7 : m.stamina < 70 ? 0.9 : 1.0;
const moraleFactor = m.morale < 25 ? 0.4 : m.morale < 45 ? 0.7 : m.morale < 60 ? 0.9 : 1.0;
const growthFactor = effortBonus * staminaFactor * moraleFactor;

// 成長抵抗：個人のポテンシャルで鈍化ラインが変わる
// potential: 55〜98で生成。高いほど伸びしろ大
// 鈍化開始ライン = potential * 0.75 程度（potential:70→約52、potential:90→約67）
const isTalent = m.personality === '天才肌';
const isEffort = m.personality === '努力家';
// 鈍化ラインをポテンシャル・性格から算出
// 鈍化ライン：potential:60→約66、potential:75→約83、potential:90→約99
const softFloor = isTalent ? m.potential * 1.02
                : isEffort ? m.potential * 0.95
                : m.potential * 0.88;
function growthResist(val, floor, talent){
  const d = val - floor; // 鈍化ラインからの距離
  if(d < 0)  return 1.0;            // 鈍化ライン未満：普通に成長
  if(d < 5)  return talent ? 0.75 : 0.55;
  if(d < 10) return talent ? 0.50 : 0.30;
  if(d < 15) return talent ? 0.25 : 0.12;
  return      talent ? 0.10 : 0.04; // 大幅超過：ほぼ動かない
}
const skillCeil = growthResist(m.skill,      softFloor, isTalent);
const ensCeil   = growthResist(m.expression, softFloor, isTalent);

// パート練習のさぼり・顧問巡回補正
const isSect = G._currentPracTag==='sectional' || G._currentPracTag==='sectional_sup';
const didSabori = isSect && G._lastSaboriParts && G._lastSaboriParts.includes(m.part);
const supervised = G._currentPracTag==='sectional_sup';
let sectFactor = 1.0;
if(didSabori){
  // さぼったパート：効果激減、個人のスキルも少し落ちる
  sectFactor = 0.1 + Math.random()*0.15;
  m.morale = cap(m.morale - rnd(2,5)); // さぼり癖でモチベ微減
} else if(supervised){
  // 顧問巡回：技術効果1.3倍、ただしモチベに後でペナルティ
  sectFactor = 1.3;
}
if(fx.skill)   m.skill     =cap(m.skill     +Math.round((fx.skill  +rnd(-3,2))*growthFactor*skillCeil*sectFactor));
if(fx.ens)     m.expression=cap(m.expression+Math.round((fx.ens    +rnd(-3,2))*growthFactor*ensCeil*sectFactor));

// スタミナは練習するたびに必ず少し消耗する
const staminaCost = rnd(1,3);
m.stamina = cap(m.stamina - staminaCost + (fx.stamina ? fx.stamina + rnd(-1,1) : 0));

if(fx.morale){
let mBase = fx.morale;
// 顧問巡回時：モチベペナルティ追加（監視されている圧力）
if(supervised){
  const pressure = m.personality==='完璧主義者' ? 0 :
                   m.personality==='人見知り'   ? rnd(3,7) :
                   m.personality==='自由奔放'   ? rnd(4,8) :
                   m.personality==='お調子者'   ? rnd(2,5) : rnd(1,4);
  mBase = mBase - pressure;
}
const mDelta = mBase > 0
? Math.round(mBase * moraleBonus + rnd(-2,2))
: Math.round(mBase * moralePenalty + rnd(-1,1));
m.morale=cap(m.morale+mDelta);
} else {
if(m.stamina < 35) m.morale = cap(m.morale + rnd(-3,-1));
// 顧問巡回でmorale指定なしの場合も圧力
if(supervised){
  const pressure = m.personality==='完璧主義者'?0:m.personality==='人見知り'?rnd(2,5):rnd(1,3);
  m.morale = cap(m.morale - pressure);
}
}

// ブレイクスルー（確率低下）
if(fx.skill && m.potential > 80 && Math.random() < 0.08){
m.skill=cap(m.skill+rnd(1,2));
}
// スランプ：スタミナ・士気が低いと技術も落ちることがある
if(m.stamina < 25 && m.morale < 35 && Math.random() < 0.2){
m.skill = cap(m.skill - rnd(1,3));
}
});
}
const DIFF={
easy:{
memMin:18,memMax:30,skillBase:14,skillRng:28,funds:180000,moraleBase:62,label:'弱小校',compMod:1.0,
duesPerMember:1500,   // 月額部費（円/人）
monthlyFixed:40000,   // 毎月の固定費（施設・楽器維持等）
parentReaction:0.7,   // 部費値上げへの保護者反発率（0〜1）
conflictRate:0.05,    // 部員いざこざ発生率
auditRate:0.0,        // オーディション発生率
diffNote:'資金繰りが厳しく、部費値上げは保護者の反発を招きやすい。',
},
mid:{
memMin:32,memMax:52,skillBase:28,skillRng:30,funds:400000,moraleBase:70,label:'中堅校',compMod:0.97,
duesPerMember:3000,
monthlyFixed:55000,
parentReaction:0.35,
conflictRate:0.08,
auditRate:0.0,
diffNote:'資金・技術ともにバランスが良い。着実な成長が見込める。',
},
hard:{
memMin:53,memMax:78,skillBase:48,skillRng:30,funds:700000,moraleBase:65,label:'強豪校',compMod:0.93,
duesPerMember:5500,
monthlyFixed:80000,
parentReaction:0.1,
conflictRate:0.22,   // 人数が多いため高め
auditRate:0.4,       // オーディション定期発生
diffNote:'資金・人材は豊富だが、部員間の競争・いざこざが多い。',
},
};
function calcSongGain(pracTag, effectiveFx){
if(!G.kaDaiKyoku) return 0;
// 履歴更新
G.pracHistory = G.pracHistory || [];
G.pracHistory.push(pracTag);
if(G.pracHistory.length > 8) G.pracHistory.shift();
const recent = G.pracHistory;
const songCount = recent.filter(t=>t==='song').length;
const sectCount = recent.filter(t=>t==='sectional'||t==='sectional_sup').length;
const ensCount  = recent.filter(t=>t==='ensemble'||t==='recording').length;
const basicOnly = recent.every(t=>t==='basic');
if(basicOnly) return 0;

// マンネリ判定
const songBoredom = songCount >= 5;
if(songBoredom && pracTag==='song'){
  G.songBoredom = (G.songBoredom||0) + 1;
} else {
  G.songBoredom = Math.max(0,(G.songBoredom||0)-1);
}

// sectionalDebt
G.sectionalDebt = G.sectionalDebt || 0;
if(pracTag==='sectional'||pracTag==='sectional_sup'){
  G.sectionalDebt = Math.max(0, G.sectionalDebt - 2);
} else if(pracTag==='song'||pracTag==='ensemble'){
  if(sectCount===0) G.sectionalDebt += 1;
}

// ── 5軸更新 ──
const fx = PRAC_SONG_FX[pracTag] || {};
const balanced = songCount>=1 && sectCount>=1 && ensCount>=1;
const boredomMult = (songBoredom && pracTag==='song') ? (G.songBoredom>=3?0.27:0.45) : 1.0;
const balanceMult = balanced ? 1.25 : 1.0;
const debtPenalty = G.sectionalDebt >= 3 ? Math.max(0.3, 1 - G.sectionalDebt*0.15) : 1.0;

// 課題曲と自由曲それぞれに更新
['kadaiParams','jiyuParams'].forEach(key=>{
  if(!G[key]) G[key]=newSongParams(0);
  const hasSelected = key==='kadaiParams' ? !!G.kaDaiKyoku?.selectedKadai : !!G.kaDaiKyoku?.selectedJiyu;
  if(!hasSelected) return; // 選曲前は更新しない
  SONG_PARAMS.forEach(p=>{
    const gain = fx[p.key] || 0;
    if(gain<=0) return;
    const raw = gain * boredomMult * balanceMult * debtPenalty;
    const delta = Math.round(raw + rnd(-1,1));
    G[key][p.key] = cap(G[key][p.key] + Math.max(0, delta));
  });
});

// G.songを5軸平均で更新（後方互換）
const allAvg = Math.round((songAvg(G.kadaiParams)+songAvg(G.jiyuParams))/2);
G.song = allAvg;

// 旧インターフェース互換のためreturn値（ログ用）
return songAvg(G.kadaiParams||newSongParams());
}
function checkShirkers(pracTag){
G.shirkerIds = G.shirkerIds || [];
G.pracHistory = G.pracHistory || [];
const recent = G.pracHistory;
const soloOrSect = ['intense','sectional'];
const soloStreak = recent.length >= 3 && recent.slice(-3).every(t=>soloOrSect.includes(t));
const noEnsemble = recent.length >= 4 && !recent.slice(-4).some(t=>['ensemble','concert','recording'].includes(t));
const risk = (soloStreak ? 0.35 : 0) + (noEnsemble ? 0.25 : 0);
if(risk <= 0) return null;
if(G.shirkerIds.length > 0) return null;
if(Math.random() < risk){
const candidates = G.members.filter(m=>
!m.isCaptain && !m.isPartLeader &&
(m.personality==='お調子者'||m.personality==='自由奔放'||m.personality==='おっとり型'||m.morale<45)
);
if(!candidates.length) return null;
const shirker = pick(candidates);
G.shirkerIds.push(shirker.id);
shirker.morale = Math.max(20, shirker.morale - rnd(5,12));
shirker.skill  = Math.max(10, shirker.skill  - rnd(2,5));
return shirker;
}
return null;
}
function resolveShirker(){
if(!G.shirkerIds || G.shirkerIds.length === 0) return;
G.pracHistory = G.pracHistory || [];
const recent = G.pracHistory.slice(-2);
const hasEnsemble = recent.some(t=>['ensemble','concert','mental','teacher'].includes(t));
if(hasEnsemble){
G.shirkerIds.forEach(id=>{
const m = G.members.find(x=>x.id===id);
if(m){ m.morale = Math.min(99, m.morale + rnd(8,15)); }
});
G.shirkerIds = [];
}
}
function selDiff(btn,d){
document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('sel'));
btn.classList.add('sel'); selDiff_=d; rollSchool();
}
function rollSchool(){
const cfg=DIFF[selDiff_];
const name=pick(SCH_PFX)+pick(SCH_SFX);
const adv=Math.random()<.5?pick(ADV_F):pick(ADV_M);
const cnt=rnd(cfg.memMin,cfg.memMax);
const feats=[pick(SCH_FEAT)];
if(Math.random()<.4) feats.push(pick(SCH_FEAT.filter(f=>f!==feats[0])));
schoolData={name,adv,cnt,feats,diff:selDiff_};
document.getElementById('prev-name').textContent=name+'吹奏楽部';
document.getElementById('prev-count').textContent=cnt;
document.getElementById('prev-adv').textContent=adv;
document.getElementById('prev-tags').innerHTML=feats.map(f=>`<span class="sp-tag">${f}</span>`).join(' ');
}
rollSchool();
function generateMembers(count,cfg){
const members=[];
const totW=Object.values(PART_W).reduce((a,b)=>a+b,0);
const alloc={};
PARTS.forEach(p=>{alloc[p]=Math.max(1,Math.round(count*PART_W[p]/totW));});
let diff=count-Object.values(alloc).reduce((a,b)=>a+b,0);
while(diff>0){const p=pick(PARTS);alloc[p]++;diff--;}
while(diff<0){const p=PARTS.find(p=>alloc[p]>1);if(p){alloc[p]--;diff++;}else break;}
PARTS.forEach(part=>{
for(let i=0;i<alloc[part];i++){
const grade=rnd(1,3);
// 初期値は低め。学年差は小さく（育成で差がつくイメージ）
// 1年:ほぼ初心者 / 2年:少し慣れた / 3年:それなりに弾ける
const gradeOffset = grade===1 ? 0 : grade===2 ? rnd(3,8) : rnd(6,14);
// 強豪校は初期から幅広く、弱小は低め揃い
const initCeil = cfg.skillBase < 20 ? 48 : cfg.skillBase < 40 ? 58 : 68;
const base = Math.min(cfg.skillBase + rnd(0, Math.round(cfg.skillRng*0.55)) + gradeOffset, initCeil);
const pers=pick(PERSONALITIES);
const hobby=pick(HOBBIES);
const str=pick(STRENGTHS_POOL);
const weak=pick(WEAKNESS_POOL);
let skill=cap(base), expression=cap(base+rnd(-8,8));
let stamina = grade===1 ? rnd(28,65) : grade===2 ? rnd(38,78) : rnd(45,85);
let morale=cap(cfg.moraleBase+rnd(-14,18));
let potential=rnd(65,98); // 65〜98：低くても65台まで届く
if(pers==='努力家'){stamina=Math.min(99,stamina+rnd(8,18));morale=Math.min(99,morale+rnd(5,12));}
if(pers==='天才肌'){skill=Math.min(99,skill+rnd(10,20));potential=Math.min(100,potential+10);morale=Math.max(20,morale-rnd(5,15));}
if(pers==='完璧主義者'){skill=Math.min(99,skill+rnd(5,12));morale=Math.max(20,morale-rnd(5,10));stamina=Math.max(20,stamina-rnd(5,10));}
if(pers==='繊細なアーティスト'){expression=Math.min(99,expression+rnd(10,18));morale=Math.max(20,morale-rnd(3,10));}
if(pers==='ムードメーカー'||pers==='お調子者'){morale=Math.min(99,morale+rnd(10,20));skill=Math.max(10,skill-rnd(3,8));}
if(pers==='リーダーシップ型'){morale=Math.min(99,morale+rnd(5,12));expression=Math.min(99,expression+rnd(3,8));}
if(pers==='おっとり型'){stamina=Math.min(99,stamina+rnd(5,10));skill=Math.max(10,skill-rnd(2,6));}
if(pers==='人見知り'){morale=Math.max(20,morale-rnd(5,15));}
if(pers==='热血漢'){stamina=Math.min(99,stamina+rnd(5,15));morale=Math.min(99,morale+rnd(5,10));skill=Math.max(10,skill-rnd(2,5));}
if(Math.random()<0.1) morale=rnd(20,40);   // 士気が低い子
if(Math.random()<0.08) stamina=rnd(20,35);  // スタミナがない子
// 飛び抜けて上手い子（学年が高いほど出やすいが初期上限は抑える）
const exceptionalChance = grade===1 ? 0.03 : grade===2 ? 0.06 : 0.10;
if(Math.random()<exceptionalChance) skill=Math.min(58, base+rnd(8,16));
members.push({
id:members.length, name:rndName(), part, grade,
skill:cap(skill), expression:cap(expression),
stamina:cap(stamina), morale:cap(morale),
status:'良好', potential:cap(potential), personality:pers,
isPartLeader:false, hobby, strength:str, weakness:weak,
isCaptain:false, isExec:false,
});
}
});
return members;
}
function startGame(){
if(!schoolData)return;
const cfg=DIFF[selDiff_];
const members=generateMembers(schoolData.cnt,cfg);
G={
school:schoolData.name,advisor:schoolData.adv,diff:selDiff_,
year:1,month:4,week:1,
skill:0,ensemble:0,song:0,morale:cfg.moraleBase,
// 曲パラメーター（課題曲・自由曲それぞれ5軸）
kadaiParams:newSongParams(0),
jiyuParams:newSongParams(0),
funds:cfg.funds,
dues:cfg.duesPerMember,      // 現在の月額部費
members,captain:null,execs:[],
division:null,               // 'mid'=中編成 / 'large'=大編成 (4月に選択)
divisionChosen:false,
compSchedule:[],             // 今年度の出場予定大会リスト
compQualifyIdx:0,            // compScheduleの何番目まで突破済み
compHistory:[],
achievements:{
firstContest:false,districtGold:false,prefGold:false,
regionGold:false,nationalGold:false,
eastJapan:false,members50:false,skill80:false,
},
log:[],recruitDone:false,
parentAnger:0,
conflictActive:false,
auditPending:false,
kaDaiKyoku:null,
_monthEventDone:{},
partLeaders:[],
pracHistory:[],          // 直近の練習タグ履歴（さぼり判定用）
shirkerIds:[],           // 現在さぼっている部員ID
songBoredom:0,           // 曲練習連続カウント（マンネリ）
sectionalDebt:0,         // パート練習不足カウント
feats:schoolData.feats||[], // 学校の特徴
};
// 学校特徴ボーナスを部員に適用
(G.feats||[]).forEach(feat=>{
  const b=FEAT_BONUS[feat];
  if(b&&b.memberBonus) G.members.forEach(m=>b.memberBonus(m));
});
// 特徴をログに記録
if(G.feats.length>0){
  const featDescs=G.feats.map(f=>FEAT_BONUS[f]?`【${f}】${FEAT_BONUS[f].desc}`:`【${f}】`).join(' ／ ');
  addLog(`学校特徴：${featDescs}`,'システム');
}
recalc();
autoElectCaptain();
showView('v-intro');
document.getElementById('intro-name').textContent=G.school+'吹奏楽部';
document.getElementById('intro-sub').textContent=`顧問：${G.advisor} ／ 部員数：${members.length}名 ／ ${DIFF[G.diff].label}`;
// 特徴ボーナス説明を表示
const featBonusEl=document.getElementById('intro-feat-bonus');
if(featBonusEl&&G.feats.length>0){
  featBonusEl.innerHTML=G.feats.map(f=>{
    const b=FEAT_BONUS[f];
    if(!b) return '';
    const bonuses=[];
    if(b.memberBonus) bonuses.push('部員の初期ステータス↑');
    if(b.weeklyFx)    bonuses.push('毎週効果あり');
    if(b.fundBonus>0) bonuses.push(`月+${b.fundBonus.toLocaleString()}円`);
    if(b.compBonus)   bonuses.push(`コンクール+${b.compBonus}点`);
    if(b.campBonus)   bonuses.push('合宿効果1.5倍');
    if(b.teacherDiscount) bonuses.push(`外部講師${b.teacherDiscount.toLocaleString()}円割引`);
    return `<div style="background:var(--gold3);border:1px solid rgba(176,125,42,.25);border-radius:7px;padding:7px 10px;margin-bottom:5px;font-size:11px">
      <span style="font-weight:700;color:var(--gold)">✦ ${f}</span>
      <span style="color:var(--ink3);margin-left:6px">${b.desc}</span>
      <div style="color:var(--teal);margin-top:2px;font-size:10px">ボーナス：${bonuses.join(' ／ ')}</div>
    </div>`;
  }).join('');
}
const grid=document.getElementById('member-grid');
grid.innerHTML='';
members.forEach((m,i)=>{
setTimeout(()=>{
const el=document.createElement('div');
el.className='mc'; el.onclick=()=>showProfile(m.id);
el.style.animationDelay=(i*.025)+'s';
const col=PART_COL[m.part]||'#555';
const bg=PART_BG[m.part]||'#f5f5f5';
el.innerHTML=`
<div class="mc-name">${m.name}</div>
<div class="mc-row">
<span class="mc-part" style="background:${bg};color:${col}">${m.part}</span>
<span class="mc-grade g${m.grade}">${m.grade}年</span>
</div>
<div class="mc-bar-row"><span>演奏力</span><div class="mc-bar-bg"><div class="mc-bar-fill" style="width:${m.skill}%;background:${col}"></div></div><span>${m.skill}</span></div>
<div class="mc-bar-row"><span>表現力</span><div class="mc-bar-bg"><div class="mc-bar-fill" style="width:${m.expression}%;background:#7050b080"></div></div><span>${m.expression}</span></div>
<div class="mc-bar-row"><span>士気</span><div class="mc-bar-bg"><div class="mc-bar-fill" style="width:${m.morale}%;background:#3a7a5080"></div></div><span>${m.morale}</span></div>
<div style="font-size:9px;color:var(--ink3);margin-top:4px">性格：${m.personality}</div>
`;
grid.appendChild(el);
},i*28);
});
}
function enterGame(){
showView('v-game');
document.getElementById('gh-school').textContent=G.school;
document.getElementById('gh-adv').textContent=G.advisor;
buildPracticeGrid();
renderAll();
const isMob=window.innerWidth<=767;
const mml=document.getElementById('mob-member-list');
const mtd=document.querySelector('.mtbl-desktop');
if(mml) mml.style.display='none';
if(mtd) mtd.style.display=isMob?'none':'block';
addLog('部活がスタート！全国金賞を目指して頑張りましょう。','システム');
setTimeout(()=>openDivisionModal(), 800);
}

// ================================================================
// 士気伝染システム
// ================================================================
function applyMoraleContagion(){
  if(!G.members||!G.members.length) return null;
  const total = G.members.length;

  // 低士気部員（35以下）と高士気部員（75以上）を集計
  const lowMoraleMembers  = G.members.filter(m=>m.morale<=35);
  const highMoraleMembers = G.members.filter(m=>m.morale>=75);
  const lowRatio  = lowMoraleMembers.length  / total;
  const highRatio = highMoraleMembers.length / total;

  // 部長・ムードメーカーの抑制効果
  const cap_ = G.captain;
  const moodmakers = G.members.filter(m=>m.personality==='ムードメーカー'||m.personality==='リーダーシップ型');
  const suppressPower = (cap_&&cap_.morale>50?0.35:0) + moodmakers.filter(m=>m.morale>50).length*0.12;

  // 伝染が起きる閾値：低士気が15%以上で発動
  if(lowRatio < 0.15) {
    // 低士気が少ない＆高士気が多い→じわっと底上げ
    if(highRatio > 0.40){
      G.members.forEach(m=>{
        if(m.morale < 60 && Math.random() < 0.25){
          m.morale = cap(m.morale + rnd(1,3));
        }
      });
    }
    G._lowMoraleStreak = 0;
    return null;
  }

  // 低士気が続いた週数を累積
  G._lowMoraleStreak = (G._lowMoraleStreak||0) + 1;
  const streak = G._lowMoraleStreak;

  // 伝染強度：低士気比率×継続週数で増大、抑制効果で軽減
  const baseSpread = Math.min(0.7, lowRatio * 1.8 + streak * 0.04) * (1 - suppressPower);

  let affected = 0;
  G.members.forEach(m=>{
    if(m.morale <= 35) return; // 既に低い子はスキップ

    // 同パートに低士気部員がいると影響大
    const samePart = lowMoraleMembers.filter(lm=>lm.part===m.part);
    const partFactor = samePart.length > 0 ? 1.5 : 1.0;

    // 性格による耐性
    const resistance = m.personality==='努力家'?0.4
      : m.personality==='完璧主義者'?0.5
      : m.personality==='リーダーシップ型'?0.3
      : m.personality==='ムードメーカー'?0.2
      : m.personality==='繊細なアーティスト'?1.4
      : m.personality==='人見知り'?1.2
      : m.personality==='お調子者'?1.1 : 1.0;

    const spreadChance = baseSpread * partFactor * resistance;
    if(Math.random() < spreadChance){
      const penalty = rnd(1, Math.min(8, 2 + streak));
      m.morale = cap(m.morale - penalty);
      affected++;
    }
  });

  // イベント通知
  if(affected > 0){
    const severity = lowRatio >= 0.40 ? 'critical' : lowRatio >= 0.25 ? 'serious' : 'mild';
    return {affected, streak, severity,
      lowCount: lowMoraleMembers.length,
      names: lowMoraleMembers.slice(0,2).map(m=>m.name)};
  }
  return null;
}
function recalc(){
if(!G.members||!G.members.length)return;
G.skill   =cap(G.members.reduce((a,m)=>a+m.skill,0)/G.members.length);
G.ensemble=cap(G.members.reduce((a,m)=>a+m.expression,0)/G.members.length);
G.morale  =cap(G.members.reduce((a,m)=>a+m.morale,0)/G.members.length);
const shirkerSet=new Set(G.shirkerIds||[]);
G.members.forEach(m=>{
if(shirkerSet.has(m.id))          m.status='さぼり中';
else if(m.morale>=85&&m.stamina>=75) m.status='絶好調';
else if(m.morale<=30||m.stamina<=25) m.status='不調';
else if(m.morale<=45)             m.status='やる気低下';
else if(m.stamina<=40)            m.status='疲労気味';
else                              m.status='良好';
});
}
function renderAll(){
recalc();
updateHeader();
renderSongRadars();
buildPracticeGrid(); // 月変化でシーズンボーナス表示を更新
renderSkillBars();
renderMembers();
renderSchedule();
renderRightPanel();
renderCaptain();
renderAchievements();
renderCompSection();
renderDivisionStatus();
renderDuesInfo();
checkAchievements();
}
function updateHeader(){
document.getElementById('gh-year').textContent=G.year;
document.getElementById('gh-month').textContent=MN[G.month];
document.getElementById('gh-week').textContent=`第${G.week}週`;
document.getElementById('gh-mem').textContent=G.members.length;
document.getElementById('gh-funds').textContent=G.funds.toLocaleString();
document.getElementById('gh-morale').textContent=G.morale;
const avg=(G.skill+G.ensemble)/2;
const rep=avg>=88?'S':avg>=78?'A':avg>=65?'B':avg>=50?'C':'D';
const repEl=document.getElementById('gh-rep');
repEl.textContent=rep;
repEl.style.color=rep==='S'?'#c04040':rep==='A'?'var(--gold)':rep==='B'?'var(--teal)':rep==='C'?'var(--blue)':'var(--ink3)';
document.getElementById('sv-skill').textContent=G.skill;
document.getElementById('sv-ens').textContent=G.ensemble;
document.getElementById('sv-morale').textContent=G.morale;
const songCard=document.getElementById('sv-song-card');
if(songCard){
songCard.style.opacity=G.kaDaiKyoku?'1':'0.45';
songCard.title=G.kaDaiKyoku?'':'6月に曲目が決定すると有効になります';
}
const _songAvgDisp = G.kaDaiKyoku?.selectedKadai||G.kaDaiKyoku?.selectedJiyu
  ? Math.round((songAvg(G.kadaiParams||newSongParams())+songAvg(G.jiyuParams||newSongParams()))/2)
  : G.song;
document.getElementById('sv-song').textContent=G.kaDaiKyoku?_songAvgDisp:'—';
const alertBar=document.getElementById('alert-bar');
if(alertBar){
const alerts=[];
if(G.shirkerIds&&G.shirkerIds.length>0){
const names=(G.shirkerIds).map(id=>G.members.find(m=>m.id===id)?.name).filter(Boolean).join('、');
alerts.push(`<div style="background:var(--red2);border:1px solid var(--red);border-radius:7px;padding:7px 12px;font-size:11px;color:var(--red);margin-bottom:4px">😴 <strong>さぼり中：${names}</strong>　→ 合奏やコンサート系の練習で解消できます</div>`);
}
if(G.songBoredom>=3) alerts.push(`<div style="background:var(--amber2);border:1px solid var(--amber);border-radius:7px;padding:7px 12px;font-size:11px;color:var(--amber);margin-bottom:4px">😑 <strong>曲練習マンネリ</strong>　→ 基礎練習・パート練習を挟みましょう</div>`);
// 低士気アラート
const _lowMCount = G.members ? G.members.filter(m=>m.morale<=35).length : 0;
const _lowMRatio = G.members.length ? _lowMCount/G.members.length : 0;
if(_lowMRatio>=0.40) alerts.push(`<div style="background:var(--red2);border:1px solid var(--red);border-radius:7px;padding:7px 12px;font-size:11px;color:var(--red);margin-bottom:4px">💀 <strong>士気危機</strong>　低士気部員が${_lowMCount}人！このままでは全体崩壊の恐れ</div>`);
else if(_lowMRatio>=0.25) alerts.push(`<div style="background:var(--amber2);border:1px solid var(--amber);border-radius:7px;padding:7px 12px;font-size:11px;color:var(--amber);margin-bottom:4px">😞 <strong>士気低下が広がっています</strong>　低士気部員：${_lowMCount}人 → メンタル強化か個別ケアを</div>`);
else if(_lowMRatio>=0.15) alerts.push(`<div style="background:var(--amber2);border:1px solid var(--amber);border-radius:7px;padding:7px 12px;font-size:11px;color:var(--amber);margin-bottom:4px">⚠️ <strong>落ち込んでいる部員がいます</strong>　士気の低い子が${_lowMCount}人います</div>`);
if(G.sectionalDebt>=3) alerts.push(`<div style="background:var(--amber2);border:1px solid var(--amber);border-radius:7px;padding:7px 12px;font-size:11px;color:var(--amber);margin-bottom:4px">⚠️ <strong>パート練習不足</strong>　→ パート練習でクオリティを高めましょう</div>`);
alertBar.innerHTML=alerts.join('');
}
document.getElementById('rp-month').textContent=MN[G.month];
document.getElementById('rp-week-info').textContent=`第${G.week}週 / 第${G.year}クール`;
document.getElementById('week-header').textContent=`第${G.week}週（${MN[G.month]}）`;
document.getElementById('weeks-left').textContent=Math.max(1,WEEKS_PER_MONTH-G.week+1);
let goalText='—';
if(!G.divisionChosen){ goalText='4月：編成を選択してください'; }
else if(G.division==='large'){ goalText=['地区大会 金賞','県大会 金賞','支部大会 金賞','全国大会 金賞'][Math.min(G.year-1,3)]||'全国金賞 連覇'; }
else { goalText=['県大会 金賞','支部大会 金賞','東日本大会 金賞','東日本連覇'][Math.min(G.year-1,3)]||'東日本連覇'; }
document.getElementById('rp-goal').textContent=goalText;
const rb=document.getElementById('recruit-nav-btn');
rb.style.display=(G.year>1&&(G.month===4||G.month===5)&&!G.recruitDone)?'flex':'none';
}
function renderSkillBars(){
const ps={};
PARTS.forEach(p=>{const ms=G.members.filter(m=>m.part===p);ps[p]=ms.length?Math.round(ms.reduce((a,m)=>a+m.skill,0)/ms.length):0;});
document.getElementById('skill-bars').innerHTML=PARTS.filter(p=>ps[p]>0).map(p=>`
<div class="skb">
<span class="skb-name">${p}</span>
<div class="skb-bg"><div class="skb-fill" style="width:${ps[p]}%;background:${PART_COL[p]}"></div></div>
<span class="skb-val">${ps[p]}</span>
</div>`).join('');
}
function renderMembers(){
const actParts=[...new Set(G.members.map(m=>m.part))];
document.getElementById('part-filter').innerHTML=
`<button class="btn btn-sm ${!memberFilter_?'btn-primary':''}" onclick="setMFilter(null)">全員</button>`+
actParts.map(p=>`<button class="btn btn-sm ${memberFilter_===p?'btn-primary':''}" onclick="setMFilter('${p}')" style="${memberFilter_===p?'':'border-color:'+PART_COL[p]+'40;color:'+PART_COL[p]}">${p}</button>`).join('');
const list=memberFilter_?G.members.filter(m=>m.part===memberFilter_):G.members;
document.getElementById('member-tbody').innerHTML=list.map(m=>{
const col=PART_COL[m.part]||'#555';
const bg=PART_BG[m.part]||'#f5f5f5';
const moralCol=m.morale>70?'var(--green)':m.morale>40?'var(--gold)':'var(--red)';
return `<tr class="${m.isCaptain?'captain':''}" onclick="showProfile(${m.id})" style="cursor:pointer">
<td><span class="crown">${m.isCaptain?'👑':m.isExec?'🎖':m.isPartLeader?'🎵':''}</span>${m.name}</td>
<td><span class="g-badge g${m.grade}">${m.grade}年</span></td>
<td><span class="ptag" style="background:${bg};color:${col}">${m.part}</span></td>
<td><div class="minibar"><div class="minibar-bg"><div class="minibar-fill" style="width:${m.skill}%;background:${col}"></div></div>${m.skill}</div></td>
<td><div class="minibar"><div class="minibar-bg"><div class="minibar-fill" style="width:${m.expression}%;background:#7050b0"></div></div>${m.expression}</div></td>
<td><div class="minibar"><div class="minibar-bg"><div class="minibar-fill" style="width:${m.stamina}%;background:var(--blue)"></div></div>${m.stamina}</div></td>
<td><div class="minibar"><div class="minibar-bg"><div class="minibar-fill" style="width:${m.morale}%;background:${moralCol}"></div></div>${m.morale}</div></td>
<td style="font-size:10px;color:var(--ink2)">${m.personality}</td>
<td style="font-size:10px;color:${m.status==='絶好調'?'var(--gold)':m.status==='良好'?'var(--green)':m.status==='不調'||m.status==='さぼり中'?'var(--red)':'var(--amber)'}">${m.status}</td>
</tr>`;
}).join('');
document.getElementById('mob-member-list').innerHTML=list.map(m=>{
const col=PART_COL[m.part]||'#555';
const bg=PART_BG[m.part]||'#f5f5f5';
const moralCol=m.morale>70?'var(--green)':m.morale>40?'var(--gold)':'var(--red)';
return `<div onclick="showProfile(${m.id})" style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:11px 13px;margin-bottom:7px;cursor:pointer;${m.isCaptain?'border-color:var(--gold);background:var(--gold3);':''}">
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">
<div style="display:flex;align-items:center;gap:7px">
<div style="width:34px;height:34px;border-radius:50%;background:${bg};color:${col};border:1.5px solid ${col};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${m.name[0]}</div>
<div>
<div style="font-size:13px;font-weight:700">${m.isCaptain?'👑 ':m.isExec?'🎖 ':m.isPartLeader?'🎵 ':''}${m.name}</div>
<div style="display:flex;gap:5px;margin-top:2px">
<span class="ptag" style="background:${bg};color:${col}">${m.part}</span>
<span class="g-badge g${m.grade}">${m.grade}年</span>
</div>
</div>
</div>
<div style="font-size:10px;color:var(--ink3);text-align:right">${m.personality}<br><span style="color:${m.status==='良好'?'var(--green)':'var(--red)'}">${m.status}</span></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px">
${[['演奏',m.skill,col],['表現',m.expression,'#7050b0'],['体力',m.stamina,'var(--blue)'],['士気',m.morale,moralCol]].map(([l,v,c])=>`
<div style="background:var(--bg);border-radius:5px;padding:4px 6px;text-align:center">
<div style="font-size:9px;color:var(--ink3)">${l}</div>
<div style="font-size:13px;font-weight:700;color:${c}">${v}</div>
</div>`).join('')}
</div>
</div>`;
}).join('');
}
function setMFilter(p){memberFilter_=p;renderMembers();}
function showProfile(id){
const m=G.members.find(m=>m.id===id);
if(!m)return;
const col=PART_COL[m.part]||'#555';
const bg=PART_BG[m.part]||'#f5f5f5';
const av=document.getElementById('prof-avatar');
av.textContent=m.name[0];
av.style.background=bg; av.style.color=col; av.style.borderColor=col;
document.getElementById('prof-name').textContent=(m.isCaptain?'👑 ':m.isExec?'🎖 ':m.isPartLeader?'🎵 ':'')+m.name;
document.getElementById('prof-meta').innerHTML=`<span class="ptag" style="background:${bg};color:${col}">${m.part}</span> &nbsp; <span class="g-badge g${m.grade}">${m.grade}年</span>`;
const bios=[
`${m.grade}年生として日々練習に励んでいる。${m.part}パートの一員として、部の演奏を支えている。`,
`入部以来ずっと${m.part}を担当している。${m.personality}な性格で、仲間から信頼されている。`,
`${m.part}の音色に惹かれて入部した。趣味は${m.hobby}で、練習の合間に楽しんでいる。`,
];
document.getElementById('prof-bio').textContent=pick(bios);
document.getElementById('prof-stats').innerHTML=[
{l:'演奏力',v:m.skill,col:col},{l:'表現力',v:m.expression,col:'#7050b0'},
{l:'スタミナ',v:m.stamina,col:'var(--blue)'},{l:'士気',v:m.morale,col:'var(--green)'},
{l:'潜在力',v:m.potential,col:'var(--gold)'},{l:'学年',v:m.grade+'年',col:'var(--ink)'},
].map(s=>`<div class="prof-stat"><div class="prof-stat-lbl">${s.l}</div><div class="prof-stat-val" style="color:${s.col}">${s.v}</div></div>`).join('');
document.getElementById('prof-personality-box').innerHTML=
`<strong>性格：${m.personality}</strong><br>${PERS_DESC[m.personality]||''}<br><br>
<strong>得意：</strong>${m.strength}<br>
<strong>苦手：</strong>${m.weakness}<br>
<strong>趣味：</strong>${m.hobby}`;
// 相談エリア：士気が低い場合に表示
renderConsultArea(m);
document.getElementById('ov-profile').classList.add('show');
}

function renderConsultArea(m){
const el=document.getElementById('prof-consult-area');
if(!el) return;
if(m.morale<=50){
  const urgency = m.morale<=25 ? 'critical' : m.morale<=40 ? 'serious' : 'mild';
  const urgencyMsg = urgency==='critical'
    ? `<span style="color:var(--red);font-weight:700">⚠ 士気危険（${m.morale}）——早急なケアが必要です</span>`
    : urgency==='serious'
    ? `<span style="color:var(--amber);font-weight:700">😔 士気低下（${m.morale}）——声をかけてみましょう</span>`
    : `<span style="color:var(--ink3)">士気がやや低め（${m.morale}）——フォローできます</span>`;
  el.innerHTML=`
    <div style="background:var(--red2);border:1px solid rgba(192,64,64,.2);border-radius:8px;padding:10px 12px;margin-bottom:10px">
      <div style="font-size:11px;margin-bottom:8px">${urgencyMsg}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-gold" onclick="openConsult(${m.id},'peer')">👥 部員同士で相談</button>
        <button class="btn btn-sm" onclick="openConsult(${m.id},'teacher')">🎓 顧問に相談する</button>
      </div>
    </div>`;
} else {
  el.innerHTML='';
}
}

// ================================================================
// 相談システム
// ================================================================
let _consultTargetId=null;

function openConsult(memberId, type){
  _consultTargetId=memberId;
  const m=G.members.find(x=>x.id===memberId);
  if(!m) return;

  document.getElementById('consult-title').textContent=
    type==='peer' ? '👥 部員同士で相談' : '🎓 顧問に相談する';
  document.getElementById('consult-subtitle').textContent=
    `${m.name}（士気：${m.morale}）の悩みに向き合います`;
  document.getElementById('consult-result').style.display='none';

  if(type==='peer'){
    // 相談相手の候補（士気高め・性格が合いそうな部員）
    const candidates = G.members.filter(x=>
      x.id!==memberId && x.morale>=55 &&
      ['ムードメーカー','リーダーシップ型','努力家','熱血漢'].includes(x.personality)
    );
    const samePart = G.members.filter(x=>x.id!==memberId&&x.part===m.part&&x.morale>=50);
    const options = [...new Set([...candidates,...samePart])].slice(0,4);
    const cap_ = G.captain;

    let html=`<div style="font-size:12px;color:var(--ink2);margin-bottom:10px">誰に話を聞いてもらいますか？</div>`;
    if(cap_&&cap_.id!==memberId&&cap_.morale>=45){
      html+=peerOption(cap_,m,'captain');
    }
    if(options.length===0){
      html+=`<div style="font-size:12px;color:var(--ink3);padding:12px;text-align:center">今は相談できる部員がいません（他の部員の士気も低いようです）</div>`;
    } else {
      options.forEach(p=>{ html+=peerOption(p,m,'peer'); });
    }
    document.getElementById('consult-body').innerHTML=html;

  } else {
    // 顧問相談
    const advisorMorale = G.morale; // 部全体の士気を顧問の状態として使用
    const approaches=[
      {key:'listen',   label:'💬 じっくり話を聞く',    desc:'時間をかけて気持ちを受け止める。効果は確実だが士気回復は中程度。'},
      {key:'encourage',label:'🔥 熱く励ます',          desc:'顧問が情熱的に背中を押す。ハマれば大きな効果、空回りすることも。'},
      {key:'practice', label:'🎵 一緒に練習する',       desc:'言葉よりも音楽で向き合う。スキルと士気を同時に上げる可能性がある。'},
      {key:'rest',     label:'🌿 少し休ませる',         desc:'無理をさせない判断。士気は回復するが、練習から外れる分スキルが落ちる。'},
    ];
    document.getElementById('consult-body').innerHTML=
      `<div style="font-size:12px;color:var(--ink2);margin-bottom:10px">${G.advisor}先生の対応を選んでください</div>`+
      approaches.map(a=>`
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:6px;cursor:pointer;transition:all .15s"
          onmouseover="this.style.borderColor='var(--teal)'" onmouseout="this.style.borderColor='var(--border)'"
          onclick="resolveTeacherConsult(${memberId},'${a.key}')">
          <div style="font-size:12px;font-weight:700;margin-bottom:2px">${a.label}</div>
          <div style="font-size:10px;color:var(--ink3)">${a.desc}</div>
        </div>`).join('');
  }
  document.getElementById('ov-consult').classList.add('show');
}

function peerOption(peer, target, role){
  const chemistry = calcChemistry(peer, target);
  const chemLabel = chemistry>=0.7?'◎ 相性よさそう':chemistry>=0.4?'○ 話せそう':'△ 少し難しいかも';
  const chemCol   = chemistry>=0.7?'var(--green)':chemistry>=0.4?'var(--teal)':'var(--amber)';
  return `
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 12px;margin-bottom:6px;cursor:pointer;transition:all .15s"
      onmouseover="this.style.borderColor='var(--blue)'" onmouseout="this.style.borderColor='var(--border)'"
      onclick="resolvePeerConsult(${peer.id},${target.id})">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-size:12px;font-weight:700">${role==='captain'?'👑 ':''} ${peer.name}</span>
          <span style="font-size:10px;color:var(--ink3);margin-left:6px">${peer.part}・${peer.grade}年・${peer.personality}</span>
        </div>
        <span style="font-size:11px;font-weight:700;color:${chemCol}">${chemLabel}</span>
      </div>
    </div>`;
}

function calcChemistry(a, b){
  // 性格の相性を数値化
  const good={
    'ムードメーカー':['繊細なアーティスト','人見知り','おっとり型'],
    'リーダーシップ型':['努力家','完璧主義者'],
    '努力家':['繊細なアーティスト','おっとり型'],
    '熱血漢':['お調子者','自由奔放'],
  };
  const bad={
    '完璧主義者':['お調子者','自由奔放'],
    '自由奔放':['完璧主義者'],
  };
  let score=0.5;
  if(good[a.personality]?.includes(b.personality)) score+=0.3;
  if(bad[a.personality]?.includes(b.personality))  score-=0.2;
  if(a.part===b.part) score+=0.1; // 同パートは話しやすい
  if(a.grade > b.grade) score+=0.05; // 先輩の方が頼りやすい
  return Math.max(0,Math.min(1,score));
}

function resolvePeerConsult(peerId, targetId){
  const peer   = G.members.find(m=>m.id===peerId);
  const target = G.members.find(m=>m.id===targetId);
  if(!peer||!target) return;

  const chemistry = calcChemistry(peer, target);
  const roll = Math.random();
  let result, moraleGain, ensGain=0;

  if(roll < chemistry * 0.8){
    // 成功：相性と運次第で効果が変わる
    moraleGain = Math.round(rnd(8,18) * chemistry);
    ensGain    = Math.round(rnd(2,6)  * chemistry);
    result='success';
  } else if(roll < 0.9){
    moraleGain = rnd(2,6);
    result='partial';
  } else {
    moraleGain = rnd(-3,1);
    result='fail';
  }

  target.morale = cap(target.morale + moraleGain);
  if(ensGain>0){ target.expression=cap(target.expression+ensGain); peer.expression=cap(peer.expression+2); }
  // 相談した側も少し士気が変化
  peer.morale = cap(peer.morale + (result==='success'?rnd(2,5):-1));

  const msgs={
    success:[
      `${peer.name}が${target.name}の話をじっくり聞いた。話し終えた${target.name}の表情が、少し明るくなった。`,
      `「なんか、話してよかった」——${target.name}がぽつりと言った。${peer.name}は笑って頷いた。`,
      `${peer.name}の言葉が、${target.name}の心に届いた。二人の間に、新しい絆が生まれた気がした。`,
    ],
    partial:[
      `${peer.name}なりに言葉をかけたが、${target.name}の表情はまだ晴れない。でも、声をかけてもらえたことは伝わったようだ。`,
      `うまく言葉が見つからなかった。それでも、隣にいてくれることが、少しだけ助けになった。`,
    ],
    fail:[
      `話しかけるタイミングが合わなかった。${target.name}は「大丈夫」と言ったが、顔は曇ったままだった。`,
      `${peer.name}の励ましが、今日は${target.name}に届かなかった。距離感が難しい。`,
    ],
  };

  showConsultResult(
    result==='success'?'✅ 心が少し軽くなった':result==='partial'?'💬 少し話せた':'😔 うまく届かなかった',
    pick(msgs[result]),
    `士気 ${moraleGain>=0?'+':''}${moraleGain}${ensGain>0?' / 表現力 +'+ensGain:''}`,
    result
  );
  recalc(); renderAll();
  addLog(`${target.name}が${peer.name}に相談（${result==='success'?'うまく伝わった':result==='partial'?'少し伝わった':'届かなかった'}）`,'部員管理');
}

function resolveTeacherConsult(memberId, approach){
  const m=G.members.find(x=>x.id===memberId);
  if(!m) return;

  const pers=m.personality;
  let moraleGain=0, skillChange=0, resultKey;

  const roll=Math.random();
  if(approach==='listen'){
    moraleGain=rnd(10,20);
    resultKey='success';
  } else if(approach==='encourage'){
    const fits=['熱血漢','努力家','リーダーシップ型','お調子者'];
    const misfit=['繊細なアーティスト','人見知り','おっとり型'];
    if(fits.includes(pers)||roll<0.5){ moraleGain=rnd(15,28); resultKey='success'; }
    else if(misfit.includes(pers)&&roll>0.6){ moraleGain=rnd(-5,3); resultKey='fail'; }
    else { moraleGain=rnd(5,12); resultKey='partial'; }
  } else if(approach==='practice'){
    moraleGain=rnd(8,16);
    skillChange=rnd(2,5);
    resultKey='success';
  } else { // rest
    moraleGain=rnd(12,22);
    skillChange=-rnd(1,3);
    resultKey='partial';
  }

  m.morale=cap(m.morale+moraleGain);
  if(skillChange) m.skill=cap(m.skill+skillChange);

  const approachMsgs={
    listen:{
      success:[`${G.advisor}先生はじっくり話を聞いてくれた。「あなたのこと、ちゃんと見てるよ」——その言葉が、${m.name}の心をほぐした。`,
               `${m.name}が話し終えるまで、${G.advisor}先生は一度も口を挟まなかった。それだけで、十分だった。`],
      partial:[`${G.advisor}先生が話を聞いてくれた。完全には伝わらなかったかもしれないが、少しだけ楽になった。`],
      fail:   [`${G.advisor}先生に話したが、うまく言葉にできなかった。それでも、聞こうとしてくれたことは伝わった。`],
    },
    encourage:{
      success:[`${G.advisor}先生の熱い言葉が、${m.name}の中で何かに火をつけた。「やってやろう」——そんな気持ちが芽生えた。`,
               `「お前なら絶対できる」——${G.advisor}先生の言葉を、${m.name}はしばらく胸の中で繰り返していた。`],
      partial:[`${G.advisor}先生の励ましを、${m.name}は半分受け取った。もう少し時間が必要かもしれない。`],
      fail:   [`${G.advisor}先生の言葉は熱かったが、今の${m.name}には少し重すぎた。タイミングが難しかった。`],
    },
    practice:{
      success:[`${G.advisor}先生と二人で練習した。言葉よりも音楽が、${m.name}の気持ちを動かした。`,
               `一緒に音を出すことで、余計なことを考えずに済んだ。${m.name}の音が、少しずつ戻ってきた。`],
      partial:[`${G.advisor}先生と練習した。気分転換にはなったが、根本的な悩みはまだ残っている。`],
      fail:   [`練習に集中しようとしたが、気持ちがついてこなかった。でも、先生が付き合ってくれたことは嬉しかった。`],
    },
    rest:{
      success:[`「少し休んでいいよ」——${G.advisor}先生の一言が、${m.name}をほっとさせた。無理をしないことも、大切な判断だ。`,
               `${m.name}は少し練習から離れた。体を休めながら、気持ちを整える時間ができた。`],
      partial:[`休む時間をもらった${m.name}。気持ちは少し楽になったが、練習から外れた分の不安も残った。`],
      fail:   [`休ませてもらったが、逆に焦りが出てきてしまった。${m.name}には、動いている方が合っているのかもしれない。`],
    },
  };

  const msgs=approachMsgs[approach][resultKey]||approachMsgs[approach].partial;
  const label=approach==='listen'?'じっくり話を聞く':approach==='encourage'?'熱く励ます':approach==='practice'?'一緒に練習':' 少し休ませる';
  showConsultResult(
    resultKey==='success'?`✅ ${label}：効果あり`:resultKey==='partial'?`💬 ${label}：少し効果あり`:`😔 ${label}：うまくいかなかった`,
    pick(msgs),
    `士気 ${moraleGain>=0?'+':''}${moraleGain}${skillChange?' / 演奏力 '+(skillChange>=0?'+':'')+skillChange:''}`,
    resultKey
  );
  recalc(); renderAll();
  addLog(`${G.advisor}先生が${m.name}に相談対応（${label}→${resultKey==='success'?'効果あり':'効果小'}）`,'部員管理');
}

function showConsultResult(title, body, effect, resultKey){
  const col = resultKey==='success'?'var(--green)':resultKey==='partial'?'var(--amber)':'var(--red)';
  const resultEl=document.getElementById('consult-result');
  resultEl.style.display='block';
  resultEl.innerHTML=`
    <div style="font-weight:700;color:${col};margin-bottom:6px">${title}</div>
    <div style="margin-bottom:8px">${body}</div>
    <div style="font-size:10px;color:var(--ink3)">効果：${effect}</div>`;
  document.getElementById('consult-body').innerHTML='';
}
function renderSchedule(){
const months=[4,5,6,7,8,9,10,11,12,1,2,3];
const ci=months.indexOf(G.month);
document.getElementById('sch-grid').innerHTML=months.map((m,i)=>{
const isC=m===G.month,isPast=i<ci;
return `<div class="sch-m ${isC?'cur':''} ${isPast?'past':''}" onclick="showSchD(${m})">
<div class="sch-lbl">${MN[m]}</div><div class="sch-num">${m}</div>
<div class="sch-ev">
${(G.compSchedule||[]).find(s=>s.m===m)?`<div><span class="ev-dot" style="background:var(--gold)"></span>${(G.compSchedule.find(s=>s.m===m)||{}).name||'大会'}</div>`:''}
${(MONTHLY_EVENTS[m]||[]).slice(0,1).map(e=>`<div><span class="ev-dot" style="background:var(--blue)"></span>${e}</div>`).join('')}
</div></div>`;
}).join('');
}
function showSchD(m){
const evs=MONTHLY_EVENTS[m]||[];
let h=`<strong>${MN[m]}のイベント</strong><br><br>`;
const compEntry=(G.compSchedule||[]).find(s=>s.m===m);
if(compEntry)h+=`<div style="color:var(--gold);margin-bottom:5px">🏆 ${compEntry.name}</div>`;
h+=evs.map(e=>`<div style="margin-bottom:3px">• ${e}</div>`).join('');
document.getElementById('sch-detail').innerHTML=h;
}
function renderRightPanel(){
const cnt={};PARTS.forEach(p=>cnt[p]=0);G.members.forEach(m=>cnt[m.part]++);
document.getElementById('rp-parts').innerHTML=PARTS.filter(p=>cnt[p]>0).map(p=>
`<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid var(--bg4)">
<span style="color:${PART_COL[p]}">${p}</span>
<span style="color:var(--ink);font-weight:700">${cnt[p]}名</span>
</div>`).join('');
const cap_=G.captain;
document.getElementById('rp-captain').innerHTML=cap_
?`<span style="color:var(--gold);font-weight:700">👑 ${cap_.name}</span><br><span style="color:var(--ink3);font-size:10px">${cap_.part}・${cap_.grade}年</span>`
:'<span style="color:var(--ink3)">未選出</span>';
if(!G.divisionChosen){
document.getElementById('rp-comps').innerHTML='<span style="color:var(--amber)">編成未選択</span>';
} else {
const upcoming=(G.compSchedule||[]).filter(s=>s.qualified&&!s.done).slice(0,3);
document.getElementById('rp-comps').innerHTML=upcoming.map(s=>
`<div style="margin-bottom:4px"><span style="color:var(--gold)">▶</span> ${s.m}月 <span style="font-size:11px">${s.name}</span></div>`).join('')
||'<span style="color:var(--ink3)">今クール終了</span>';
}
}
function renderCaptain(){
const cc=document.getElementById('captain-card');
const cap_=G.captain;
if(cap_){
const col=PART_COL[cap_.part]||'#555';
cc.innerHTML=`<div class="card-h">👑 現部長</div>
<div style="display:flex;align-items:center;gap:12px">
<div style="width:48px;height:48px;border-radius:50%;background:${PART_BG[cap_.part]};color:${col};border:2px solid ${col};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700">${cap_.name[0]}</div>
<div>
<div style="font-size:15px;font-weight:700">${cap_.name}</div>
<div style="font-size:11px;color:var(--ink2)">${cap_.part} ・ ${cap_.grade}年 ／ ${cap_.personality}</div>
<div style="font-size:10px;color:var(--ink3);margin-top:2px">${cap_.strength}</div>
</div>
</div>`;
} else {
cc.innerHTML='<div class="card-h">👑 現部長</div><div style="color:var(--ink3);font-size:12px">まだ部長が選出されていません</div>';
}
const allExecs=(G.execs||[]);
const allPL=(G.partLeaders||[]);
if(allExecs.length>0||allPL.length>0){
document.getElementById('exec-card').style.display='block';
const execHtml=allExecs.map(m=>
`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--bg4)">
<span>🎖</span>
<span style="font-size:12px;font-weight:700">${m.name}</span>
<span style="font-size:10px;color:var(--blue)">副部長</span>
<span style="font-size:10px;color:var(--ink3)">${m.part}・${m.grade}年</span>
</div>`).join('');
const plHtml=allPL.slice(0,9).map(m=>
`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--bg4)">
<span>🎵</span>
<span style="font-size:12px;font-weight:700">${m.name}</span>
<span style="font-size:10px;color:var(--teal)">PL</span>
<span style="font-size:10px;color:var(--ink3)">${m.part}・${m.grade}年</span>
</div>`).join('');
document.getElementById('exec-list').innerHTML=execHtml+
(allPL.length>0?`<div style="font-size:10px;color:var(--ink3);margin:8px 0 4px;letter-spacing:.08em">パートリーダー</div>`+plHtml:'');
}
const sa=document.getElementById('captain-select-area');
if(G.month===2||G.month===3){
const cands=G.members.filter(m=>m.grade<3&&m.grade>0).sort((a,b)=>(b.skill+b.expression+b.morale)-(a.skill+a.expression+a.morale)).slice(0,5);
sa.innerHTML=`<div style="margin-bottom:8px;font-size:12px;color:var(--ink2)">次期部長の候補者（クリックで部長に就任）</div>`+
cands.map(m=>`
<div class="recruit-card" style="cursor:pointer" onclick="electCaptain(${m.id})">
<div class="rc-info">
<div class="rc-name">${m.name}</div>
<div class="rc-meta">${m.part}・${m.grade}年 ／ ${m.personality} ／ 総合:${Math.round((m.skill+m.expression+m.morale)/3)}</div>
</div>
<button class="btn btn-sm btn-gold">部長に任命</button>
</div>`).join('');
} else if(G.year>1&&G.captain&&(G.month===2||G.month===3)){
sa.innerHTML=`<div style="font-size:12px;color:var(--ink2);margin-bottom:8px">現部長：${G.captain.name}（${G.captain.grade}年）<br>パートリーダーを再選出できます。</div>
<button class="btn btn-sm btn-primary" onclick="reelectPartLeaders()">🎵 パートリーダーを再選出</button>`;
} else {
sa.innerHTML='<div style="font-size:12px;color:var(--ink3)">部長・パートリーダーの選出は2〜3月に行えます</div>';
}
}
function reelectPartLeaders(){
if(!G.captain) return;
G.members.forEach(m=>{if(!m.isCaptain&&!m.isExec) m.isPartLeader=false;});
electPartLeadersAuto(G.captain.id);
addLog('パートリーダーを再選出した。','システム');
notif('パートリーダー更新',`各パートのリーダーを再選出しました`);
renderCaptain();
renderMembers();
}
function autoElectCaptain(){
const pool=G.members.filter(m=>m.grade===3).length>0
? G.members.filter(m=>m.grade===3)
: G.members.filter(m=>m.grade===2);
if(!pool.length)return;
const best=pool.sort((a,b)=>(b.skill+b.expression+b.morale)-(a.skill+a.expression+a.morale))[0];
G.members.forEach(m=>{m.isCaptain=false;m.isExec=false;m.isPartLeader=false;});
best.isCaptain=true;
G.captain=best;
electPartLeadersAuto(best.id);
G.execs=G.members.filter(m=>m.id!==best.id&&!m.isPartLeader&&m.grade>=2)
.sort((a,b)=>(b.skill+b.morale)-(a.skill+a.morale)).slice(0,2);
G.execs.forEach(m=>m.isExec=true);
}
function electPartLeadersAuto(captainId){
const parts=[...new Set(G.members.map(m=>m.part))];
G.partLeaders=[];
parts.forEach(part=>{
const all=G.members.filter(m=>m.part===part&&m.id!==captainId&&!m.isCaptain);
if(!all.length)return;
const g3=all.filter(m=>m.grade===3);
const g2=all.filter(m=>m.grade===2);
const pool=g3.length?g3:g2.length?g2:all;
const leader=pool.sort((a,b)=>b.skill-a.skill)[0];
leader.isPartLeader=true;
G.partLeaders=G.partLeaders||[];
G.partLeaders.push(leader);
});
}
function electCaptain(id){
G.members.forEach(m=>{m.isCaptain=false;m.isExec=false;m.isPartLeader=false;});
const m=G.members.find(m=>m.id===id);
if(!m)return;
m.isCaptain=true;
G.captain=m;
electPartLeadersAuto(id);
G.execs=G.members.filter(m2=>m2.id!==id&&!m2.isPartLeader&&m2.grade<3)
.sort((a,b)=>(b.skill+b.morale)-(a.skill+a.morale)).slice(0,2);
G.execs.forEach(m=>m.isExec=true);
addLog(`${m.name}が新部長に就任。幹部・パートリーダーも決定した。`,'システム');
notif('部長就任',`${m.name}（${m.part}・${m.grade}年）が部長になりました`);
renderCaptain();
renderMembers();
renderRightPanel();
}
function buildPracticeGrid(){
const isSeason=G.month>=7&&G.month<=10;
document.getElementById('week-grid').innerHTML=PRACTICES.map((p,i)=>{
const isBonus=p.seasonBonus&&isSeason;
const eff=getPracticeEffective(p);
return `
<div class="week-card ${isBonus?'bonus-card':''}" id="wk-${p.id}" onclick="selectPrac('${p.id}')">
<div class="wk-num">${isBonus?'⭐':'　'}</div>
<div class="wk-icon">${p.icon}</div>
<div class="wk-name">${p.name}</div>
<div class="wk-fx">${fxLabel(eff)}${isBonus?'<br><span style="color:var(--gold);font-size:8px">シーズンボーナス中</span>':''}</div>
${p.cost?`<div class="wk-cost">−${p.cost.toLocaleString()}円</div>`:''}
</div>`;
}).join('');
}
function fxLabel(fx){
const parts=[];
if(fx.skill>0)parts.push(`技術+${fx.skill}`);
if(fx.ens>0)parts.push(`合奏+${fx.ens}`);
// 曲精度は5軸で別途表示するため省略
if(fx.morale>0)parts.push(`士気+${fx.morale}`);
if(fx.morale<0)parts.push(`<span style="color:var(--red)">士気${fx.morale}</span>`);
if(fx.stamina>0)parts.push(`体力+${fx.stamina}`);
return parts.join(' ')||'—';
}
function selectPrac(id){
document.querySelectorAll('.week-card').forEach(c=>c.classList.remove('sel'));
document.getElementById('wk-'+id).classList.add('sel');
selPracId=id;
const p=PRACTICES.find(x=>x.id===id);
const eff=getPracticeEffective(p);
const isSeason=p.seasonBonus&&G.month>=7&&G.month<=10;
document.getElementById('sel-prac-name').textContent=p.name;
const prev=document.getElementById('prac-preview');
prev.style.display='block';
const recent=(G.pracHistory||[]);
const recentTags=recent.slice(-4);
const warnings=[];
if(p.id==='song'&&recentTags.filter(t=>t==='song').length>=3) warnings.push('⚠ 曲練習が続くとマンネリになります');
if((p.id==='intense'||p.id==='sectional')&&recentTags.filter(t=>['intense','sectional'].includes(t)).length>=3) warnings.push('⚠ 個人/パート練習が続くとさぼりが出やすくなります');
if(p.id==='song'&&!G.kaDaiKyoku) warnings.push('ℹ 曲が決まっていないため精度は上がりません（6月以降）');
// 5軸別効果表示
const pracSongFx = PRAC_SONG_FX[p.tag||p.id]||{};
const hasSongFx  = Object.values(pracSongFx).some(v=>v>0);
const songNote = hasSongFx && G.kaDaiKyoku
  ? `<div style="margin-top:6px;background:var(--bg3);border-radius:6px;padding:6px 8px">
      <div style="font-size:9px;color:var(--ink3);font-weight:700;margin-bottom:4px;letter-spacing:.05em">🎼 曲パラメーターへの効果</div>
      ${SONG_PARAMS.map(sp=>{
        const v=pracSongFx[sp.key]||0;
        if(v<=0) return '';
        const barW=Math.round(v/5*100);
        return `<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;font-size:10px">
          <span style="width:14px;text-align:center">${sp.icon}</span>
          <span style="flex:1;color:var(--ink2)">${sp.label}</span>
          <div style="width:50px;height:5px;background:var(--bg4);border-radius:3px;overflow:hidden">
            <div style="width:${barW}%;height:100%;background:${sp.col};border-radius:3px"></div>
          </div>
          <span style="color:${sp.col};font-weight:700;font-size:9px">+${v}</span>
        </div>`;
      }).join('')}
    </div>`
  : !G.kaDaiKyoku && hasSongFx
  ? `<span style="color:var(--ink3);font-size:10px">※ 6月の曲目決定後に曲パラメーター効果が有効になります</span>`
  : '';
document.getElementById('prac-preview-body').innerHTML=
`<strong>${p.name}</strong>${isSeason?'<span style="color:var(--gold);margin-left:6px">⭐ シーズンボーナス適用中！</span>':''}<br><br>
${p.desc}<br><br>
予測効果：${fxLabel(eff)}<br>
${songNote}<br>
${p.cost?`<span style="color:var(--red)">費用：${p.cost.toLocaleString()}円</span><br>`:''}
${warnings.map(w=>`<div style="color:var(--amber);font-size:10px;margin-top:2px">${w}</div>`).join('')}
<span style="color:var(--ink3);font-size:10px">※部員の性格・スタミナ・士気により個人差あり</span>`;
}
function advanceWeek(){
recalc();
// 学校特徴の週次効果
(G.feats||[]).forEach(feat=>{
  const b=FEAT_BONUS[feat];
  if(b&&b.weeklyFx) b.weeklyFx(G);
});
// 士気伝染チェック（練習前に適用）
const contagion = applyMoraleContagion();
const before={skill:G.skill,ensemble:G.ensemble,song:G.song,morale:G.morale,funds:G.funds,
  kadaiParams:G.kadaiParams?{...G.kadaiParams}:null,
  jiyuParams:G.jiyuParams?{...G.jiyuParams}:null};
let pracName=null;
let eventData=null;
// 伝染が起きていたらイベントとして反映
if(contagion && !eventData){
  const {affected, streak, severity, lowCount, names} = contagion;
  const nameStr = names.length ? names.join('、') : '数名';
  if(severity==='critical'){
    eventData={icon:'💀',title:'部の雰囲気が最悪に',
      body:`${nameStr}らの落ち込みが全体に広がり、練習室の空気が重苦しい。このままでは崩壊しかねない。`,
      col:'var(--red)'};
    addLog(`士気危機：低士気が${lowCount}人に蔓延（${streak}週継続）`,'警告');
  } else if(severity==='serious'){
    eventData={icon:'😞',title:'暗い雰囲気が広がっている',
      body:`${nameStr}などの落ち込みが周囲に影響し始めている。早めに手を打ちたい。`,
      col:'var(--amber)'};
    if(streak>=3) addLog(`士気低下が${streak}週続いている。対処が必要。`,'警告');
  } else {
    // mild：イベントは出さず、週報に軽く記載するだけ
    if(streak>=2) addLog(`${nameStr}の落ち込みが周囲に少し影響している。`,'状況');
  }
}
if(selPracId){
const p=PRACTICES.find(x=>x.id===selPracId);
let pCost=p.cost;
if(p.tag==='teacher'){
  const discount=(G.feats||[]).reduce((s,f)=>{const b=FEAT_BONUS[f];return s+(b&&b.teacherDiscount?b.teacherDiscount:0);},0);
  pCost=Math.max(0,p.cost-discount);
  if(discount>0) notif('特徴ボーナス',`外部講師招聘費 ${discount.toLocaleString()}円割引！`);
}
if(pCost&&G.funds<pCost){notif('資金不足','外部講師を招く資金が不足しています');return;}
G.funds-=pCost;
const effectiveFx=getPracticeEffective(p);
G._currentPracTag = p.tag||p.id; // パート練習判定用
applyPracticeToMembers(effectiveFx);
// さぼりパートをイベントに反映
if(G._lastSaboriParts && G._lastSaboriParts.length > 0 && !eventData){
  const sp = G._lastSaboriParts.join('・');
  eventData={icon:'😴',title:`${sp}パートがさぼった`,
    body:`${sp}パートが自主練をさぼっていた。そのぶん成長が遅れそうだ。`,
    col:'var(--amber)'};
}
const songGain = calcSongGain(p.tag||p.id, effectiveFx);
// G.songはcalcSongGain内で5軸平均として自動更新される
const shirker = checkShirkers(p.tag||p.id);
resolveShirker();
if(shirker && !eventData){
const shirkerLines=[
`${shirker.name}が練習に身が入らず、こっそりスマホをいじっていた。`,
`${shirker.name}が「なんか疲れた…」と愚痴りながらサボり気味だった。`,
`${shirker.name}が練習をフェードアウト。誰かが声をかけないといけない。`,
`${shirker.name}が個人練習の時間に姿を消した。トイレが長すぎる…`,
];
eventData={icon:'😴',title:'さぼり発生',body:pick(shirkerLines),col:'var(--amber)'};
addLog(`${shirker.name}がさぼり気味になった`,'イベント');
}
if(G.sectionalDebt>=3 && !eventData){
eventData={icon:'⚠️',title:'パート練習不足',body:'パート練習が不足しています。合奏のクオリティに影響が出始めています。',col:'var(--amber)'};
}
if(G.songBoredom>=3 && !eventData){
eventData={icon:'😑',title:'曲練習がマンネリ',body:'同じ曲ばかり練習して部員が飽き気味。基礎やパート練習も織り交ぜよう。',col:'var(--amber)'};
}
pracName=p.name+(effectiveFx._seasonBonus?' ✨':'');
if(effectiveFx._seasonBonus) notif('シーズンボーナス！','コンクール期間中の外部講師は効果大！');
const songGainStr = songGain>0 ? `(曲精度+${songGain})` : G.kaDaiKyoku?'(曲精度効果なし)':'(曲未決定)';
addLog(`週練習：${p.name}${effectiveFx._seasonBonus?' [シーズンボーナス]':''} ${songGainStr}`,'練習');
selPracId=null;
document.querySelectorAll('.week-card').forEach(c=>c.classList.remove('sel'));
document.getElementById('sel-prac-name').textContent='なし';
document.getElementById('prac-preview').style.display='none';
}
G.members.forEach(m=>m.morale=Math.max(20,m.morale-rnd(0,2)));
if(!selPracId && G.shirkerIds && G.shirkerIds.length > 0 && Math.random() < 0.1){
const id = G.shirkerIds[0];
const m = G.members.find(x=>x.id===id);
if(m){ m.morale=Math.min(99, m.morale+rnd(3,8)); }
G.shirkerIds = G.shirkerIds.slice(1);
}
if(Math.random()<(eventData?0.15:0.25)){
const ev=pickWeightedEvent();
ev.fx(G);
if(!eventData) eventData={icon:ev.icon,title:ev.title,body:ev.body,col:ev.col};
addLog(ev.title,'イベント');
}
recalc();
const after={skill:G.skill,ensemble:G.ensemble,song:G.song,morale:G.morale,funds:G.funds,
  kadaiParams:G.kadaiParams?{...G.kadaiParams}:null,
  jiyuParams:G.jiyuParams?{...G.jiyuParams}:null};
showWeekResult(before,after,pracName,eventData);
if(G.week>=WEEKS_PER_MONTH){
G.week=1;
G._pendingMonthAdvance=true; // closeWeekResultで月進行
} else {
G.week++;
}
}
async function showWeekResult(before,after,pracName,eventData){
const curWeek=G._pendingMonthAdvance?WEEKS_PER_MONTH:(G.week<=1?WEEKS_PER_MONTH:G.week-1);
document.getElementById('wr-week-badge').textContent=`${MN[G.month]} 第${curWeek}週`;
document.getElementById('wr-title').textContent='週の記録';
document.getElementById('wr-prac-label-wrap').innerHTML=pracName
?`<span class="wr-prac-label">📋 ${pracName}</span>`:'';
const ea=document.getElementById('wr-event-area');
if(eventData){
ea.innerHTML=`<div class="wr-event-badge">
<div class="wr-event-icon">${eventData.icon}</div>
<div><div class="wr-event-title">${eventData.title}</div><div class="wr-event-body">${eventData.body}</div></div>
</div>`;
} else ea.innerHTML='';
const hasPiece = !!G.kaDaiKyoku;
const params=[
{lbl:'総合技術力',     before:before.skill,   after:after.skill,   col:'var(--blue)'},
{lbl:'アンサンブル',   before:before.ensemble,after:after.ensemble,col:'#7050b0'},
// 5軸は別途ミニレーダーで表示（後述）
{lbl:'士気',           before:before.morale,  after:after.morale,  col:'var(--green)'},
{lbl:'資金（円）',     before:before.funds,   after:after.funds,   col:'var(--gold)',isMoney:true},
];
document.getElementById('wr-rows').innerHTML=params.map(p=>{
const delta=p.after-p.before;
const dStr=p.isMoney?(delta>=0?'+'+delta.toLocaleString():delta.toLocaleString()):(delta>=0?'+'+delta:String(delta));
const dCls=delta>0?'wr-plus':delta<0?'wr-minus':'wr-zero';
return `<div class="wr-row">
<div class="wr-lbl">${p.lbl}</div>
<div class="wr-vals">
<span class="wr-old">${p.isMoney?p.before.toLocaleString():p.before}</span>
<span class="wr-arrow">→</span>
<span class="wr-new" style="color:${p.col}">${p.isMoney?p.after.toLocaleString():p.after}</span>
<span class="wr-delta ${dCls}">${dStr}</span>
</div>
</div>`;
}).join('');
// 5軸ミニ表示
if(hasPiece&&(G.kaDaiKyoku?.selectedKadai||G.kaDaiKyoku?.selectedJiyu)){
  const miniRows=SONG_PARAMS.map(sp=>{
    const bKadai=before.kadaiParams?.[sp.key]??0;
    const aKadai=after.kadaiParams ?.[sp.key]??0;
    const bJiyu =before.jiyuParams ?.[sp.key]??0;
    const aJiyu =after.jiyuParams  ?.[sp.key]??0;
    const hasKadai=!!G.kaDaiKyoku?.selectedKadai;
    const hasJiyu =!!G.kaDaiKyoku?.selectedJiyu;
    const bVal=hasKadai&&hasJiyu?Math.round((bKadai+bJiyu)/2):hasKadai?bKadai:bJiyu;
    const aVal=hasKadai&&hasJiyu?Math.round((aKadai+aJiyu)/2):hasKadai?aKadai:aJiyu;
    const d=aVal-bVal;
    const dCls=d>0?'wr-plus':d<0?'wr-minus':'wr-zero';
    return `<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;font-size:11px">
      <span style="width:18px;text-align:center">${sp.icon}</span>
      <span style="flex:1;color:var(--ink2)">${sp.label}</span>
      <span style="color:var(--ink3)">${bVal}</span>
      <span style="color:var(--ink4)">→</span>
      <span style="color:${sp.col};font-weight:700">${aVal}</span>
      <span class="wr-delta ${dCls}" style="min-width:28px;text-align:right">${d>=0?'+':''  }${d}</span>
    </div>`;
  }).join('');
  document.getElementById('wr-rows').innerHTML+=
    `<div style="background:var(--bg3);border-radius:8px;padding:9px 11px;margin-top:8px">
      <div style="font-size:10px;color:var(--ink3);font-weight:700;margin-bottom:6px;letter-spacing:.05em">🎼 曲パラメーター</div>
      ${miniRows}
    </div>`;
}
const sw=document.getElementById('wr-story-wrap');
sw.innerHTML=`<div class="wr-story-loading">
<div class="wr-story-dots"><div class="wr-story-dot"></div><div class="wr-story-dot"></div><div class="wr-story-dot"></div></div>
<span>今週のストーリーを書いています…</span>
</div>`;
document.getElementById('wr-continue-btn').disabled=true;
document.getElementById('ov-week-result').classList.add('show');
sw.innerHTML=`<div class="wr-story-text" id="wr-story-text"></div>`;
const el=document.getElementById('wr-story-text');
await typewriterEffect(el,buildFallbackStory(curWeek,pracName,eventData,before,after),18);
document.getElementById('wr-continue-btn').disabled=false;
}
async function generateWeekStory(week,pracName,eventData,before,after){
const sorted=[...G.members].sort((a,b)=>{
const aScore=Math.abs(a.morale-50)+Math.abs(a.stamina-60)+Math.abs(a.skill-G.skill);
const bScore=Math.abs(b.morale-50)+Math.abs(b.stamina-60)+Math.abs(b.skill-G.skill);
return bScore-aScore;
});
const pool=sorted.slice(0,Math.min(6,sorted.length));
const spotlights=[pick(pool)];
if(pool.length>1&&Math.random()>.4){
let m2=pick(pool); if(m2.id!==spotlights[0].id) spotlights.push(m2);
}
if(pool.length>2&&Math.random()>.7){
let m3=pick(pool); if(!spotlights.find(x=>x.id===m3.id)) spotlights.push(m3);
}
const memberDesc=spotlights.map(m=>`${m.name}（${m.part}・${m.grade}年・${m.personality}・演奏力${m.skill}・士気${m.morale}・体力${m.stamina}）`).join('、');
const skillDelta=after.skill-before.skill;
const moraleDelta=after.morale-before.morale;
const songDelta=after.song-before.song;
const kadaiDelta=after.kadaiParams&&before.kadaiParams?songAvg(after.kadaiParams)-songAvg(before.kadaiParams):songDelta;
const jiyuDelta=after.jiyuParams&&before.jiyuParams?songAvg(after.jiyuParams)-songAvg(before.jiyuParams):songDelta;
const isSeason=G.month>=7&&G.month<=10;
const _sj=G.kaDaiKyoku?.selectedJiyu||(Array.isArray(G.kaDaiKyoku?.jiyu)?G.kaDaiKyoku.jiyu[0]:G.kaDaiKyoku?.jiyu);
const _sk=G.kaDaiKyoku?.selectedKadai;
const pieceInfo=_sk&&_sj?`課題曲「${_sk.title}」／自由曲「${_sj.title}」`:_sj?`自由曲「${_sj.title}」`:'';
const shirkerNames=(G.shirkerIds||[]).map(id=>G.members.find(m=>m.id===id)?.name).filter(Boolean);
const extraCtx=[];
if(shirkerNames.length) extraCtx.push(`さぼり中の部員：${shirkerNames.join('、')}`);
if(G.songBoredom>=2) extraCtx.push('曲練習のマンネリが出てきた');
if(G.sectionalDebt>=2) extraCtx.push('パート練習が不足している');
if(G.conflictActive) extraCtx.push('部内でいざこざがある');
const _lowM=G.members.filter(m=>m.morale<=35);
if(_lowM.length>=3) extraCtx.push(`${_lowM.slice(0,2).map(m=>m.name).join('、')}など${_lowM.length}人が落ち込んでいて部の雰囲気に影響している`);
else if(_lowM.length>0) extraCtx.push(`${_lowM[0].name}の士気が低く周囲が気にかけている`);
if(G._lowMoraleStreak>=3) extraCtx.push('暗い雰囲気が数週間続いている');
const ANGLES=[
'今週のハイライトシーンを、部員の心情を中心に描写する',
'中高生らしいユーモラスな場面や軽口を中心に描く（クスっと笑えるトーンで）',
'部員たちの何気ない放課後の空気感と、音楽への純粋な気持ちを詩的に表現する',
'葛藤や困難と、それを乗り越えようとする青春の姿を描く',
'練習の緊張感と、終わった後のほっとした解放感を交互に描く',
'特定の部員の視点から、その子の内心の言葉を交えて語りかけるように描く',
...(shirkerNames.length?['さぼり気味の部員を中心に、その心境と周囲の反応を描く']:[]),
...(G.songBoredom>=2?['マンネリを感じている部員たちと、それでも前に進もうとする姿を描く']:[]),
];
const angle=pick(ANGLES);
const prompt=`あなたは中高生の青春吹奏楽部の物語を書く作家です。
以下の情報をもとに、その週の部活の様子を生き生きとしたストーリー調の文章（220〜300文字）で書いてください。
【学校】${G.school}吹奏楽部（${DIFF[G.diff].label}・${G.division==='large'?'大編成':'中編成'}）
【時期】${G.year}年目 ${MN[G.month]} 第${week}週${isSeason?' ※コンクールシーズン！':''}
【顧問】${G.advisor}先生
【部長】${G.captain?G.captain.name+'（'+G.captain.part+'・'+G.captain.personality+'）':'未選出'}
【今週の練習】${pracName||'自由練習'}
【登場する部員】${memberDesc||'部員たち'}
【今週のできごと】${eventData?eventData.title+' — '+eventData.body:'特になし'}
【曲目】${pieceInfo||'未定'}
【追加状況】${extraCtx.length?extraCtx.join('、'):'特になし'}
【パラメーター変化】技術力${skillDelta>=0?'+'+skillDelta:skillDelta}、士気${moraleDelta>=0?'+'+moraleDelta:moraleDelta}、曲精度（課題曲平均）${kadaiDelta>=0?'+'+kadaiDelta:kadaiDelta}
【現在の部の状態】技術力${after.skill}／士気${after.morale}／資金${after.funds.toLocaleString()}円
【今回のストーリーアングル】${angle}
ルール：
- 登場部員の名前・性格・パラメーターを物語に自然に反映する（士気低い子はやる気なさげ、スタミナない子は息が上がる等）
- 中高生らしいリアルなセリフ・言葉遣いにする（「マジやばい」「えー無理」等も自然に使う）
- 練習の具体的な場面（音・動き・空気感）を描写する
- セリフを1〜2つ入れる（「　」で）
- アングルに従ったトーンで書く
- 最後に次週・未来への余韻で締める
- 箇条書き・見出し不要、地の文のみ、余分な空白なし`;
const res=await fetch('https://api.anthropic.com/v1/messages',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:700,messages:[{role:'user',content:prompt}]})
});
if(!res.ok) throw new Error('API '+res.status);
const data=await res.json();
return data.content.map(b=>b.text||'').join('').trim();
}
function buildFallbackStory(week,pracName,eventData,before,after){
const skillDelta=after.skill-before.skill;
const moraleDelta=after.morale-before.morale;
const pracTag=G._currentPracTag||'';
const mem=G.members.length>0?pick(G.members):null;
const mem2=G.members.length>1?pick(G.members.filter(m=>!mem||m.id!==mem.id)):null;
const cap_=G.captain;
const lowMorale=G.members.filter(m=>m.morale<40);
const highMorale=G.members.filter(m=>m.morale>75);
const lowSkill=G.members.filter(m=>m.skill<35);
const highSkill=G.members.filter(m=>m.skill>70);
const avgStamina=G.members.length?Math.round(G.members.reduce((a,m)=>a+m.stamina,0)/G.members.length):50;

// ── 練習タグ別・特化した書き出し ──
const pracOpenings={
  basic:[
    `チューニングの音が練習室に広がった。今週は基礎からじっくり向き合う一週間だった。`,
    `ロングトーンの音が廊下まで響いた。地味だけど、これが全ての土台になる。`,
    `音階練習から始まった今週。${mem?mem.name+'は':'部員たちは'}一音一音を丁寧に確かめるように吹いた。`,
    `「基礎は嘘をつかない」——${G.advisor}先生の言葉が、練習室に静かに染み渡った。`,
  ],
  ensemble:[
    `「全体、もう一度！」${G.advisor}先生の指揮棒が振り下ろされ、音が一体になっていく。`,
    `バラバラだった音が、少しずつひとつに近づいていく感覚があった。`,
    `合奏中、${mem?mem.name+'が':'誰かが'}隣のパートの音に耳を傾けているのが見えた。`,
    `音が重なる瞬間の気持ちよさを、今週また少し感じることができた。`,
  ],
  song:[
    `コンクール曲のフレーズが、今週も練習室に鳴り響いた。`,
    `「本番まで何回弾けるか」——そんな緊張感が漂い始めた一週間だった。`,
    `${G.kaDaiKyoku?.selectedKadai?'「'+G.kaDaiKyoku.selectedKadai.title+'」の':'課題曲の'}難しいパッセージと向き合い続けた一週間。`,
    `譜面を見なくても弾けるようになってきた。でも、まだそれだけでは足りない。`,
  ],
  sectional:[
    `パートごとに分かれた練習室から、それぞれの音が漏れ聞こえてきた。`,
    `「ここのリズム、もう一回合わせよう」パート内の声が飛び交う一週間だった。`,
    `${mem?mem.name+'の':'あるパートの'}音が、パート練習を重ねるごとに整ってきた。`,
    `隣のパートの仕上がりが気になる。それがまた、いい刺激になっていた。`,
  ],
  sectional_sup:[
    `${G.advisor}先生がパートを巡回する。視線が来るたびに、自然と姿勢が正される。`,
    `「ここ、もう少し丁寧に」——${G.advisor}先生の一言が、各パートに緊張感をもたらした。`,
    `先生が来るとわかっていると、普段より集中できる。複雑な気持ちだけれど。`,
    `巡回の足音が聞こえるたびに、練習室の空気がぴりっとした。`,
  ],
  intense:[
    `苦手なフレーズと、今週も正面から向き合った。`,
    `${mem?mem.name+'は':'部員たちは'}できるまで繰り返した。10回、20回、それ以上。`,
    `個人練習の時間、練習室は静かな緊張感に包まれていた。`,
    `「できない」を「できる」に変えるために、ひたすら繰り返す一週間だった。`,
  ],
  teacher:[
    `外部の先生が来た瞬間、練習室の空気が変わった。`,
    `プロの耳には、どんな細かいミスも聞こえていた。`,
    `「そこ、もっと息を使って」——普段とは違う言葉が、新しい気づきをくれた。`,
    `外部講師の先生の一言一言が、部員たちの表情を変えていった。`,
  ],
  mental:[
    `今週は楽器を置いて、気持ちを整える時間にした。`,
    `「技術じゃなくて、心の話をしよう」——${G.advisor}先生の言葉で練習が始まった。`,
    `円になって話し合った。音楽以外の話も、自然と出てきた。`,
    `本番のことを想像しながら、部員たちは自分の気持ちと向き合った。`,
  ],
  recording:[
    `スマホのマイクを立て、演奏を録音した。再生ボタンを押した瞬間、部員の顔が変わった。`,
    `「思ったより…」録音を聴いた${mem?mem.name+'が':'誰かが'}、小さく呟いた。`,
    `客観的に聴くと、見えなかったものが見えてくる。録音はそういう鏡だった。`,
    `録音した音源を全員で聴いた。気まずい沈黙の後、自然と話し合いが始まった。`,
  ],
  analysis:[
    `他校の演奏動画を全員で観た。「うまい」という声が自然と漏れた。`,
    `ライバル校の音を聴いていると、自分たちの課題がはっきり見えてくる。`,
    `「負けたくない」——分析が終わった後、${mem?mem.name+'の':'誰かの'}目に火が灯った。`,
    `他校の演奏を研究することで、自分たちの強みと弱みが浮かび上がってきた。`,
  ],
  concert:[
    `ステージに立つと、練習とは違う緊張感があった。でも、それが心地よかった。`,
    `観客の前で演奏する。それだけで、部員の顔つきが変わる。`,
    `拍手をもらうたびに、また頑張ろうという気持ちが湧いてきた。`,
    `演奏が終わった後の静寂。そして、あたたかい拍手。${mem?mem.name+'には、':'部員たちには、'}その音が忘れられなかった。`,
  ],
};

// ── 共通書き出し（タグ不明時のフォールバック）──
const commonOpenings=[];
if(cap_) commonOpenings.push(
  `${cap_.name}が「集合！」と声をかけ、今日も練習が始まった。`,
  `部長の${cap_.name}が部員たちを見渡し、小さく頷いた。`
);
commonOpenings.push(
  `放課後の練習室に、楽器の音が溢れ出した。`,
  `${G.advisor}先生の指揮棒が上がった瞬間、部員たちの視線が一点に集まった。`,
  `窓の外が暗くなっても、${G.school}吹奏楽部の練習は続いた。`,
  `今週も部員たちは音楽室に集まり、音を重ねていった。`
);
if(mem) commonOpenings.push(
  `${mem.name}の音が、今日は少し違って聴こえた。`,
  `${mem.name}が楽器を構えたとき、ふと去年のことを思い出した。`
);
const openings=pracOpenings[pracTag]||commonOpenings;

// ── 練習タグ別・中間描写 ──
const pracMidDescs={
  basic:[
    `スケールを何度も繰り返すうちに、${mem?mem.name+'の':'誰かの'}音が少し丸くなってきた。`,
    `地道な基礎練習が、じわじわと土台を固めていく。すぐには見えないけれど、確かに積み上がっている。`,
    `${lowSkill.length>0?pick(lowSkill).name+'は':mem?mem.name+'は':''}音階をゆっくり、丁寧に繰り返した。急がなくていい。今はそれだけでいい。`,
  ],
  ensemble:[
    `${mem?mem.name+'が':''} 隣のパートの音を聴きながら自分の音を調整する。その積み重ねが、合奏を作っていく。`,
    `バランスが揃った瞬間、${G.advisor}先生が小さく微笑んだ。部員たちはその表情を見逃さなかった。`,
    `${mem&&mem2?mem.name+'と'+mem2.name+'が':'部員たちが'}アイコンタクトで音を合わせた。言葉はいらなかった。`,
  ],
  song:[
    `${highSkill.length>0?pick(highSkill).name+'の':''}音が曲の核になっていく感覚があった。でも、まだ全員がそこに届いていない。`,
    `難しいパッセージを${mem?mem.name+'が':''}何度も繰り返した。指が覚えるまで、ひたすら繰り返す。`,
    `曲の後半、${lowStamina?'スタミナが切れかけた部員もいたが、':''}最後まで音を出し続けた。`,
  ],
  sectional:[
    `${mem?mem.name+'の':'あるパートの'}苦手な箇所を、パート全員で支え合いながら乗り越えた。`,
    `パートの中で意見が出た。「ここはこう吹いた方が」——そんな会話が、演奏を豊かにする。`,
    highMorale.length>0?`${pick(highMorale).name}がパートをぐいぐい引っ張っていた。`:
    `パートリーダーを中心に、細かいところを丁寧に確認していった。`,
  ],
  sectional_sup:[
    `${G.advisor}先生の指摘は的確だった。「そこ、音が早い」——言われて初めて気づくことがある。`,
    `先生がいる間、${mem?mem.name+'も':'部員たちも'}いつもより集中していた。終わった後は、少しぐったりしていたけれど。`,
    `巡回が終わった後、${mem?mem.name+'が':'誰かが'}「やっぱり先生に聴いてもらうと違うね」とつぶやいた。`,
  ],
  intense:[
    `${mem?mem.name+'は':'部員たちは'}苦手なフレーズと30分向き合い続けた。できない。でも止まらない。`,
    `個人練習の時間、${highSkill.length>0?pick(highSkill).name+'は難しい曲をさらにレベルアップして練習していた。':
    '各自が自分の弱点と向き合っていた。'}`,
    lowMorale.length>0?`${pick(lowMorale).name}はうまくいかない自分に少し苛立っていたが、それでも手を止めなかった。`:
    `繰り返すたびに、少しずつ指が動くようになってきた。`,
  ],
  teacher:[
    `外部講師の先生は、一人ひとりの音をじっくり聴いていた。${mem?mem.name+'は':''}その視線を感じながら、いつも以上に集中した。`,
    `「あなたたちには可能性がある」——その一言が、今週の練習を変えた。`,
    `プロの視点で見ると、当たり前だと思っていたことが、実は改善できることだったと気づいた。`,
  ],
  mental:[
    `「コンクールが怖い」——誰かが正直に言った。その言葉が、場の空気をやわらかくした。`,
    `${mem?mem.name+'は':''} 目を閉じて演奏をイメージした。音楽は、頭の中でも鳴り続ける。`,
    `チームとして戦うために、まず気持ちを一つにする週があってもいい。`,
  ],
  recording:[
    `再生した音源を聴きながら、${mem?mem.name+'が':'誰かが'}「ここ、もっとこうできる」とメモを取った。`,
    `客観的に自分の音を聴くことで、漠然とした不安が具体的な課題に変わった。`,
    `「意外と悪くない」という声も上がった。聴いてみるまでわからないことがある。`,
  ],
  analysis:[
    `「この学校、ここが強いよね」——${mem?mem.name+'が':'誰かが'}動画を止めながら言った。`,
    `ライバルを知ることで、自分たちの練習に方向性が生まれた。`,
    highMorale.length>0?`${pick(highMorale).name}は「絶対に勝ちたい」とつぶやいた。その目に、本気が宿っていた。`:
    `他校の演奏を見た後、自然と練習の質が上がった気がした。`,
  ],
  concert:[
    `舞台袖で緊張していた${mem?mem.name+'も':'部員たちも'}、音を出した瞬間に迷いが消えた。`,
    `アンコールの拍手が来たとき、${mem?mem.name+'は':'部員たちは'}こみ上げるものを感じた。`,
    `本番で緊張するのは、それだけ本気だということだ。終わった後、みんなそれを知っていた。`,
  ],
};
const commonMidDescs=[];
if(mem) commonMidDescs.push(
  `${mem.name}は今日も黙々と練習に向き合っていた。`,
  `${mem.name}の表情が、先週より少し柔らかくなった気がした。`
);
if(mem&&mem2) commonMidDescs.push(
  `${mem.name}と${mem2.name}が目を合わせ、小さく頷いた。`,
  `${mem2.name}が${mem.name}に「もう一回やってみよう」と声をかけた。`
);
if(lowMorale.length>0) commonMidDescs.push(
  `${pick(lowMorale).name}は疲れた顔をしていたが、それでも楽器を離さなかった。`
);
if(highMorale.length>0) commonMidDescs.push(
  `${pick(highMorale).name}の演奏には、今週も迷いがなかった。`
);
const midDescs=pracMidDescs[pracTag]||commonMidDescs;

// ── 変化描写（パラメーター連動）──
const changeDescs=[];
if(skillDelta>3) changeDescs.push(
  `今週の練習は手応えがあった。音の輪郭が、確かに太くなってきている。`,
  `「あ、揃った」——誰かが小さく呟いた。その瞬間が、今週一番の収穫だった。`
);
else if(skillDelta>0) changeDescs.push(
  `小さな一歩だけれど、確実に前に進んでいる。`,
  `まだまだ荒削りだけど、音楽の形が少し見えてきた。`
);
else if(skillDelta<0) changeDescs.push(
  `今週は思うように音が出なかった。でも、それも練習のうちだ。`,
  `うまくいかない日もある。それでも明日また集まれば、きっと違う。`
);
if(moraleDelta<-3) changeDescs.push(
  `練習室の空気が、少し重たかった。みんな疲れているのかもしれない。`,
  `笑顔が少ない一週間だった。それでも、誰も欠席しなかった。`
);
else if(moraleDelta>3) changeDescs.push(
  `練習室に笑い声が増えた。チームとして、いい空気が流れている。`,
  `部員たちの顔が明るい。こういう週が続くといいと思った。`
);
if(eventData) changeDescs.push(
  `そんな中、${eventData.title}があった。部の空気に、小さな変化をもたらした。`,
  `${eventData.title}——それは今週の練習に、確かな影響を与えた。`
);

// ── 練習タグ別・締め ──
const pracEndings={
  basic:[
    `基礎は地味だ。でも、ここを疎かにしたら先はない。部員たちはそれを知っていた。`,
    `ロングトーンの余韻が、静かな練習室に消えていった。また来週も、ここから始まる。`,
    `土台を固める一週間が終わった。目には見えないけれど、確かに積み上がっている。`,
  ],
  ensemble:[
    `音が重なる喜びを、今週また少し感じることができた。合奏は、一人ではできないから美しい。`,
    `バラバラだった音が、一つになっていく。その過程こそが、吹奏楽の醍醐味だと思った。`,
    `全員の音が揃った瞬間、言葉はいらなかった。それだけで十分だった。`,
  ],
  song:[
    `曲と向き合う時間は、自分と向き合う時間でもある。来週も、この曲と戦い続ける。`,
    `本番まで、まだ時間はある。でも、それは永遠ではない。`,
    `「この曲を好きになれたら、もっとうまくなれる」——${mem?mem.name+'は':'誰かは'}そう思っていた。`,
  ],
  sectional:[
    `パートがひとつになったとき、合奏はさらに輝く。その日のために、今日もパート練習をした。`,
    `細かいところを磨く地道な作業が、やがて大きな差になる。`,
    `パートの絆が、少し深まった一週間だった。`,
  ],
  sectional_sup:[
    `先生の目があるのは、ありがたいことだ。そう思えるようになったのも、成長かもしれない。`,
    `厳しい目で見てもらえるうちが花だ。来週も、精一杯やろう。`,
    `巡回が終わった後の、あの清々しい疲れ。また来週も、頑張れそうだった。`,
  ],
  intense:[
    `できなかったことが、少しできるようになった。それだけで、今週は十分だ。`,
    `苦手を克服する道は長い。でも、向き合い続けることが、一番の近道だと知っている。`,
    `${mem?mem.name+'は':'部員たちは'}今週も自分の限界と戦った。その積み重ねが、やがて実を結ぶ。`,
  ],
  teacher:[
    `プロの言葉は重い。でも、それだけ価値がある。来週の練習が、また少し変わるはずだ。`,
    `外部の目を借りることで、自分たちだけでは気づけなかったことが見えてきた。`,
    `先生が帰った後、練習室がいつもより静かだった。みんな、頭の中で整理していたのかもしれない。`,
  ],
  mental:[
    `強い演奏は、強い気持ちから生まれる。今週はその土台を作った。`,
    `心が整ったとき、音も変わる。そう信じて、また来週に臨む。`,
    `技術だけじゃない。気持ちも鍛えることができる。それを知った一週間だった。`,
  ],
  recording:[
    `録音を聴いた後の練習は、いつもと少し違って聴こえた。耳が変わると、音も変わる。`,
    `自分の音を客観的に知ること。それが上達への一番の近道かもしれない。`,
    `「また録って、聴いてみよう」——そう思えるようになったこと自体が、成長だった。`,
  ],
  analysis:[
    `ライバルを研究した週が終わった。知ることは、戦う力になる。`,
    `他校の良さを認めながら、自分たちの色を磨いていく。それが${G.school}らしさだと思った。`,
    `分析が終わった後の練習は、なんとなく熱量が違った。`,
  ],
  concert:[
    `本番の空気を体で覚えた。この感覚を、コンクールまで忘れないでいたい。`,
    `観客の前で音楽を届けること。それが全ての練習の意味だと、また思い出した。`,
    `演奏が終わった後の充実感。これがあるから、また頑張れる。`,
  ],
};
const commonEndings=[
  `来週もまた、全国への道は続く。`,
  `${G.school}吹奏楽部の夏は、まだ終わらない。`,
  `音楽室の電気が消えても、部員たちの音は心の中で鳴り続けていた。`,
  `また来週、ここで音を重ねよう。それだけで、今は十分だった。`,
  `${G.advisor}先生が最後に言った。「来週、楽しみにしてるよ」。`,
  `扉を閉める音が響いた。また明日、この音楽室に戻ってくる。`,
  `一週間が終わった。でも、音楽は終わらない。`,
];
const endings=pracEndings[pracTag]||commonEndings;

// 組み立て
let s='';
s+=pick(openings)+' ';
if(midDescs.length) s+=pick(midDescs)+' ';
if(changeDescs.length) s+=pick(changeDescs)+' ';
s+=pick(endings);
return s.trim();
}
async function typewriterEffect(el,text,delayMs){
el.textContent='';
for(let i=0;i<text.length;i++){
el.textContent+=text[i];
const pause='。！？\n'.includes(text[i])?delayMs*7:delayMs;
await new Promise(r=>setTimeout(r,pause));
}
}
function closeWeekResult(){
document.getElementById('ov-week-result').classList.remove('show');
if(G._pendingMonthAdvance){
G._pendingMonthAdvance=false;
advanceMonth_();
} else {
renderAll();
}
}
function advanceMonth_(){
const prevMonth=G.month;
if(G.month===3){endYear();return;}
G.month=G.month===12?1:G.month+1;
const cfg=DIFF[G.diff];
const income=G.dues*G.members.length;
const expense=cfg.monthlyFixed;
// 学校特徴の月次資金ボーナス
const featFundBonus=(G.feats||[]).reduce((sum,feat)=>{
  const b=FEAT_BONUS[feat];
  return sum+(b&&b.fundBonus?b.fundBonus:0);
},0);
G.funds+=income-expense+featFundBonus;
if(G.funds<0) G.funds=0;
const featBonusStr=featFundBonus>0?` +${featFundBonus.toLocaleString()}円（特徴補助）`:'';
addLog(`月次収支：+${income.toLocaleString()}円（部費）-${expense.toLocaleString()}円（固定費）${featBonusStr}`,'資金');
if(G.divisionChosen){
const comp=getCompThisMonth();
if(comp){
setTimeout(()=>runComp(comp.name,comp.m),300);
}
}
if(G.month===4&&!G.divisionChosen){
setTimeout(()=>openDivisionModal(),600);
}
const cfg2=DIFF[G.diff];
if(Math.random()<cfg2.conflictRate&&!G.conflictActive){
G.conflictActive=true;
triggerConflictEvent();
}
if(Math.random()<cfg2.auditRate&&!G.auditPending){
G.auditPending=true;
setTimeout(()=>triggerAuditEvent(),500);
}
const hasCompThisMonth=G.divisionChosen&&!!(G.compSchedule||[]).find(s=>s.m===G.month&&s.qualified);
if(!hasCompThisMonth){
notif(MN[G.month],(MONTHLY_EVENTS[G.month]||[])[0]||'新しい月が始まりました');
}
setTimeout(()=>processMonthlyEvent(G.month), 700);
if(G.month===4){G.recruitDone=false;window._recruitCands=[];}
recalc();
addLog(`${MN[G.month]}になりました`,'システム');
renderAll();
}
function endYear(){
const grad=G.members.filter(m=>m.grade===3);
const gradCount=grad.length;
const prevCaptainGrad=G.captain&&G.captain.grade===3;
G.members=G.members.filter(m=>m.grade<3);
G.members.forEach(m=>m.grade++);
G.year++;G.month=4;G.week=1;
G.song=0;
G.kadaiParams=newSongParams(0);
G.jiyuParams=newSongParams(0);
G.division=null;G.divisionChosen=false;
G.compSchedule=[];
G.conflictActive=false;G.auditPending=false;
G.kaDaiKyoku=null;
G.partLeaders=[];
G.pracHistory=[];
G.shirkerIds=[];
G.songBoredom=0;
G.sectionalDebt=0;
G._monthEventDone={};
if(prevCaptainGrad){G.captain=null;addLog('部長が卒業しました。新部長を2〜3月に選出してください。','システム');}
const hasComp=G.compHistory.some(c=>c.year===G.year-1);
const hasGold=G.compHistory.some(c=>c.year===G.year-1&&c.result==='金賞');
const hasNatGold=G.compHistory.some(c=>c.year===G.year-1&&(c.name==='全国大会'||c.name==='東日本大会')&&c.result==='金賞');
const hasPrefGold=G.compHistory.some(c=>c.year===G.year-1&&c.name.includes('支部')&&c.result==='金賞');
const base=DIFF[G.diff].memMin===18?rnd(6,12):DIFF[G.diff].memMin===32?rnd(10,18):rnd(14,24);
const bonus=hasNatGold?12:hasPrefGold?9:hasGold?6:hasComp?3:0;
const newCount=base+bonus;
const cfg=DIFF[G.diff];
const newParts=PARTS.filter(p=>p!=='オーボエ');
for(let i=0;i<newCount;i++){
const part=pick(newParts);
const pers=pick(PERSONALITIES);
G.members.push({
id:G.members.length,name:rndName(),part,grade:1,
skill:rnd(8,26),expression:rnd(8,24),stamina:rnd(50,80),morale:rnd(72,92),
status:'良好',potential:rnd(62,100),personality:pers,
hobby:pick(HOBBIES),strength:pick(STRENGTHS_POOL),weakness:pick(WEAKNESS_POOL),
isCaptain:false,isExec:false,isPartLeader:false,
});
}
const recruitMsg=hasNatGold?`全国・東日本大会金賞の効果で${newCount}名（+${bonus}名増）の新入部員が来た！`
:hasPrefGold?`支部大会金賞の知名度で${newCount}名（+${bonus}名増）が入部した。`
:hasGold?`コンクール金賞の知名度で${newCount}名（+${bonus}名増）が入部した。`
:`${newCount}名の新入部員が入部しました。`;
addLog(recruitMsg,'入部');
addLog(`${G.year-1}年度終了。${gradCount}名が卒業。${G.year}年目スタート。`,'システム');
notif(`${G.year}年目スタート`,`${gradCount}名卒業・新入生${newCount}名加入`);
recalc();
renderAll();
}
function getCompTable(){ return G.division==='large'?COMP_T_LARGE:COMP_T_MID; }
function setupCompSchedule(){
const sched = G.division==='large' ? COMP_SCHEDULE_LARGE : COMP_SCHEDULE_MID;
G.compSchedule = sched.map(s=>({...s,qualified:false,done:false}));
if(G.compSchedule.length>0) G.compSchedule[0].qualified=true;
}
function getCompThisMonth(){
return G.compSchedule.find(s=>s.m===G.month&&s.qualified&&!s.done)||null;
}
function getNextComp(){
return G.compSchedule.find(s=>s.qualified&&!s.done)||null;
}
function calcScore(){
// 選んだ課題曲の特性でウェイト変動
const selK=G.kaDaiKyoku?.selectedKadai;
const selJ=G.kaDaiKyoku?.selectedJiyu;
// 課題曲と自由曲のウェイトを平均して使う
const wK=selK?.scoreWeight||{skill:0.38,ensemble:0.32,song:0.22,morale:0.08};
const wJ=selJ?.scoreWeight||wK;
const w={
  skill:   Math.round((wK.skill   + wJ.skill)   /2*100)/100,
  ensemble:Math.round((wK.ensemble+ wJ.ensemble) /2*100)/100,
  song:    Math.round((wK.song    + wJ.song)     /2*100)/100,
  morale:  Math.round((wK.morale  + wJ.morale)   /2*100)/100,
};
const avgStamina=G.members.length?Math.round(G.members.reduce((a,m)=>a+m.stamina,0)/G.members.length):50;
const staminaBonus=selK?.trait==='stamina'?Math.round((avgStamina-50)*0.15):0;
const diffBonus=selK?Math.round((selK.difficulty-3)*2.5):0;
const featCompBonus=(G.feats||[]).reduce((sum,feat)=>{const b=FEAT_BONUS[feat];return sum+(b&&b.compBonus?b.compBonus:0);},0);
// 5軸曲パラメーターからコンクール曲スコアを算出
const kadaiScore=G.kadaiParams?songAvg(G.kadaiParams):G.song;
const jiyuScore=G.jiyuParams?songAvg(G.jiyuParams):G.song;
const songScore=G.kaDaiKyoku?.selectedKadai&&G.kaDaiKyoku?.selectedJiyu?Math.round((kadaiScore+jiyuScore)/2):G.song;
const memberCount=G.members.length;
const reqCount=G.division==='large'?55:35;
const countPenalty=Math.max(0,(reqCount-memberCount)*0.3);
const base=G.skill*(w.skill||0.38)+G.ensemble*(w.ensemble||0.32)+songScore*(w.song||0.22)+G.morale*(w.morale||0.08)+staminaBonus+diffBonus+featCompBonus;
const captainBonus=G.captain?3:0;
const plBonus=(G.partLeaders&&G.partLeaders.length>=3)?2:0; // パートリーダーが揃うとボーナス
const conflictPenalty=G.conflictActive?6:0;
const shirkerPenalty=(G.shirkerIds&&G.shirkerIds.length>0)?(G.shirkerIds.length*3):0;
const sectDebtPenalty=Math.min(8,(G.sectionalDebt||0)*1.5);
const boredomPenalty=Math.min(5,(G.songBoredom||0)*1.2);
const luck=(Math.random()-.5)*8;
const mod={easy:1.0,mid:.97,hard:.93}[G.diff]||1;
return Math.round((base+captainBonus+plBonus-countPenalty-conflictPenalty-shirkerPenalty-sectDebtPenalty-boredomPenalty)*mod+luck);
}
function runComp(name,month){
G.achievements.firstContest=true;
// ── コンクール遠征費・参加費 ──
const compCost = (()=>{
  const members = G.members.length;
  // 大会ランクによって遠征費が変わる
  const isNational = name.includes('全国')||name.includes('東日本');
  const isPref     = name.includes('県')||name.includes('支部');
  const isDistrict = name.includes('地区');
  // 参加費（固定）+ 遠征費（部員数×交通費）
  const entryFee   = isNational?10000 : isPref?5000 : 2000;
  const travelPer  = isNational?2500  : isPref?1200  : 400;
  const hotelPer   = isNational?3500  : isPref?1500  : 0; // 宿泊が必要な大会
  return entryFee + (travelPer + hotelPer) * members;
})();
if(G.funds < compCost){
  // 資金不足でも出場できるが部員の士気が下がる
  addLog(`${name}：参加費・遠征費(${compCost.toLocaleString()}円)が不足！資金：${G.funds.toLocaleString()}円`,'資金');
  G.funds = 0;
  G.members.forEach(m=>m.morale=cap(m.morale-rnd(3,7)));
  showEventPopup('💸','遠征費が足りない！',`${name}の参加費・遠征費${compCost.toLocaleString()}円が不足。
部員たちは肩を落としながら出発した。`,'var(--red)');
} else {
  G.funds -= compCost;
  addLog(`${name}：参加費・遠征費 -${compCost.toLocaleString()}円`,'資金');
}
const score=calcScore();
const tbl=getCompTable();
const t=tbl[name];
if(!t){return;}
const reqCount=G.division==='large'?55:35;
const memberCount=G.members.length;
const underCount=memberCount<reqCount;
let result,cls;
if(score>=t.金){result='金賞';cls='res-gold';}
else if(score>=t.銀){result='銀賞';cls='res-silver';}
else if(score>=t.銅){result='銅賞';cls='res-bronze';}
else{result='入賞なし';cls='res-none';}
const advanced = result==='金賞' && t.passLine!==null;
const idx=G.compSchedule.findIndex(s=>s.m===month&&s.name===name);
if(idx>=0){
G.compSchedule[idx].done=true;
G.compSchedule[idx].result=result;
G.compSchedule[idx].score=score;
if(advanced && idx+1<G.compSchedule.length){
G.compSchedule[idx+1].qualified=true;
}
}
if(name.includes('地区'))G.achievements.districtGold=(result==='金賞');
if(name.includes('県'))  G.achievements.prefGold=(result==='金賞')||G.achievements.prefGold;
if(name.includes('支部'))G.achievements.regionGold=(result==='金賞')||G.achievements.regionGold;
if(name==='東日本大会')  G.achievements.eastJapan=(result==='金賞')||G.achievements.eastJapan;
if(name==='全国大会'&&result==='金賞') G.achievements.nationalGold=true;
G.compHistory.push({name,year:G.year,month,result,score,division:G.division});
G.members.forEach(m=>m.morale=cap(m.morale+(result==='金賞'?12:result==='銀賞'?4:result==='銅賞'?-2:-10)));
addLog(`${name}：${result}（${score}点）`,'コンクール');
const emoji=result==='金賞'?'🏆':result==='銀賞'?'🥈':result==='銅賞'?'🥉':'😢';
const nextComp=advanced&&idx+1<G.compSchedule.length?G.compSchedule[idx+1].name:null;
const nextMsg=nextComp?`<div style="color:var(--green);font-size:13px;margin-top:8px;font-weight:700">→ ${nextComp}へ進出！</div>`:'';
const passInfo=t.passLine?`<div style="font-size:11px;color:var(--ink3);margin-top:4px">通過枠：上位${t.passCount}校</div>`:'';
const countWarn=underCount?`<div style="color:var(--red);font-size:11px;margin-top:4px">⚠ 出場人数（${memberCount}人）が規定（${reqCount}人）を下回っています</div>`:'';
const finalMsg=name==='全国大会'&&result==='金賞'?`<div style="font-size:18px;color:var(--gold);font-family:var(--serif);font-weight:800;margin-top:12px">🎉 全国金賞達成！</div>`:'';
const eastMsg=name==='東日本大会'&&result==='金賞'?`<div style="font-size:16px;color:var(--teal);font-family:var(--serif);font-weight:700;margin-top:10px">🌸 東日本大会金賞！</div>`:'';
document.getElementById('comp-result-body').innerHTML=`
<div style="padding:8px 0">
<div style="font-size:52px;margin-bottom:8px">${emoji}</div>
<div style="font-size:11px;color:var(--ink3);margin-bottom:4px">${G.division==='large'?'大編成':'中編成'}</div>
<div style="font-family:var(--serif);font-size:22px;font-weight:800;margin-bottom:6px">${name}</div>
<div style="margin-bottom:8px"><span class="${cls}" style="font-size:15px">${result}</span></div>
<div style="font-size:12px;color:var(--ink2)">演奏スコア：${score}点　（金賞：${t.金}点 / 銀：${t.銀}点 / 銅：${t.銅}点）</div>
${passInfo}${countWarn}${nextMsg}${finalMsg}${eastMsg}
</div>`;
document.getElementById('ov-comp').classList.add('show');
renderCompSection();
renderAchievements();
}
function renderCompSection(){
if(!G.divisionChosen){
document.getElementById('next-comp').innerHTML=
`<div style="color:var(--amber);font-weight:700">⚠ 4月に編成規模を選択してください</div>
<div style="font-size:11px;color:var(--ink3);margin-top:4px">中編成（35人以下）または大編成（55人以上）</div>`;
document.getElementById('comp-hist').innerHTML='<div style="color:var(--ink3);text-align:center;padding:20px">まだ参加実績がありません</div>';
return;
}
const nc=getNextComp();
const tbl=getCompTable();
if(nc){
const t=tbl[nc.name];
const s=Math.round(G.skill*.38+G.ensemble*.32+G.song*.22+G.morale*.08+(G.captain?3:0));
const reqCount=G.division==='large'?55:35;
const countOk=G.members.length>=reqCount;
let pred,col;
if(!countOk){pred=`人数不足（${G.members.length}/${reqCount}人）`;col='var(--red)';}
else if(s>=t.金){pred='金賞・通過圏内！';col='var(--gold)';}
else if(s>=t.銀){pred='銀賞ライン';col='#888';}
else if(s>=t.銅){pred='銅賞ライン';col='var(--amber)';}
else{pred='入賞ライン以下';col='var(--ink3)';}
const passInfo=t.passLine?` ／ 通過枠 上位${t.passCount}校`:'';
document.getElementById('next-comp').innerHTML=
`<div style="margin-bottom:6px"><strong>${G.division==='large'?'🎺 大編成':'🎻 中編成'}</strong></div>
次大会：<strong>${nc.name}（${nc.m}月）</strong><br>
予測スコア：<strong>${s}点</strong> → <strong style="color:${col}">${pred}</strong><br>
<span style="font-size:10px;color:var(--ink3)">金：${t.金}点／銀：${t.銀}点／銅：${t.銅}点${passInfo}</span><br>
<span style="font-size:10px;color:${countOk?'var(--green)':'var(--red)'}">出場人数：${G.members.length}人（規定${reqCount}人）</span>` +
(G.shirkerIds&&G.shirkerIds.length>0?`<br><span style="font-size:10px;color:var(--red)">⚠ さぼり部員${G.shirkerIds.length}名がいます（スコアに影響）</span>`:'') +
(G.sectionalDebt>=3?`<br><span style="font-size:10px;color:var(--amber)">⚠ パート練習不足（クオリティ低下中）</span>`:'') +
(G.songBoredom>=3?`<br><span style="font-size:10px;color:var(--amber)">⚠ 曲練習マンネリ（効果低下中）</span>`:'');
} else {
document.getElementById('next-comp').innerHTML='<span style="color:var(--ink3)">今クールの出場大会はありません</span>';
}
const schedHtml=G.compSchedule.length>0?`
<div style="margin-top:12px;border-top:1px solid var(--border);padding-top:10px">
<div style="font-size:10px;color:var(--ink3);letter-spacing:.1em;margin-bottom:7px">今年度のロードマップ</div>
${G.compSchedule.map((s,i)=>{
const done=s.done;const qual=s.qualified;
const res=s.result||'';
const cls=res==='金賞'?'res-gold':res==='銀賞'?'res-silver':res==='銅賞'?'res-bronze':res?'res-none':'';
const icon=done?(res==='金賞'?'🏆':res==='銀賞'?'🥈':res==='銅賞'?'🥉':'✕'):qual?'▶':'○';
return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;opacity:${qual||done?1:.4}">
<span style="font-size:13px;width:18px;text-align:center">${icon}</span>
<span style="font-size:12px;flex:1">${s.m}月 ${s.name}</span>
${done?`<span class="${cls}" style="font-size:10px">${res}</span>`:''}
</div>`;
}).join('')}
</div>`:'';
document.getElementById('next-comp').innerHTML=(document.getElementById('next-comp').innerHTML||'')+schedHtml;
document.getElementById('comp-hist').innerHTML=G.compHistory.length?
G.compHistory.slice().reverse().map(c=>`
<div class="comp-card">
<div>
<div style="font-size:13px;font-weight:700;margin-bottom:2px">${c.name}</div>
<div style="font-size:11px;color:var(--ink2)">${c.year}年目 ${c.m||c.month}月 ／ ${c.score}点 ／ ${c.division==='large'?'大編成':'中編成'}</div>
</div>
<span class="${c.result==='金賞'?'res-gold':c.result==='銀賞'?'res-silver':c.result==='銅賞'?'res-bronze':'res-none'}">${c.result}</span>
</div>`).join('')
:'<div style="color:var(--ink3);text-align:center;padding:20px">まだ参加実績がありません</div>';
}
function openRecruit(){
if(G.recruitDone){notif('募集済み','今年の新入部員募集は終了しています');return;}
if(!window._recruitCands||window._recruitCands.length===0){
const cands=[];
const n=rnd(5,8);
for(let i=0;i<n;i++){
const part=pick(PARTS.filter(p=>p!=='オーボエ'));
cands.push({
uid:Date.now()+i, name:rndName(), part,
skill:rnd(8,26), expression:rnd(8,24), morale:rnd(70,90),
personality:pick(PERSONALITIES), hobby:pick(HOBBIES),
strength:pick(STRENGTHS_POOL), weakness:pick(WEAKNESS_POOL),
potential:rnd(60,100), grade:1, stamina:rnd(50,80),
status:'良好', isCaptain:false, isExec:false, isPartLeader:false,
});
}
window._recruitCands=cands;
}
renderRecruitModal();
document.getElementById('ov-recruit').classList.add('show');
}
function renderRecruitModal(){
const cands=window._recruitCands||[];
document.getElementById('recruit-body').innerHTML=
`<div style="font-size:12px;color:var(--ink2);margin-bottom:12px">入部希望者が来ています。受け入れる部員を選んでください。残り<strong>${cands.length}</strong>名</div>`+
(cands.length===0
? '<div style="color:var(--ink3);text-align:center;padding:16px">全員の対応が完了しました</div>'
: cands.map(c=>`
<div class="recruit-card">
<div class="rc-info">
<div class="rc-name">${c.name}</div>
<div class="rc-meta">${c.part} ／ ${c.personality} ／ 演奏力:${c.skill} 表現力:${c.expression}</div>
</div>
<div style="display:flex;gap:5px">
<button class="btn btn-sm btn-green" onclick="acceptRecruit(${c.uid})">受け入れる</button>
<button class="btn btn-sm" onclick="rejectRecruit(${c.uid})" style="color:var(--ink3)">断る</button>
</div>
</div>`).join(''));
}
function acceptRecruit(uid){
const idx=window._recruitCands.findIndex(c=>c.uid===uid);
if(idx===-1)return;
const c=window._recruitCands.splice(idx,1)[0];
G.members.push({...c,id:G.members.length});
addLog(`${c.name}（${c.part}）が入部した`,'入部');
notif('入部',`${c.name}が${c.part}パートに入部しました`);
checkAchievements();
recalc();
renderAll();
if(window._recruitCands.length===0){
G.recruitDone=true;
window._recruitCands=[];
closeModal('ov-recruit');
notif('募集終了','今年の新入部員募集が終わりました');
} else {
renderRecruitModal();
}
}
function rejectRecruit(uid){
const idx=window._recruitCands.findIndex(c=>c.uid===uid);
if(idx===-1)return;
const c=window._recruitCands.splice(idx,1)[0];
addLog(`${c.name}（${c.part}）の入部を断った`,'入部');
if(window._recruitCands.length===0){
G.recruitDone=true;
window._recruitCands=[];
closeModal('ov-recruit');
notif('募集終了','今年の新入部員募集が終わりました');
} else {
renderRecruitModal();
}
}
const ACH=[
{k:'firstContest',i:'🎺',n:'初コンクール',    d:'初めてコンクールに出場'},
{k:'districtGold',i:'🥇',n:'地区大会金賞',    d:'大編成・地区大会で金賞'},
{k:'prefGold',    i:'🏅',n:'県大会金賞',      d:'県大会（どちらの編成でも）で金賞'},
{k:'regionGold',  i:'🌸',n:'支部大会金賞',    d:'支部大会で金賞を獲得'},
{k:'eastJapan',   i:'🌟',n:'東日本大会金賞',  d:'中編成ルートの頂点・東日本大会で金賞'},
{k:'nationalGold',i:'🏆',n:'全国金賞',        d:'大編成ルートの頂点・全国大会で金賞'},
{k:'members50',   i:'👥',n:'大所帯部活',      d:'部員数50人以上'},
{k:'skill80',     i:'🎵',n:'技術力80',        d:'総合技術力が80以上'},
];
function checkAchievements_dup(){} // removed duplicate - real one is above
function renderAchievements(){
document.getElementById('ach-list').innerHTML=ACH.map(a=>`
<div class="ach-row">
<div class="ach-icon">${a.i}</div>
<div style="flex:1"><div class="ach-name ${G.achievements[a.k]?'ach-done':''}" style="font-size:12px;font-weight:700">${a.n}</div><div style="font-size:10px;color:var(--ink3)">${a.d}</div></div>
<div style="font-size:11px;${G.achievements[a.k]?'color:var(--gold);font-weight:700':'color:var(--ink4)'}">${G.achievements[a.k]?'✓達成':'未達成'}</div>
</div>`).join('');
}
function addLog(msg,tag){
G.log.unshift({m:MN[G.month],y:G.year,w:G.week,tag,msg});
document.getElementById('log-container').innerHTML=G.log.slice(0,20).map(l=>{
const cl=l.tag==='コンクール'?'log-comp':l.tag==='イベント'?'log-ev':l.tag==='練習'?'log-prac':l.tag==='入部'?'log-recr':l.tag==='資金'?'log-funds':l.tag==='いざこざ'?'log-conflict':'log-sys';
return `<div class="log-item"><span class="log-date">${l.y}年${l.m}W${l.w}</span><span class="log-tag ${cl}">[${l.tag}]</span><span>${l.msg}</span></div>`;
}).join('');
}
function showEventPopup(icon,title,body,col){
document.getElementById('ev-icon').textContent=icon;
document.getElementById('ev-title').textContent=title;
document.getElementById('ev-body').textContent=body;
document.getElementById('ev-effect').style.color=col||'var(--ink)';
document.getElementById('ev-overlay').classList.add('show');
document.getElementById('ev-popup').classList.add('show');
}
function closeEventPopup(){
document.getElementById('ev-overlay').classList.remove('show');
document.getElementById('ev-popup').classList.remove('show');
recalc();renderAll();
}
async function processMonthlyEvent(month){
if(!G._monthEventDone) G._monthEventDone={};
const key=`${G.year}-${month}`;
if(G._monthEventDone[key]) return;
G._monthEventDone[key]=true;
const events={
4: ()=>monthEvent4(),
5: ()=>monthEvent5(),
6: ()=>monthEvent6(),
7: ()=>monthEvent7(),
8: ()=>monthEvent8(),
9: ()=>monthEvent9(),
10: ()=>monthEvent10(),
11: ()=>monthEvent11(),
12: ()=>monthEvent12(),
1: ()=>monthEvent1(),
2: ()=>monthEvent2(),
3: ()=>monthEvent3(),
};
if(events[month]) await events[month]();
}
function monthEvent4(){
if(G.year===1) return; // 1年目は enterGame で対応済み
showEventPopup('🌸','入学式シーズン',
'新入生が入学し、部活への見学者が増えた。部員募集のチャンスだ。','var(--rose)');
}
function monthEvent5(){
const ev=Math.random()<0.5;
if(ev){
applyAll(G,{ens:3,morale:6,song:2});
showEventPopup('🎪','春季演奏会',
'春の演奏会を無事に終えた。お客さんの温かい拍手が部員の自信になった。','var(--green)');
addLog('春季演奏会終了。部の士気が上がった。','イベント');
}
}
async function monthEvent6(){
if(G.division==='large'&&!G.kaDaiKyoku){
await generatePiecesEvent();
} else if(G.division==='mid'&&!G.kaDaiKyoku){
await generateJiyuKyoku();
}
}
function monthEvent7(){
const rain=Math.random()<0.2;
if(rain){
showEventPopup('🌧','サマーコンサートが雨天中止',
'野外コンサートが雨で中止になった。準備していた部員たちはがっかりしている。','var(--ink3)');
applyAll(G,{morale:-5});
} else {
showEventPopup('☀️','サマーコンサート',
'夏の野外コンサートが大盛況！観客の笑顔が部員の原動力になった。','var(--green)');
applyAll(G,{morale:7,ens:3});
addLog('サマーコンサート大成功！','イベント');
}
}
function monthEvent8(){
const fundsCost=G.diff==='easy'?60000:G.diff==='mid'?90000:120000;
const hasCampBonus=(G.feats||[]).some(f=>FEAT_BONUS[f]&&FEAT_BONUS[f].campBonus);
if(G.funds>=fundsCost){
G.funds-=fundsCost;
const campFx=hasCampBonus?{skill:7,ens:7,stamina:9,morale:6}:{skill:5,ens:5,stamina:6,morale:4};
applyAll(G,campFx);
showEventPopup('🏕️','夏合宿',
`合宿費${fundsCost.toLocaleString()}円を使い、みっちり合宿練習を行った。\n体力も技術も大きく伸びた！${hasCampBonus?" 【合宿施設完備ボーナス！】":""}`,"var(--teal)");
addLog(`夏合宿実施（-${fundsCost.toLocaleString()}円）。全パラメーター向上。`,'イベント');
} else {
showEventPopup('💸','合宿費が足りない',
'夏合宿を行いたかったが、資金不足で断念した。通常練習で乗り切ろう。','var(--red)');
applyAll(G,{morale:-4});
addLog('夏合宿：資金不足で断念。','イベント');
}
}
function monthEvent9(){
showEventPopup('🎶','アンサンブルコンテストエントリー',
'小編成グループを編成し、アンコンへのエントリーを行った。各グループの練習が始まった。','var(--blue)');
applyAll(G,{ens:4,morale:3});
addLog('アンサンブルコンテスト準備開始。','イベント');
}
function monthEvent10(){
showEventPopup('📋','定期演奏会の準備開始',
'年末の定期演奏会に向けて選曲・パート割り当てが始まった。','var(--blue)');
}
function monthEvent11(){
// ── 定期演奏会の収支計算 ──
// 支出：会場費 + 印刷費(プログラム) + 照明・音響費
const venueCost   = G.diff==='easy' ? 40000  : G.diff==='mid' ? 70000  : 110000;
const printCost   = Math.round(G.members.length * 500);
const stageCost   = G.diff==='easy' ? 15000  : G.diff==='mid' ? 25000  : 40000;
const totalCost   = venueCost + printCost + stageCost;
// 収入：チケット収益（演奏力・士気・部員数で集客が変わる）
const baseAudience = G.diff==='easy' ? 80 : G.diff==='mid' ? 150 : 250;
const skillBonus   = Math.round((G.skill - 40) * 1.2);  // 演奏力が高いほど集客↑
const moraleBonus  = Math.round((G.morale - 50) * 0.8); // 士気も影響
const memberBonus  = Math.round(G.members.length * 0.5);// 部員の家族・友人
const audience     = Math.max(20, baseAudience + skillBonus + moraleBonus + memberBonus + rnd(-20,30));
const ticketPrice  = G.diff==='easy' ? 600 : G.diff==='mid' ? 800 : 1200;
const ticketIncome = audience * ticketPrice;
const netBalance   = ticketIncome - totalCost;
G.funds += netBalance;
if(G.funds < 0) G.funds = 0;
// 演奏評価
const success = G.morale > 60 && G.skill > 50;
const packed  = audience > baseAudience * 1.3;
if(success && packed){
  applyAll(G,{morale:12,ens:6,skill:3});
  showEventPopup('🎭','定期演奏会大成功！',
    `満員${audience}人の観客の前でスタンディングオベーション！
収支：${netBalance>=0?'+':''}${netBalance.toLocaleString()}円（入場${ticketIncome.toLocaleString()}円 / 経費${totalCost.toLocaleString()}円）`,'var(--gold)');
  addLog(`定期演奏会大成功！観客${audience}人 収支${netBalance>=0?'+':''}${netBalance.toLocaleString()}円`,'資金');
} else if(success){
  applyAll(G,{morale:7,ens:4,skill:2});
  showEventPopup('🎭','定期演奏会 好評',
    `${audience}人が来場。温かい拍手をもらえた。
収支：${netBalance>=0?'+':''}${netBalance.toLocaleString()}円（入場${ticketIncome.toLocaleString()}円 / 経費${totalCost.toLocaleString()}円）`,'var(--teal)');
  addLog(`定期演奏会好評。観客${audience}人 収支${netBalance>=0?'+':''}${netBalance.toLocaleString()}円`,'資金');
} else {
  applyAll(G,{morale:2,ens:2});
  showEventPopup('🎭','定期演奏会',
    `${audience}人が来場。課題の残る演奏になった。
収支：${netBalance>=0?'+':''}${netBalance.toLocaleString()}円（入場${ticketIncome.toLocaleString()}円 / 経費${totalCost.toLocaleString()}円）`,netBalance<0?'var(--red)':'var(--ink3)');
  addLog(`定期演奏会終了。観客${audience}人 収支${netBalance>=0?'+':''}${netBalance.toLocaleString()}円`,'資金');
  if(netBalance < 0) addLog('定期演奏会が赤字になりました。来年は早めにチケット販売を！','資金');
}
// 資金不足で公演ができないケース
if(G.funds <= 0){
  G.members.forEach(m=>m.morale=cap(m.morale-rnd(3,6)));
  addLog('資金が底をつきました。部費の見直しを検討してください。','資金');
}
}
function monthEvent12(){
showEventPopup('🎄','年末発表会',
'年末の発表会を行い、1年間の練習の成果を披露した。3年生への感謝も込めた演奏になった。','var(--green)');
applyAll(G,{morale:5});
}
function monthEvent1(){
const score=rnd(50,95);
const result=score>=80?'金賞':score>=65?'銀賞':score>=50?'銅賞':'入賞なし';
const cls=result==='金賞'?'var(--gold)':result==='銀賞'?'#888':result==='銅賞'?'var(--amber)':'var(--ink3)';
showEventPopup(result==='金賞'?'🏆':'🎶',
`アンサンブルコンテスト本選：${result}`,
`小編成チームが本選で演奏した。スコア${score}点。部員それぞれが個人技を磨く良い経験になった。`,cls);
applyAll(G,{ens:5,morale:result==='金賞'?10:result==='銀賞'?4:-2});
addLog(`アンサンブルコンテスト：${result}（${score}点）`,'コンクール');
}
function monthEvent2(){
const grad3=G.members.filter(m=>m.grade===3);
if(grad3.length>0){
showEventPopup('🌸','3年生送別演奏会',
`${grad3.map(m=>m.name).slice(0,3).join('、')}など${grad3.length}名の3年生への感謝を込めた演奏会が開かれた。涙あり笑いありの感動的な会になった。`,'var(--rose)');
applyAll(G,{morale:8});
addLog(`3年生${grad3.length}名の送別演奏会。感動の一幕。`,'イベント');
}
}
function monthEvent3(){
const grad3=G.members.filter(m=>m.grade===3);
if(grad3.length>0){
showEventPopup('🎓','卒業式演奏',
`卒業式で在校生として演奏し、${grad3.length}名の先輩を送り出した。来年こそ全国へ、という誓いが新たになった。`,'var(--gold)');
addLog(`卒業式演奏。${grad3.length}名の先輩を送り出した。`,'イベント');
}
}
async function generatePiecesEvent(){
await new Promise(resolve=>{
showEventPopup('🎼','課題曲・自由曲の選定',
'6月、コンクールの課題曲が発表された。自由曲とともに今年の演奏プログラムを決定する。曲目を生成しています…','var(--blue)');
const okBtn=document.querySelector('#ev-popup .btn');
if(okBtn){okBtn.disabled=true;okBtn.textContent='生成中...';}
generateKaDaiKyoku().then(()=>{
if(okBtn){okBtn.disabled=false;okBtn.textContent='OK';}
resolve();
});
});
}
async function generateJiyuKyoku(){
if(G.kaDaiKyoku) return;
G.kaDaiKyoku={kadai:[], jiyu:null};
await generateKaDaiKyoku();
}
async function generateKaDaiKyoku(){
const loadingEl=document.getElementById('ev-body');
try{
const prompt=`吹奏楽コンクールの課題曲と自由曲を生成してください。
学校：${G.school}（${DIFF[G.diff].label}、${G.year}年目）
編成：${G.division==='large'?'大編成（60人規模）':'中編成（35人規模）'}
技術力：${G.skill}/100
以下の形式でJSONのみを返してください（前後の説明不要）：
{
"kadai": [
{"number": "課題曲I",   "title": "曲名（架空）", "difficulty": 3, "style": "明るいマーチ風",       "trait": "solo",      "traitLabel": "ソロ重視",    "traitDesc": "個人技が問われる特性の説明", "scoreWeight": {"skill":0.50,"ensemble":0.20,"song":0.20,"morale":0.10}, "desc": "曲の特徴2文"},
{"number": "課題曲II",  "title": "曲名（架空）", "difficulty": 4, "style": "叙情的な歌謡曲風",     "trait": "ensemble",  "traitLabel": "バンド力重視", "traitDesc": "アンサンブルが鍵の説明",   "scoreWeight": {"skill":0.25,"ensemble":0.50,"song":0.15,"morale":0.10}, "desc": "曲の特徴2文"},
{"number": "課題曲III", "title": "曲名（架空）", "difficulty": 4, "style": "勇壮なコンサートマーチ", "trait": "stamina",   "traitLabel": "スタミナ重視", "traitDesc": "体力が問われる特性の説明",   "scoreWeight": {"skill":0.30,"ensemble":0.25,"song":0.25,"morale":0.20}, "desc": "曲の特徴2文"},
{"number": "課題曲IV",  "title": "曲名（架空）", "difficulty": 5, "style": "現代的なコンサートピース","trait": "technical", "traitLabel": "高難度",      "traitDesc": "技術力が問われる特性の説明",   "scoreWeight": {"skill":0.55,"ensemble":0.25,"song":0.15,"morale":0.05}, "desc": "曲の特徴2文"}
],
"jiyu": [
{"title": "自由曲タイトル1（架空）", "difficulty": ${Math.min(5,Math.ceil(G.skill/20)+1)}, "composer": "架空の作曲者名", "trait": "特性キー", "traitLabel": "特性ラベル", "traitDesc": "特性の説明1文", "scoreWeight": {"skill":0.35,"ensemble":0.30,"song":0.25,"morale":0.10}, "desc": "自由曲の特徴2文"},
{"title": "自由曲タイトル2（架空）", "difficulty": ${Math.max(2,Math.ceil(G.skill/20)-1)}, "composer": "架空の作曲者名", "trait": "特性キー", "traitLabel": "特性ラベル", "traitDesc": "特性の説明1文", "scoreWeight": {"skill":0.35,"ensemble":0.30,"song":0.25,"morale":0.10}, "desc": "自由曲の特徴2文"}
]
}
difficultyは2〜5の整数。4曲の難易度は必ず全て異なる値（2,3,4,5をそれぞれ1回ずつ使用）にしてください。どの特性の曲が難しいかは年によって変わります。曲名は日本語または英語で、実在しない架空の曲名。`;
const res=await fetch('https://api.anthropic.com/v1/messages',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,messages:[{role:'user',content:prompt}]})
});
const data=await res.json();
const text=data.content.map(b=>b.text||'').join('').trim();
const jsonStr=text.replace(/```json|```/g,'').trim();
const parsed=JSON.parse(jsonStr);
G.kaDaiKyoku=parsed;
showKaDaiKyokuModal(parsed);
} catch(e){
// 難易度をシャッフル（毎年ランダムに割り当て）
const _diffs=[2,3,4,5]; // 易〜難の4段階をシャッフル
for(let i=_diffs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[_diffs[i],_diffs[j]]=[_diffs[j],_diffs[i]];}
G.kaDaiKyoku={
kadai:[
{number:'課題曲I',   title:'大空への序曲',       difficulty:_diffs[0],style:'明るいマーチ',
 trait:'solo',    traitLabel:'ソロ重視',    traitDesc:'木管・金管のソロが多く個人技が光る。個々の演奏力が問われる。',
 scoreWeight:{skill:0.50,ensemble:0.20,song:0.20,morale:0.10},
 desc:'軽快なリズムが特徴的なマーチ。木管楽器の華やかなソロが聴き所。'},
{number:'課題曲II',  title:'青い風の詩',          difficulty:_diffs[1],style:'抒情的な歌謡風',
 trait:'ensemble', traitLabel:'バンド力重視', traitDesc:'全体のハーモニーとブレンドが鍵。アンサンブル力が高いほど有利。',
 scoreWeight:{skill:0.25,ensemble:0.50,song:0.15,morale:0.10},
 desc:'ゆったりとした旋律が美しい叙情曲。フルートとオーボエが際立つ。'},
{number:'課題曲III', title:'光の凱旋',            difficulty:_diffs[2],style:'勇壮なコンサートマーチ',
 trait:'stamina',  traitLabel:'スタミナ重視', traitDesc:'テンポが速く体力を消耗する。スタミナの高い部員が多いほど有利。',
 scoreWeight:{skill:0.30,ensemble:0.25,song:0.25,morale:0.20},
 desc:'金管の力強さと打楽器の存在感が映えるダイナミックな作品。'},
{number:'課題曲IV',  title:'彼方への飛翔',        difficulty:_diffs[3],style:'現代的コンサートピース',
 trait:'technical', traitLabel:'高難度',     traitDesc:'変拍子・複雑な和声が特徴。技術力が高いほど大きな加点が得られる。',
 scoreWeight:{skill:0.55,ensemble:0.25,song:0.15,morale:0.05},
 desc:'変拍子と複雑なハーモニーが特徴。上級者向けの挑戦的な作品。'},
],
jiyu:[
  {title:'大地の詩〜輝ける明日へ', difficulty:Math.min(5,Math.ceil(G.skill/20)+1), composer:'架空 太郎',
   ...pickJiyuTraits()[0],
   desc:'雄大な自然をテーマにした管弦楽的スケールの大曲。冒頭の打楽器のソロから全奏へ。終盤に向けてクライマックスを迎える。'},
  {title:'暁の空へ〜希望の序曲',   difficulty:Math.max(2,Math.ceil(G.skill/20)-1), composer:'星野 幻想',
   ...pickJiyuTraits()[1],
   desc:'夜明けをテーマにした叙情的な作品。木管の柔らかな旋律から始まり、全奏の輝かしいフィナーレで締めくくる。'}
]
};
showKaDaiKyokuModal(G.kaDaiKyoku);
}
}
function showKaDaiKyokuModal(data){
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const kadaiHtml=(data.kadai||[]).map(k=>`
<div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:6px">
<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
<div>
<span style="font-size:10px;color:var(--ink3)">${k.number}</span>
<div style="font-family:var(--serif);font-size:14px;font-weight:700">${k.title}</div>
<div style="font-size:10px;color:var(--teal)">${k.style}</div>
</div>
<div style="font-size:11px;color:var(--gold);flex-shrink:0">${stars(k.difficulty||3)}</div>
</div>
<div style="font-size:11px;color:var(--ink2)">${k.desc}</div>
</div>`).join('');
const jiyuArr=Array.isArray(data.jiyu)?data.jiyu:(data.jiyu?[data.jiyu]:[]);
const traitIconJ={dramatic:'🎭',technical:'⚡',lyrical:'🎵',rhythmic:'🥁',stamina:'💪',ensemble:'🎶',solo:'🎷',modern:'🔬'};
const traitColJ ={dramatic:'var(--rose)',technical:'var(--red)',lyrical:'var(--teal)',rhythmic:'var(--amber)',stamina:'var(--green)',ensemble:'var(--blue)',solo:'var(--teal)',modern:'var(--rose)'};
const jiyuHtml=jiyuArr.length?`
<div style="margin-top:10px;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:6px">🎼 自由曲（2曲から選択）</div>
${jiyuArr.map((j,i)=>{
  const col=traitColJ[j.trait]||'var(--gold)';
  const w=j.scoreWeight||{skill:0.35,ensemble:0.30,song:0.25,morale:0.10};
  const fit=Math.round(G.skill*(w.skill||0.35)+G.ensemble*(w.ensemble||0.30)+G.song*(w.song||0.25)+G.morale*(w.morale||0.10));
  const fitLabel=fit>=75?'◎ 得意':fit>=60?'○ 合う':fit>=45?'△ やや難':'✗ 苦手';
  const fitCol=fit>=75?'var(--green)':fit>=60?'var(--teal)':fit>=45?'var(--amber)':'var(--red)';
  return `<div style="background:var(--gold3);border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;margin-bottom:7px;cursor:pointer;transition:all .15s"
    onclick="selectJiyu(${i})" id="jiyu-opt-${i}"
    onmouseover="this.style.borderColor='${col}'" onmouseout="this.style.borderColor='var(--border)'">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
      <div>
        <div style="font-family:var(--serif);font-size:14px;font-weight:800">${j.title}</div>
        <div style="font-size:10px;color:var(--ink3)">作曲：${j.composer||'—'}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:11px;color:var(--gold)">${stars(j.difficulty||3)}</div>
        <div style="font-size:11px;color:${fitCol};font-weight:700">${fitLabel}（${fit}点）</div>
      </div>
    </div>
    <div style="display:inline-block;background:${col}22;border:1px solid ${col};border-radius:5px;padding:1px 7px;font-size:10px;font-weight:700;color:${col};margin-bottom:4px">
      ${traitIconJ[j.trait]||'🎼'} ${j.traitLabel||''}
    </div>
    <div style="font-size:10px;color:var(--ink3);margin-bottom:3px">${j.traitDesc||''}</div>
    <div style="font-size:11px;color:var(--ink2)">${j.desc}</div>
  </div>`;
}).join('')}`:'';
// 課題曲選択UI生成
const traitIcon={solo:'🎷',ensemble:'🎶',stamina:'💪',technical:'⚡'};
const traitCol ={solo:'var(--teal)',ensemble:'var(--blue)',stamina:'var(--green)',technical:'var(--rose)'};
const kadaiSelectHtml=(data.kadai||[]).map((k,i)=>{
  const w=k.scoreWeight||{skill:0.35,ensemble:0.35,song:0.20,morale:0.10};
  // 部の現状との相性を計算
  const avgStamina=G.members.length?Math.round(G.members.reduce((a,m)=>a+m.stamina,0)/G.members.length):50;
  const fit = Math.round(G.skill*w.skill + G.ensemble*w.ensemble + G.song*w.song + G.morale*w.morale
    + (k.trait==='stamina' ? (avgStamina-50)*0.3 : 0));
  const fitLabel = fit>=75?'◎ 得意':fit>=60?'○ 合う':fit>=45?'△ やや難':'✗ 苦手';
  const fitCol   = fit>=75?'var(--green)':fit>=60?'var(--teal)':fit>=45?'var(--amber)':'var(--red)';
  const diffStars='★'.repeat(k.difficulty||3)+'☆'.repeat(5-(k.difficulty||3));
  const col=traitCol[k.trait]||'var(--ink3)';
  return `<div style="background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;margin-bottom:7px;cursor:pointer;transition:all .15s"
    onclick="selectKadai(${i})" id="kadai-opt-${i}"
    onmouseover="this.style.borderColor='${col}'" onmouseout="this.style.borderColor='var(--border)'">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
      <div>
        <span style="font-size:10px;color:var(--ink3)">${k.number}</span>
        <div style="font-family:var(--serif);font-size:14px;font-weight:700">${k.title}</div>
        <div style="font-size:10px;color:var(--teal)">${k.style}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:11px;color:var(--gold)">${diffStars}</div>
        <div style="font-size:11px;color:${fitCol};font-weight:700">${fitLabel}（${fit}点）</div>
      </div>
    </div>
    <div style="display:inline-block;background:${col}22;border:1px solid ${col};border-radius:5px;padding:1px 7px;font-size:10px;font-weight:700;color:${col};margin-bottom:4px">
      ${traitIcon[k.trait]||'🎵'} ${k.traitLabel||''}
    </div>
    <div style="font-size:10px;color:var(--ink3);margin-bottom:3px">${k.traitDesc||''}</div>
    <div style="font-size:11px;color:var(--ink2)">${k.desc}</div>
  </div>`;
}).join('');
document.getElementById('comp-result-body').innerHTML=`
<div style="text-align:left;padding:4px 0">
<div style="font-family:var(--serif);font-size:18px;font-weight:800;margin-bottom:4px;text-align:center">🎼 課題曲を選んでください</div>
<div style="font-size:11px;color:var(--ink3);text-align:center;margin-bottom:12px">${G.year}年度 ／ 4曲から1曲を選択</div>
${kadaiSelectHtml}
${jiyuHtml}
<div style="margin-top:10px;font-size:10px;color:var(--ink3)">※「得意」な曲を選ぶとスコアに有利。難しい曲は成功すれば高評価。</div>
</div>`;
document.getElementById('ov-comp').classList.add('show');
// 選択ボタンを非表示（選曲するまで閉じられない）
const okBtn=document.querySelector('#ov-comp .btn');
if(okBtn) okBtn.style.display='none';
}
function selectKadai(idx){
const k=G.kaDaiKyoku.kadai[idx];
if(!k) return;
G.kaDaiKyoku.selectedKadai=k;
// 選択したことを視覚的に反映
document.querySelectorAll('[id^="kadai-opt-"]').forEach((el,i)=>{
  el.style.opacity=i===idx?'1':'0.4';
  el.style.borderColor=i===idx?'var(--gold)':'var(--border)';
  if(i===idx) el.style.background='var(--gold3)';
});
// OKボタンを表示
const okBtn=document.querySelector('#ov-comp .btn');
if(okBtn){okBtn.style.display='';okBtn.textContent=`「${k.title}」で決定`;}
addLog(`課題曲「${k.title}」（${k.traitLabel}）を選択した。`,'システム');
notif('課題曲決定',`「${k.title}」を選択しました`);
// 両方選択済みならOKボタンを有効化
checkBothSelected();
}
function selectJiyu(idx){
const jiyuArr=Array.isArray(G.kaDaiKyoku.jiyu)?G.kaDaiKyoku.jiyu:[G.kaDaiKyoku.jiyu];
const j=jiyuArr[idx];
if(!j) return;
G.kaDaiKyoku.selectedJiyu=j;
document.querySelectorAll('[id^="jiyu-opt-"]').forEach((el,i)=>{
  el.style.opacity=i===idx?'1':'0.4';
  el.style.borderColor=i===idx?'var(--gold)':'var(--border)';
  if(i===idx) el.style.background='var(--gold3)';
  else el.style.background='';
});
addLog(`自由曲「${j.title}」（${j.traitLabel}）を選択した。`,'システム');
notif('自由曲決定',`「${j.title}」を選択しました`);
checkBothSelected();
}
function checkBothSelected(){
const kadaiOk=!!G.kaDaiKyoku?.selectedKadai;
const jiyuOk=!!G.kaDaiKyoku?.selectedJiyu;
const okBtn=document.querySelector('#ov-comp .btn');
if(!okBtn) return;
if(kadaiOk&&jiyuOk){
  const k=G.kaDaiKyoku.selectedKadai;
  const j=G.kaDaiKyoku.selectedJiyu;
  okBtn.style.display='';
  okBtn.textContent=`「${k.title}」×「${j.title}」で決定`;
} else if(kadaiOk){
  okBtn.style.display='';
  okBtn.textContent='自由曲も選んでください';
  okBtn.disabled=true;
  setTimeout(()=>{if(okBtn)okBtn.disabled=false;},100);
}
}
function openDivisionModal(){
const cnt=G.members.length;
document.getElementById('div-mid-count').innerHTML=
`<span style="color:${cnt<=35?'var(--teal)':'var(--red)'}">${cnt}人 → ${cnt<=35?'✓ 規定内':'⚠ 規定超過'}</span>`;
document.getElementById('div-large-count').innerHTML=
`<span style="color:${cnt>=55?'var(--blue)':'var(--amber)'}">${cnt}人 → ${cnt>=55?'✓ 規定内':'⚠ 人数不足（ペナルティあり）'}</span>`;
document.getElementById('ov-division').classList.add('show');
}
function chooseDivision(div){
G.division=div;
G.divisionChosen=true;
setupCompSchedule();
closeModal('ov-division');
const label=div==='large'?'大編成（全国大会ルート）':'中編成（東日本大会ルート）';
addLog(`今年度の編成を「${label}」に決定した`,'システム');
notif('編成決定',label);
renderAll();
}
function renderDivisionStatus(){
const el=document.getElementById('division-status');
if(!el) return;
if(!G.divisionChosen){
el.innerHTML=`<div style="color:var(--amber);font-weight:700">⚠ まだ編成が選択されていません</div>
<div style="font-size:11px;color:var(--ink3);margin-top:4px">4月中に選択してください</div>
<button class="btn btn-sm btn-gold" style="margin-top:8px" onclick="openDivisionModal()">編成を選択する</button>`;
} else {
const div=G.division==='large'?'🎺 大編成（全国大会ルート）':'🎻 中編成（東日本大会ルート）';
const req=G.division==='large'?55:35;
const cnt=G.members.length;
el.innerHTML=`<div style="font-size:14px;font-weight:700;margin-bottom:4px">${div}</div>
<div style="font-size:11px;color:${cnt>=req?'var(--green)':'var(--red)'}">現在 ${cnt}人 / 規定 ${req}人以上</div>`;
}
}
function renderDuesInfo(){
const el=document.getElementById('dues-info');
if(!el) return;
const cfg=DIFF[G.diff];
const income=G.dues*G.members.length;
const expense=cfg.monthlyFixed;
const balance=income-expense;
el.innerHTML=`
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
<div style="background:var(--bg);border-radius:7px;padding:8px 10px">
<div style="font-size:10px;color:var(--ink3)">月額部費（1人）</div>
<div style="font-size:16px;font-weight:700;color:var(--ink)">${G.dues.toLocaleString()}円</div>
</div>
<div style="background:var(--bg);border-radius:7px;padding:8px 10px">
<div style="font-size:10px;color:var(--ink3)">月次収支</div>
<div style="font-size:16px;font-weight:700;color:${balance>=0?'var(--green)':'var(--red)'}">${balance>=0?'+':''}${balance.toLocaleString()}円</div>
</div>
</div>
<div style="font-size:10px;color:var(--ink3)">部費収入：${income.toLocaleString()}円 ／ 固定費：${expense.toLocaleString()}円</div>
${G.parentAnger>0?`<div style="margin-top:6px;font-size:11px;color:var(--red)">⚠ 保護者の不満：${G.parentAnger}/100</div>`:''}`;
}
function openDuesModal(){
const cfg=DIFF[G.diff];
const options=[
{label:'大幅値下げ（−1,000円）', delta:-1000, reaction:'保護者の満足度が上がります'},
{label:'値下げ（−500円）',        delta:-500,  reaction:'保護者が少し喜びます'},
{label:'現状維持',                delta:0,     reaction:'変更なし'},
{label:'値上げ（+500円）',        delta:+500,  reaction:cfg.parentReaction>0.5?'保護者の反発が予想されます':'保護者は理解してくれそうです'},
{label:'大幅値上げ（+1,000円）', delta:+1000, reaction:'保護者の強い反発が予想されます'},
{label:'大幅値上げ（+2,000円）', delta:+2000, reaction:'保護者が激怒する可能性があります'},
];
document.getElementById('dues-body').innerHTML=`
<div style="font-size:12px;color:var(--ink2);margin-bottom:10px">
現在の部費：<strong>${G.dues.toLocaleString()}円/月</strong><br>
${cfg.diffNote}
</div>
${options.map(o=>`
<div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">
<div>
<div style="font-size:12px;font-weight:700">${o.label}</div>
<div style="font-size:10px;color:var(--ink3);margin-top:2px">${o.reaction}</div>
</div>
<button class="btn btn-sm ${o.delta>0?'btn-gold':o.delta<0?'btn-green':''}" onclick="applyDues(${o.delta})">${o.delta===0?'このまま':'変更する'}</button>
</div>`).join('')}`;
document.getElementById('ov-dues').classList.add('show');
}
function applyDues(delta){
if(delta===0){closeModal('ov-dues');return;}
const cfg=DIFF[G.diff];
const newDues=Math.max(500,G.dues+delta);
G.dues=newDues;
if(delta>0){
const angerRoll=Math.random();
const angered=angerRoll<cfg.parentReaction;
if(angered){
const anger=Math.round(delta/500*20*cfg.parentReaction);
G.parentAnger=Math.min(100,G.parentAnger+anger);
const moralePenalty=Math.round(anger*0.4);
G.members.forEach(m=>m.morale=Math.max(20,m.morale-moralePenalty));
showEventPopup('😠','保護者から反発',
`部費の値上げに保護者から強い反発がありました。部員の士気が下がっています。`,
'var(--red)');
addLog(`部費を${newDues.toLocaleString()}円に値上げ → 保護者反発（怒り度+${anger}）`,'資金');
} else {
addLog(`部費を${newDues.toLocaleString()}円に値上げ → 保護者は理解`,'資金');
notif('部費改定',`${newDues.toLocaleString()}円に変更しました`);
}
} else {
G.parentAnger=Math.max(0,G.parentAnger-15);
G.members.forEach(m=>m.morale=Math.min(100,m.morale+3));
addLog(`部費を${newDues.toLocaleString()}円に値下げ → 保護者好感`,'資金');
notif('部費改定',`${newDues.toLocaleString()}円に変更しました`);
}
closeModal('ov-dues');
renderAll();
}
function triggerConflictEvent(){
const conflicts=[
{title:'パート内で対立が発生',body:'メンバー間で練習方針を巡る対立が激化。チームワークに影響が出ている。'},
{title:'先輩・後輩のトラブル',body:'上下関係のトラブルが発生。部の雰囲気が重苦しくなっている。'},
{title:'パートリーダー交代劇',body:'パートリーダーの選出を巡って部員間に亀裂が入った。'},
];
const ev=pick(conflicts);
G.members.forEach(m=>m.morale=Math.max(20,m.morale-rnd(5,12)));
showEventPopup('⚡',ev.title,ev.body,'var(--red)');
addLog(ev.title,'いざこざ');
}
function triggerAuditEvent(){
if(!G.auditPending) return;
G.auditPending=false;
const sorted=[...G.members].sort((a,b)=>b.skill-a.skill);
const cutLine=Math.floor(sorted.length*0.8);
sorted.slice(0,cutLine).forEach(m=>m.morale=Math.min(100,m.morale+8));
sorted.slice(cutLine).forEach(m=>m.morale=Math.max(10,m.morale-15));
G.conflictActive=false;
showEventPopup('🎯','パートオーディション実施',
'レギュラー争いのオーディションが行われました。選ばれた部員は奮起し、外れた部員は落ち込んでいます。',
'var(--amber)');
addLog('パートオーディション実施 → 士気に明暗','イベント');
recalc(); renderAll();
}
function checkAchievements(){
if(G.members.length>=50) G.achievements.members50=true;
if(G.skill>=80)          G.achievements.skill80=true;
}

// ================================================================
// セーブ・ロード機能
// ================================================================
const SAVE_KEY='suisougaku_save';
const SAVE_SLOTS=3;

function getSaveSlots(){
  const slots=[];
  for(let i=0;i<SAVE_SLOTS;i++){
    const raw=localStorage.getItem(SAVE_KEY+'_'+i);
    slots.push(raw?JSON.parse(raw):null);
  }
  return slots;
}

function saveGame(slot){
  const saveData={
    version:1,
    savedAt:new Date().toLocaleString('ja-JP'),
    school:G.school, year:G.year, month:G.month, week:G.week,
    diff:G.diff, division:G.division, divisionChosen:G.divisionChosen,
    skill:G.skill, ensemble:G.ensemble, song:G.song, morale:G.morale,
    funds:G.funds, dues:G.dues, parentAnger:G.parentAnger,
    members:G.members, captain:G.captain, execs:G.execs,
    advisor:G.advisor, kaDaiKyoku:G.kaDaiKyoku,
    kadaiParams:G.kadaiParams||null, jiyuParams:G.jiyuParams||null,
    compSchedule:G.compSchedule, compHistory:G.compHistory,
    achievements:G.achievements, pracHistory:G.pracHistory,
    songBoredom:G.songBoredom, sectionalDebt:G.sectionalDebt,
    conflictActive:G.conflictActive, shirkerIds:G.shirkerIds,
    log:(G.log||[]).slice(-50), // 直近50件のみ保存
  };
  localStorage.setItem(SAVE_KEY+'_'+slot, JSON.stringify(saveData));
  notif('セーブ完了',`スロット${slot+1}に保存しました（${saveData.savedAt}）`);
  renderSaveModal();
}

function loadGame(slot){
  const raw=localStorage.getItem(SAVE_KEY+'_'+slot);
  if(!raw){notif('エラー','セーブデータがありません');return;}
  const d=JSON.parse(raw);
  Object.assign(G,{
    school:d.school, year:d.year, month:d.month, week:d.week,
    diff:d.diff, division:d.division, divisionChosen:d.divisionChosen,
    skill:d.skill, ensemble:d.ensemble, song:d.song, morale:d.morale,
    funds:d.funds, dues:d.dues, parentAnger:d.parentAnger||0,
    members:d.members, captain:d.captain, execs:d.execs||[],
    advisor:d.advisor, kaDaiKyoku:d.kaDaiKyoku,
    kadaiParams:d.kadaiParams||newSongParams(0),
    jiyuParams:d.jiyuParams||newSongParams(0),
    compSchedule:d.compSchedule||[], compHistory:d.compHistory||[],
    achievements:d.achievements||{}, pracHistory:d.pracHistory||[],
    songBoredom:d.songBoredom||0, sectionalDebt:d.sectionalDebt||0,
    conflictActive:d.conflictActive||false, shirkerIds:d.shirkerIds||[],
    log:d.log||[],
  });
  closeModal('ov-save');
  showView('v-game');
  showScr('overview',null);
  recalc();
  renderAll();
  notif('ロード完了',`${d.school} ${d.year}年目をロードしました`);
}

function deleteSave(slot){
  localStorage.removeItem(SAVE_KEY+'_'+slot);
  notif('削除完了',`スロット${slot+1}のデータを削除しました`);
  renderSaveModal();
}

function renderSaveModal(){
  const slots=getSaveSlots();
  const inGame=document.getElementById('v-game').classList.contains('active');
  document.getElementById('save-slots').innerHTML=slots.map((s,i)=>`
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div style="font-weight:700;font-size:13px">スロット ${i+1}</div>
        <div style="display:flex;gap:6px">
          ${inGame?`<button class="btn btn-sm btn-gold" onclick="saveGame(${i})">上書き保存</button>`:''}
          ${s?`<button class="btn btn-sm" onclick="loadGame(${i})">ロード</button>`:''}
          ${s?`<button class="btn btn-sm" style="color:var(--red)" onclick="deleteSave(${i})">削除</button>`:''}
        </div>
      </div>
      ${s?`
        <div style="font-size:12px;color:var(--ink2)">${s.school}　${s.year}年目 ${s.month}月</div>
        <div style="font-size:11px;color:var(--ink3);margin-top:2px">技術:${s.skill} 士気:${s.morale} 資金:${(s.funds||0).toLocaleString()}円</div>
        <div style="font-size:10px;color:var(--ink4);margin-top:2px">保存日時：${s.savedAt}</div>
      `:`<div style="font-size:12px;color:var(--ink4)">データなし</div>`}
    </div>
  `).join('');
}

function openSaveModal(){
  renderSaveModal();
  document.getElementById('ov-save').classList.add('show');
}

// ================================================================
// 五角形レーダーチャート描画
// ================================================================
function drawRadarChart(svgId, params, color='#2a5fa8'){
  const svg = document.getElementById(svgId);
  if(!svg || !params) return;
  const cx=100, cy=100, r=75;
  const keys=['pitch','rhythm','tempo','expression','balance'];
  const labels=['音程','リズム','テンポ','表現','バランス'];
  const N=keys.length;
  // 頂点座標（上から時計回り）
  const pts = keys.map((_,i)=>{
    const angle = (Math.PI*2*i/N) - Math.PI/2;
    return {
      x: cx + r*Math.cos(angle),
      y: cy + r*Math.sin(angle),
      lx: cx + (r+18)*Math.cos(angle),
      ly: cy + (r+18)*Math.sin(angle),
    };
  });
  // 値の座標
  const vals = keys.map((k,i)=>{
    const v = Math.max(0,Math.min(100,params[k]||0));
    const angle = (Math.PI*2*i/N) - Math.PI/2;
    return {
      x: cx + (r*v/100)*Math.cos(angle),
      y: cy + (r*v/100)*Math.sin(angle),
      v,
    };
  });
  // グリッド線（20%刻み）
  let grid='';
  [20,40,60,80,100].forEach(pct=>{
    const gPts=keys.map((_,i)=>{
      const angle=(Math.PI*2*i/N)-Math.PI/2;
      return `${cx+r*(pct/100)*Math.cos(angle)},${cy+r*(pct/100)*Math.sin(angle)}`;
    }).join(' ');
    grid+=`<polygon points="${gPts}" fill="none" stroke="var(--border)" stroke-width="0.8"/>`;
  });
  // 軸線
  const axes=pts.map(p=>`<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="var(--border)" stroke-width="0.8"/>`).join('');
  // データ多角形
  const poly=vals.map(v=>`${v.x},${v.y}`).join(' ');
  const hexColor=color;
  // ラベル
  const lbls=pts.map((p,i)=>{
    const v=vals[i].v;
    const anchor=p.lx<cx-5?'end':p.lx>cx+5?'start':'middle';
    return `<text x="${p.lx.toFixed(1)}" y="${(p.ly+4).toFixed(1)}" text-anchor="${anchor}" font-size="9" fill="var(--ink2)">${labels[i]}</text>
<text x="${p.lx.toFixed(1)}" y="${(p.ly+13).toFixed(1)}" text-anchor="${anchor}" font-size="8" fill="${hexColor}" font-weight="700">${v}</text>`;
  }).join('');
  svg.innerHTML=`${grid}${axes}
<polygon points="${poly}" fill="${hexColor}" fill-opacity="0.18" stroke="${hexColor}" stroke-width="2"/>
${lbls}`;
}

function renderSongRadars(){
  if(!G.kaDaiKyoku) return;
  const kadaiEl=document.getElementById('radar-kadai');
  const jiyuEl =document.getElementById('radar-jiyu');
  if(kadaiEl&&G.kaDaiKyoku.selectedKadai){
    drawRadarChart('radar-kadai-svg', G.kadaiParams, '#2a5fa8');
    kadaiEl.style.display='block';
    document.getElementById('radar-kadai-title').textContent=
      `課題曲「${G.kaDaiKyoku.selectedKadai.title}」`;
    document.getElementById('radar-kadai-avg').textContent=songAvg(G.kadaiParams);
  }
  if(jiyuEl&&G.kaDaiKyoku.selectedJiyu){
    drawRadarChart('radar-jiyu-svg', G.jiyuParams, '#1a8070');
    jiyuEl.style.display='block';
    document.getElementById('radar-jiyu-title').textContent=
      `自由曲「${G.kaDaiKyoku.selectedJiyu.title}」`;
    document.getElementById('radar-jiyu-avg').textContent=songAvg(G.jiyuParams);
  }
}
function showView(id){
document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
document.getElementById(id).classList.add('active');
const inGame=id==='v-game';
const mn=document.getElementById('mob-nav');
const fab=document.getElementById('mob-fab');
if(mn)  mn.classList.toggle('in-game', inGame);
if(fab) fab.classList.toggle('in-game', inGame);
}
function showScr(id,btn){
document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
document.getElementById('scr-'+id).classList.add('active');
document.querySelectorAll('.gnav-btn').forEach(b=>b.classList.remove('act'));
if(btn) btn.classList.add('act');
const isMob=window.innerWidth<=767;
const mml=document.getElementById('mob-member-list');
const mtd=document.querySelector('.mtbl-desktop');
if(mml) mml.style.display=(id==='members'&&isMob)?'block':'none';
if(mtd) mtd.style.display=(id==='members'&&!isMob)?'block':'none';
}
function mobNav(id,btn){
showScr(id,null);
document.querySelectorAll('.mob-nav-btn').forEach(b=>b.classList.remove('act'));
if(btn) btn.classList.add('act');
const desktopBtn=document.querySelector(`.gnav-btn[onclick*="${id}"]`);
if(desktopBtn){document.querySelectorAll('.gnav-btn').forEach(b=>b.classList.remove('act'));desktopBtn.classList.add('act');}
}
function closeModal(id){document.getElementById(id).classList.remove('show');}
let _nt;
function notif(title,body){clearTimeout(_nt);document.getElementById('notif-title').textContent=title;document.getElementById('notif-body').textContent=body;document.getElementById('notif').classList.add('show');_nt=setTimeout(()=>document.getElementById('notif').classList.remove('show'),3200);}
