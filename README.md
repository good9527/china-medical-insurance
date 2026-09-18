# 全国医疗保险待遇精算测算与政策知识库平台

<p align="center">
  <img src="https://img.shields.io/badge/覆盖统筹区-344%20%2F%20344%20(100%25)-success?style=for-the-badge&logo=china" alt="Coverage">
  <img src="https://img.shields.io/badge/精算断言-6%2C804%20Passed-blue?style=for-the-badge&logo=jest" alt="Tests">
  <img src="https://img.shields.io/badge/前端框架-Vue%203%20%2B%20Uni--app-brightgreen?style=for-the-badge&logo=vuedotjs" alt="Vue3">
  <img src="https://img.shields.io/badge/语言-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/自动化CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions" alt="CI">
  <img src="https://img.shields.io/badge/开源协议-MIT-orange?style=for-the-badge" alt="License">
</p>

---

## 📌 项目简介

**全国医疗保险待遇精算测算平台**是一个面向全国参保人的民生级开源工具与政策数据库。本项目完整收录并结构化建模了中国内地 **31 个省、自治区、直辖市及新疆生产建设兵团下辖的全部 344 个医保统筹区**现行有效的基本医疗保险待遇政策。

平台不仅支持在手机端、网页端即时进行精确到分、严丝合缝的医保报销金额测算，更建立了一整套**官方红头文件溯源体系**与**多维智能巡检引擎**，杜绝政策滞后、倒挂与非标误填。

---

## 🌟 核心特色

1. **全国 344 统筹区 100% 全量覆盖**：
   - 涵盖全部直辖市、地级市、自治州、盟以及直管县级行政区。
2. **多层次精算测算引擎 (`src/engine/calculator.ts`)**：
   - **职工医保**：在职与退休人员多梯次区分、门诊共济累计起付与分段报销、门诊年度限额管控、住院起付线阶梯递减规则。
   - **城乡居民医保**：普通门诊统筹、“两病”（高血压/糖尿病）专项用药报销、基层/一级/二级/三级定点医疗机构住院梯次支付。
   - **大病保险 / 大额互助**：特例分段累进报销比例、合规自付起付扣除、多阶梯超高额兜底计算。
   - **跨省/跨地市异地就医结算**：规范转诊备案比例下浮、未备案急诊及自主就医扣减计算。
3. **真实官方公文严格溯源**：
   - 数据拒绝网络营销号与二手非官方信息，所有参数均与当地医疗保障局（`ybj.*.gov.cn`）或人民政府（`*.gov.cn`）现行红头公文文号、发布日期及官方链接强绑定。
4. **工业级长效巡检与防错体系 (`src/engine/inspector/`)**：
   - **智能防错规则库**：自动拦截比例倒挂、异常救助兜底档混入、门诊共济限额失真。
   - **法定特例白名单认证**：对北京二级 78%、成都高档三级 68%、德州 72% 等红头特例进行公文白名单强认证。
   - **定期随机巡查与级联排查**：内置随机 35 统筹区抽检管道；一旦单点发现异常特征，自动触发全域级联扫描广播。
5. **6,804 项全域精算自动化测试**：
   - 覆盖全国所有地级市真实场景的自动化断言测试套件，确保每一笔账目分毫不差。

---

## 🏗️ 架构设计

```
14.全国医保报销/
├── src/
│   ├── data/                   # 全国 344 统筹区政策数据库
│   │   ├── beijing/            # 北京市统筹数据
│   │   ├── guangdong/          # 广东省 21 地市统筹数据
│   │   ├── sichuan/            # 四川省 21 市州统筹数据
│   │   ├── shaanxi/            # 陕西省 10 市及杨凌统筹数据
│   │   └── ...                 # 涵盖全国各省自治区
│   ├── engine/                 # 核心计算与质检引擎
│   │   ├── calculator.ts       # 核心精算计算器（门诊、住院、大病、异地）
│   │   ├── inspector/          # 智能体检引擎
│   │   │   ├── rules.ts        # 智能巡检规则库（含法定特例白名单）
│   │   │   └── inspector.ts    # 全量巡检、随机抽检与级联排查器
│   │   └── __tests__/          # 6,804 项全域场景自动化测试
│   ├── pages/                  # Uni-app 前端界面
│   │   ├── index/              # 首页与城市切换
│   │   ├── calculator/         # 交互式医保测算器
│   │   ├── policy/             # 官方政策详情与红头公文溯源
│   │   └── service/            # 全国 12393 智能医保服务专线与经办导航
│   └── scripts/                # 自动化运维与质检脚本
│       ├── run-smart-inspection.ts  # 智能体检执行入口
│       ├── monitor-policies.ts      # 医保官网连通与健康监控
│       └── update-policy-pipeline.ts # 政策管道自动同步
└── .github/
    ├── workflows/              # GitHub Actions 自动化工作流 (CI/CD/巡检)
    └── ISSUE_TEMPLATE/         # 社区政策纠偏与反馈表单
```

---

## 🚀 快速上手

### 1. 安装环境

本项目推荐使用 Node.js 18+ 或 20+。

```bash
# 克隆仓库
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>

# 安装依赖
npm install
```

### 2. 本地开发与预览

```bash
# 启动 H5 网页开发服务器（热重载）
npm run dev:h5

# 启动微信小程序开发预览
npm run dev:mp-weixin
```

本地服务启动后，在浏览器访问控制台提示的地址（如 `http://localhost:5173/`）即可使用。

---

## 🧪 自动化测试与巡检指令

本项目内置了完整的质量保障工具链：

| 指令 | 说明 |
| :--- | :--- |
| `npm run check:all` | **【完整门禁】** 顺序执行合规审计 + 智能体检 + 官网监控 + 6804 项精算断言 + H5 构建 |
| `npm run audit:smart` | **【全量体检】** 对全国 344 个统筹区执行全量多维智能规则扫描 |
| `npm run audit:patrol` | **【随机巡查】** 随机抽取 35 个统筹区进行深度精算与倒挂抽检 |
| `npm run test:calc` | **【精算测试】** 运行 6,804 项全域门诊、住院自动化测算断言 |
| `npm run monitor:policies` | **【官网监控】** 检查全国 344 个统筹区医保局官网与数据源连通性 |
| `npm run build:h5` | **【生产构建】** 编译生成适用于 GitHub Pages 或 Web 服务器的纯静态网页产物 |

---

## 🚢 部署上线

### 方案 A：GitHub Pages 免费自动部署（推荐）

本项目已内置 `.github/workflows/deploy-pages.yml`：
1. 将代码推送到 GitHub 仓库的 `main` 分支；
2. 进入 GitHub 仓库设置：`Settings` -> `Pages`；
3. 将 **Build and deployment -> Source** 设置为 **GitHub Actions**；
4. 每次提交代码，GitHub Actions 会自动编译并将 H5 站点发布到 `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`，永久免费托管。

### 方案 B：自建 Nginx / Web 服务器

```bash
# 编译生产包
npm run build:h5

# 编译产物位于 dist/build/h5 目录
# 将该目录下的所有文件上传至 Nginx 静态站点根目录即可
```

---

## 🤝 政策共建与纠偏反馈

中国医疗保险政策由各统筹区因地制宜动态调整。如发现您所在城市的**起付线、报销比例、封顶限额**在最新政策中有调整，非常欢迎您参与共建：

1. 提交 **[政策更新 Issue](https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>/issues/new?template=policy_update.yml)**：附带当地医保局红头文件文号或官方链接；
2. 提交 **Pull Request**：修改 `src/data/<省份>/<城市>.ts` 中的参数，并同步补充官方发文凭证。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开放源代码。
