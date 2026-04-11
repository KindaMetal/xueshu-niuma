import { validateDimensions, validateArchetypes, validateTemplates } from './core/Validator.js';
import { ScoringEngine } from './core/ScoringEngine.js';
import { ResultGenerator } from './core/ResultGenerator.js';
import { 
  mockDimensions, 
  mockArchetypes, 
  mockUserAnswers_INFP_Route, 
  mockUserAnswers_ESTJ_Route 
} from './data/mock/mock_data.js';

// 我们手动添加一个简单的 Result Template 用于测试引擎组装能力
const mockTemplates = {
  "templates": [
    {
      "id": "TPL_01",
      "style": "极简测试风",
      "main_title_format": "确诊标签：{archetype_name}",
      "subtitle_format": "检测你的核心因子：{top_traits}",
      "judgement_text": "在残酷科研界，你的表现符合：{behavior_summary}。由于你的 {top_traits}，建议你找个 {match_positive} 续命，千万远离 {match_negative}。",
      "match_section": {
        "best_match_title": "救命稻草",
        "best_match_desc": "{match_positive}",
        "worst_match_title": "催命符",
        "worst_match_desc": "{match_negative}"
      }
    }
  ]
};

console.log("=== 正在载入并校验伪 MBTI 数据核心 ===");
const dims = validateDimensions(mockDimensions);
const arches = validateArchetypes(mockArchetypes);
const tpls = validateTemplates(mockTemplates);
console.log("[✔] 数据契约护栏全部通过！\n");

// 实例化引擎
const scorer = new ScoringEngine(dims);
const generator = new ResultGenerator(arches, tpls);

function runSimulation(label, userAnswers) {
  console.log(`--- [开始模拟测试玩家：${label}] ---`);
  
  const { rawScores, code } = scorer.evaluate(userAnswers);
  console.log(`[引擎处理] 最终轴向分值：`, rawScores);
  console.log(`[引擎处理] 生成 MBTI 骨架代码：[ ${code} ]`);
  
  const finalPayload = generator.generatePayload(code);
  console.log(`\n============================`);
  console.log(`UI 宣发层最终 Payload 字典组装结果`);
  console.log(`============================`);
  console.log(JSON.stringify(finalPayload, null, 2));
  console.log(`------------------------------------\n`);
}

runSimulation("用户A (极端逃避/心碎路线)", mockUserAnswers_INFP_Route);
runSimulation("用户B (铁血卷王路线)", mockUserAnswers_ESTJ_Route);

console.log("=== Phase 1 全链路控制台连通测试大成功！ ===");
