import { MatchEngine } from './MatchEngine.js';

/**
 * 结果页模板组装生成器 (Result Payload Generator) V3
 * 兼容塔罗牌替身特效挂载级全维心智匹配引擎
 */
export class ResultGenerator {
  constructor(archetypesConfig, templatesConfig, artManifestConfig) {
    this.archetypes = archetypesConfig.archetypes;
    this.templates = templatesConfig.templates;
    this.artManifest = artManifestConfig;
    this.matcher = new MatchEngine(archetypesConfig);
  }

  _interpolateTemplate(templateStr, replacements) {
    return templateStr.replace(/\{(\w+)\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  }

  generatePayload(code, templateId = "TPL_01") {
    const archetype = this.archetypes[code];
    if (!archetype) throw new Error(`未找到对应 ${code} 的人格原图鉴，引擎异常。`);

    const tpl = this.templates.find(t => t.id === templateId) || this.templates[0];
    
    // 提取塔罗牌特效包
    let artNode = this.artManifest.manifest[code];
    let isFallback = false;
    if (!artNode) {
      artNode = this.artManifest.fallback;
      isFallback = true;
    }

    const standName = artNode.standName || (isFallback ? "【未觉醒的游魂】" : "");

    // 通过心智匹配网络动态计算该角色的死敌与知音！
    const { bestMatchCode, worstMatchCode } = this.matcher.findMatches(code);
    const bestArch = this.archetypes[bestMatchCode];
    const worstArch = this.archetypes[worstMatchCode];

    const dictionary = {
      archetype_name: archetype.name,
      top_traits: archetype.traits.join(" + "),
      behavior_summary: archetype.summary,
      archetype_advice: archetype.advice || "建议立刻转行送外卖。",
      match_positive: `${bestMatchCode} (${bestArch.name.split(' ')[0]})`, 
      partner_reason: archetype.partner_reason || "因为 ta 恰好包容了你的缺陷。",
      match_negative: `${worstMatchCode} (${worstArch.name.split(' ')[0]})`,
      enemy_reason: archetype.enemy_reason || "因为你们一旦碰面就会互删爆雷。"
    };

    return {
      style_name: tpl.style,
      result_code: code,
      main_title: this._interpolateTemplate(tpl.main_title_format, dictionary),
      subtitle: this._interpolateTemplate(tpl.subtitle_format, dictionary),
      judgement: this._interpolateTemplate(tpl.judgement_text, dictionary),
      matches: {
        best: {
          title: tpl.match_section.best_match_title,
          desc: this._interpolateTemplate(tpl.match_section.best_match_desc, dictionary)
        },
        worst: {
          title: tpl.match_section.worst_match_title,
          desc: this._interpolateTemplate(tpl.match_section.worst_match_desc, dictionary)
        }
      },
      // 塔罗牌注入管线
      tarot: {
        rarity: artNode.rarityToneKey || "N",
        standImage: artNode.standAssetKey,
        themeColor: artNode.themeColor || "#fff",
        frameKey: artNode.cardFrameKey,
        standName: standName,
        fxLayer: artNode.fxLayer || "none"
      }
    };
  }
}
