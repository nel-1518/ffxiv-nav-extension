// ==UserScript==
// @name         FF14 官网导航
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在官网/石之家/NGA 增加导航按钮，方便访问 FF14 国服官网的各个链接，也可以进行自定义收藏常用链接。
// @author       Nel
// @match        *://ff.web.sdo.com/web8/*
// @match        *://ff14risingstones.web.sdo.com/*
// @match        *://ngabbs.com/*
// @match        *://bbs.nga.cn/*
// @match        *://nga.178.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      cqnews.web.sdo.com
// ==/UserScript==

(function () {
  'use strict';

  const BTN_TEXT = 'FF14 官网导航';

  // ============================================================
  // 链接分类配置
  // ============================================================
  const linkCategories = [
    {
      title: '消费充值', icon: '💰',
      links: [
        { name: '游戏充值', url: 'https://pay.sdo.com/item/GWPAY-100001900' },
        { name: '道具商城', url: 'https://qu.sdo.com/tools-shop?merchantId=1' },
        { name: '道具仓库', url: 'https://qu.sdo.com/personal-center?merchantId=1#itemindex-100001900-1' },
        { name: '周边商城', url: 'https://qu.sdo.com/surround-shop?merchantId=1' },
        { name: '积分商城', url: 'https://qu.sdo.com/unit-shop?merchantId=1' },
        { name: '陆行鸟礼物站', url: 'https://ffpay.sdo.com/pc/giftsStation/index.html#/index' },
        { name: '后勤补给站', url: 'https://actff1.web.sdo.com/project/141028dgf/index.html' },
      ],
    },
    {
      title: '常驻活动', icon: '🕹️',
      links: [
        { name: '超域传送', url: 'https://ff14bjz.sdo.com/RegionKanTelepo?' },
        { name: '黄金的试炼', url: 'https://actff1.web.sdo.com/20241130_GoldTrial/#/index' },
        { name: '积分签到', url: ' https://qu.sdo.com/personal-center?merchantId=1#pointsindex-1' },
        { name: '石之家签到', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/signcalendar' },
        { name: '竞猜中心', url: 'https://actff1.web.sdo.com/20240520_NewJingCai/index.html#/index' },
      ],
    },
    {
      title: '游戏讯息', icon: '📰',
      links: [
        { name: '最新情报', url: 'https://ff.web.sdo.com/web8/index.html#/newstab/newslist' },
        { name: '更新笔记', url: 'https://ff.web.sdo.com/web8/index.html#/patchnote' },
        { name: '服务器状况', url: 'https://ff.web.sdo.com/web8/index.html#/servers' },
        { name: '金曦之遗辉资料站', url: 'https://actff1.web.sdo.com/project/20240927dawntrail/index.html' },
        { name: '银海之天舟资料站', url: 'https://actff1.web.sdo.com/project/20260425evercold/' },
      ],
    },
    {
      title: '新手成长', icon: '🌱',
      links: [
        { name: '游戏下载', url: 'https://ff.web.sdo.com/web8/index.html#/download' },
        { name: '萌新招待', url: 'https://actff1.web.sdo.com/20250713_ZhaoDaiNew/index.html#/index' },
        { name: '初心者试炼', url: 'https://actff1.web.sdo.com/20240910_NewP_70/index.html#/index' },
        { name: '优待服务器', url: 'https://ff.web.sdo.com/web8/index.html#/servers' },
        { name: '冒险录使用指南', url: 'https://actff1.web.sdo.com/project/20190918adventure/index.html' },
        { name: '[石之家]萌新招待', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/recruit/beginner' },
        { name: '二次元吉田', url: 'https://actff1.web.sdo.com/project/20180228justice/index.html' },
      ],
    },
    {
      title: '副本战斗', icon: '🗡️',
      links: [
        { name: '[石之家]副本招募', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/recruit/party' },
        { name: '[石之家]零式数据', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/statistics/savage' },
        { name: '[石之家]绝境战数据', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/statistics/ultimate' },
        { name: '职业指南', url: 'https://actff1.web.sdo.com/project/20190917jobguid/index.html' },
        { name: '英雄榜-天动之章', url: 'https://actff1.web.sdo.com/HeroList/index0224.html' },
        { name: '英雄榜-阿尔法幻境', url: 'https://actff1.web.sdo.com/20180525HeroList/index190128.html' },
        { name: '英雄榜-再生之章', url: 'https://actff1.web.sdo.com/20180525HeroList/index210406.html' },
        { name: '英雄榜-荒天之狱', url: 'https://actff1.web.sdo.com/20180525HeroList/index230926.html' },
        { name: '英雄榜-重量级', url: 'https://actff1.web.sdo.com/20180525HeroList/index260105.html' },
      ],
    },
    {
      title: 'PVP', icon: '⚔️',
      links: [
        { name: '[石之家]纷争前线数据', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/statistics/frontline' },
        { name: '水晶冲突排行榜', url: 'https://actff1.web.sdo.com/project/ffcrystranking/index.html#/index' },
        { name: 'PVP 指南', url: 'https://actff1.web.sdo.com/project/160810event/page1.html' },
        { name: 'PVP 职业指南', url: 'https://actff1.web.sdo.com/project/20190917jobguid/index.html#/indexpvp' },
        { name: '水晶争霸赛', url: 'https://actff1.web.sdo.com/project/ffcrystallinerank/index.html#/index' },
      ],
    },
    {
      title: '其他玩法', icon: '🎮',
      links: [
        { name: '[石之家]幻化', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/glamour' },
        { name: '深层迷宫', url: 'https://actff1.web.sdo.com/project/170420deepdungeon4/index.html' },
        { name: '深层迷宫排行榜', url: 'https://actff1.web.sdo.com/20251103deepdungeon4/index.html?rank=party' },
        { name: '重建伊修加德', url: 'https://actff1.web.sdo.com/project/200103ishgardian/index.html' },
        { name: '开拓无人岛', url: 'https://actff1.web.sdo.com/project/20221212ffsanctuary/pc/index.html' },
        { name: '宇宙探索', url: 'https://actff1.web.sdo.com/project/20250619cosmicexploration/v4kjfz92uewnum597r5wr0fa3km7bg/index.html#/cosmic_exploration' },
        { name: '永结同心', url: 'https://actff1.web.sdo.com/project/150420Marriage/index.html' },
        { name: '房屋购买', url: 'https://actff1.web.sdo.com/project/20220801housingland/index.html' },
        { name: '多玛方城战', url: 'https://actff1.web.sdo.com/project/190624goldsaucer/doman/index.html' },
        { name: '跨界/超域传送指南', url: 'https://actff1.web.sdo.com/project/20190613worldvisit/d9o81h971g9128hiashd21/pc/datacentertravel.html' },
      ],
    },
    {
      title: '旅行笔录', icon: '📖',
      links: [
        { name: '第七灵灾回忆录', url: 'https://actff1.web.sdo.com/project/20200527memoir/memoir_1.html' },
        { name: '苍穹秘话', url: 'https://actff1.web.sdo.com/Project/160808Firmament/#sidestory_01' },
        { name: '红莲秘话', url: 'https://actff1.web.sdo.com/Project/180727Act/index.html#sidestory_01' },
        { name: '暗影秘话', url: 'https://actff1.web.sdo.com/Project/20200817special/index.html' },
        { name: '黎明秘话', url: 'https://actff1.web.sdo.com/project/20220701twilight/index1.html' },
        { name: '晓月秘话', url: 'https://actff1.web.sdo.com/project/20230826xymihua/index.html' },
        { name: '朔月秘话', url: 'https://actff1.web.sdo.com/project/20240822talesunderthenewmoon/sidestory_01.html' },
        { name: '金曦秘话', url: 'https://actff1.web.sdo.com/project/20260324tales_under_the_golden_sun/r3o3m83yu0nh/sidestory_01.html' },
      ],
    },
    {
      title: '游戏之外', icon: '🎊',
      links: [
        { name: '海德林咖啡餐厅', url: 'https://ff.web.sdo.com/ffcafe/index.html#/index' },
        { name: 'FANFEST2017', url: 'https://actff1.web.sdo.com/Project/170421Fanfest/' },
        { name: 'FANFEST2019', url: 'https://actff1.web.sdo.com/2019Fanfest/#/home' },
        { name: 'FANFEST2021', url: 'https://actff1.web.sdo.com/Fans2021/index.html#/index' },
        { name: 'FANFEST2024', url: 'https://actff1.web.sdo.com/project/20240202favn6b6tv8a8s8f8e8s8t/index.html#/index' },
        { name: '壁纸/铃声/表情包', url: 'https://ff.web.sdo.com/special/maverick7.0.html' },
        { name: '最终幻想14 x ARTIST', url: 'https://actff1.web.sdo.com/Project/170421Fanfest' },
      ],
    },
    {
      title: '其他', icon: '🔗',
      links: [
        { name: '大鲶鱼保佑', url: 'https://actff1.web.sdo.com/project/20200702Livelottery/index.html' },
        { name: '家具设计大赛2025', url: 'https://ff.web.sdo.com/web8/index.html#/newstab/newscont/380022' },
        { name: '活动资格申请中心', url: 'https://ffact.web.sdo.com/project/20191110_Race/#/index' },
        { name: '光呆狒狒认养计划', url: 'https://actff1.web.sdo.com/project/20240227fffeifei6f7c8x9s5w62/index.html#/index' },

      ],
    },
    {
      title: '违规处理', icon: '🚥',
      links: [
        { name: '账号处罚细则', url: 'https://actff1.web.sdo.com/project/20210621ffviolation/index.html#/penalt' },
        { name: '违规处理平台', url: 'https://actff1.web.sdo.com/project/20210621ffviolation/index.html#/index' },
        { name: '处罚公告', url: 'https://actff1.web.sdo.com/project/20210621ffviolation/index.html#/release' },
        { name: 'FF14 陌迪翁中心', url: 'https://weibo.com/u/7316752765' },
      ],
    },
    {
      title: '官方账号', icon: '👤',
      links: [
        { name: '官方微博', url: 'https://weibo.com/cnff14' },
        { name: '官方哔哩哔哩', url: 'https://space.bilibili.com/6655514' },
        { name: '官方小红书', url: 'https://www.xiaohongshu.com/user/profile/5f814cbe0000000001003455' },
        { name: '官方抖音', url: 'https://www.douyin.com/user/MS4wLjABAAAAHJts6kVkO7Lob9_H5VMSc3UZXCSq6gw5s02kplXQ7k0' },
        { name: 'FF14 周边商城', url: 'https://weibo.com/u/7285749323' },
        { name: '彩虹客服', url: 'https://qryai.crm.sdo.com/?gameId=100001900&q=&gamename=%E6%9C%80%E7%BB%88%E5%B9%BB%E6%83%B314&s=webh5' },
        { name: '石之家小助手', url: 'https://ff14risingstones.web.sdo.com/pc/index.html#/me/posts?uuid=10001019' },
        { name: '清凉的小丝瓜', url: 'https://space.bilibili.com/48648/dynamic' },
      ],
    },
  ];

  // ============================================================
  // 拼音首字母映射表（仅含链接标题中的汉字）
  // ============================================================
  const PY_MAP = {
    七:'q',下:'x',业:'y',丝:'s',中:'z',之:'z',书:'s',买:'m',争:'z',二:'e',人:'r',仓:'c',他:'t',伊:'y',
    优:'y',传:'c',佑:'y',使:'s',保:'b',修:'x',值:'z',元:'y',充:'c',光:'g',公:'g',其:'q',具:'j',养:'y',
    再:'z',冒:'m',冲:'c',况:'k',凉:'l',分:'f',划:'h',则:'z',初:'c',到:'d',前:'q',副:'f',加:'j',务:'w',
    动:'d',助:'z',募:'m',勤:'q',包:'b',化:'h',南:'n',博:'b',厅:'t',台:'t',号:'h',吉:'j',同:'t',后:'h',
    呆:'d',告:'g',周:'z',咖:'k',哔:'b',哩:'l',商:'s',啡:'f',器:'q',回:'h',城:'c',域:'y',境:'j',壁:'b',
    声:'s',处:'c',外:'w',多:'d',大:'d',天:'t',宇:'y',官:'g',宙:'z',客:'k',宫:'g',家:'j',小:'x',尔:'e',
    层:'c',屋:'w',岛:'d',常:'c',平:'p',幻:'h',库:'k',建:'j',开:'k',式:'s',录:'l',彩:'c',影:'y',待:'d',
    微:'w',德:'d',心:'x',忆:'y',息:'x',情:'q',想:'x',戏:'x',成:'c',战:'z',房:'f',手:'s',抖:'d',报:'b',
    拓:'t',招:'z',指:'z',据:'j',排:'p',探:'t',数:'s',斗:'d',料:'l',新:'x',方:'f',旅:'l',无:'w',明:'m',
    晓:'x',晶:'j',暗:'a',曦:'x',更:'g',最:'z',月:'y',服:'f',朔:'s',本:'b',林:'l',格:'g',榜:'b',次:'c',
    水:'s',永:'y',法:'f',活:'h',海:'h',消:'x',深:'s',清:'q',游:'y',灵:'l',灾:'z',炼:'l',物:'w',状:'z',
    狒:'f',狱:'y',猜:'c',玛:'m',玩:'w',理:'l',瓜:'g',生:'s',用:'y',田:'t',申:'s',界:'j',的:'d',石:'s',
    礼:'l',秘:'m',积:'j',穹:'q',突:'t',站:'z',竞:'j',章:'z',笔:'b',第:'d',签:'q',索:'s',红:'h',级:'j',
    纷:'f',纸:'z',线:'x',细:'x',终:'z',结:'j',给:'g',绝:'j',罚:'f',翁:'w',者:'z',职:'z',舟:'z',苍:'c',
    英:'y',荒:'h',莲:'l',萌:'m',虹:'h',行:'x',补:'b',表:'b',规:'g',计:'j',认:'r',讯:'x',记:'j',设:'s',
    试:'s',话:'h',请:'q',账:'z',购:'g',费:'f',资:'z',赛:'s',超:'c',跨:'k',载:'z',辉:'h',边:'b',违:'w',
    迪:'d',迷:'m',送:'s',道:'d',遗:'y',重:'z',量:'l',金:'j',铃:'l',银:'y',长:'z',阿:'a',陆:'l',陌:'m',
    险:'x',雄:'x',零:'l',霸:'b',音:'y',餐:'c',驻:'z',鱼:'y',鲶:'n',鸟:'n',黄:'h',黎:'l',
  };

  // ============================================================
  // 将字符串转为拼音首字母（非中文保留原字符）
  // ============================================================
  function toPinyinInitials(str) {
    let result = '';
    for (const ch of str) {
      const lower = ch.toLowerCase();
      if (ch >= '\u4e00' && ch <= '\u9fff') {
        result += PY_MAP[ch] || '';
      } else if ((lower >= 'a' && lower <= 'z') || (ch >= '0' && ch <= '9')) {
        result += lower;
      }
    }
    return result;
  }

  // ============================================================
  // 搜索索引 — 由 linkCategories 构建扁平化链接列表
  // ============================================================
  function buildSearchIndex() {
    const index = [];
    linkCategories.forEach(cat => {
      cat.links.forEach(link => {
        index.push({
          name: link.name,
          url: link.url,
          pinyin: toPinyinInitials(link.name),
          categoryTitle: cat.title,
          categoryIcon: cat.icon,
          abbr: '',
          priority: 0, // 来源链接优先级最低
        });
      });
    });
    const favLinks = getFavLinks();
    favLinks.forEach(link => {
      index.push({
        name: link.name,
        url: link.url,
        pinyin: toPinyinInitials(link.name),
        categoryTitle: '常用链接',
        categoryIcon: '⭐',
        abbr: link.abbr || '',
        priority: link.isCustom ? 2 : 1, // 自定义=2最高，收藏=1，来源=0
      });
    });
    return index;
  }

  // ============================================================
  // 跨站存储抽象层 — 优先使用 GM_setValue/GM_getValue（跨站共享），
  // 降级到 localStorage（同站隔离）
  // ============================================================
  const Store = {
    get(key, defaultVal = null) {
      try {
        if (typeof GM_getValue !== 'undefined') {
          const val = GM_getValue(key);
          return val !== undefined ? val : defaultVal;
        }
        const raw = localStorage.getItem(key);
        if (raw === null) return defaultVal;
        // 兼容旧格式（纯字符串）和新格式（JSON 序列化）
        try { return JSON.parse(raw); } catch { return raw; }
      } catch {
        return defaultVal;
      }
    },
    set(key, val) {
      try {
        if (typeof GM_setValue !== 'undefined') {
          GM_setValue(key, val);
        } else {
          localStorage.setItem(key, JSON.stringify(val));
        }
      } catch (e) {
        console.warn('存储失败:', e);
      }
    },
    remove(key) {
      try {
        if (typeof GM_deleteValue !== 'undefined') {
          GM_deleteValue(key);
        } else {
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.warn('删除失败:', e);
      }
    },
  };

  // ============================================================
  // JSONP 请求工具 — 绕过 CORS 跨域限制
  // 使用 GM_xmlhttpRequest 避免 Tampermonkey 沙盒回调失效问题
  // ============================================================
  function fetchViaGM(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            resolve(data);
          } catch (e) {
            reject(e);
          }
        },
        onerror: function (err) {
          reject(err);
        },
        timeout: 10000,
      });
    });
  }

  // ============================================================
  // 从 ffconfig.js 获取最新版本更新笔记
  // ============================================================
  async function fetchLatestPatchNote() {
    try {
      // ffconfig.js?<随机字符串>
      const url = 'ffconfig.js?' + Math.random().toString(36).substr(2);
      const res = await fetch(url);
      const text = await res.text();

      // 解析所有 X.X版本更新笔记 条目
      const regex = /name:\s*'([\d.]+)版本更新笔记'[\s\S]*?link:\s*'([^']+)'/g;
      const entries = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        const versionStr = match[1];
        const baseVersion = parseFloat(versionStr); // 7.51 → 7.5
        entries.push({
          name: versionStr + '版本更新笔记',
          link: match[2],
          baseVersion: baseVersion,
          isBase: versionStr === String(baseVersion),
        });
      }

      // 按基础版本分组
      const groups = {};
      for (const entry of entries) {
        if (!groups[entry.baseVersion]) groups[entry.baseVersion] = [];
        groups[entry.baseVersion].push(entry);
      }

      const baseVersions = Object.keys(groups).map(Number).sort((a, b) => b - a);
      if (baseVersions.length === 0) return null;

      // 取最新的基础版本，优先用精确匹配项 (如 "7.5" 而非 "7.51")
      const latestBase = baseVersions[0];
      return groups[latestBase].find(e => e.isBase) || groups[latestBase][0];
    } catch (e) {
      console.warn('获取 ffconfig.js 失败:', e);
      return null;
    }
  }

  // 仅官网域名下请求 ffconfig.js 获取最新版本更新笔记
  if (window.location.hostname === 'ff.web.sdo.com') {
    const PATCH_NOTE_BASE = 'https://ff.web.sdo.com/web8/';
    fetchLatestPatchNote().then(entry => {
      if (entry) {
        linkCategories[2].links.push({
          name: entry.name,
          url: PATCH_NOTE_BASE + entry.link,
        });
      }
    });
  }

  // ============================================================
  // 常用链接存储（固定+自定义，上限 24）
  // ============================================================
  const FAV_KEY = 'ff14_fav_links';
  const FAV_MAX = 12;

  function getFavLinks() {
    return Store.get(FAV_KEY, []);
  }

  function saveFavLinks(links) {
    Store.set(FAV_KEY, links);
  }

  function addFavLink(name, url, isCustom, abbr) {
    const links = getFavLinks();
    if (links.some(l => l.url === url)) return;
    if (links.length >= FAV_MAX) return;
    links.push({ name, url, isCustom: !!isCustom, abbr: abbr || '' });
    saveFavLinks(links);
  }

  function removeFavLink(url) {
    const links = getFavLinks();
    saveFavLinks(links.filter(l => l.url !== url));
  }

  // ============================================================
  // 深色/浅色主题
  // ============================================================
  const THEME_KEY = 'ff14_nav_theme';

  function getTheme() {
    return Store.get(THEME_KEY, 'dark');
  }

  function setTheme(mode) {
    Store.set(THEME_KEY, mode);
  }

  // 常用栏收起状态
  const COLLAPSED_KEY = 'ff14_fav_collapsed';

  function getCollapsed() {
    return Store.get(COLLAPSED_KEY, false) === true;
  }

  function setCollapsed(val) {
    Store.set(COLLAPSED_KEY, val ? true : false);
  }

  // 最新活动收起状态
  const ACTIVITY_COLLAPSED_KEY = 'ff14_activity_collapsed';

  function getActivityCollapsed() {
    return Store.get(ACTIVITY_COLLAPSED_KEY, false) === true;
  }

  function setActivityCollapsed(val) {
    Store.set(ACTIVITY_COLLAPSED_KEY, val ? true : false);
  }

  // ============================================================
  // 通用：创建标题元素（圆角）
  // ============================================================
  function createSectionTitle(text, C, isDark, extraStyle = {}) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, {
      fontSize: '15px', fontWeight: '700', color: C.catText,
      letterSpacing: '1px',
      padding: '7px 18px',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
      ...extraStyle,
    });
    return el;
  }

  // ============================================================
  // 常用栏模块 — 生成独立的全宽四列网格区域
  // ============================================================
  function createFavModule(C, linkGrid, isDark, searchIndex) {
    const favLinks = getFavLinks();

    const favSection = document.createElement('div');
    Object.assign(favSection.style, {
      marginBottom: '10px',
    });

    const favHeader = document.createElement('div');
    const isInitCollapsed = getCollapsed();
    favHeader.dataset.collapsed = isInitCollapsed ? 'true' : 'false';
    const headerSpan = document.createElement('span');
    headerSpan.textContent = '⭐ 常用链接' + (favLinks.length > 0 ? ' (' + favLinks.length + '/' + FAV_MAX + ')' : '');
    const toggleHint = document.createElement('span');
    toggleHint.textContent = isInitCollapsed ? ' [展开]' : ' [收起]';
    Object.assign(toggleHint.style, {
      fontSize: '12px', fontWeight: '400', color: C.muted, marginLeft: '8px',
    });
    Object.assign(favHeader.style, {
      fontSize: '15px', fontWeight: '700', color: C.catText,
      letterSpacing: '1px',
      padding: '0 18px', height: '40px', lineHeight: '40px',
      cursor: 'pointer', userSelect: 'none',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.5)',
      boxShadow: isDark
        ? '0 2px 12px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(255, 255, 255, 0.04)'
        : '0 2px 16px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(255, 255, 255, 0.6)',
      clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)',
    });
    favHeader.appendChild(headerSpan);
    favHeader.appendChild(toggleHint);
    favSection.appendChild(favHeader);

    // 可折叠容器
    const favCollapse = document.createElement('div');
    const initMaxHeight = isInitCollapsed ? '0' : '2000px';
    const initOpacity = isInitCollapsed ? '0' : '1';
    Object.assign(favCollapse.style, {
      overflow: 'hidden',
      maxHeight: initMaxHeight,
      opacity: initOpacity,
      transition: 'max-height 0.35s ease, opacity 0.25s ease',
    });

    favHeader.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .del-btn')) return;
      const isCollapsed = favHeader.dataset.collapsed === 'true';
      const newVal = !isCollapsed;
      favHeader.dataset.collapsed = newVal ? 'true' : 'false';
      setCollapsed(newVal);
      favCollapse.style.maxHeight = newVal ? '0' : '2000px';
      favCollapse.style.opacity = newVal ? '0' : '1';
      toggleHint.textContent = newVal ? ' [展开]' : ' [收起]';
    });

    const favGrid = document.createElement('div');
    Object.assign(favGrid.style, {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '2px 14px',
      padding: '10px 0',
      minWidth: '0',
    });

    // 网格容器阻止默认拖放行为，允许 drop
    favGrid.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // ---------- 内部辅助函数 ----------

    // 拖拽排序状态（共享给所有行）
    let dragSrcEl = null;

    function createFavRow(link) {
      const isCustom = link.isCustom;
      const row = document.createElement('div');
      row.draggable = true;
      row.dataset.url = link.url;
      row.dataset.isCustom = isCustom ? 'true' : 'false';
      Object.assign(row.style, {
        display: 'flex', alignItems: 'center', position: 'relative',
        borderRadius: '6px', transition: 'all 0.15s',
        minWidth: '0', overflow: 'hidden',
      });

      // 拖拽手柄
      const dragHandle = document.createElement('span');
      dragHandle.textContent = '⠿';
      dragHandle.title = '拖拽排序';
      Object.assign(dragHandle.style, {
        display: 'none', width: '20px', textAlign: 'center',
        fontSize: '13px', color: C.muted, cursor: 'grab',
        flexShrink: '0', userSelect: 'none',
      });

      row.addEventListener('dragstart', (e) => {
        dragSrcEl = row;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        row.style.opacity = '0.5';
        row.style.border = `1px dashed ${C.accent}`;
      });

      row.addEventListener('dragend', () => {
        row.style.opacity = '';
        row.style.border = '';
        favGrid.querySelectorAll('[data-url]').forEach(r => {
          r.style.border = '';
        });
        dragSrcEl = null;
      });

      row.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (row !== dragSrcEl) {
          row.style.border = `1px solid ${C.accent}`;
        }
      });

      row.addEventListener('dragleave', () => {
        if (row !== dragSrcEl) {
          row.style.border = '';
        }
      });

      row.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dragSrcEl || row === dragSrcEl) return;

        row.style.border = '';
        dragSrcEl.style.opacity = '';
        dragSrcEl.style.border = '';

        const rows = [...favGrid.querySelectorAll('[data-url]')];
        const srcIdx = rows.indexOf(dragSrcEl);
        const dstIdx = rows.indexOf(row);

        if (srcIdx < dstIdx) {
          row.parentNode.insertBefore(dragSrcEl, row.nextSibling);
        } else {
          row.parentNode.insertBefore(dragSrcEl, row);
        }

        saveFavOrder();
        dragSrcEl = null;
      });

      const item = document.createElement('a');
      item.textContent = link.name;
      item.href = link.url;
      item.target = '_blank';
      item.rel = 'noopener';
      Object.assign(item.style, {
        flex: '1', display: 'block', padding: '10px 8px 10px 12px',
        borderRadius: '4px', color: C.favLink,
        textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: '16px', fontWeight: '500',
        transition: 'all 0.15s', cursor: 'pointer',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        textShadow: C.linkShadow,
        letterSpacing: '0.5px',
      });

      const delBtn = document.createElement('span');
      delBtn.textContent = '✕';
      Object.assign(delBtn.style, {
        display: 'none', width: '22px', height: '22px', lineHeight: '22px',
        textAlign: 'center', fontSize: '12px', color: C.muted,
        cursor: 'pointer', borderRadius: '3px', flexShrink: '0',
        transition: 'color 0.12s', userSelect: 'none',
      });
      delBtn.addEventListener('mouseenter', () => { delBtn.style.color = C.accent; });
      delBtn.addEventListener('mouseleave', () => { delBtn.style.color = C.muted; });
      delBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        removeFavLink(link.url);
        // 从存储重建搜索索引
        const rebuilt = buildSearchIndex();
        searchIndex.length = 0;
        searchIndex.push(...rebuilt);
        row.remove();
        updateFavCount();
        if (!isCustom) {
          restorePinButton(link.url);
        }
        // 未达上限且添加按钮不在 DOM 中时重新插入
        if (getFavLinks().length < FAV_MAX && addBtnRef && !addBtnRef.parentNode) {
          favGrid.appendChild(addBtnRef);
        }
      });

      row.addEventListener('mouseenter', () => {
        item.style.backgroundColor = C.linkHoverBg;
        item.style.color = C.accent;
        item.style.paddingLeft = '16px';
        delBtn.style.display = 'block';
        dragHandle.style.display = 'block';
      });
      row.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
        item.style.color = C.favLink;
        item.style.paddingLeft = '12px';
        delBtn.style.display = 'none';
        dragHandle.style.display = 'none';
      });

      row.appendChild(dragHandle);
      row.appendChild(item);
      row.appendChild(delBtn);
      return row;
    }

    function updateFavCount() {
      const current = getFavLinks();
      headerSpan.textContent = '⭐ 常用链接' + (current.length > 0 ? ' (' + current.length + '/' + FAV_MAX + ')' : '');
    }

    // ---------- 保存常用栏排序 ----------
    function saveFavOrder() {
      const rows = [...favGrid.querySelectorAll('[data-url]')];
      const links = [];

      rows.forEach((r) => {
        const name = r.querySelector('a')?.textContent || '';
        const url = r.dataset.url;
        const isCustom = r.dataset.isCustom === 'true';
        links.push({ name, url, isCustom });
      });

      saveFavLinks(links);
    }
    function restorePinButton(url) {
      const cols = linkGrid.children;
      for (let c = 0; c < cols.length; c++) {
        const rows = cols[c].querySelectorAll('[data-url]');
        for (const r of rows) {
          if (r.dataset.url === url) {
            const linkName = r.querySelector('a')?.textContent || '';
            const alreadyFav = getFavLinks().some(l => l.url === url);
            if (alreadyFav) break;
            const oldPin = r.querySelector('span');
            if (oldPin && oldPin.textContent === '📌') oldPin.remove();
            const newPinBtn = document.createElement('span');
            newPinBtn.textContent = '📌';
            Object.assign(newPinBtn.style, {
              display: 'none', width: '22px', height: '22px', lineHeight: '22px',
              textAlign: 'center', fontSize: '14px', cursor: 'pointer',
              borderRadius: '3px', flexShrink: '0', transition: 'all 0.12s', userSelect: 'none',
            });
            newPinBtn.addEventListener('click', (e) => {
              e.preventDefault(); e.stopPropagation();
              const links = getFavLinks();
              if (links.length >= FAV_MAX) return;
              if (links.some(l => l.url === url)) return;
              addFavLink(linkName, url, false);
              const emptyEl = favGrid.querySelector('#fav-empty');
              if (emptyEl) emptyEl.remove();
              const newRow = createFavRow({ name: linkName, url: url, isCustom: false });
              if (addBtnRef && addBtnRef.parentNode) {
                favGrid.insertBefore(newRow, addBtnRef);
              } else {
                favGrid.appendChild(newRow);
              }
              updateFavCount();
              // 达到上限则移除添加按钮
              if (getFavLinks().length >= FAV_MAX && addBtnRef && addBtnRef.parentNode) {
                addBtnRef.remove();
              }
              newPinBtn.remove();
            });
            newPinBtn.addEventListener('mouseenter', () => { newPinBtn.style.transform = 'scale(1.2)'; });
            newPinBtn.addEventListener('mouseleave', () => { newPinBtn.style.transform = 'scale(1)'; });
            r.appendChild(newPinBtn);
            break;
          }
        }
      }
    }

    // ---------- 构建初始内容 ----------
    if (favLinks.length === 0) {
      // 无链接时仅显示 + 按钮
    } else {
      favLinks.forEach((link) => {
        const row = createFavRow(link);
        favGrid.appendChild(row);
      });
    }

    // ---------- "+" 添加自定义链接按钮 ----------
    let addBtnRef = null;

    function createAddBtn() {
      const btn = document.createElement('div');
      Object.assign(btn.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '4px', cursor: 'pointer',
        color: C.muted, fontSize: '14px', fontWeight: '700',
        padding: '5px 8px',
        border: `1px dashed ${C.border}`,
        transition: 'all 0.15s',
        userSelect: 'none',
      });
      btn.textContent = '+';
      btn.title = '添加自定义链接';

      btn.addEventListener('mouseenter', () => {
        btn.style.color = C.accent;
        btn.style.borderColor = C.accent;
        btn.style.backgroundColor = C.linkHoverBg;
        btn.style.boxShadow = '0 0 8px rgba(115, 191, 230, 0.15)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.color = C.muted;
        btn.style.borderColor = C.border;
        btn.style.backgroundColor = 'transparent';
        btn.style.boxShadow = 'none';
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showAddLinkDialog();
      });

      return btn;
    }

    // ---------- 自定义链接弹窗 ----------
    function showAddLinkDialog() {
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '10000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      });

      const box = document.createElement('div');
      Object.assign(box.style, {
        backgroundColor: C.dialogBg, borderRadius: C.dialogBorderRadius, padding: '24px 28px',
        minWidth: '320px', cursor: 'default',
        boxShadow: C.dialogShadow,
      });

      const title = document.createElement('div');
      title.textContent = '添加自定义链接';
      Object.assign(title.style, {
        fontSize: '16px', fontWeight: '700', color: C.accent,
        marginBottom: '16px',
      });
      box.appendChild(title);

      // 名称输入
      const nameLabel = document.createElement('div');
      nameLabel.textContent = '名称';
      Object.assign(nameLabel.style, { fontSize: '13px', color: C.catText, marginBottom: '4px' });
      box.appendChild(nameLabel);

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = '输入网站名称';
      Object.assign(nameInput.style, {
        width: '100%', boxSizing: 'border-box', padding: '8px 10px',
        fontSize: '14px', borderRadius: '8px', marginBottom: '12px',
        backgroundColor: C.catBg, color: C.text, border: `1px solid ${C.border}`,
        outline: 'none',
      });
      nameInput.addEventListener('focus', () => { nameInput.style.borderColor = C.accent; });
      nameInput.addEventListener('blur', () => { nameInput.style.borderColor = C.border; });
      box.appendChild(nameInput);

      // 网址输入
      const urlLabel = document.createElement('div');
      urlLabel.textContent = '链接';
      Object.assign(urlLabel.style, { fontSize: '13px', color: C.catText, marginBottom: '4px' });
      box.appendChild(urlLabel);

      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = '输入链接 (例: https://example.com)';
      Object.assign(urlInput.style, {
        width: '100%', boxSizing: 'border-box', padding: '8px 10px',
        fontSize: '14px', borderRadius: '8px', marginBottom: '12px',
        backgroundColor: C.catBg, color: C.text, border: `1px solid ${C.border}`,
        outline: 'none',
      });
      urlInput.addEventListener('focus', () => { urlInput.style.borderColor = C.accent; });
      urlInput.addEventListener('blur', () => { urlInput.style.borderColor = C.border; });
      box.appendChild(urlInput);

      // 缩写输入
      const abbrLabel = document.createElement('div');
      abbrLabel.textContent = '缩写（可选，字母，用于快速搜索）';
      Object.assign(abbrLabel.style, { fontSize: '13px', color: C.catText, marginBottom: '4px' });
      box.appendChild(abbrLabel);

      const abbrInput = document.createElement('input');
      abbrInput.type = 'text';
      abbrInput.placeholder = '例: cz (自动转为小写)';
      Object.assign(abbrInput.style, {
        width: '100%', boxSizing: 'border-box', padding: '8px 10px',
        fontSize: '14px', borderRadius: '8px', marginBottom: '20px',
        backgroundColor: C.catBg, color: C.text, border: `1px solid ${C.border}`,
        outline: 'none',
      });
      abbrInput.addEventListener('focus', () => { abbrInput.style.borderColor = C.accent; });
      abbrInput.addEventListener('blur', () => { abbrInput.style.borderColor = C.border; });
      // 实时过滤非字母字符并转小写
      abbrInput.addEventListener('input', () => {
        abbrInput.value = abbrInput.value.toLowerCase().replace(/[^a-z]/g, '');
      });
      box.appendChild(abbrInput);

      // 按钮行
      const btnRow = document.createElement('div');
      Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '10px' });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '取消';
      Object.assign(cancelBtn.style, {
        padding: '7px 18px', borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '600',
        color: C.text, backgroundColor: C.catBg, border: `1px solid ${C.border}`,
        transition: 'all 0.12s',
      });
      cancelBtn.addEventListener('mouseenter', () => { cancelBtn.style.backgroundColor = C.linkHoverBg; });
      cancelBtn.addEventListener('mouseleave', () => { cancelBtn.style.backgroundColor = C.catBg; });

      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = '确认';
      Object.assign(confirmBtn.style, {
        padding: '7px 18px', borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '600',
        color: '#fff', backgroundColor: C.accent, border: 'none',
        transition: 'all 0.12s',
      });
      confirmBtn.addEventListener('mouseenter', () => { confirmBtn.style.opacity = '0.85'; });
      confirmBtn.addEventListener('mouseleave', () => { confirmBtn.style.opacity = '1'; });

      function confirmAdd() {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const abbr = abbrInput.value.trim();
        if (!name || !url) return;

        addFavLink(name, url, true, abbr);

        // 从存储重建搜索索引
        if (searchIndex) {
          const rebuilt = buildSearchIndex();
          searchIndex.length = 0;
          searchIndex.push(...rebuilt);
        }

        const newRow = createFavRow({ name, url, isCustom: true, abbr });
        favGrid.insertBefore(newRow, addBtnRef);
        updateFavCount();

        if (getFavLinks().length >= FAV_MAX && addBtnRef.parentNode) {
          addBtnRef.remove();
        }

        overlay.remove();
      }

      function closeDialog() {
        overlay.remove();
      }

      confirmBtn.addEventListener('click', confirmAdd);
      cancelBtn.addEventListener('click', closeDialog);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

      // Enter 确认，ESC 关闭
      function keyHandler(e) {
        if (e.key === 'Enter') confirmAdd();
        else if (e.key === 'Escape') closeDialog();
      }
      document.addEventListener('keydown', keyHandler);

      // 清理事件
      const origRemove = overlay.remove.bind(overlay);
      overlay.remove = () => {
        document.removeEventListener('keydown', keyHandler);
        origRemove();
      };

      btnRow.appendChild(cancelBtn);
      btnRow.appendChild(confirmBtn);
      box.appendChild(btnRow);
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      // 自动聚焦
      setTimeout(() => nameInput.focus(), 50);
    }

    addBtnRef = createAddBtn();
    if (favLinks.length < FAV_MAX) {
      favGrid.appendChild(addBtnRef);
    }

    favSection.appendChild(favCollapse);
    favCollapse.appendChild(favGrid);

    return { favSection, favGrid, favHeader, createFavRow, updateFavCount, restorePinButton, addBtnRef };
  }

  function createDialog() {
    // ---- 主题色 ----
    const mode = getTheme();
    const isDark = mode === 'dark';
    const C = {
      overlayBg: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.45)',
      dialogBg: isDark ? 'rgb(24, 25, 26)' : '#ffffff',
      dialogShadow: isDark ? '0 8px 40px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.15)',
      dialogBorderRadius: '24px 8px',
      text: isDark ? 'rgb(204, 204, 204)' : 'rgb(50, 55, 65)',
      border: isDark ? 'rgb(37, 38, 44)' : 'rgb(218, 218, 218)',
      borderGlow: isDark ? 'rgba(115, 191, 230, 0.08)' : 'rgba(107, 131, 179, 0.06)',
      accent: isDark ? '#73aac6' : '#6b8db3',
      accentGlow: isDark ? 'rgba(115, 191, 230, 0.12)' : 'rgba(107, 131, 179, 0.1)',
      muted: isDark ? 'rgb(153, 151, 151)' : 'rgb(145, 145, 145)',
      catBg: isDark ? 'rgb(49, 50, 57)' : 'rgb(235, 240, 245)',
      catText: isDark ? 'rgb(160, 190, 215)' : 'rgb(80, 105, 135)',
      link: isDark ? '#dddddd' : '#333333',
      linkHoverBg: isDark ? 'rgb(37, 38, 44)' : 'rgb(238, 243, 250)',
      tagBg: isDark ? 'rgb(37, 38, 44)' : 'rgb(235, 240, 245)',
      tagBorder: isDark ? 'rgb(49, 50, 57)' : 'rgb(210, 215, 220)',
      tagText: isDark ? 'rgb(204, 204, 204)' : 'rgb(100, 110, 120)',
      tagHoverBg: isDark ? 'rgb(49, 50, 57)' : 'rgb(225, 232, 240)',
      tagHoverBorder: isDark ? 'rgba(115,191,230,0.4)' : 'rgba(107,131,179,0.5)',
      emptyText: isDark ? 'rgb(153,151,151)' : 'rgb(180, 176, 168)',
      favLink: isDark ? '#dddddd' : '#333333',
      favHover: isDark ? '#dddddd' : '#333333',
      divider: isDark ? '#3a4a55' : '#99b6cc',
      linkShadow: isDark ?
        '0px 0px 4px rgb(16, 36, 64, 0.8), 0px 0px 16px rgb(16, 36, 64, 0.5)' :
        '0px 0px 4px rgb(255, 255, 255, 0.6), 0px 0px 16px rgba(255, 255, 255, 0.5)',
      toggleBtn: isDark ? '🌙' : '☀️',
    };

    // 遮罩层
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: C.overlayBg,
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    });

    // 对话框主体
    const dialog = document.createElement('div');
    Object.assign(dialog.style, {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      background: isDark
        ? 'linear-gradient(315deg, rgba(24, 25, 26, 0.92) 10%, rgba(32, 35, 40, 0.92) 90%)'
        : 'linear-gradient(315deg, rgba(227, 228, 230, 0.92) 10%, rgba(242, 244, 245, 0.92) 90%)',
      borderRadius: C.dialogBorderRadius,
      padding: '35px 35px',
      maxWidth: '820px',
      width: '92%',
      maxHeight: '84vh',
      overflowY: 'auto',
      cursor: 'default',
      boxShadow: C.dialogShadow,
      color: C.text,
      // fontFamily: 'SimHei, -apple-system-font, "Helvetica Neue", sans-serif',
      fontSize: '16px',
      lineHeight: '1.6',
      position: 'relative',
      scrollbarWidth: 'thin',
      scrollbarColor: isDark ? 'rgba(115,191,230,0.25) transparent' : 'rgba(107,131,179,0.25) transparent',
    });


    // 标题栏
    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '14px',
      paddingBottom: '10px',
      borderBottom: `1px solid ${C.divider}`,
    });

    const title = document.createElement('span');
    title.textContent = BTN_TEXT;
    Object.assign(title.style, {
      fontSize: '22px',
      fontWeight: '900',
      color: C.accent,
      textShadow: isDark
        ? '#102440 0px 0px 4px,#102440 0px 0px 8px, #102440 0px 0px 16px'
        : 'rgb(255, 255, 255) 0px 0px 4px, rgba(255, 255, 255) 0px 0px 8px, rgba(255, 255, 255) 0px 0px 16px',
    });

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      fontSize: '24px',
      color: C.muted,
      cursor: 'pointer',
      padding: '4px 8px',
      transition: 'color 0.15s',
    });
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = C.accent; });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = C.muted; });
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.remove();
    });

    header.appendChild(title);

    // 非官方提示
    const unofficialHint = document.createElement('span');
    unofficialHint.textContent = '仅供便利导航使用，以官方网页为准';
    Object.assign(unofficialHint.style, {
      fontSize: '12px',
      color: C.muted,
      marginLeft: '10px',
      marginRight: 'auto',
      opacity: '1',
      userSelect: 'none',
    });

    header.appendChild(unofficialHint);

    // ---- 搜索栏（支持拼音首字母 + 键盘导航）----
    const searchIndex = buildSearchIndex();
    const searchContainer = document.createElement('div');
    Object.assign(searchContainer.style, {
      position: 'relative',
      margin: '0 8px',
      flexShrink: '0',
    });

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 搜索链接[S]...';
    Object.assign(searchInput.style, {
      padding: '4px 12px',
      fontSize: '13px',
      borderRadius: '14px',
      border: `1px solid ${C.border}`,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      color: C.text,
      outline: 'none',
      width: '120px',
      transition: 'all 0.25s',
    });
    searchInput.addEventListener('focus', () => {
      searchInput.style.borderColor = C.accent;
      searchInput.style.width = '180px';
      searchInput.style.backgroundColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.style.borderColor = C.border;
      searchInput.style.width = '120px';
      searchInput.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
      setTimeout(() => { dropdown.style.display = 'none'; selectedIdx = -1; }, 200);
    });

    // 搜索结果下拉
    const dropdown = document.createElement('div');
    Object.assign(dropdown.style, {
      position: 'absolute',
      top: '100%',
      right: '0',
      width: '300px',
      maxHeight: '380px',
      overflowY: 'auto',
      backgroundColor: C.dialogBg,
      border: `1px solid ${C.border}`,
      borderRadius: '10px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
      display: 'none',
      zIndex: '10001',
      marginTop: '6px',
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(dropdown);

    let currentResults = [];
    let selectedIdx = -1;

    function openResult(item) {
      window.open(item.url, '_blank');
      dropdown.style.display = 'none';
      searchInput.value = '';
      currentResults = [];
      selectedIdx = -1;
    }

    function renderDropdown() {
      if (currentResults.length === 0) {
        dropdown.innerHTML = '<div style="padding:12px;color:' + C.muted + ';font-size:13px;text-align:center;">未找到匹配链接</div>';
        dropdown.style.display = 'block';
        return;
      }

      dropdown.innerHTML = '';
      currentResults.slice(0, 20).forEach((r, i) => {
        const row = document.createElement('div');
        const isSelected = i === selectedIdx;
        Object.assign(row.style, {
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: C.text,
          borderBottom: `1px solid ${C.border}`,
          transition: 'background 0.1s',
          backgroundColor: isSelected ? C.linkHoverBg : 'transparent',
        });
        row.innerHTML =
          '<span style="flex-shrink:0;">' + r.categoryIcon + '</span>' +
          '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + r.name + '</span>' +
          '<span style="flex-shrink:0;font-size:11px;color:' + C.muted + ';">' + r.categoryTitle + '</span>';
        row.dataset.idx = i;
        row.addEventListener('mouseenter', () => {
          row.style.backgroundColor = C.linkHoverBg;
        });
        row.addEventListener('mouseleave', () => {
          if (i !== selectedIdx) row.style.backgroundColor = 'transparent';
        });
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          openResult(r);
        });
        dropdown.appendChild(row);
      });
      dropdown.style.display = 'block';

      // 滚动到选中项
      if (selectedIdx >= 0) {
        const selRow = dropdown.querySelector('[data-idx="' + selectedIdx + '"]');
        if (selRow) selRow.scrollIntoView({ block: 'nearest' });
      }
    }

    function doSearch(query) {
      if (!query) {
        dropdown.style.display = 'none';
        selectedIdx = -1;
        return;
      }
      let results = searchIndex.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const pinyinMatch = item.pinyin && item.pinyin.includes(query);
        const catMatch = item.categoryTitle.toLowerCase().includes(query);
        const abbrMatch = item.abbr && item.abbr.includes(query);
        return nameMatch || pinyinMatch || catMatch || abbrMatch;
      });
      // 优先级：自定义(2) > 常用链接(1) > 来源链接(0)，同优先级内缩写匹配优先
      results.sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        const aAbbr = a.abbr && a.abbr.includes(query) ? 1 : 0;
        const bAbbr = b.abbr && b.abbr.includes(query) ? 1 : 0;
        return bAbbr - aAbbr;
      });
      currentResults = results;
      selectedIdx = currentResults.length > 0 ? 0 : -1;
      renderDropdown();
    }

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      doSearch(query);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentResults.length === 0) return;
        selectedIdx = (selectedIdx + 1) % Math.min(currentResults.length, 20);
        renderDropdown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentResults.length === 0) return;
        const max = Math.min(currentResults.length, 20);
        selectedIdx = (selectedIdx - 1 + max) % max;
        renderDropdown();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIdx >= 0 && selectedIdx < currentResults.length) {
          openResult(currentResults[selectedIdx]);
        }
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        dropdown.style.display = 'none';
        selectedIdx = -1;
        searchInput.blur();
      }
    });

    // 点击页面其他位置关闭下拉
    const closeDropdown = (e) => {
      if (!searchContainer.contains(e.target)) {
        dropdown.style.display = 'none';
        selectedIdx = -1;
      }
    };
    document.addEventListener('click', closeDropdown, true);

    header.appendChild(searchContainer);

    // 主题切换按钮
    const themeBtn = document.createElement('span');
    themeBtn.textContent = C.toggleBtn;
    themeBtn.title = isDark ? '切换到浅色模式' : '切换到深色模式';
    Object.assign(themeBtn.style, {
      fontSize: '18px',
      color: C.accent,
      cursor: 'pointer',
      padding: '4px 10px',
      transition: 'all 0.15s',
      userSelect: 'none',
    });
    themeBtn.addEventListener('mouseenter', () => { themeBtn.style.transform = 'scale(1.2)'; });
    themeBtn.addEventListener('mouseleave', () => { themeBtn.style.transform = 'scale(1)'; });
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newMode = isDark ? 'light' : 'dark';
      setTheme(newMode);
      overlay.remove();
      // 重新打开弹窗
      const newDialog = createDialog();
      document.body.appendChild(newDialog);
    });

    header.appendChild(themeBtn);
    header.appendChild(closeBtn);

    const host = window.location.hostname;
    const isOfficialSite = host === 'ff.web.sdo.com' || host === 'ff14risingstones.web.sdo.com';

    // 最新活动区域
    let activitySection = null;
    activitySection = document.createElement('div');
    Object.assign(activitySection.style, {
      marginBottom: '10px',
    });

    // 先创建标题栏和可折叠容器，再决定是否发起请求
    const isActCollapsed = getActivityCollapsed();

    const titleBar = document.createElement('div');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = '📣 最新活动';
    const actToggleHint = document.createElement('span');
    actToggleHint.textContent = isActCollapsed ? ' [展开]' : ' [收起]';
    Object.assign(actToggleHint.style, {
      fontSize: '12px', fontWeight: '400', color: C.muted, marginLeft: '8px',
    });
    Object.assign(titleBar.style, {
      fontSize: '15px', fontWeight: '700', color: C.catText,
      letterSpacing: '1px',
      padding: '0 18px', height: '40px', lineHeight: '40px', cursor: 'pointer', userSelect: 'none',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.5)',
      clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)',
    });
    titleBar.appendChild(titleSpan);
    titleBar.appendChild(actToggleHint);
    activitySection.appendChild(titleBar);

    titleBar.dataset.collapsed = isActCollapsed ? 'true' : 'false';

    const actCollapse = document.createElement('div');
    Object.assign(actCollapse.style, {
      overflow: 'hidden',
      maxHeight: isActCollapsed ? '0' : '2000px',
      opacity: isActCollapsed ? '0' : '1',
      transition: 'max-height 0.35s ease, opacity 0.25s ease',
    });
    activitySection.appendChild(actCollapse);

    // 数据加载完成（已展开）后再支持普通展开/收起切换
    let dataLoaded = false;

    function buildActivityList(data) {
      dataLoaded = true;

      // 活动标题列表 — 每行一个标题，点击可跳转
      // 含"季节活动"的标题加粗并置顶
      const seasonalItems = data.filter(item => (item.Title || '').includes('季节活动'));
      const normalItems = data.filter(item => !(item.Title || '').includes('季节活动'));
      const sortedItems = [...seasonalItems, ...normalItems];

      const listContainer = document.createElement('div');
      Object.assign(listContainer.style, {
        padding: '6px 12px 10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      });

      sortedItems.forEach(item => {
        const isSeasonal = (item.Title || '').includes('季节活动');
        const link = document.createElement('a');
        link.href = item.OutLink || '#';
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = item.Title || '';
        Object.assign(link.style, {
          display: 'block',
          padding: '5px 10px',
          color: C.link,
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: isSeasonal ? '700' : '400',
          borderRadius: '4px',
          transition: 'all 0.15s',
          textShadow: C.linkShadow,
          background: 'transparent',
        });
        link.addEventListener('mouseenter', () => {
          link.style.backgroundColor = C.linkHoverBg;
          link.style.color = C.accent;
          link.style.paddingLeft = '14px';
        });
        link.addEventListener('mouseleave', () => {
          link.style.backgroundColor = 'transparent'
          link.style.color = C.link;
          link.style.paddingLeft = '10px';
        });
        listContainer.appendChild(link);
      });

      actCollapse.appendChild(listContainer);
    }

    // 展开/收起切换（含首次展开时加载）
    titleBar.addEventListener('click', () => {
      const collapsed = titleBar.dataset.collapsed === 'true';
      const newVal = !collapsed;

      // 如果是收起状态 → 点击展开，且数据尚未加载 → 发起请求
      if (collapsed && !dataLoaded) {
        // 加载中提示
        const loadingEl = document.createElement('div');
        loadingEl.textContent = '加载中...';
        Object.assign(loadingEl.style, {
          fontSize: '12px', color: C.muted, padding: '10px 14px',
        });
        actCollapse.appendChild(loadingEl);

        titleBar.dataset.collapsed = 'false';
        setActivityCollapsed(false);
        actCollapse.style.maxHeight = '2000px';
        actCollapse.style.opacity = '1';
        actToggleHint.textContent = ' [收起]';

        fetchViaGM('https://cqnews.web.sdo.com/api/news/newsList?gameCode=ff&CategoryCode=5203&pageIndex=0&pageSize=5')
          .then(res => {
            const data = res.Data || [];
            actCollapse.innerHTML = '';
            if (!data.length) {
              const emptyEl = document.createElement('div');
              emptyEl.textContent = '暂无最新活动';
              Object.assign(emptyEl.style, {
                fontSize: '12px', color: C.muted, padding: '10px 14px',
              });
              actCollapse.appendChild(emptyEl);
              return;
            }
            buildActivityList(data);
          })
          .catch(() => {
            actCollapse.innerHTML = '';
            const errEl = document.createElement('div');
            errEl.textContent = '加载失败';
            Object.assign(errEl.style, {
              fontSize: '12px', color: C.muted, padding: '10px 14px',
            });
            actCollapse.appendChild(errEl);
          });
        return;
      }

      titleBar.dataset.collapsed = newVal ? 'true' : 'false';
      setActivityCollapsed(newVal);
      actCollapse.style.maxHeight = newVal ? '0' : '2000px';
      actCollapse.style.opacity = newVal ? '0' : '1';
      actToggleHint.textContent = newVal ? ' [展开]' : ' [收起]';
    });

    // 如果初始为展开状态，立即加载数据
    if (!isActCollapsed) {
      const loadingEl = document.createElement('div');
      loadingEl.textContent = '加载中...';
      Object.assign(loadingEl.style, {
        fontSize: '12px', color: C.muted, padding: '10px 14px',
      });
      actCollapse.appendChild(loadingEl);

      fetchViaGM('https://cqnews.web.sdo.com/api/news/newsList?gameCode=ff&CategoryCode=5203&pageIndex=0&pageSize=5')
        .then(res => {
          const data = res.Data || [];
          actCollapse.innerHTML = '';
          if (!data.length) {
            const emptyEl = document.createElement('div');
            emptyEl.textContent = '暂无最新活动';
            Object.assign(emptyEl.style, {
              fontSize: '12px', color: C.muted, padding: '10px 14px',
            });
            actCollapse.appendChild(emptyEl);
            return;
          }
          buildActivityList(data);
        })
        .catch(() => {
          actCollapse.innerHTML = '';
          const errEl = document.createElement('div');
          errEl.textContent = '加载失败';
          Object.assign(errEl.style, {
            fontSize: '12px', color: C.muted, padding: '10px 14px',
          });
          actCollapse.appendChild(errEl);
        });
    }


    // ========== 链接区域 — 四列网格布局 ==========
    const linkGrid = document.createElement('div');
    Object.assign(linkGrid.style, {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '12px 20px',
      minWidth: '0',
    });

    // ========== 常用栏模块（需要 linkGrid 引用） ==========
    const favModule = createFavModule(C, linkGrid, isDark, searchIndex);
    const { favSection, favGrid: favCol, favHeader: favTitle, createFavRow, updateFavCount, restorePinButton, addBtnRef } = favModule;
    const favLinks = getFavLinks();

    linkCategories.forEach((category) => {
      const column = document.createElement('div');
      Object.assign(column.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        minWidth: '0',
      });

      const catTitle = createSectionTitle((category.icon || '') + ' ' + category.title, C, isDark, { marginBottom: '8px' });
      column.appendChild(catTitle);

      category.links.forEach((link) => {
        const isAlreadyPinned = favLinks.some(l => l.url === link.url);
        const row = createSourceRow(link, isAlreadyPinned, favCol, favTitle);
        column.appendChild(row);
      });

      linkGrid.appendChild(column);
    });

    // 辅助：创建来源分类的一行
    function createSourceRow(link, alreadyPinned, favColRef, favTitleRef) {
      const row = document.createElement('div');
      row.dataset.url = link.url;
      Object.assign(row.style, {
        display: 'flex', alignItems: 'center', position: 'relative',
        borderRadius: '6px', transition: 'all 0.15s',
        minWidth: '0', overflow: 'hidden',
      });

      const item = document.createElement('a');
      item.textContent = link.name;
      item.href = link.url;
      item.target = '_blank';
      item.rel = 'noopener';
      Object.assign(item.style, {
        flex: '1', display: 'block', padding: '6px 8px 6px 12px',
        borderRadius: '6px', color: C.link,
        textDecoration: 'none', fontSize: '16px', fontWeight: '500',
        transition: 'all 0.15s', cursor: 'pointer',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        textShadow: C.linkShadow,
      });

      const pinBtn = document.createElement('span');
      pinBtn.textContent = '📌';
      Object.assign(pinBtn.style, {
        display: 'none', width: '24px', height: '24px', lineHeight: '24px',
        textAlign: 'center', fontSize: '14px', cursor: 'pointer',
        borderRadius: '3px', flexShrink: '0', transition: 'all 0.12s', userSelect: 'none',
      });
      pinBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const links = getFavLinks();
        if (links.length >= FAV_MAX) return;
        if (links.some(l => l.url === link.url)) return;
        addFavLink(link.name, link.url, false);
        const emptyEl = favColRef.querySelector('#fav-empty');
        if (emptyEl) emptyEl.remove();
        const newRow = createFavRow({ name: link.name, url: link.url, isCustom: false });
        if (addBtnRef && addBtnRef.parentNode) {
          favColRef.insertBefore(newRow, addBtnRef);
        } else {
          favColRef.appendChild(newRow);
        }
        updateFavCount();
        // 总数达到上限则移除添加按钮
        if (getFavLinks().length >= FAV_MAX && addBtnRef && addBtnRef.parentNode) {
          addBtnRef.remove();
        }
        pinBtn.remove();
      });
      pinBtn.addEventListener('mouseenter', () => { pinBtn.style.transform = 'scale(1.2)'; });
      pinBtn.addEventListener('mouseleave', () => { pinBtn.style.transform = 'scale(1)'; });

      row.addEventListener('mouseenter', () => {
        item.style.backgroundColor = C.linkHoverBg;
        item.style.color = C.accent;
        item.style.paddingLeft = '14px';
        const pb = row.querySelector('span');
        if (pb) pb.style.display = 'block';
      });
      row.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
        item.style.color = C.link;
        item.style.paddingLeft = '10px';
        const pb = row.querySelector('span');
        if (pb) pb.style.display = 'none';
      });

      row.appendChild(item);
      if (!alreadyPinned) row.appendChild(pinBtn);
      return row;
    }

    dialog.appendChild(header);
    dialog.appendChild(favSection);
    if (activitySection) dialog.appendChild(activitySection);
    dialog.appendChild(linkGrid);
    overlay.appendChild(dialog);

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // ESC 关闭 + S 键聚焦搜索
    const focusHandler = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', focusHandler);
      } else if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      }
    };
    document.addEventListener('keydown', focusHandler);

    return overlay;
  }

  // ============================================================
  // 通用的导航按钮创建函数
  // ============================================================
  function createNavButton(color, bgColor, hoverBgColor, extraStyles = {}) {
    const navBtn = document.createElement('div');
    navBtn.textContent = BTN_TEXT;

    const styles = {
      display: 'inline-block',
      // 渐变
      color: '#ffffff',
      borderRadius: '30px',
      fontWeight: '700',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.15s',
      verticalAlign: 'middle',
      userSelect: 'none',
      backgroundColor: bgColor,
      boxShadow: '0 2px 8px rgba(115, 191, 230, 0.15)',
      height: '32px',
      lineHeight: '32px',
      padding: '0 16px',
      fontSize: '14px',
      ...extraStyles,
    };
    Object.assign(navBtn.style, styles);

    let hoverTimer = null;
    let dialogOpen = false;

    function openDialog() {
      if (dialogOpen) return;
      dialogOpen = true;
      const dialog = createDialog();
      document.body.appendChild(dialog);

      const origRemove = dialog.remove.bind(dialog);
      dialog.remove = () => {
        dialogOpen = false;
        origRemove();
      };
    }

    navBtn.addEventListener('mouseenter', () => {
      navBtn.style.backgroundColor = hoverBgColor;
      hoverTimer = setTimeout(() => {
        if (!dialogOpen) openDialog();
      }, 300);
    });

    navBtn.addEventListener('mouseleave', () => {
      navBtn.style.backgroundColor = bgColor;
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    });

    navBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      openDialog();
    });

    // 全局 F 键快捷键打开导航对话框
    window.addEventListener('keydown', function fKeyHandler(e) {
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault();
          openDialog();
        }
      }
    });

    return navBtn;
  }

  function addNavButton() {
    const lf = document.querySelector('.lf');
    if (!lf) return;

    // 修正父容器 flex 布局，防止按钮被 space-between 推到中间
    const parent = lf.parentElement;
    parent.style.justifyContent = 'flex-start';
    // 将右侧元素推到最右边
    const rightEl = parent.querySelector('.rt, .rtbox');
    if (rightEl) rightEl.style.marginLeft = 'auto';

    // 创建导航按钮
    const navBtn = createNavButton('#fff', 'rgb(75, 135, 185)', 'rgb(100, 170, 220)', {
      marginLeft: '16px',
    });

    // 按钮放在 logo 容器（.lf）右侧
    lf.after(navBtn);
  }

  // ============================================================
  // 石之家页面
  // ============================================================
  function addStoneHomeButton() {
    // 找到 logo_stone 元素
    const logoStone = document.querySelector('.logo_stone.rel.cursor');
    if (!logoStone) return;

    const parentContainer = logoStone.parentElement;
    if (!parentContainer) return;

    // 创建导航按钮
    const navBtn = createNavButton('#fff', 'rgb(75, 135, 185)', 'rgb(100, 170, 220)', {
      marginLeft: '0',
    });

    // 在 logo_stone 右侧插入按钮
    logoStone.after(navBtn);
  }

  // 页面为 Vue SPA，需要等待渲染完成后插入按钮
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待元素 ${selector} 超时`));
      }, timeout);
    });
  }

  // ============================================================
  // NGA 页面：在「艾欧泽亚」链接右侧添加按钮
  // ============================================================
  function addNgaButton() {
    const eorzeaLinks = document.querySelectorAll('a[href="/thread.php?fid=-362960"]');
    let targetLink = null;
    for (const link of eorzeaLinks) {
      const text = link.textContent.replace(/\s/g, '');
      if (text === '艾欧泽亚') {
        targetLink = link;
        break;
      }
    }
    // 如果没找到精确匹配，回退到第一个
    if (!targetLink && eorzeaLinks.length > 0) targetLink = eorzeaLinks[0];
    if (!targetLink) return;

    const navBtn = createNavButton('#fff', 'rgb(75, 135, 185)', 'rgb(100, 170, 220)', {
      marginLeft: '8px',
    });

    targetLink.parentNode.insertBefore(navBtn, targetLink.nextSibling);
  }

  // ============================================================
  // 根据域名执行不同逻辑
  // ============================================================
  const host = window.location.hostname;

  if (host === 'ff14risingstones.web.sdo.com') {
    // 石之家页面：在导航栏左侧插入按钮
    waitForElement('.head_cent.w1146.mgauto.flex.space')
      .then(() => addStoneHomeButton())
      .catch(() => {
        window.addEventListener('load', () => {
          setTimeout(() => addStoneHomeButton(), 500);
        });
      });
  } else if ((host.includes('ngabbs.com') || host.includes('nga.cn') || host.includes('nga.178.com')) && window.location.pathname === '/thread.php' && new URLSearchParams(window.location.search).get('fid') === '-362960') {
    // NGA 页面：仅在艾欧泽亚版块（fid=-362960）添加按钮
    waitForElement('a[href="/thread.php?fid=-362960"]')
      .then(() => addNgaButton())
      .catch(() => {
        window.addEventListener('load', () => {
          setTimeout(() => addNgaButton(), 500);
        });
      });
  } else {
    // 官网页面：在左上角添加导航按钮
    waitForElement('.lf a[href="#/index"]')
      .then(() => addNavButton())
      .catch(() => {
        window.addEventListener('load', () => {
          setTimeout(() => addNavButton(), 500);
        });
      });
  }

})();