import { addTags, getAllText, getNodeTree, removeHighlight } from "utils/note"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { HUDController, showHUD } from "utils/common"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import { textComment } from "types/MarginNote"
import lang from "lang"
import { unique } from "utils"
import { SerialCode } from "utils/text"

const { help, option, intro, label, link, hud } = lang.module.magicaction

const config: IConfig = {
  name: "MagicAction",
  intro,
  link,
  settings: [],
  actions: [
    {
      key: "manageProfile",
      type: cellViewType.button,
      label: label.manage_profile,
      option: option.manage_profile,
      help: help.manage_profile
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.filter_cards,
      option: option.filter_cards,
      key: "filterCards"
    },
    {
      type: cellViewType.button,
      label: label.merge_cards,
      key: "mergeCards",
      option: option.merge_cards
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.rename_title,
      key: "renameTitle",
      help: help.rename_title
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.merge_text,
      key: "mergeText",
      help: help.merge_text,
      option: option.merge_text
    },
    {
      key: "switchTitle",
      type: cellViewType.button,
      label: label.switch_title,
      option: option.switch_title,
      help: help.switch_title
    }
  ]
}

const util = {
  genCharArray(char: string, len: number, step: number = 1): string[] {
    const serialCode = Object.values(SerialCode).filter(k =>
      k.includes(char)
    )[0]
    if (!serialCode) throw ""
    const charArr = []
    const startIndex = serialCode.search(char)
    for (
      let i = startIndex, end = startIndex + len * step - 1;
      i <= end;
      i = i + step
    ) {
      charArr.push(serialCode[i % serialCode.length])
    }
    return charArr
  },
  genNumArr(num: number, len: number, step = 1, digit = 0) {
    const numArr = []
    for (let i = num, end = num + len * step - 1; i <= end; i = i + step) {
      numArr.push(String(i).padStart(digit, "0"))
    }
    return numArr
  },
  getSerialInfo(newSubStr: string, length: number) {
    // string[] len>2 , [string, number], [string] 三种情况
    const serialArr = reverseEscape(
      newSubStr.replace(/^.*%(\[.+\]).*$/, "$1").replace(/'/g, '"')
    ) as any[]
    const len = serialArr.length
    if (len == 0 || typeof serialArr[0] !== "string")
      throw "数组内必须有元素，并且第一个元素必须是字符"
    if (len == 1 || (len == 2 && typeof serialArr[1] == "number")) {
      const step = len == 1 ? 1 : (serialArr[1] as number)
      const startValue = serialArr[0]
      // 如果是数字
      if (/^[0-9]+$/.test(startValue))
        return util.genNumArr(
          Number(startValue),
          length,
          step,
          startValue.length
        )
      // 如果是其他字符，一个字节
      else if (startValue.length === 1)
        return util.genCharArray(startValue, length, step)
      else throw "必须输入数字和单个字符"
    } // 自定义替换字符，数组元素长度大于 1，如果长度为 2，则第二个为字符串
    else if (len > 1 && serialArr.every(k => typeof k == "string"))
      return serialArr as string[]
    else throw "不符合输入格式要求"
  },
  getSerialByIndex(startValue: string, index: number) {
    if (/^[0-9]+$/.test(startValue))
      return String(Number(startValue) + index).padStart(startValue.length, "0")
    const serialCode = Object.values(SerialCode).filter(k =>
      k.includes(startValue)
    )[0]
    if (!serialCode) throw ""
    const len = serialCode.length
    const startIndex = serialCode.search(startValue)
    return serialCode[(startIndex + index) % len]
  },
  getLayerSerialInfo(newSubStr: string, treeIndex: number[][]) {
    // string[], [...string[],[string,number]] 均可省略
    const serialArr = reverseEscape(
      newSubStr.replace(/^.*#(\[.+\]).*$/, "$1").replace(/'/g, '"')
    ) as any[]
    const option = {
      linkCode: ".",
      MAXLevel: Infinity
    }
    if (Array.isArray(serialArr[serialArr.length - 1])) {
      const opt = serialArr.pop() as any[]
      if (opt.length > 2) throw "option 数组必须两个元素以内"
      opt.forEach(k => {
        if (typeof k === "number") option.MAXLevel = k
        else if (typeof k === "string") option.linkCode = k
        else throw "option 数组内只能是 number 或 string"
      })
    }
    const len = serialArr.length
    if (len == 0 || serialArr.some(serial => typeof serial !== "string"))
      throw "除开 option 必须还有元素，并且都必须是 string"
    // [[0],[1],[2],[2,0],[2,1],[2,1,1,1]]
    return treeIndex.map(nodeIndex =>
      nodeIndex.length <= option.MAXLevel
        ? nodeIndex
            .map((index, _index) => {
              return util.getSerialByIndex(
                serialArr[_index > len - 1 ? len - 1 : _index],
                index
              )
            })
            .join(option.linkCode)
        : ""
    )
  }
}

const enum FilterCards {
  OnlyTitle,
  AllText
}

const enum MergeCards {
  MergeTitle,
  NotMergeTitile
}

const enum MergeText {
  ToExpertText,
  ToComment
}

const enum SwitchTitle {
  ToNonexistent,
  Exchange
}

const action: IActionMethod = {
  renameTitle({ content, nodes }) {
    content = /^\(.*\)$/.test(content)
      ? content
      : `(/^.*$/g, "${escapeDoubleQuote(content)}")`
    const { newSubStr, regexp } = string2ReplaceParam(content)[0]
    // 分级序列命名
    if (/#\[(.+)\]/.test(newSubStr)) {
      const isHavingChildren = nodes.every(
        node =>
          nodes[0].parentNote === node.parentNote && node?.childNotes?.length
      )
      if (isHavingChildren) {
        nodes.forEach(node => {
          // 只处理子节点
          const { treeIndex, onlyChildren } = getNodeTree(node)
          const newTitles = util
            .getLayerSerialInfo(newSubStr, treeIndex)
            .map(k => newSubStr.replace(/#\[(.+)\]/, k))
          onlyChildren.forEach((node, index) => {
            const title = node.noteTitle ?? ""
            if (newTitles[index])
              node.noteTitle = title.replace(regexp, newTitles[index])
          })
        })
      } else {
        showHUD(hud.hierarchical_numbering, 2)
        return
      }
    }
    // 如果含有序列信息，就把获取新的 replace 参数
    else if (/%\[(.+)\]/.test(newSubStr)) {
      const newTitles = util
        .getSerialInfo(newSubStr, nodes.length)
        .map(k => newSubStr.replace(/%\[(.+)\]/, k))
      nodes.forEach((note, index) => {
        const title = note.noteTitle ?? ""
        if (newTitles[index])
          note.noteTitle = title.replace(regexp, newTitles[index])
      })
    }
    // 或者直接替换
    else {
      nodes.forEach(note => {
        const title = note.noteTitle ?? ""
        note.noteTitle = title.replace(regexp, newSubStr)
      })
    }
  },
  mergeText({ option, nodes, content }) {
    for (const node of nodes) {
      const allText = getAllText(
        node,
        reverseEscape(`"${escapeDoubleQuote(content ?? "")}"`)
      )
      // MN 这个里的 API 名称设计的有毛病
      const linkComments: textComment[] = []
      while (node.comments.length) {
        const comment = node.comments[0]

        comment.type == "TextNote" &&
          comment.text.includes("marginnote3app") &&
          linkComments.push(comment)

        node.removeCommentByIndex(0)
      }
      switch (option) {
        case MergeText.ToExpertText:
          node.excerptText = allText
          break
        case MergeText.ToComment:
          node.excerptText = ""
          node.appendTextComment(removeHighlight(allText))
      }
      linkComments.forEach(linkComment => {
        node.appendTextComment(linkComment.text)
      })
    }
  },
  filterCards({ nodes, content, option }) {
    if (!content) return
    const regGroup = string2RegArray(content)
    const customSelectedNodes = nodes.filter(node => {
      const title = node.noteTitle ?? ""
      const content = `${title}\n${getAllText(node)}`
      return regGroup.some(regs =>
        regs.every(reg =>
          reg.test(option == FilterCards.AllText ? content : title)
        )
      )
    })
    if (customSelectedNodes.length) {
      HUDController.show(hud.is_clicked)
      return customSelectedNodes
    } else {
      showHUD(hud.none_card)
      return []
    }
  },
  mergeCards({ option, nodes }) {
    if (nodes.length == 1) return
    const node = nodes[0]
    const titles = node.noteTitle ? [node.noteTitle] : []
    for (let i = 1; i < nodes.length; i++) {
      const title = nodes[i].noteTitle
      title && titles.push(title)
      node.merge(nodes[i])
    }
    const len = node.comments.length
    // 从后往前删，索引不会乱
    node.comments.reverse().forEach((comment, index) => {
      comment.type == "TextNote" &&
        titles.includes(comment.text) &&
        node.removeCommentByIndex(len - index - 1)
    })
    if (option == MergeCards.MergeTitle)
      node.noteTitle = unique(titles).join("; ")
    // 合并标签
    addTags(node, [], true)
  },
  switchTitle({ nodes, option }) {
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText ? removeHighlight(note.excerptText) : ""
      switch (option) {
        case SwitchTitle.ToNonexistent:
          // 只允许存在一个
          if ((title || text) && !(title && text)) {
            note.noteTitle = text
            note.excerptText = title
          } else if (title == text) note.noteTitle = ""
          break
        case SwitchTitle.Exchange:
          note.noteTitle = text
          note.excerptText = title
          break
      }
    }
  }
}

export { config, util, action }
