/* =============================================================
 * 京迹 · 北京旅游攻略 — PWA 应用逻辑
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

  function defaultTripDate() {
    // 默认：下个月的 15 号（“10 月中旬”）
    const now = new Date();
    let d = new Date(now.getFullYear(), now.getMonth(), 15);
    if (d <= startOf(now)) d = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + d.getDate();
  }

  // ---------- 状态 ----------
  const store = {
    get tripDate() { return localStorage.getItem("jj_tripDate") || defaultTripDate(); },
    setTripDate(v) { localStorage.setItem("jj_tripDate", v); },
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

  // ---------- 预约提醒逻辑 ----------
  function reservationReminder(spot) {
    const e = spot.entry;
    const tripDateStr = store.tripDate;
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

  // ---------- 首页 ----------
  function renderHome() {
    const cats = ["全部", ...Array.from(new Set(SPOTS.map(s => s.category)))];
    const grid = SPOTS.map(s => {
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

    const itin = ITINERARY.map(d => {
      const items = d.items.map(id => {
        const s = byId(id);
        return s ? '<a class="itin-item" href="#/spot/' + id + '">' + s.name + "</a>" : "";
      }).join("");
      return (
        '<div class="itin-day"><div class="day-head"><span class="day-num">Day ' + d.day + "</span>" +
        '<span class="day-title">' + d.title + "</span></div>" +
        '<div class="itin-items">' + items + "</div></div>"
      );
    }).join("");

    view().innerHTML =
      '<div class="hero"><h1>' + CITY.name + " · " + CITY.hero + "</h1>" +
      '<div class="hero-sub">' + CITY.desc + "</div>" +
      '<span class="hero-tag">' + SPOTS.length + ' 个景点 · 攻略 + 预约提醒</span></div>' +

      '<div class="dcard"><h2>🧥 10 月中旬 · 天气与穿衣</h2><div class="dc-body">' +
      '<div class="wx-temp">🌤️ ' + WEATHER.temp + "</div>" +
      '<ul class="tip-list">' + WEATHER.items.map(i => '<li>' + i.icon + " " + i.text + "</li>").join("") + "</ul>" +
      '<div class="wx-note">' + WEATHER.note + "</div>" +
      "</div></div>" +

      '<div class="chips" id="chips">' +
      cats.map((c, i) => '<span class="chip' + (i === 0 ? " active" : "") + '" data-cat="' + c + '">' + c + "</span>").join("") +
      "</div>" +

      '<div class="spot-grid" id="grid">' + grid + "</div>" +

      '<div class="section-title">10 月中旬 · 3 天参考行程</div>' +
      '<div class="itin-card">' + itin + "</div>" +

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
  }

  // ---------- 详情页 ----------
  function renderSpot(id) {
    const s = byId(id);
    if (!s) return renderHome();
    const added = store.tripList.includes(id);
    const rem = reservationReminder(s);
    const entryCls = s.entry.type === "预约" ? "entry-reserve" : s.entry.type === "购票" ? "entry-buy" : "entry-free";
    const entryIcon = s.entry.type === "预约" ? "🎫" : s.entry.type === "购票" ? "🪪" : "🆓";
    const scalperHead = s.scalper.risk === "high" ? "⚠️ 黄牛票高风险" : s.scalper.risk === "low" ? "🔶 黄牛风险低" : "✅ 无需黄牛";

    view().innerHTML =
      '<div class="detail-hero">' +
      '<a class="back-btn" href="#/" aria-label="返回">←</a>' +
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
      '<div class="reserve-cta"><div class="rc-title">你 ' + fmtMD(parseDate(store.tripDate)) + " 去 " + s.name + "：</div>" + rem.text + "</div>" +
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
    const d = store.tripDate;

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
      '<div class="tdc-hint">例：10 月中旬出行，选 10 月 15 日左右</div></div>' +

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
      store.setTripDate(dateInput.value || defaultTripDate());
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
      const lines = ["【北京 " + fmtMD(parseDate(store.tripDate)) + " 行程】"];
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
    const cards = FOODS.map(f =>
      '<div class="food-card" data-cat="' + f.cat + '">' +
      '<div class="food-head"><div class="food-name">' + f.name + '</div>' +
      '<span class="food-badge">' + f.cat + "</span></div>" +
      '<div class="food-meta">📍 ' + f.area + " · 💰 " + f.budget + "</div>" +
      '<div class="food-sign">🍽️ 招牌：<b>' + f.sign + "</b></div>" +
      '<div class="food-tip">💡 ' + f.tip + "</div></div>"
    ).join("");

    view().innerHTML =
      '<div class="hero" style="padding:16px 18px"><h1 style="font-size:20px">美食地图</h1>' +
      '<div class="hero-sub">先吃饭，再逛景点——人均参考，实际以店内为准</div></div>' +
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

  // ---------- 路由 ----------
  function route() {
    const h = location.hash || "#/";
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    let tabKey = "home";
    if (h.startsWith("#/spot/")) {
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
      renderHome();
    }
    const tab = document.querySelector('.tab[data-tab="' + tabKey + '"]');
    if (tab) tab.classList.add("active");
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
    route();
  });
})();
