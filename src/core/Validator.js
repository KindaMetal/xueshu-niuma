/**
 * 数据契约护栏 (Schema Validators)
 * 严格验证从 JSON 读入的数据，任何由于粗心导致的数据缺失直接报错阻断引擎启动。
 */

export function validateDimensions(data) {
  if (!data?.dimensions || !Array.isArray(data.dimensions)) throw new Error("dimensions.json: 缺失核心 dimensions 数组");
  data.dimensions.forEach(dim => {
    if (!dim.id || !dim.left || !dim.right) throw new Error(`Dimension ${dim.id || 'Unknown'} 格式残缺`);
    if (!dim.left.code || !dim.right.code) throw new Error(`Dimension ${dim.id} 缺失极坐标代码 (Code)`);
  });
  return data;
}

export function validateArchetypes(data) {
  if (!data?.archetypes || typeof data.archetypes !== 'object') throw new Error("archetypes_pool.json: 缺失 archetypes 字典对象");
  for (const [key, archetype] of Object.entries(data.archetypes)) {
    if (!archetype.name || !archetype.traits || !Array.isArray(archetype.traits)) {
      throw new Error(`Archetype ${key} 格式残缺，必须包含 name 和 traits数组`);
    }
  }
  return data;
}

export function validateScenarios(data) {
  if (!data?.scenarios || !Array.isArray(data.scenarios)) throw new Error("scenarios_pool.json: 缺失 scenarios 数组");
  data.scenarios.forEach(scene => {
    if (!scene.id || !scene.text) throw new Error(`Scenario ${scene.id || 'Unknown'} 缺失题干`);
    if (!scene.options || !Array.isArray(scene.options) || scene.options.length === 0) {
      throw new Error(`Scenario ${scene.id} 必须包含有效选项(options)`);
    }
    // 深度验证每道题的权重是否为数字
    scene.options.forEach((opt, idx) => {
      if (!opt.text || !opt.weight) throw new Error(`Scenario ${scene.id} 选项 ${idx} 缺失文本或权重对象`);
      for (const [axis, val] of Object.entries(opt.weight)) {
        if (typeof val !== 'number') throw new Error(`Scenario ${scene.id} 选项 ${idx} 轴向权重 ${axis} 必须是数字`);
      }
    });
  });
  return data;
}

export function validateTemplates(data) {
  if (!data?.templates || !Array.isArray(data.templates)) throw new Error("result_templates.json: 缺失 templates 数组");
  data.templates.forEach(tpl => {
    if (!tpl.id || !tpl.judgement_text) throw new Error(`Template ${tpl.id || 'Unknown'} 缺失核心判词`);
  });
  return data;
}
