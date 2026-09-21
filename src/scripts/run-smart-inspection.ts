import { PolicyInspector } from '../engine/inspector';

const args = process.argv.slice(2);
let mode = 'full';
let cityCode: string | undefined;
let category: string | undefined;
let sampleSize = 35;

for (const arg of args) {
  if (arg.startsWith('--mode=')) {
    mode = arg.split('=')[1];
  } else if (arg.startsWith('--city=')) {
    cityCode = arg.split('=')[1];
  } else if (arg.startsWith('--category=')) {
    category = arg.split('=')[1];
  } else if (arg.startsWith('--size=')) {
    sampleSize = parseInt(arg.split('=')[1], 10);
  }
}

const inspector = new PolicyInspector();

if (mode === 'patrol') {
  console.log(`\n🎲 启动定期随机抽查巡检模式 (抽查样本量: ${sampleSize} 个统筹区)...`);
  const { sampleSummary, cascadeTriggered, cascadeSummary } = inspector.randomSamplePatrol({ sampleSize });
  console.log(PolicyInspector.formatConsoleReport(sampleSummary));

  if (cascadeTriggered && cascadeSummary) {
    console.log(`\n⚡ 警报触发！抽查中检出风险问题，系统自动启动【全国级联穿透排查机制】！`);
    console.log(PolicyInspector.formatConsoleReport(cascadeSummary));
  } else {
    console.log(`\n✅ 抽查体检完成！本次抽查的 ${sampleSize} 个样本统筹区全部健康，未触发级联告警。`);
  }
} else if (mode === 'cascade') {
  console.log(`\n⚡ 启动指定病灶全国级联穿透排查模式 (目标城市: ${cityCode || '全网'}, 目标病灶: ${category || '全病灶'})...`);
  const summary = inspector.cascadeInvestigate({
    targetCityCode: cityCode,
    targetCategory: category as any
  });
  console.log(PolicyInspector.formatConsoleReport(summary));
} else {
  console.log(`\n🔍 启动全量 348 统筹区智能多维巡检模式...`);
  const summary = inspector.inspectAll();
  console.log(PolicyInspector.formatConsoleReport(summary));
}
