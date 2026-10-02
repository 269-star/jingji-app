/* =============================================================
 * 旅迹 · 城市旅游攻略 — PWA 应用逻辑
 * ============================================================= */
(function () {
  "use strict";

  // ---------- 工具 ----------
  const $ = (sel, el) => (el || document).querySelector(sel);
  const view = () => $("#view");
  const pad = n => String(n).padStart(2, "0");

  function parseDate(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
  function fmtMD(d) { return (d.getMonth() + 1) + "月" + d.getDate() + "日"; }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function diffDays(a, b) { return Math.round((startOf(b) - startOf(a)) / 86400000); }
  function startOf(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function todayStr() {
    const t = new Date();
    return t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  }

  function defaultTravelDate() {
    // 默认：今天
    return todayStr();
  }

  // ---------- 状态 ----------
  const store = {
    get travelDate() { return localStorage.getItem("jj_travelDate") || defaultTravelDate(); },
    setTravelDate(v) { localStorage.setItem("jj_travelDate", v); },
    get tripList() { try { return JSON.parse(localStorage.getItem("jj_trip") || "[]"); } catch { return []; } },
    setTrip(a) { localStorage.setItem("jj_trip", JSON.stringify(a)); }
  };

  const byId = id => SPOTS.find(s => s.id === id);

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- 图片兜底（SVG 明信片） ----------
  function fallbackImg(name) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#d8a13a'/><stop offset='1' stop-color='#9c2418'/></linearGradient></defs>" +
      "<rect width='800' height='500' fill='url(#g)'/>" +
      "<text x='400' y='250' font-size='64' fill='rgba(255,255,255,.9)' text-anchor='middle' font-family='sans-serif' dominant-baseline='middle'>" + name + "</text>" +
      "</svg>";
    return "data:image/svg+xml;utf-8," + encodeURIComponent(svg);
  }
  function bindImg(img, name) {
    const src = img.getAttribute("src");
    img.addEventListener("error", () => { img.onerror = null; img.src = fallbackImg(name); }, { once: true });
  }

  // ---------- 实时天气（Open-Meteo，免费无 key） ----------
  function wmoIcon(code) {
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code < 51) return "🌦️";
    if (code < 71) return "🌧️";
    if (code < 80) return "🌨️";
    if (code < 87) return "🌦️";
    if (code < 95) return "🌨️";
    return "⛈️";
  }

  function clothesFromTemp(tmax, tmin) {
    if (tmax >= 28) return "短袖T恤/裙装即可，注意防晒补水";
    if (tmax >= 23) return "长袖T恤/薄衬衫，怕凉备一件薄外套";
    if (tmax >= 18) return "薄外套/卫衣 + 长裤";
    if (tmax >= 13) return "夹克/风衣 + 长袖内搭";
    if (tmax >= 8) return "毛衣 + 外套，早晚更冷";
    if (tmax >= 3) return "薄羽绒/厚外套 + 毛衣";
    return "羽绒服 + 毛衣，帽子围巾手套";
  }

  async function fetchLiveWeather(cityId, dateStr) {
    const coord = CITY_COORDS[cityId];
    if (!coord) return null;
    const target = parseDate(dateStr);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((target - today) / 86400000);
    if (days < 0 || days > 15) return null; // 实时预报只覆盖 15 天内
    try {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=" + coord.lat +
        "&longitude=" + coord.lng +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,wind_speed_10m_max" +
        "&timezone=Asia%2FShanghai&start_date=" + dateStr + "&end_date=" + dateStr;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) return null;
      const j = await res.json();
      const d = j && j.daily;
      if (!d || !d.time || !d.time.length) return null;
      return {
        tmax: Math.round(d.temperature_2m_max[0]),
        tmin: Math.round(d.temperature_2m_min[0]),
        precip: d.precipitation_sum ? d.precipitation_sum[0] : 0,
        code: d.weathercode ? d.weathercode[0] : 0,
        wind: d.wind_speed_10m_max ? d.wind_speed_10m_max[0] : 0
      };
    } catch (e) { return null; }
  }

  // ---------- 预约提醒逻辑 ----------
  function reservationReminder(spot) {
    const e = spot.entry;
    const tripDateStr = store.travelDate;
    if (!tripDateStr) return { cls: "reminder-free", text: "先在「我的行程」里选择出行日期" };
    const tripDate = parseDate(tripDateStr);
    const today = startOf(new Date());
    if (tripDate < today) return { cls: "reminder-free", text: "出行日期已过，请在「我的行程」里更新日期" };

    if (e.leadDays === 0) {
      if (e.type === "免费") return { cls: "reminder-free", text: "免费开放，当天直接去即可" };
      return { cls: "reminder-free", text: "无需提前预约，当天现场 / 线上购票即可" };
    }
    const openDate = addDays(tripDate, -e.leadDays);
    if (startOf(openDate) > today) {
      const days = diffDays(today, openDate);
      return {
        cls: "reminder-soon",
        text: "📌 " + fmtMD(openDate) + " " + (e.saleTime !== "-" ? e.saleTime + " " : "") + "开始放票（还有 " + days + " 天），记得准时在官方渠道抢票！"
      };
    }
    return {
      cls: "reminder-now",
      text: "🔔 现在放票窗口已开！马上去「" + e.channels[0] + "」预约 " + fmtMD(tripDate) + " 的票，越早越稳。"
    };
  }

  // ---------- 城市选择（首页 / 子界面共用） ----------
  function cityCardsHtml() {
    return CITIES.map(c => {
      if (c.status === "ready") {
        const n = SPOTS.filter(s => (s.city || "beijing") === c.id).length;
        return (
          '<a class="city-card ready" href="#/city/' + c.id + '">' +
          '<div class="cc-emoji">' + c.emoji + "</div>" +
          '<div class="cc-name">' + c.name + ' <span class="cc-en">' + c.en + "</span></div>" +
          '<div class="cc-tagline">' + c.tagline + "</div>" +
          '<div class="cc-meta">' + n + " 个景点 · 美食地图 · 地铁速查</div>" +
          '<div class="cc-go">进入攻略 →</div></a>'
        );
      }
      return (
        '<div class="city-card coming"><div class="cc-emoji dim">' + c.emoji + "</div>" +
        '<div class="cc-name">' + c.name + ' <span class="cc-en">' + c.en + "</span></div>" +
        '<div class="cc-tagline">' + c.tagline + "</div>" +
        '<div class="cc-meta">即将上线</div></div>'
      );
    }).join("");
  }

  function renderCities() {
    const cards = cityCardsHtml();

    view().innerHTML =
      '<div class="hero"><h1>选择城市</h1>' +
      '<div class="hero-sub">逐城攻略 · 预约倒计时 · 黄牛提醒 · 天气穿衣</div></div>' +
      '<div class="city-grid">' + cards + "</div>" +
      '<p style="font-size:12px;color:var(--ink2);margin-top:18px;text-align:center;">更多城市持续开发中，想玩哪个城市告诉我们 🙏</p>';
  }

  // ---------- 城市主页 ----------
  function renderCityHome(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return renderCities();
    const spots = SPOTS.filter(s => (s.city || "beijing") === cityId);
    const dObj = parseDate(store.travelDate);

    const cats = ["全部", ...Array.from(new Set(spots.map(s => s.category)))];
    const grid = spots.map(s => {
      const badgeCls = s.entry.type === "预约" ? "badge-reserve" : s.entry.type === "购票" ? "badge-buy" : "badge-free";
      const leadTag = s.entry.leadDays > 0 ? "提前" + s.entry.leadDays + "天" : "";
      return (
        '<a class="spot-card" href="#/spot/' + s.id + '" data-cat="' + s.category + '">' +
        '<img src="' + s.img + '" alt="' + s.name + '" loading="lazy" data-name="' + s.name + '">' +
        '<span class="badge ' + badgeCls + '">' + s.entry.type + "</span>" +
        (leadTag ? '<span class="lead-tag">' + leadTag + "</span>" : "") +
        '<div class="sc-body"><div class="sc-name">' + s.name + "</div>" +
        '<div class="sc-sub">' + s.tagline + " · " + s.bestHours + "</div></div></a>"
      );
    }).join("");

    view().innerHTML =
      '<div class="hero"><h1>' + city.name + " · " + fmtMD(dObj) + " 之旅</h1>" +
      '<div class="hero-sub">' + city.tagline + " · 点右上角 📅 改日期</div>" +
      '<span class="hero-tag">' + spots.length + " 个景点 · 攻略 + 预约提醒</span></div>" +

      '<div class="dcard" id="wxCard"><h2>🧥 ' + fmtMD(dObj) + " · " + city.name + " 天气与穿衣</h2>" +
      '<div class="dc-body" id="wxBody"><div class="wx-loading">📡 正在获取实时天气…</div></div></div>' +

      '<div class="chips" id="chips">' +
      cats.map((c, i) => '<span class="chip' + (i === 0 ? " active" : "") + '" data-cat="' + c + '">' + c + "</span>").join("") +
      "</div>" +

      '<div class="spot-grid" id="grid">' + grid + "</div>" +

      '<p style="font-size:12px;color:var(--ink2);margin-top:18px;text-align:center;">' +
      '票价与预约政策可能调整，出行前请以官方渠道为准 🙏</p>';

    // 图片兜底
    view().querySelectorAll("img").forEach(img => bindImg(img, img.dataset.name));

    // 分类筛选
    $("#chips").addEventListener("click", ev => {
      const chip = ev.target.closest(".chip");
      if (!chip) return;
      view().querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.dataset.cat;
      view().querySelectorAll(".spot-card").forEach(card => {
        card.style.display = cat === "全部" || card.dataset.cat === cat ? "" : "none";
      });
    });

    // 实时天气（异步填充）
    loadLiveWeather(cityId);
  }

  // ---------- 实时天气卡 ----------
  async function loadLiveWeather(cityId) {
    const body = document.getElementById("wxBody");
    if (!body) return;
    const dObj = parseDate(store.travelDate);
    const alert = crowdAlert(store.travelDate);
    const monthly = (WEATHER_BY_MONTH[cityId] || []).find(w => w.m === dObj.getMonth() + 1);

    const live = await fetchLiveWeather(cityId, store.travelDate);
    let html = "";
    if (live) {
      const tips = ["👕 穿衣建议：<b>" + clothesFromTemp(live.tmax, live.tmin) + "</b>"];
      if (live.precip >= 1) tips.push("☔ 有降水（约 " + live.precip + "mm），建议带折叠伞");
      if (live.wind >= 20) tips.push("💨 最大风速 " + Math.round(live.wind) + " km/h，建议防风外套");
      if (live.tmin <= 5) tips.push("🌡 夜间最低 " + live.tmin + "°C，早晚出门多穿一件");
      tips.push("👟 每天步数 1.5 万+，一定穿舒适的运动鞋");
      html =
        '<div class="wx-temp">' + wmoIcon(live.code) + " 白天 " + live.tmax + "°C · 夜间 " + live.tmin + "°C</div>" +
        '<ul class="tip-list">' + tips.map(t => "<li>" + t + "</li>").join("") + "</ul>" +
        (alert ? '<div class="wx-alert ' + (alert.level === "high" ? "alert-high" : "alert-low") + '">' + alert.text + "</div>" : "") +
        '<div class="wx-note">实时预报（Open-Meteo）· <span class="wx-refresh" id="wxRefresh">↻ 刷新</span> · 出发前再看一眼</div>';
    } else if (monthly) {
      html =
        '<div class="wx-temp">🌤️ ' + monthly.temp + "</div>" +
        '<ul class="tip-list">' +
        '<li>👕 穿衣建议：<b>' + monthly.clothes + "</b></li>" +
        monthly.extras.map(t => "<li>" + t + "</li>").join("") +
        '<li>👟 每天步数 1.5 万+，一定穿舒适的运动鞋</li>' +
        "</ul>" +
        (alert ? '<div class="wx-alert ' + (alert.level === "high" ? "alert-high" : "alert-low") + '">' + alert.text + "</div>" : "") +
        '<div class="wx-note">该日期超出实时预报范围（仅 15 天内），显示气候参考；日期临近后自动切换为实时预报</div>';
    } else {
      html = '<div class="wx-note">该城市天气数据准备中…</div>';
    }
    body.innerHTML = html;
    const rf = document.getElementById("wxRefresh");
    if (rf) rf.addEventListener("click", () => {
      body.innerHTML = '<div class="wx-loading">📡 正在刷新实时天气…</div>';
      loadLiveWeather(cityId);
    });
  }

  // ---------- 详情页 ----------
  function renderSpot(id) {
    const s = byId(id);
    if (!s) return renderCities();
    const added = store.tripList.includes(id);
    const rem = reservationReminder(s);
    const entryCls = s.entry.type === "预约" ? "entry-reserve" : s.entry.type === "购票" ? "entry-buy" : "entry-free";
    const entryIcon = s.entry.type === "预约" ? "🎫" : s.entry.type === "购票" ? "🪪" : "🆓";
    const scalperHead = s.scalper.risk === "high" ? "⚠️ 黄牛票高风险" : s.scalper.risk === "low" ? "🔶 黄牛风险低" : "✅ 无需黄牛";

    view().innerHTML =
      '<div class="detail-hero">' +
      '<a class="back-btn" href="#/city/' + (s.city || "beijing") + '" aria-label="返回">←</a>' +
      '<img src="' + s.img + '" alt="' + s.name + '" data-name="' + s.name + '">' +
      '<div class="dh-overlay"></div>' +
      '<div class="dh-text"><h1>' + s.name + '</h1><div class="dh-en">' + s.en + "</div>" +
      '<div class="dh-tag">' + s.tagline + " · " + "★".repeat(s.rating) + "</div></div></div>" +

      '<div class="entry-banner ' + entryCls + '">' +
      '<div class="eb-icon">' + entryIcon + "</div>" +
      '<div><div class="eb-type">进入方式：' + s.entry.type + "</div>" +
      '<div class="eb-sum">' + s.entry.summary + "</div></div></div>" +

      '<div class="dcard"><h2>🎫 预约 / 购票</h2><div class="dc-body">' +
      "<p style='font-size:13.5px;color:var(--ink2)'>" + s.entry.details + "</p>" +
      '<div class="lead-box"><b>放票规则：</b>' + s.entry.leadNote + "</div>" +
      '<div class="channels">' + s.entry.channels.map(c => '<span class="channel">' + c + "</span>").join("") + "</div>" +
      '<div class="reserve-cta"><div class="rc-title">你 ' + fmtMD(parseDate(store.travelDate)) + " 去 " + s.name + "：</div>" + rem.text + "</div>" +
      "</div></div>" +

      '<div class="dcard"><h2>💰 票价参考</h2><div class="dc-body">' +
      s.tickets.map(t => '<div class="ticket-row"><span>' + t.name + '</span><span class="price">' + t.price + "</span></div>").join("") +
      "</div></div>" +

      '<div class="dcard"><h2>⏰ 开放与交通</h2><div class="dc-body">' +
      '<div class="kv"><span class="k">开放时间</span><span class="v">' + s.hours + "</span></div>" +
      '<div class="kv"><span class="k">闭馆</span><span class="v">' + s.closed + "</span></div>" +
      '<div class="kv"><span class="k">建议游玩</span><span class="v">' + s.bestHours + "</span></div>" +
      '<div class="kv" style="display:block"><span class="k">交通</span><div class="v" style="text-align:left;margin-top:4px;font-weight:400">' + s.transport + "</div></div>" +
      "</div></div>" +

      '<div class="scalper ' + s.scalper.risk + '"><div class="sp-head">' + scalperHead + "</div>" + s.scalper.text + "</div>" +

      '<div class="dcard"><h2>📜 景点历史</h2><div class="dc-body"><p class="history-text">' + s.history + "</p></div></div>" +

      '<div class="dcard"><h2>💡 10 月中旬实用建议</h2><div class="dc-body">' +
      '<ul class="tip-list">' + s.tips.map(t => "<li>" + t + "</li>").join("") + "</ul>" +
      (s.combine && s.combine.length ?
        '<div class="combine-row" style="margin-top:12px">' + s.combine.map(cid => {
          const c = byId(cid);
          return c ? '<a class="combine-chip" href="#/spot/' + cid + '">＋ ' + c.name + "</a>" : "";
        }).join("") + "</div>" : "") +
      "</div></div>" +

      '<button class="add-btn' + (added ? " added" : "") + '" id="addBtn">' +
      (added ? "✅ 已加入我的行程" : "＋ 加入我的行程") + "</button>";

    view().querySelectorAll("img").forEach(img => bindImg(img, img.dataset.name));
    $("#addBtn").addEventListener("click", () => {
      let trip = store.tripList;
      if (trip.includes(id)) {
        trip = trip.filter(x => x !== id);
        toast("已移除「" + s.name + "」");
      } else {
        trip.push(id);
        toast("已加入「" + s.name + "」→ 去「我的行程」看预约提醒");
      }
      store.setTrip(trip);
      renderSpot(id);
    });
    window.scrollTo(0, 0);
  }

  // ---------- 我的行程 ----------
  function renderTrip() {
    const tripIds = store.tripList;
    const spots = tripIds.map(byId).filter(Boolean);
    const d = store.travelDate;

    // 票价估算：取每个景点第一条票价里的数字
    let total = 0;
    spots.forEach(s => {
      const m = (s.tickets[0] && s.tickets[0].price || "").match(/(\d+)/);
      if (m) total += Number(m[1]);
    });

    const items = spots.map(s => {
      const rem = reservationReminder(s);
      return (
        '<div class="trip-item" data-id="' + s.id + '">' +
        '<div class="ti-top"><img src="' + s.img + '" alt="' + s.name + '" data-name="' + s.name + '">' +
        '<div class="ti-info"><a class="ti-name" href="#/spot/' + s.id + '">' + s.name + "</a>" +
        '<div class="ti-meta">' + s.entry.type + " · " + (s.tickets[0] ? s.tickets[0].price : "免费") + " · " + s.bestHours + "</div></div>" +
        '<button class="ti-remove" aria-label="移除">✕</button></div>' +
        '<div class="ti-reminder ' + rem.cls + '">' + rem.text + "</div></div>"
      );
    }).join("");

    view().innerHTML =
      '<div class="hero" style="padding:16px 18px"><h1 style="font-size:20px">我的行程</h1>' +
      '<div class="hero-sub">勾选要去的景点，app 帮你算出每个景点的预约倒计时</div></div>' +

      '<div class="trip-date-card">' +
      '<label>📅 出行日期（预约倒计时按此计算）</label>' +
      '<div class="tdc-row"><input type="date" id="tripDate" value="' + d + '"></div>' +
      '<div class="tdc-hint">顶部 📅 与此同步，改任一处都会重算预约倒计时</div></div>' +

      (spots.length
        ? items
        : '<div class="empty"><div class="empty-icon">🧭</div>' +
          "<p>还没有添加景点<br>去首页点「＋ 加入我的行程」吧</p></div>") +

      (spots.length
        ? '<div class="trip-summary">' +
          '<div class="ts-line"><span>景点数</span><span>' + spots.length + " 个</span></div>" +
          '<div class="ts-line"><span>票价估算（仅大门票）</span><span class="ts-total">约 ' + total + " 元</span></div>" +
          "</div>" +
          '<button class="copy-btn" id="copyBtn">📋 复制行程清单（可发微信备忘）</button>'
        : "");

    view().querySelectorAll("img").forEach(img => bindImg(img, img.dataset.name));

    const dateInput = $("#tripDate");
    dateInput.addEventListener("change", () => {
      store.setTravelDate(dateInput.value || defaultTravelDate());
      toast("已更新出行日期，预约倒计时已重算");
      renderTrip();
    });

    view().querySelectorAll(".ti-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.closest(".trip-item").dataset.id;
        store.setTrip(store.tripList.filter(x => x !== id));
        toast("已移除");
        renderTrip();
      });
    });

    const copyBtn = $("#copyBtn");
    if (copyBtn) copyBtn.addEventListener("click", () => {
      const lines = ["【北京 " + fmtMD(parseDate(store.travelDate)) + " 行程】"];
      spots.forEach((s, i) => {
        const r = reservationReminder(s);
        lines.push((i + 1) + ". " + s.name + "（" + s.entry.type + "，" + (s.tickets[0] ? s.tickets[0].price : "免费") + "）");
        lines.push("   " + r.text);
      });
      lines.push("", "票价与预约政策以官方为准");
      const text = lines.join("\n");
      const done = () => toast("已复制到剪贴板 ✅");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else fallbackCopy(text, done);
    });
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); cb(); } catch { toast("复制失败，请长按手动复制"); }
    document.body.removeChild(ta);
  }

  // ---------- 美食 ----------
  function renderFood() {
    const cats = ["全部", ...Array.from(new Set(FOODS.map(f => f.cat)))];
    const cards = FOODS.map(f => {
      const mapUrl = "https://uri.amap.com/search?keyword=" + encodeURIComponent(f.map || f.name) + "&city=北京";
      return ('<a class="food-card" data-cat="' + f.cat + '" href="' + mapUrl + '" target="_blank" rel="noopener">' +
      '<div class="food-head"><div class="food-name">' + f.name + '</div>' +
      '<span class="food-badge">' + f.cat + "</span></div>" +
      '<div class="food-addr">📍 ' + f.addr + "</div>" +
      '<div class="food-meta">💰 ' + f.budget + "</div>" +
      '<div class="food-sign">🍽️ 招牌：<b>' + f.sign + "</b></div>" +
      '<div class="food-tip">💡 ' + f.tip + "</div>" +
      '<div class="food-go">点击打开高德地图 · 导航/看实时排队 →</div></a>');
    }).join("");

    view().innerHTML =
      '<div class="hero" style="padding:16px 18px"><h1 style="font-size:20px">美食地图</h1>' +
      '<div class="hero-sub">本地人常去的店，点卡片直接打开高德地图</div></div>' +
      '<div class="chips" id="foodChips">' +
      cats.map((c, i) => '<span class="chip' + (i === 0 ? " active" : "") + '" data-cat="' + c + '">' + c + "</span>").join("") +
      "</div>" + cards;

    $("#foodChips").addEventListener("click", ev => {
      const chip = ev.target.closest(".chip");
      if (!chip) return;
      view().querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.dataset.cat;
      view().querySelectorAll(".food-card").forEach(card => {
        card.style.display = cat === "全部" || card.dataset.cat === cat ? "" : "none";
      });
    });
    window.scrollTo(0, 0);
  }

  // ---------- 地铁出行 ----------
  function renderMetro() {
    const lines = METRO.map(l =>
      '<div class="metro-card">' +
      '<div class="metro-head"><span class="line-dot" style="background:' + l.color + '"></span>' +
      '<span class="metro-line">' + l.line + '</span>' +
      '<span class="metro-tag">' + l.tag + "</span></div>" +
      l.stations.map(s =>
        '<div class="metro-station"><span class="ms-name">' + s.name + "</span>" +
        '<span class="ms-spot">→ ' + s.spot + "</span></div>").join("") +
      "</div>"
    ).join("");

    view().innerHTML =
      '<div class="hero" style="padding:16px 18px"><h1 style="font-size:20px">地铁出行速查</h1>' +
      '<div class="hero-sub">7 条线路覆盖 12 个景点，8 号线是「游客黄金线」</div></div>' +
      '<div class="metro-tips">' + METRO_TIPS.map(t => '<ul class="tip-list" style="margin:0"><li>' + t + "</li></ul>").join("") + "</div>" +
      lines;
    window.scrollTo(0, 0);
  }

  // ---------- 顶栏：日期选择 + 城市切换 ----------
  function bindTopBar() {
    const pill = $("#datePill");
    const sheet = $("#dateSheet");
    const renderPill = () => { pill.textContent = "📅 " + fmtMD(parseDate(store.travelDate)); };
    renderPill();
    pill.addEventListener("click", () => {
      $("#dateInput").value = store.travelDate;
      sheet.style.display = "block";
    });
    $("#dateCancel").addEventListener("click", () => { sheet.style.display = "none"; });
    $("#dateApply").addEventListener("click", () => {
      const v = $("#dateInput").value;
      if (v) store.setTravelDate(v);
      sheet.style.display = "none";
      toast("已更新日期，天气/穿衣与预约倒计时已重算");
      renderPill();
      route();
    });
    sheet.addEventListener("click", ev => { if (ev.target === sheet) sheet.style.display = "none"; });

    // 城市选择子界面（全屏滑入动画）
    const cs = $("#citySheet");
    const openCity = () => {
      $("#citySheetBody").innerHTML = cityCardsHtml();
      cs.classList.add("open");
      document.body.classList.add("no-scroll");
    };
    const closeCity = () => {
      cs.classList.remove("open");
      document.body.classList.remove("no-scroll");
    };
    $("#cityPill").addEventListener("click", openCity);
    $("#cityClose").addEventListener("click", closeCity);
    cs.addEventListener("click", ev => {
      if (ev.target.classList.contains("cs-backdrop")) closeCity();
      const card = ev.target.closest(".city-card.ready");
      if (card) {
        ev.preventDefault();
        closeCity();
        setTimeout(() => { location.hash = card.getAttribute("href"); }, 240); // 等滑出动画
      }
    });
  }

  function updateDatePill() {
    const pill = $("#datePill");
    if (pill) pill.textContent = "📅 " + fmtMD(parseDate(store.travelDate));
  }

  function updateCityPill() {
    const h = location.hash || "#/";
    let name = "选择城市";
    if (h.startsWith("#/city/")) {
      const c = CITIES.find(x => x.id === h.slice("#/city/".length));
      if (c) name = c.name;
    } else if (h.startsWith("#/spot/")) {
      const s = byId(h.slice("#/spot/".length));
      if (s) { const c = CITIES.find(x => x.id === (s.city || "beijing")); if (c) name = c.name; }
    } else if (h === "#/trip" || h === "#/food" || h === "#/metro") {
      name = "北京";
    }
    const el = $("#cityPill");
    if (el) el.textContent = name;
  }

  // ---------- 路由 ----------
  function route() {
    const h = location.hash || "#/";
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    let tabKey = "home";
    if (h.startsWith("#/city/")) {
      renderCityHome(h.slice("#/city/".length));
    } else if (h.startsWith("#/spot/")) {
      renderSpot(h.slice("#/spot/".length));
    } else if (h === "#/food") {
      renderFood();
      tabKey = "food";
    } else if (h === "#/metro") {
      renderMetro();
      tabKey = "metro";
    } else if (h === "#/trip") {
      renderTrip();
      tabKey = "trip";
    } else {
      renderCities();
    }
    const tab = document.querySelector('.tab[data-tab="' + tabKey + '"]');
    if (tab) tab.classList.add("active");
    updateCityPill();
    updateDatePill();
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
    bindTopBar();
    route();
  });
})();
