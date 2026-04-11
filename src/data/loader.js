// 负责在构建时直接将本地存放的各种设定全尺寸 JSON 加载进运行内存
import dimensionsJson from '../../docs/phase_0/dimensions_pool.json';
import archetypesJson from '../../docs/phase_0/archetypes_pool.json';
import scenariosJson from '../../docs/phase_0/scenarios_pool.json';
import templatesJson from '../../docs/phase_0/result_templates.json';
import artManifestJson from './art_manifest.json';

import { validateDimensions, validateArchetypes, validateScenarios, validateTemplates } from '../core/Validator.js';

export const MasterData = {
  getDimensions: () => validateDimensions(dimensionsJson),
  getArchetypes: () => validateArchetypes(archetypesJson),
  getScenarios: () => {
    // 强制截断为前5题爆发弹药（Phase 3 快速验证闭门包）
    const full = validateScenarios(scenariosJson);
    return { scenarios: full.scenarios.slice(0, 5) };
  },
  getTemplates: () => validateTemplates(templatesJson),
  getArtManifest: () => artManifestJson
};
