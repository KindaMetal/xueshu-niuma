/**
 * 首测流失率与裂变触发率监控遥测核心 (Telemetry Stub)
 */

export const Tracker = {
  // 记录答题进度，发送给预制端点
  logNavigation: (fromIndex, toIndex, optionSelected) => {
    const payload = {
      event: 'QUESTION_ANSWERED',
      from: fromIndex,
      to: toIndex,
      option: optionSelected,
      timestamp: new Date().toISOString()
    };
    console.log(`[Telemetry] 埋点发送 ->`, payload);
    // TODO: Phase 4 接入真实后端
  },

  logDropOff: (currentIndex) => {
    // 这里可以通过 beforeunload 事件触发
    console.warn(`[Telemetry] 检测到逃逸行为！流失节点 -> 题 ${currentIndex}`);
  },

  logShare: (resultCode) => {
    const payload = {
      event: 'CARD_EXPORTED',
      mbtiCode: resultCode,
      timestamp: new Date().toISOString()
    };
    console.log(`[Telemetry] 👑 裂变事件触发！导出了人格 -> ${resultCode}`, payload);
  }
};
