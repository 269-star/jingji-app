# 旅迹 · 城市旅游攻略 App

一个面向**手机端**的旅游攻略 PWA（可安装到手机主屏幕，像 App 一样使用）。

## 功能

- 🏮 **12 个北京景点攻略**：故宫、八达岭长城、天坛、颐和园、北海、景山、钟鼓楼、孔庙国子监、雍和宫、798 艺术区、什刹海后海、南锣鼓巷
- 🧥 **10 月中旬天气/穿衣提醒**：昼夜温差、保湿、防晒、步数提醒
- 🦆 **美食地图**：9 类推荐（全聚德/四季民福/大董/涮肉/老字号小吃 + 3 个区域指南）
- 🚇 **地铁出行速查**：7 条线路 × 22 个车站对照表（8 号线 = 游客黄金线），基于 2026 年最新线路数据核实
- 🎫 **进入方式**：每个景点明确标注「预约 / 购票 / 免费」
- ⏰ **预约倒计时**：选择出行日期后，自动算出每个景点「哪天几点放票、还剩几天」
- 🛡️ **黄牛票提醒**：明确告诉你哪些景点买黄牛票风险高（故宫实名核验，闲鱼票基本是坑）
- 📜 **历史 + 图片**：每个景点的历史背景和实景照片（已打包到本地，离线也能看）
- 📅 **我的行程**：勾选景点 → 生成预约清单 + 票价估算，一键复制发微信备忘
- 📶 **离线可用**：Service Worker 缓存，装好后没网也能打开

## 本地运行

```bash
cd travel-app
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

或

```bash
npx serve .
```

## 在手机上使用

1. Mac 和手机连**同一个 Wi-Fi**
2. 终端里运行 `python3 -m http.server 8000`
3. 查看 Mac 的局域网 IP（`ifconfig | grep inet`，一般是 `192.168.x.x`）
4. 手机浏览器打开 `http://192.168.x.x:8000`
5. 安装到主屏幕：
   - **iPhone**：Safari 打开 → 分享按钮 → 「添加到主屏幕」
   - **Android**：Chrome 打开 → 右上角 ⋮ → 「安装应用 / 添加到主屏幕」

> 注意：通过局域网 http 访问时，离线缓存（service worker）需要 https 才会生效；
> 装到主屏幕和浏览功能不受影响。要完整 https 体验，可部署到任意静态托管（Vercel / Netlify / GitHub Pages）。

## 部署到公网（可选，推荐）

把 `travel-app` 文件夹拖到 [Netlify](https://app.netlify.com/drop) 或
`npx vercel` 一下，即可得到 https 链接，手机访问后安装体验完整。

## 文件结构

```
travel-app/
├── index.html          # 页面骨架
├── css/style.css       # 样式（移动端优先）
├── js/data.js          # ⭐ 景点数据（想加景点/城市改这里）
├── js/app.js           # 应用逻辑（路由、倒计时、行程）
├── images/*.jpg        # 景点照片（已压缩，本地打包）
├── icons/              # App 图标
├── manifest.json       # PWA 安装配置
└── sw.js               # 离线缓存
```

## 想加新景点？

编辑 `js/data.js`，在 `SPOTS` 数组里照着现有格式加一条即可（图片放 `images/`）。
想加新城市：加一个 `CITY` + 一组 `SPOTS`，并在 `app.js` 的城市选择里扩展。

## 构建真·原生 App（Capacitor）

工程已生成：`android/` + `ios/`（Capacitor 8）。

### Android（已编译 ✅）

现成安装包：**`~/Desktop/京迹.apk`**（7.3MB，调试版）

- **USB 安装**（推荐）：手机开「USB 调试」→ 数据线连 Mac →
  ```bash
  /Users/mjs/Library/Android/sdk/platform-tools/adb install ~/Desktop/京迹.apk
  ```
- **手动安装**：把 `京迹.apk` 传到手机（微信文件传输助手/AirDrop），点它安装，允许「安装未知来源应用」
- 重新编译：
  ```bash
  cd travel-app && npx cap sync   # 网页改了之后先同步
  cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew assembleDebug
  ```
  产物在 `android/app/build/outputs/apk/debug/app-debug.apk`

> 注意：调试版用调试签名，重装前若签名冲突先卸载旧版。

### iOS（需要你的 Xcode）

1. App Store 安装 **Xcode**（免费，约 12GB，需要 Apple ID）
2. 打开工程：
   ```bash
   cd travel-app/ios && open JingJi.xcodeproj
   ```
3. Xcode 顶栏：选你的 iPhone（需先插线信任）→ Signing 选你的 Apple ID
4. 点 ▶ 运行。免费 Apple ID 可安装到自己设备上（7 天有效，到期重新跑一次）；
   上架 App Store 需要 ¥708/年的开发者账号

### 已安装的编译环境

- JDK 17/21：`/opt/homebrew/opt/openjdk@17` / `@21`
- Android SDK：`~/Library/Android/sdk`（platform-35 + build-tools 35）

---

## 说明

- 票价、预约政策、地铁线路随时间会调整；地铁信息已对照 2026 年线路数据核实，出行前仍建议用「亿通行」App 确认
- 图片来自公开网络（Bing 图片搜索结果），仅供学习使用
