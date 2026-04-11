/**
 * 全维心智互斥与共鸣雷达引擎
 * 不使用写死的字符串，而是通过心智极轴字面量（MBTI 4维坐标差异）来动态搜寻全库。
 */

export class MatchEngine {
  constructor(archetypesConfig) {
    this.archetypes = archetypesConfig.archetypes;
    // 获取当前库里真实存在的 ID 列表，防止算出不在库里的角色引发崩溃
    this.availableCodes = Object.keys(this.archetypes);
  }

  // 算两位角色性格的区别度 (0 代表一模一样，4 代表完全相反天敌)
  _calculateDiff(code1, code2) {
    let diff = 0;
    for (let i = 0; i < 4; i++) {
        if (code1[i] !== code2[i]) diff++;
    }
    return diff;
  }

  // 给定一个性格 Code，搜寻他的极品知音与天生死敌
  findMatches(targetCode) {
    let bestCode = null;
    let worstCode = null;

    let minDiffScore = 999;
    let maxDiffScore = -1;

    for (const testCode of this.availableCodes) {
      if (testCode === targetCode) continue;

      const diff = this._calculateDiff(targetCode, testCode);
      
      // 我们定义“完全相斥”(diff=4)是死敌，如果没4找3
      if (diff > maxDiffScore) {
          maxDiffScore = diff;
          worstCode = testCode;
      }
      
      // 我们定义“知音”在学术界是性格有2点互补（比如E带I，J带P）的同行
      // 这里的算法计算距离绝对差 |diff - 2| 越近越好
      const soulmateScore = Math.abs(diff - 2); 
      if (soulmateScore < minDiffScore) {
          minDiffScore = soulmateScore;
          bestCode = testCode;
      }
    }

    // fallback 为自己，以防库里只有一个数据
    return {
      bestMatchCode: bestCode || targetCode,
      worstMatchCode: worstCode || targetCode
    };
  }
}
