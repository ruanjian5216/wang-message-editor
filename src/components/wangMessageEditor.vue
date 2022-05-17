<template>
  <div class="wang-message-editor">
    <!-- 可输入div框 -->
    <div
      class="input_panel"
      ref="edit"
      :placeholder="placeholder"
      contenteditable="true"
      spellcheck="true"
    ></div>
    <!-- 工具栏 -->
    <div class="input_bar_tool">
      <slot />
      <!-- 字数限制 -->
      <div v-if="limitInputLength">
        <span :class="{ error_style: isOverflow }">{{ valueLength }}</span>
        <span>/{{ limitInputLength }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 可输入字数限制
     * 如果设置为 0 则不限制
     */
    limitInputLength: {
      type: Number,
      default: 280,
    },
    // 占位文字
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    // 文本框可以接受的文本类型
    contentType: {
      type: String,
      default: "plain",
      validator(value) {
        return ["plain", "rich"].includes(value);
      },
    },
  },
  data() {
    return {
      lastEditRange: "", //选取位置
      valueLength: 0, //已经输入的字数长度
      isOverflow: false, //是否超出可输入长度限制
    };
  },
  mounted() {
    this.$nextTick(() => {
      let edit = this.$refs.edit;
      // 点击输入框时，记录位置
      edit.addEventListener("click", () => {
        // 获取选定对象
        let selection = getSelection();
        // 设置最后光标对象
        this.lastEditRange = selection.getRangeAt(0);
      });

      // 键盘输入值时触发
      edit.addEventListener("keyup", () => {
        let res = this.textFromHtml(this.$refs.edit.innerHTML);
        if (res.length > this.limitInputLength) {
          this.isOverflow = true;
          this.valueLength = this.limitInputLength - res.length;
        } else {
          this.valueLength = res.length;
          this.isOverflow = false;
        }

        if (this.limitInputLength) {
          this.$emit("input", {
            content: res,
            isOverflow: this.isOverflow,
          });
        } else {
          this.$emit("input", res);
        }

        // 获取选定对象
        let selection = getSelection();
        // 设置最后光标对象
        this.lastEditRange = selection.getRangeAt(0);
      });
    });
  },
  methods: {
    confirm() {
      let res = this.textFromHtml(this.$refs.edit.innerHTML);
      this.$emit("confirm", res.toString());
    },

    pasteHtmlAtCaret(html) {
      var sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            this.lastEditRange = range;
            /**
             * 监听用户通过剪切板粘贴文字时，计算文本框已经输入的文字长度
             */
            let res = this.textFromHtml(this.$refs.edit.innerHTML);
            this.valueLength = res.length;
          }
        }
      } else if (document.selection && document.selection.type != "Control") {
        document.selection.createRange().pasteHTML(html);
      }
    },
    // 格式化为text
    textFromHtml(str, self) {
      str = str
        .replace(/&#10;/g, "\n")
        .replace(/&#09;/g, "\t")
        .replace(/<img[^>]*alt="([^"]+)"[^>]*>/gi, "$1")
        .replace(/\n|\r/g, "")
        .replace(/<br[^>]*>/gi, "\n")
        .replace(/(?:<(?:div|p|ol|ul|li|pre|code|object)[^>]*>)+/gi, "<div>")
        .replace(/(?:<\/(?:div|p|ol|ul|li|pre|code|object)>)+/gi, "</div>")
        .replace(/\n<div><\/div>/gi, "\n")
        .replace(/<div><\/div>\n/gi, "\n")
        .replace(/(?:<div>)+<\/div>/gi, "\n")
        .replace(/([^\n])<\/div><div>/gi, "$1\n")
        .replace(/(?:<\/div>)+/gi, "</div>")
        .replace(/([^\n])<\/div>([^\n])/gi, "$1\n$2")
        .replace(/<\/div>/gi, "")
        .replace(/([^\n])<div>/gi, "$1\n")
        .replace(/\n<div>/gi, "\n")
        .replace(/<div>\n/gi, "\n\n")
        .replace(/<(?:[^>]+)?>/g, "")
        .replace(new RegExp("&#8203;", "g"), "")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x60;/g, "`")
        .replace(/&#60;/g, "<")
        .replace(/&#62;/g, ">")
        .replace(/&amp;/g, "&");
      return str;
    },
    // 将text格式化为html
    htmlFromText(str, self) {
      str = str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/`/g, "&#x60;")
        .replace(/(?:\r\n|\r|\n)/g, "\n")
        .replace(/(\n+)/g, "<div>$1</div>")
        .replace(/\n/g, "<br/>")
        .replace(/<br\/><\/div>/g, "</div>");
      return str;
    },
    // 设置输入框内容
    setContent(text) {
      this.$refs.edit.innerHTML = this.htmlFromText(text);
    },
    // 获取焦点
    focus() {
      this.$refs.edit.focus();
    },
    // 添加at功能
    addAt(value) {
      let res = this.textFromHtml(this.$refs.edit.innerHTML);
      this.$refs.edit.innerHTML = this.htmlFromText(res + value);
    },
  },
  // computed: {
  //   listeners() {
  //     return Object.assign({}, this.$listeners, {
  //       input: function (e) {
  //         const inputContent =
  //           this.contentType === "plain"
  //             ? e.target.textContent
  //             : e.target.innerHTML;
  //         /**
  //          * 监听输入框变化
  //          * 并发出 input事件
  //          */
  //         this.$emit("input", inputContent);
  //       }.bind(this),
  //     });
  //   },
  // },
};
</script>

<style lang="less" scoped>
// 右侧输入框区域
.wang-message-editor {
  // width: 100%;
  box-sizing: border-box;
  position: relative;
  // 输入框面板
  .input_panel {
    margin: 0 auto;
    background: #efefef;
    width: 100%;
    height: 100px;
    outline: none;
    border: #1390ff 2px solid;
    border-radius: 8px;
    padding: 5px;
    overflow: auto;
    box-sizing: border-box;
    ::v-deep .emoji {
      width: 18px;
      height: 18px;
      margin: 2px;
    }
  }
  .input_panel:empty:before {
    content: attr(placeholder);
    position: absolute;
    font-size: 14px;
    color: gray;
    background-color: transparent;
  }

  .input_panel::-webkit-scrollbar {
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 0px;
  }
  .input_panel::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .input_panel::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .input_bar_tool {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;
    font-size: 12px;
    color: #666;
    background: #efefef;
    .error_style {
      color: red;
    }
  }
}
</style>