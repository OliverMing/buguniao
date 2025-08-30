
//引入Qill插件
/* eslint-disable */
import Quill from "quill";
// 自定义字体
let fontFamily = ['宋体', '黑体', '微软雅黑', '楷体', '仿宋', 'Arial', '苹方'];
Quill.imports['attributors/style/font'].whitelist = fontFamily;
Quill.register(Quill.imports['attributors/style/font']);
// 自定义文字大小
let fontSize = ['10px', '12px', '14px', '16px', '20px', '24px', '36px']
Quill.imports['attributors/style/size'].whitelist = fontSize;
Quill.register(Quill.imports['attributors/style/size']);
// 新增行高
let Parchment = Quill.import("parchment");
let lingHeight = ['initial', '1', '1.2', '1.3', '1.4', '1.5', '1.75', '2', '3', '4'];
class lineHeightAttributor extends Parchment.Attributor.Style { }
const lineHeightStyle = new lineHeightAttributor("lineHeight", "line-height", {
  scope: Parchment.Scope.INLINE,
  whitelist: lingHeight
});
Quill.register({ "formats/lineHeight": lineHeightStyle }, true);
// 对齐方式样式都改成style方式，而不是class
let Align = Quill.import('attributors/style/align');
Align.whitelist = ['right', 'center', 'justify'];
Quill.register(Align, true);
const toolbarOptions = [
  [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    { header: 1 },
    { header: 2 },
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
    { script: "sub" }, // 下标
    { script: "super" }, // 上标
    { align: [] },
    { color: [] },
    { background: [] },
    "link",
    "image",
  ],
  [{ size: fontSize }], // 文字大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ font: fontFamily }], // 字体
  [{ lineheight: lingHeight }]   // 行高
]

export {
    toolbarOptions,
    Quill,
    lineHeightStyle
}