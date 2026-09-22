# 🏥 全国医疗保险待遇估算与政策知识库平台 (China Medical Insurance Platform)

<p align="center">
  <a href="https://good9527.github.io/china-medical-insurance/">
    <img src="https://img.shields.io/badge/🌐_在线免安装体验-点击直达-007AFF?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/覆盖统筹区-348%20%2F%20348%20(100%25)-success?style=for-the-badge&logo=china" alt="Coverage">
  <img src="https://img.shields.io/badge/自动化断言-7%2C184%20Passed-blue?style=for-the-badge&logo=jest" alt="Tests">
  <img src="https://img.shields.io/badge/前端框架-Vue%203%20%2B%20Uni--app-brightgreen?style=for-the-badge&logo=vuedotjs" alt="Vue3">
  <img src="https://img.shields.io/badge/语言-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/开源协议-MIT-orange?style=for-the-badge" alt="License">
</p>

---

> 🚀 **免安装直达访问**：
> 本平台已通过 GitHub Actions 自动化流水线实时编译托管，任何手机、电脑浏览器均可免安装即点即用：
> 👉 **[https://good9527.github.io/china-medical-insurance/](https://good9527.github.io/china-medical-insurance/)**

---

## 📌 项目简介

**全国医疗保险待遇估算与政策知识库平台**是一个面向全国参保人的民生级开源工具与公开政策数据库。本项目完整收录并结构化建模了中国内地 **31 个省、自治区、直辖市及新疆生产建设兵团下辖的全部 348 个医保统筹区**现行有效的基本医疗保险待遇政策。

平台不仅支持在手机端、网页端即时进行精确到分、严丝合缝的医保报销金额预估，更建立了一整套**官方红头文件穿透式溯源体系**与**多维智能巡检引擎**，杜绝政策滞后、倒挂与非标误填。

> ⚠️ **合规声明**：
> 本平台所展示政策参数与估算结果均基于地方医疗保障局及政府公开发布的规范性红头文件计算，旨在提供便民参考与普惠知识普及。参保人实际报销金额请以就医定点医疗机构出具的《基本医疗保险门诊/住院收费收据及费用结算清单》和医保信息平台实时结算凭单为准。

---

## 🌟 核心特色

1. **全国 348 统筹区 100% 全量覆盖**：
   - 涵盖全部 4 个直辖市、293 个地级市、30 个自治州、3 个盟、省直管县级行政区及新疆生产建设兵团下辖各师部。
2. **多层次严谨估算引擎 (`src/engine/calculator.ts`)**：
   - **职工基本医疗保险**：在职与退休人员多梯次区分、门诊共济累计起付与分段报销、门诊年度支付限额管控、退休起付倾斜减免。
   - **城乡居民基本医疗保险**：普通门诊统筹、“两病”（高血压/糖尿病）专项用药报销、基层/一级/二级/三级定点医疗机构住院梯次支付。
   - **大病保险 / 职工大额医疗费用补助**：合规自付段扣除、特例分段累进报销比例、多阶梯超高额兜底计算。
   - **跨省/跨地市异地就医直接结算**：异地长期居住、异地转诊转院备案比例下浮、未备案急诊及常住临时就医扣减计算。
3. **真实官方公文严格穿透溯源**：
   - 数据拒绝网络营销号与二手非官方信息，所有参数均与当地医疗保障局（`ybj.*.gov.cn`）或人民政府（`*.gov.cn`）现行红头公文发文字号、发文单位、实施日期及官方来源强绑定。
4. **工业级 7 重长效巡检与防错门禁 (`npm run check:all`)**：
   - **自动化政策一致性审计**：全面防范字段缺失与空值；
   - **智能防错规则库**：自动拦截报销比例倒挂、异常起付线混入；
   - **法定特例白名单认证**：对北京二级 78%、成都高档三级 68%、德州 72% 等红头特例进行公文白名单强认证；
   - **定期随机巡查与级联排查**：内置随机 35 统筹区抽检管道；一旦单点发现异常特征，自动触发全域级联扫描广播；
   - **7,184 项全域场景自动化断言**：覆盖全国所有地级市真实案例的高密度自动化测试套件，持续守卫计算精准。
5. **便民民生功能全矩阵**：
   - **双城待遇横向对比**：一键对比两地起付线、门诊限额、住院报销比例差异；
   - **预估凭证与海报导出**：支持一键生成精致的报销预估凭证卡片，方便转发分享给家中长辈；
   - **全国 12393 专线智能索引**：内置全国 348 统筹区医保经办热线与经办大厅指引，一键拨打与检索。

---

## 🏗️ 架构设计

```
china-medical-insurance/
├── src/
│   ├── data/                   # 全国 348 统筹区政策数据库
│   │   ├── beijing/            # 北京市统筹数据
│   │   ├── guangdong/          # 广东省 21 地市统筹数据
│   │   ├── sichuan/            # 四川省 21 市州统筹数据
│   │   ├── shaanxi/            # 陕西省 10 市及杨凌统筹数据
│   │   └── ...                 # 涵盖全国各省、自治区、直辖市及兵团
│   ├── engine/                 # 核心计算与质检引擎
│   │   ├── calculator.ts       # 核心报销预估计算器（门诊、住院、大病、异地）
│   │   ├── inspector/          # 智能体检引擎
│   │   │   ├── rules.ts        # 智能巡检规则库（含法定特例白名单）
│   │   │   └── inspector.ts    # 全量巡检、随机抽检与级联排查器
│   │   └── __tests__/          # 7,184 项全域场景自动化断言套件
│   ├── pages/                  # Uni-app 前端界面
│   │   ├── index/              # 首页城市选择与待遇总览
│   │   ├── calculator/         # 交互式医保报销预估计算器
│   │   ├── policy/             # 官方政策详情与红头公文穿透溯源
│   │   ├── compare/            # 双城医保政策横向深度对比
│   │   └── service/            # 全国 12393 智能医保服务专线与经办导航
│   └── scripts/                # 自动化运维与质检脚本
│       ├── run-smart-inspection.ts  # 智能体检执行入口
│       ├── monitor-policies.ts      # 医保官网连通与健康监控
│       └── deep-policy-audit.ts     # 深度公文一致性审计
└── .github/
    ├── workflows/              # GitHub Actions 自动化工作流 (CI/CD/Pages)
    └── ISSUE_TEMPLATE/         # 社区政策纠偏与反馈表单
```

---

## 🚀 快速上手

### 1. 本地运行

本项目推荐使用 Node.js 18+ 或 20+。

```bash
# 克隆仓库
git clone https://github.com/good9527/china-medical-insurance.git
cd china-medical-insurance

# 安装依赖
npm install

# 启动 H5 网页开发服务器（热重载）
npm run dev:h5
```

本地服务启动后，浏览器访问控制台提示地址（如 `http://localhost:5173/`）即可实时预览。

---

## 🧪 自动化测试与质量保障门禁

本项目建立了极其苛刻的自动化校验门禁：

| 指令 | 说明 |
| :--- | :--- |
| `npm run check:all` | **【完整质量防线】** 依次执行：公文审计 + 智能体检 + 官网连通性 + **7,184 项测算断言** + 生产构建 |
| `npm run test:calc` | **【场景测试】** 运行全域 7,184 项门诊、住院、异地自动化断言 |
| `npm run audit:deep` | **【深度公文审计】** 穿透检查 348 个统筹区全部关键字段、政策文号与逻辑自洽性 |
| `npm run audit:smart`| **【智能防错体检】** 扫描各统筹区是否存在比例倒挂、异常限额 |
| `npm run audit:patrol`| **【随机巡查管道】** 随机抽取 35 个统筹区执行深度核验 |
| `npm run build:h5` | **【生产静态编译】** 编译生成用于 GitHub Pages 或 Web 服务器的纯静态网页产物 |

---

## 🚢 部署上线

### GitHub Pages 免费自动化部署

本项目通过 `.github/workflows/deploy-pages.yml` 实现了提交即发布：
- 只要主分支有代码更新，GitHub Actions 会自动触发静态构建与校验；
- 校验通过后自动推送到 Pages 分支，全球 CDN 实时生效：
  👉 **[https://good9527.github.io/china-medical-insurance/](https://good9527.github.io/china-medical-insurance/)**

---

## 🤝 政策共建与纠偏反馈

中国医疗保险政策由各统筹区因地制宜动态调整。如发现您所在城市的**起付线、报销比例、封顶限额**在最新公文中有所调整，非常欢迎您参与共建：

1. 提交 **[政策纠错 Issue](https://github.com/good9527/china-medical-insurance/issues/new?template=policy_update.yml)**：附带当地医保局红头文件文号或官方链接；
2. 提交 **Pull Request**：修改对应 `src/data/<省份>/<城市>.ts` 中的参数，并同步更新测试断言。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开放源代码。
