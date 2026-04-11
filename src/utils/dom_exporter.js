import html2canvas from 'html2canvas';

/**
 *  DOM 元素转高质量 PNG 下载引擎
 * 处理阴影、发光特效等跨域问题
 */
export async function exportCardToImage(elementId, resultFileName = "my_academic_tarot.png") {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error("DOM Exporter: Cannot find target element:", elementId);
    return false;
  }

  try {
    // 渲染参数优化：为了截出来更清晰的高反差色彩
    const canvas = await html2canvas(el, {
      scale: 3, // 极限视网膜超清分辨率
      backgroundColor: "#0a0a0f", // 咬死深空底色，防止透明背景污染发光特效
      useCORS: true, // 允许加载外部图片资产(头像等)
      logging: false
    });

    // 转化为图片 URL
    const imageBase64 = canvas.toDataURL("image/png");

    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|micromessenger/i.test(ua);

    if (isMobile) {
      // 弹出供用户长按保存的全屏遮罩
      const overlay = document.createElement("div");
      overlay.id = "wechat-export-overlay";
      overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(10,10,15,0.95); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; backdrop-filter: blur(10px); animation: fadeIn 0.3s ease-out;";
      
      const img = document.createElement("img");
      img.src = imageBase64;
      img.style.cssText = "max-width:85%; max-height:75%; border-radius:8px; box-shadow:0 0 30px rgba(0, 255, 170, 0.4); object-fit: contain;";
      
      const tip = document.createElement("p");
      tip.innerText = "🔮 灵魂载体已具象化\n(请长按上方图片保存至相册，可无阻碍发送朋友圈)";
      tip.style.cssText = "color:#00ffaa; margin-top:20px; font-weight:bold; letter-spacing:1px; line-height:1.5; text-align:center; font-family: 'Courier New', monospace; text-shadow: 0 0 5px rgba(0,255,170,0.5);";
      
      const closeBtn = document.createElement("button");
      closeBtn.innerText = "✕ 返回终端";
      closeBtn.style.cssText = "position:absolute; bottom:5%; background:transparent; border:1px solid #555; color:#888; border-radius:4px; padding:8px 20px; font-size:1rem;";
      closeBtn.onclick = () => document.body.removeChild(overlay);

      overlay.appendChild(img);
      overlay.appendChild(tip);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

    } else {
      // PC 端保持直接触发静默下载
      const downloadLink = document.createElement("a");
      downloadLink.href = imageBase64;
      downloadLink.download = resultFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

    return true;
  } catch (error) {
    console.error("生成截图核爆失败:", error);
    return false;
  }
}
