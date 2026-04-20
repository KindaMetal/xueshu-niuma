import './styles/tokens.css';
import './styles/animations.css';
import { MasterData } from './data/loader.js';
import { ScoringEngine } from './core/ScoringEngine.js';
import { ResultGenerator } from './core/ResultGenerator.js';
import { exportCardToImage } from './utils/dom_exporter.js';
import { Tracker } from './core/tracker.js';

// WeChat Interceptor
// WeChat Interceptor Block REMOVED - Native support unlocked

const dims = MasterData.getDimensions();
const arches = MasterData.getArchetypes();
const tpls = MasterData.getTemplates();
const scenes = MasterData.getScenarios();
const artManifest = MasterData.getArtManifest();

const scorer = new ScoringEngine(dims);
const generator = new ResultGenerator(arches, tpls, artManifest);

let currentQuestionIndex = 0;
let userAnswers = [];

window.addEventListener('beforeunload', () => {
    if (currentQuestionIndex < scenes.scenarios.length) {
        Tracker.logDropOff(currentQuestionIndex);
    }
});

const appDiv = document.querySelector('#app');

function renderQuestion() {
  const q = scenes.scenarios[currentQuestionIndex];
  
  let optionsHtml = q.options.map((opt, idx) => `
    <button class="btn-sketch opt-btn" data-idx="${idx}">${opt.text}</button>
  `).join('');

  // Use a dark terminal-like board for questions
  appDiv.innerHTML = `
    <div class="shell-container anim-enter" id="board" style="max-width: 600px; margin: 4rem auto; padding: 2rem;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; padding-bottom: 1rem;">
        <h2 style="margin-top:0; color: #888; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px;">
          SYS.SCAN // 节点 ${currentQuestionIndex + 1} / ${scenes.scenarios.length}
        </h2>
      </div>
      <p class="nervous-text" style="font-size: 1.4rem; font-weight: bold; margin-bottom: 2.5rem; text-shadow: 0 0 10px rgba(255,255,255,0.2);">${q.text}</p>
      <div style="display: flex; flex-direction: column; gap: 0.8rem;">
        ${optionsHtml}
      </div>
    </div>
  `;

  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-idx');
      userAnswers.push(q.options[idx].weight);
      
      Tracker.logNavigation(currentQuestionIndex, currentQuestionIndex + 1, idx);
      
      const board = document.getElementById('board');
      board.classList.remove('anim-enter');
      board.classList.add('anim-exit');
      
      setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < scenes.scenarios.length) {
          renderQuestion();
        } else {
          renderTerminalTransition();
        }
      }, 200); 
    });
  });
}

function renderTerminalTransition() {
  appDiv.innerHTML = `
    <div class="shell-container" style="max-width: 600px; margin: 4rem auto; padding: 2rem; font-family: 'Courier New', monospace; color: #0f0; background: #050505; border: 1px solid #0f0; box-shadow: 0 0 20px rgba(0,255,0,0.2);">
      <h3 style="margin-top:0; border-bottom: 1px solid #0f0; padding-bottom: 0.5rem; text-transform: uppercase;">SYS.TERMINAL // DECODING</h3>
      <div id="terminal-output" style="min-height: 250px; font-size: 1.1rem; line-height: 1.8;"></div>
    </div>
  `;
  
  const lines = [
    "> 正在连接潜意识深网...",
    "> 提取脑皮层学术受击数据...",
    "> [警告] 检索到极度超载的焦虑特征峰值！",
    "> 正在强行剥离表层防御人格...",
    "> 匹配阿卡西维度坐标...",
    "> 替身（STAND）具象化准备完毕。"
  ];
  
  const output = document.getElementById('terminal-output');
  let i = 0;
  
  function typeLine() {
    if (i < lines.length) {
      const p = document.createElement('p');
      p.style.margin = '0.5rem 0';
      p.style.textShadow = '0 0 5px #0f0';
      
      // 移除上一行的假光标
      if (i > 0) output.lastChild.innerText = lines[i-1]; 
      
      p.innerText = lines[i] + ' █';
      output.appendChild(p);
      
      // 对于警告信息给予红色高亮
      if(lines[i].includes('[警告]')) {
         p.style.color = '#f04';
         p.style.textShadow = '0 0 5px #f04';
      }

      i++;
      setTimeout(typeLine, 350 + Math.random() * 500); 
    } else {
      setTimeout(() => {
        output.lastChild.innerText = lines[lines.length-1];
        // 白屏爆闪过渡
        appDiv.style.transition = 'all 0.1s';
        appDiv.style.opacity = '0';
        appDiv.style.transform = 'scale(1.1)';
        setTimeout(() => {
          appDiv.style.opacity = '1';
          appDiv.style.transform = 'scale(1)';
          appDiv.style.transition = '';
          renderResult();
        }, 150);
      }, 1000);
    }
  }
  
  setTimeout(typeLine, 400);
}

function renderResult() {
  const { code } = scorer.evaluate(userAnswers);
  // 保底容错
  const safeCode = arches.archetypes[code] ? code : "INFP";
  const payload = generator.generatePayload(safeCode);
  const t = payload.tarot;

  // 根据不同卡牌定制发光颜色
  let shadowGlow = 'var(--shadow-neon-green)';
  if (t.themeColor === '#ff0044') shadowGlow = 'var(--shadow-neon-red)';
  if (t.themeColor === '#ff5500') shadowGlow = 'var(--shadow-neon-orange)';

  appDiv.innerHTML = `
    <div class="shell-container result-stamp" style="padding: 2rem 0;">
      
      <div id="tarot-export-zone" class="tarot-frame" style="border: 2px solid ${t.themeColor}; box-shadow: ${shadowGlow};">
        <div class="tarot-inner-board" style="border-color: ${t.themeColor};">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid ${t.themeColor}; padding-bottom: 0.5rem;">
             <span style="font-weight: 900; font-size: 1.5rem; color: ${t.themeColor};">${t.rarity}</span>
             <span style="font-size: 0.9rem; letter-spacing: 3px; color: #888;">STAND NAME</span>
             <span style="font-weight: 900; font-size: 1.2rem; text-shadow: 0 0 5px ${t.themeColor};">${t.standName}</span>
          </div>

          <img src="${t.standImage}" class="tarot-image-stand" alt="替身图鉴" 
               style="border-bottom: 2px solid ${t.themeColor};"
               onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'450\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23111\\'/><text x=\\'50%\\' y=\\'50%\\' font-size=\\'20\\' text-anchor=\\'middle\\' fill=\\'%23555\\'>[替身使者迷失于亚空间]</text></svg>'">
          
          <h1 style="font-size:2.8rem; margin:1.5rem 0 0.5rem 0; letter-spacing: 2px; text-transform:uppercase;">${payload.main_title.split('：')[1] || payload.main_title}</h1>
          <h3 style="background:${t.themeColor}; color:#000; padding:0.4rem 0.6rem; display:inline-block; border-radius:3px; margin-top:0; font-size:1.1rem;">${payload.subtitle.split('：')[1] || payload.subtitle}</h3>
          
          <p style="font-size:1.3rem; line-height:1.7; text-align: left; background: rgba(0,0,0,0.5); padding: 1.5rem; border-radius: 4px; border-left: 5px solid ${t.themeColor}; margin-top: 1.5rem;">
            ${payload.judgement}
          </p>
          
          <div style="display:flex; gap: 0.8rem; margin-top:2rem; font-size: 1.1rem; text-align: left;">
            <div style="flex:1; border: 1px solid rgba(255,255,255,0.2); padding:1rem; background: rgba(255,255,255,0.05); border-radius:4px;">
               <strong style="color: ${t.themeColor};">共鸣 (Best Match)</strong><br>
               ${payload.matches.best.desc}
            </div>
            <div style="flex:1; border: 1px dashed rgba(255,255,255,0.2); padding:0.8rem;">
               <strong style="color: #666;">排斥 (Worst Match)</strong><br>
               ${payload.matches.worst.desc}
            </div>
          </div>
          
        </div>
      </div>
      
      <div style="margin-top:3rem; text-align:center; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
        <button id="btn-share" class="btn-sketch" style="background: ${t.themeColor}; color: #000; border-color: ${t.themeColor}; width: 100%; max-width: 300px;">
           <span style="font-size:1.5rem">📸</span> 生成塔罗判决书分享
        </button>
        <button class="btn-sketch" onclick="location.reload()" style="background: transparent; color: #888; border-color: #333; width: 100%; max-width: 300px;">重新打工 (Reset)</button>
      </div>

    </div>
  `;

  // 绑定截图分裂按钮
  document.getElementById('btn-share').addEventListener('click', async () => {
    const btn = document.getElementById('btn-share');
    const oldText = btn.innerHTML;
    btn.innerHTML = '正在刻录灵魂...';
    btn.disabled = true;

    Tracker.logShare(payload.result_code);
    await exportCardToImage('tarot-export-zone', `my_stand_${payload.result_code}.png`);
    
    btn.innerHTML = oldText;
    btn.disabled = false;
  });
}

renderQuestion();
