/**
 * 本地反馈检索与巡检辅助脚本
 * 运行方式: npm run feedback:list
 * 作用: 调取 GitHub 仓库公开的待处理纠错 Issue，方便本地配合 Antigravity 修改
 */
import { execSync } from 'child_process';

async function fetchFeedback() {
  const repo = 'good9527/china-medical-insurance';
  console.log(`\n======================================================`);
  console.log(`🔍 正在检查 GitHub 官方纠错反馈通道 ...`);
  console.log(`📌 仓库 Issues 地址: https://github.com/${repo}/issues`);
  console.log(`======================================================\n`);

  // 1. 尝试使用本地 gh CLI (若已登录)
  try {
    const ghOutput = execSync(`gh issue list -R ${repo} --state open --limit 20`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    if (ghOutput.trim()) {
      console.log(`📋 当前通过 GitHub CLI 检索到待处理 Issue：\n`);
      console.log(ghOutput);
      printGuidance();
      return;
    } else {
      console.log(`🎉 暂无待处理的政策纠错 Issue！当前数据处于最新状态。\n`);
      printGuidance();
      return;
    }
  } catch (e) {
    // gh CLI 未认证或无权限，切换到标准 API
  }

  // 2. 尝试使用公开 REST API
  try {
    const url = `https://api.github.com/repos/${repo}/issues?state=open`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'China-Medical-Insurance-CLI',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.ok) {
      const issues: any[] = await res.json();
      const corrections = issues.filter(i => !i.pull_request);

      if (corrections.length === 0) {
        console.log(`🎉 暂无未处理的政策纠错 Issue！当前所有统筹区数据均处于最新状态。\n`);
      } else {
        console.log(`共发现 ${corrections.length} 项开放中的政策纠错反馈：\n`);
        corrections.forEach((item, idx) => {
          console.log(`[#${idx + 1}] Issue #${item.number}: ${item.title}`);
          console.log(`    提交者: @${item.user?.login || '匿名'} | 提交时间: ${item.created_at?.slice(0, 10)}`);
          console.log(`    链接: ${item.html_url}`);
          const bodySnippet = (item.body || '').split('\n').filter((l: string) => l.trim()).slice(0, 3).join(' | ');
          console.log(`    摘要: ${bodySnippet.slice(0, 100)}...`);
          console.log(`------------------------------------------------------`);
        });
      }
    } else {
      console.log(`👉 您可直接在浏览器中打开: https://github.com/${repo}/issues 查看最新反馈`);
    }
  } catch (err: any) {
    console.log(`👉 您可直接在浏览器中打开: https://github.com/${repo}/issues 查看最新反馈`);
  }

  printGuidance();
}

function printGuidance() {
  console.log(`\n💡 本机 0 成本 AI 协同处理指南：`);
  console.log(`1. 当您在 Gmail (keepkid0824@gmail.com) 收到 GitHub 的新 Issue 提醒时；`);
  console.log(`2. 直接在当前 Antigravity 聊天窗口中说：`);
  console.log(`   “帮我处理最新的纠错反馈：西安的门诊起付线调整为 200 元，依据发文是西医保发〔2024〕10号”`);
  console.log(`3. Antigravity 会在本地自动修改政策文件、运行 6900+ 条测算断言测试，并通过 git 提交部署！\n`);
}

fetchFeedback();
