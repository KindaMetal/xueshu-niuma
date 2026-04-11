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
      scale: 2, // 视网膜高清分辨率
      backgroundColor: "#0a0a0f", // 咬死深空底色，防止透明背景污染发光特效
      useCORS: true, // 允许加载外部图片资产(头像等)
      logging: false
    });

    // 转化为图片 URL
    const imageBase64 = canvas.toDataURL("image/png");

    // 创建虚拟链接触发强制下载
    const downloadLink = document.createElement("a");
    downloadLink.href = imageBase64;
    downloadLink.download = resultFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return true;
  } catch (error) {
    console.error("生成截图核爆失败:", error);
    return false;
  }
}
