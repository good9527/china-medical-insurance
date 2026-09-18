import { allCities } from '../data';

console.log('====================================================');
console.log('🚀 启动 344 个统筹区医保待遇参数与官方公文地毯式深度核验');
console.log('====================================================');

interface Anomaly {
  cityCode: string;
  cityName: string;
  provinceName: string;
  type: string;
  detail: string;
}

const anomalies: Anomaly[] = [];

for (const city of allCities) {
  const code = city.cityCode;
  const name = city.cityName;
  const prov = city.provinceName;

  const empOut = city.employee.outpatient;
  const empIn = city.employee.inpatient;
  const resOut = city.resident.outpatient;
  const resIn = city.resident.inpatient;

  // 1. 门诊封顶线 < 门诊起付线 (致命逻辑错误)
  if (empOut.annualCap > 0 && empOut.annualCap < 999999 && empOut.annualCap <= empOut.annualDeductible) {
    anomalies.push({
      cityCode: code,
      cityName: name,
      provinceName: prov,
      type: '职工门诊封顶/起付倒挂',
      detail: `封顶线(¥${empOut.annualCap}) <= 起付线(¥${empOut.annualDeductible})`
    });
  }

  if (resOut.annualCap > 0 && resOut.annualCap <= resOut.annualDeductible) {
    anomalies.push({
      cityCode: code,
      cityName: name,
      provinceName: prov,
      type: '居民门诊封顶/起付倒挂',
      detail: `封顶线(¥${resOut.annualCap}) <= 起付线(¥${resOut.annualDeductible})`
    });
  }

  // 2. 退休总比例超过 100%
  for (const [tierKey, tier] of Object.entries(empIn.tierBenefits)) {
    const totalRatio = tier.reimbursementRatio + (tier.retireeRatioBonus || 0);
    if (totalRatio > 1.0) {
      anomalies.push({
        cityCode: code,
        cityName: name,
        provinceName: prov,
        type: '职工住院退休报销比例超标',
        detail: `${tierKey} 在职 ${(tier.reimbursementRatio * 100).toFixed(0)}% + 退休上浮 ${((tier.retireeRatioBonus || 0) * 100).toFixed(0)}% = ${(totalRatio * 100).toFixed(0)}% > 100%`
      });
    }
  }

  for (const [tierKey, tier] of Object.entries(empOut.tierBenefits)) {
    const totalRatio = tier.reimbursementRatio + (tier.retireeRatioBonus || 0);
    if (totalRatio > 1.0) {
      anomalies.push({
        cityCode: code,
        cityName: name,
        provinceName: prov,
        type: '职工门诊退休报销比例超标',
        detail: `${tierKey} 在职 ${(tier.reimbursementRatio * 100).toFixed(0)}% + 退休上浮 ${((tier.retireeRatioBonus || 0) * 100).toFixed(0)}% = ${(totalRatio * 100).toFixed(0)}% > 100%`
      });
    }
  }

  // 3. 住院起付线异常检查 (三级起付线 > 3000 或 < 200，社区起付线 > 1500)
  if (empIn.tierBenefits.tier3 && (empIn.tierBenefits.tier3.deductible > 3000 || empIn.tierBenefits.tier3.deductible < 200)) {
    anomalies.push({
      cityCode: code,
      cityName: name,
      provinceName: prov,
      type: '职工三级住院起付线异常',
      detail: `¥${empIn.tierBenefits.tier3.deductible}`
    });
  }

  // 4. 居民住院三级报销比例异常 (< 40% 或 > 85%)
  if (resIn.tierBenefits.tier3 && (resIn.tierBenefits.tier3.reimbursementRatio < 0.40 || resIn.tierBenefits.tier3.reimbursementRatio > 0.85)) {
    anomalies.push({
      cityCode: code,
      cityName: name,
      provinceName: prov,
      type: '居民三级住院比例异常',
      detail: `${(resIn.tierBenefits.tier3.reimbursementRatio * 100).toFixed(0)}%`
    });
  }

  // 5. 大病保险起付线异常 (> 50000 或 <= 0)
  if (city.resident.catastrophic) {
    const catDed = city.resident.catastrophic.deductible;
    if (catDed > 50000 || (catDed <= 0 && city.cityName !== '上海市')) {
      anomalies.push({
        cityCode: code,
        cityName: name,
        provinceName: prov,
        type: '居民大病起付线异常',
        detail: `¥${catDed}`
      });
    }
  }

  // 6. 公文摘录与数据字段的一致性深度比对
  const allDocQuotes = (city.sourceDocs || []).map(d => d.summaryQuote).join(' ');
  
  // 检查门诊起付线是否与公文矛盾
  const mDed = allDocQuotes.match(/在职(?:职工)?(?:门诊)?起付(?:线|标准)(?:为|是|：)?([0-9]{2,4})元/);
  if (mDed) {
    const parsedDed = parseInt(mDed[1], 10);
    if (parsedDed !== empOut.annualDeductible) {
      anomalies.push({
        cityCode: code,
        cityName: name,
        provinceName: prov,
        type: '公文摘录与职工门诊起付线冲突',
        detail: `公文摘录提及在职起付线 ¥${parsedDed}，但代码配置为 ¥${empOut.annualDeductible}`
      });
    }
  }

  // 检查退休门诊起付线是否与公文矛盾
  const mRetDed = allDocQuotes.match(/退休(?:人员)?(?:门诊)?起付(?:线|标准)(?:为|是|：)?([0-9]{2,4})元/);
  if (mRetDed) {
    const parsedRetDed = parseInt(mRetDed[1], 10);
    if (empOut.annualDeductibleRetiree !== undefined && parsedRetDed !== empOut.annualDeductibleRetiree) {
      anomalies.push({
        cityCode: code,
        cityName: name,
        provinceName: prov,
        type: '公文摘录与退休门诊起付线冲突',
        detail: `公文摘录提及退休起付线 ¥${parsedRetDed}，但代码配置为 ¥${empOut.annualDeductibleRetiree}`
      });
    }
  }

  // 检查门诊封顶线是否与公文矛盾
  const mCap = allDocQuotes.match(/在职(?:职工)?(?:门诊)?(?:最高支付限额|封顶线)(?:为|是|：)?([0-9]{3,5})元/);
  if (mCap) {
    const parsedCap = parseInt(mCap[1], 10);
    if (parsedCap !== empOut.annualCap) {
      anomalies.push({
        cityCode: code,
        cityName: name,
        provinceName: prov,
        type: '公文摘录与职工门诊限额冲突',
        detail: `公文摘录提及在职限额 ¥${parsedCap}，但代码配置为 ¥${empOut.annualCap}`
      });
    }
  }
}

console.log(`\n核验完成！共扫描 344 个统筹区，发现潜在异常: ${anomalies.length} 项\n`);
anomalies.forEach((a, i) => {
  console.log(`${i + 1}. [${a.provinceName} ${a.cityName} (${a.cityCode})] [${a.type}]: ${a.detail}`);
});
