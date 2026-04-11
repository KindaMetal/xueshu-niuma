// 极简假跑闭环数据集合 (Mock DataSet v1)
// 仅包含验证四轴逻辑所需的最小量特征数据。

// 假装这是从服务器 fetch 来的内容
export const mockDimensions = {
  "dimensions": [
    { "id": "E_vs_I", "left": { "code": "E" }, "right": { "code": "I" } },
    { "id": "S_vs_N", "left": { "code": "S" }, "right": { "code": "N" } },
    { "id": "T_vs_F", "left": { "code": "T" }, "right": { "code": "F" } },
    { "id": "J_vs_P", "left": { "code": "J" }, "right": { "code": "P" } }
  ]
};

export const mockArchetypes = {
  "archetypes": {
    "ESTJ": { 
      "name": "学术包工头", 
      "traits": ["组会麦霸", "维物做题家"],
      "summary": "冷酷无情的纪律委员" 
    },
    "INFP": { 
      "name": "纯血实验耗材",
      "traits": ["地缚灵", "破防大怨种"],
      "summary": "天天抱着数据哭"
    },
    "ENTP": { 
      "name": "导师高血压源泉",
      "traits": ["组会麦霸", "赛博画饼师"],
      "summary": "开题大圆饼大师"
    }
  }
};

// 一组成心导向 INFP 型的答题记录
export const mockUserAnswers_INFP_Route = [
  // 选了 I：拒绝社交
  { "I": 2, "P": 1 },
  // 选了 N：脑海里发了Nature
  { "N": 3, "F": 1 },
  // 选了 F：疯狂焦虑玉玉
  { "F": 3, "I": 1 },
  // 选了 P：死线赌徒不逼自己不动手
  { "P": 2, "N": 1 }
];

// 一组成心导向 ESTJ 型的答题记录
export const mockUserAnswers_ESTJ_Route = [
  { "E": 2, "J": 1 },
  { "S": 3, "T": 1 },
  { "T": 3, "J": 1 },
  { "J": 2, "S": 1 }
];
