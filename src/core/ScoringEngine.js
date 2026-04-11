/**
 * 心智算分黑匣子 (Scoring Engine)
 * 接收用户答题记录并计算最终 MBTI 人格类型代码。
 */

export class ScoringEngine {
  constructor(dimensionsConfig) {
    this.dimensions = dimensionsConfig.dimensions;
  }

  /**
   * 计算原始分数堆叠
   * @param {Array<Object>} answers 类似 [{ "E": 2, "N": 1 }, { "E": 1, "P": 3 }]
   * @returns {Object} 汇总对象，例如 { "E": 3, "I": 0, "S": 0, "N": 1, ... }
   */
  calculateRawScores(answers) {
    const scores = {};
    // 初始化所有维度的极大极小极性为 0
    this.dimensions.forEach(dim => {
      scores[dim.left.code] = 0;
      scores[dim.right.code] = 0;
    });

    // 累加计算
    answers.forEach(weightObj => {
      for (const [traitCode, value] of Object.entries(weightObj)) {
        if (scores[traitCode] !== undefined) {
          scores[traitCode] += value;
        }
      }
    });
    
    return scores;
  }

  /**
   * 提纯为最终的 4 字母 MBTI 代码
   * @param {Object} rawScores calculateRawScores 返回的汇总分
   * @returns {String} 例如 "INFP"或"ESTJ"
   */
  determineArchetypeCode(rawScores) {
    let finalCode = "";
    
    this.dimensions.forEach(dim => {
      const leftScore = rawScores[dim.left.code] || 0;
      const rightScore = rawScores[dim.right.code] || 0;
      
      // 简单粗暴的比较，左右谁大选谁，碰掉平局默认取左侧(或者做特殊平局处理)
      if (leftScore >= rightScore) {
        finalCode += dim.left.code;
      } else {
        finalCode += dim.right.code;
      }
    });
    
    return finalCode;
  }

  /**
   * 全链路闭环方法：走入参直接吐出 Code
   */
  evaluate(answers) {
    const rawScores = this.calculateRawScores(answers);
    const code = this.determineArchetypeCode(rawScores);
    return { rawScores, code };
  }
}
