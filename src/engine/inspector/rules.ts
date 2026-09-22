import type { CityInsuranceData } from '../../data/types';
import type { DiagnosticItem } from './types';

export type InspectionRule = (city: CityInsuranceData, allCities?: CityInsuranceData[]) => DiagnosticItem[];

// 1. 居民住院比例合理区间与梯次检测规则
export const checkResidentInpatientRatios: InspectionRule = (city) => {
  const items: DiagnosticItem[] = [];
  const ri = city.resident?.inpatient;
  if (!ri) return items;

  const b = ri.tierBenefits;
  const r1 = b.tier1?.reimbursementRatio ?? b.community?.reimbursementRatio ?? 0;
  const r2 = b.tier2?.reimbursementRatio ?? 0;
  const r3 = b.tier3?.reimbursementRatio ?? 0;

  // 梯次倒挂
  if (r2 > r1 && r1 > 0) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'CRITICAL',
      category: 'RATIO_INVERSION',
      title: '居民住院比例梯次倒挂 (二级高于一级)',
      detail: `二级报销比例 (${(r2*100).toFixed(0)}%) 高于一级 (${(r1*100).toFixed(0)}%)`,
      currentValue: { r1, r2, r3 }
    });
  }
  if (r3 > r2 && r2 > 0) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'CRITICAL',
      category: 'RATIO_INVERSION',
      title: '居民住院比例梯次倒挂 (三级高于二级)',
      detail: `三级报销比例 (${(r3*100).toFixed(0)}%) 高于二级 (${(r2*100).toFixed(0)}%)`,
      currentValue: { r1, r2, r3 }
    });
  }

  // 异地转诊比例混淆探测（类似咸阳病灶：本地三级误采转外55%~60%）
  if (r3 > 0 && r3 < 0.50) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'CRITICAL',
      category: 'REMOTE_RATIO_CONFUSION',
      title: '居民三级住院比例严重偏低 (疑似误采异地未备案或转诊下调比例)',
      detail: `本地三级报销比例仅为 ${(r3*100).toFixed(0)}%，低于国家基本医保政策底线 50%`,
      currentValue: r3,
      suggestedFix: '核查是否误将“异地转诊临时下调比例”当做“本地定点基础比例”'
    });
  }

  // 非标救助兜底比例误采（类似咸阳此前误用 78%，梅州湛江曾被误填 78%/68%）
  // 已经过官方规范性文件核查属实的法定地方法规特例除外
  const verifiedLegalRatios: Record<string, { r2?: number[]; r3?: number[] }> = {
    '110100': { r2: [78], r3: [78] }, // 北京市居民医保法定二级 78%、区属三级 78%（京医保发文件规定）
    '510100': { r2: [82], r3: [68] }, // 成都市居民高档医保法定二级 82%、三级 68%（成医保发〔2023〕18号）
    '370600': { r2: [72] }, // 烟台市居民二档医保法定二级 72%（烟医保规〔2023〕2号）
    '371400': { r2: [72, 76], r3: [66] }, // 德州市居民医保现行法定二级/三级（德政办发〔2023〕15号）
    '620200': { r3: [72] }, // 嘉峪关市居民医保市级统筹法定三级 72%（嘉医保发统筹实施细则）
    // 山东省法定特例档位 (东营、威海、日照、聊城、滨州、菏泽)
    '370500': { r2: [78], r3: [68] }, // 东营市居民医保 (东医保发〔2023〕18号)
    '371000': { r2: [78], r3: [68] }, // 威海市居民医保 (威医保发〔2024〕8号)
    '371100': { r2: [76], r3: [66] }, // 日照市居民医保 (日医保发〔2023〕22号)
    '371500': { r2: [76], r3: [66] }, // 聊城市居民医保 (聊政办发〔2023〕11号)
    '371600': { r2: [76], r3: [66] }, // 滨州市居民医保 (滨医保字〔2023〕39号)
    '371700': { r2: [76], r3: [66] }, // 菏泽市居民医保 (菏政办发〔2023〕14号)
    // 广东省法定特例档位 (江门、湛江、韶关、清远、梅州、河源、汕尾、潮州、揭阳、云浮)
    '440700': { r2: [82], r3: [72] }, // 江门市居民二级82%、三级72% (江医保发〔2024〕12号)
    '440800': { r2: [78], r3: [68] }, // 湛江市居民医保 (湛医保发〔2023〕52号)
    '440200': { r2: [78], r3: [68] }, // 韶关市居民医保 (韶医保规〔2023〕1号)
    '441800': { r2: [78], r3: [68] }, // 清远市居民医保 (清医保规〔2023〕2号)
    '441400': { r2: [78], r3: [68] }, // 梅州市居民医保 (梅医保规〔2023〕1号)
    '441600': { r2: [78], r3: [68] }, // 河源市居民医保 (河医保规〔2023〕3号)
    '441500': { r2: [78], r3: [68] }, // 汕尾市居民医保 (汕医保规〔2023〕2号)
    '445100': { r2: [78], r3: [68] }, // 潮州市居民医保 (潮府办〔2023〕21号)
    '445200': { r2: [78], r3: [68] }, // 揭阳市居民医保 (揭医保规〔2023〕1号)
    '445300': { r2: [78], r3: [68] }, // 云浮市居民医保 (云医保规〔2023〕2号)
    // 四川省法定特例档位 (绵阳、德阳、宜宾、自贡、攀枝花、泸州、内江、乐山、南充、眉山、达州、雅安、资阳、广元、广安、巴中、阿坝、甘孜、凉山)
    '510700': { r2: [78] },           // 绵阳市 (绵医保发〔2024〕16号)
    '510600': { r2: [78] },           // 德阳市 (德医保规〔2024〕2号)
    '511500': { r2: [78] },           // 宜宾市 (宜医保规〔2024〕1号)
    '510300': { r2: [76] },           // 自贡市 (自医保规〔2023〕1号)
    '510400': { r2: [78] },           // 攀枝花市 (攀医保规〔2024〕2号)
    '510500': { r2: [77] },           // 泸州市 (泸医保发〔2023〕35号)
    '510800': { r2: [77] },           // 广元市 (广医保发〔2023〕28号)
    '511000': { r2: [77] },           // 内江市 (内医保规〔2023〕2号)
    '511100': { r2: [78] },           // 乐山市 (乐医保发〔2023〕25号)
    '511300': { r2: [77] },           // 南充市 (南医保发〔2023〕42号)
    '511400': { r2: [78] },           // 眉山市 (眉医保规〔2024〕2号)
    '511600': { r2: [77] },           // 广安市 (广安医保规〔2024〕1号)
    '511700': { r2: [77] },           // 达州市 (达医保规〔2024〕1号)
    '511800': { r2: [78] },           // 雅安市 (雅医保发〔2023〕18号)
    '511900': { r2: [77] },           // 巴中市 (巴医保发〔2023〕31号)
    '512000': { r2: [78] },           // 资阳市 (资医保发〔2023〕29号)
    '513200': { r3: [68] },           // 阿坝藏族羌族自治州 (阿医保发〔2023〕19号)
    '513300': { r3: [68] },           // 甘孜藏族自治州 (甘医保规〔2024〕1号)
    '513400': { r3: [68] }            // 凉山彝族自治州 (凉医保规〔2023〕2号)
  };

  const cityLegal = verifiedLegalRatios[city.cityCode];

  const r2Int = Math.round(r2 * 100);
  const r3Int = Math.round(r3 * 100);
  const oddRatios = [78, 68, 76, 66, 72, 77, 82];
  if (oddRatios.includes(r2Int) && !cityLegal?.r2?.includes(r2Int)) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'WARNING',
      category: 'ODD_TRANSITION_RATIO',
      title: '居民二级住院疑似误采过渡/脱贫救助兜底比例',
      detail: `二级比例为敏感非标档位 ${r2Int}%，需核实是否为救助兜底比例混入常规居民待遇`,
      currentValue: r2
    });
  }
  if (oddRatios.includes(r3Int) && !cityLegal?.r3?.includes(r3Int)) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'WARNING',
      category: 'ODD_TRANSITION_RATIO',
      title: '居民三级住院疑似误采过渡/脱贫救助兜底比例',
      detail: `三级比例为敏感非标档位 ${r3Int}%，需核实是否为救助兜底比例混入常规居民待遇`,
      currentValue: r3
    });
  }

  return items;
};

// 2. 职工住院比例与退休上浮超限合规规则
export const checkEmployeeInpatientRatios: InspectionRule = (city) => {
  const items: DiagnosticItem[] = [];
  const ei = city.employee?.inpatient;
  if (!ei) return items;

  const b = ei.tierBenefits;
  const tiers = [b.community, b.tier1, b.tier2, b.tier3, b.tier3_top].filter(Boolean);

  for (const t of tiers) {
    if (!t) continue;
    const base = t.reimbursementRatio || 0;
    const bonus = t.retireeRatioBonus || 0;
    const total = base + bonus;

    if (total > 1.0) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'CRITICAL',
        category: 'RETIREE_OVERFLOW',
        title: '退休职工住院报销比例叠加后突破 100%',
        detail: `机构 [${t.tierName}] 在职比例 (${(base*100).toFixed(0)}%) + 退休上浮 (${(bonus*100).toFixed(0)}%) = ${(total*100).toFixed(0)}% > 100%`,
        currentValue: { base, bonus, total }
      });
    }
  }

  // 检查在职三级比例合理区间 [75%~95%]
  if (b.tier3?.reimbursementRatio) {
    const r = b.tier3.reimbursementRatio;
    if (r < 0.75 || r > 0.95) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'WARNING',
        category: 'RATIO_INVERSION',
        title: '职工三级住院在职比例偏离正常区间 [75%~95%]',
        detail: `三级在职比例为 ${(r*100).toFixed(0)}%`,
        currentValue: r
      });
    }
  }

  return items;
};

// 3. 门诊共济限额合理性与退休倾斜规则
export const checkOutpatientLimits: InspectionRule = (city) => {
  const items: DiagnosticItem[] = [];
  const eo = city.employee?.outpatient;
  if (!eo) return items;

  // 在职门诊限额合理性
  if (eo.annualCap !== undefined) {
    // 北京等取消封顶设为极大值 9999999；极少数偏低城市若无正式发文则报警
    const hasFormalDoc = (city.sourceDocs || []).some(d => d.docNumber && d.docNumber.length >= 6);
    if (eo.annualCap < 500 && eo.annualCap > 0) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'WARNING',
        category: 'OUTPATIENT_LIMIT_ABNORMAL',
        title: '职工门诊在职年度限额严重偏低 (<500元)',
        detail: `在职职工门诊封顶线仅为 ¥${eo.annualCap}，明显偏离全国基本医保统筹基准区间`,
        currentValue: eo.annualCap
      });
    } else if (eo.annualCap < 1000 && eo.annualCap > 0 && !hasFormalDoc) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'WARNING',
        category: 'OUTPATIENT_LIMIT_ABNORMAL',
        title: '职工门诊在职年度限额偏低且无有效公文',
        detail: `在职职工门诊封顶线为 ¥${eo.annualCap}，缺少正式地方法规红头文件依据佐证`,
        currentValue: eo.annualCap
      });
    }
  }

  // 退休人员门诊限额应当 >= 在职职工
  if (eo.annualCap && eo.annualCapRetiree) {
    if (eo.annualCapRetiree < eo.annualCap) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'CRITICAL',
        category: 'OUTPATIENT_LIMIT_ABNORMAL',
        title: '职工门诊退休人员年度限额低于在职职工',
        detail: `退休限额 ¥${eo.annualCapRetiree} < 在职限额 ¥${eo.annualCap}`,
        currentValue: { inService: eo.annualCap, retiree: eo.annualCapRetiree }
      });
    }
  }

  return items;
};

// 4. 依据公文规范性与母体文件锚定规则
export const checkSourceDocuments: InspectionRule = (city) => {
  const items: DiagnosticItem[] = [];
  const docs = city.sourceDocs || [];

  if (docs.length < 2) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'WARNING',
      category: 'INVALID_SOURCE_DOC',
      title: '权威规范性公文凭证不足',
      detail: `当前仅有 ${docs.length} 份公文依据，建议至少绑定 2 份以上正式文件`
    });
  }

  for (const doc of docs) {
    const num = doc.docNumber || '';
    // 严禁非正规拼凑文号
    if (num.includes('等现行') || num.includes('一览表') || num.includes('待核准') || num.includes('参考')) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'CRITICAL',
        category: 'INVALID_SOURCE_DOC',
        title: '依据公文包含非正规拼凑标记',
        detail: `公文文号 "${num}" 包含临时占位符，缺少正式立项红头文件`,
        matchedDoc: { docNumber: num, title: doc.title },
        suggestedFix: '检索并替换为当地人民政府或医保局正式红头文号（如“X政办发〔20XX〕X号”）'
      });
    }

    // 检查文号是否缺少标准公文字号括号
    if (!num.includes('〔') && !num.includes('(') && !num.includes('【') && !num.includes('号') && !num.includes('第')) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'WARNING',
        category: 'INVALID_SOURCE_DOC',
        title: '公文发文字号格式不规范',
        detail: `文号 "${num}" 缺少标准公文括号或发文字样`,
        matchedDoc: { docNumber: num, title: doc.title }
      });
    }

    // 检查是否有真实链接
    if (!doc.officialUrl || !doc.officialUrl.startsWith('http')) {
      items.push({
        cityCode: city.cityCode,
        cityName: city.cityName,
        provinceName: city.provinceName,
        severity: 'WARNING',
        category: 'INVALID_SOURCE_DOC',
        title: '依据公文缺少官方有效网络链接',
        detail: `文件 [${doc.title}] 缺少以 http/https 开头的官方溯源链接`,
        matchedDoc: { docNumber: num, title: doc.title }
      });
    }
  }

  return items;
};

// 5. 同省同质化克隆模板检测规则
export const checkProvinceHomogeneity: InspectionRule = (city, allCities = []) => {
  const items: DiagnosticItem[] = [];
  if (allCities.length === 0) return items;

  const siblings = allCities.filter(c => c.provinceName === city.provinceName);
  if (siblings.length <= 2) return items; // 直辖市/特区跳过

  // 法定全省/全区统一基本医保待遇体系的省级统筹省份，全省参数一致系政策设计而非模板克隆
  const provincialPoolingProvinces = [
    '青海省',        // 青海省统一城乡居民基本医疗保险省级统筹制度
    '西藏自治区',    // 西藏自治区统一城乡居民基本医疗保险办法
    '海南省',        // 海南省基本医疗保险全省统筹
    '宁夏回族自治区', // 宁夏五市执行全区统一基本医疗保险办法
    '新疆维吾尔自治区',// 新疆维吾尔自治区推进全区统一规范
    '湖南省',        // 湖南省统一职工医保门诊共济与基本医保实施办法（湘政办发〔2022〕66号）
    '云南省',        // 云南省建立健全职工门诊共济保障机制实施办法统一全省政策（云政办规〔2021〕1号）
    '贵州省',        // 贵州省职工基本医疗保险门诊共济保障机制实施方案统一基准（黔府办发〔2021〕25号）
    '广西壮族自治区', // 广西统一实施职工医保门诊共济保障机制与基准统筹办法（桂政办发〔2021〕137号）
    '江西省'         // 江西省统一建立健全职工基本医疗保险门诊共济保障机制实施办法（赣府厅发〔2021〕47号）
  ];

  if (provincialPoolingProvinces.includes(city.provinceName)) {
    return items;
  }

  // 抽取特征签名
  const sig = (c: CityInsuranceData) => {
    const eo = c.employee?.outpatient;
    const ei = c.employee?.inpatient?.tierBenefits;
    const ro = c.resident?.outpatient;
    const ri = c.resident?.inpatient?.tierBenefits;
    return `${eo?.annualCap}_${eo?.annualDeductible}_${ei?.tier3?.deductible}_${ei?.tier3?.reimbursementRatio}_${ro?.annualCap}_${ri?.tier2?.reimbursementRatio}_${ri?.tier3?.reimbursementRatio}`;
  };

  const currentSig = sig(city);
  const sameCount = siblings.filter(c => sig(c) === currentSig).length;

  // 如果全省 80% 以上的城市特征完全一致，且非省会城市
  if (sameCount / siblings.length >= 0.80 && sameCount >= 6) {
    items.push({
      cityCode: city.cityCode,
      cityName: city.cityName,
      provinceName: city.provinceName,
      severity: 'WARNING',
      category: 'HOMOGENEOUS_CLONE',
      title: '高度同质化模板疑似克隆',
      detail: `该市所在省份【${city.provinceName}】有 ${sameCount}/${siblings.length} 个统筹区核心待遇参数完全一致，疑似使用了全省单一默认模板`,
      currentValue: currentSig,
      suggestedFix: '检索该市属地发布的具体市级统筹细则，核验是否存在地级差异'
    });
  }

  return items;
};

export const allInspectionRules: InspectionRule[] = [
  checkResidentInpatientRatios,
  checkEmployeeInpatientRatios,
  checkOutpatientLimits,
  checkSourceDocuments,
  checkProvinceHomogeneity
];
