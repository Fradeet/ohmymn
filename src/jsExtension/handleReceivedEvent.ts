import { actions } from "synthesizer"
import handleExcerpt from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import { profile } from "profile"
import { delayBreak, isThisWindow, log, popup, showHUD } from "utils/common"
import eventHandlerController from "utils/event"
import {
  getNoteById,
  getSelectNodes,
  getSelectNodesAll,
  undoGroupingWithRefresh
} from "utils/note"

export const eventCtrl = eventHandlerController([
  { event: "InputOver" },
  { event: "ButtonClick" },
  { event: "SelectChange" },
  { event: "SwitchChange" },
  { event: "PopupMenuOnNote" },
  { event: "ProcessNewExcerpt" },
  { event: "ChangeExcerptRange" }
])

interface eventHandler {
  (sender: {
    userInfo: {
      [k: string]: any
    }
  }): void
}

const onButtonClick: eventHandler = async sender => {
  if (!isThisWindow(sender, self.window)) return
  const { key, content } = sender.userInfo
  if (profile.ohmymn.clickHidden) closePanel()
  let nodes: MbBookNote[]

  nodes = getSelectNodes()
  if (!nodes.length) {
    showHUD("未选中任何脑图卡片")
    return
  }

  if (nodes.length == 1 && nodes[0].childNotes?.length) {
    const { index } = await popup(
      "OhMyMN",
      "检测到您选中的唯一卡片有子节点",
      UIAlertViewStyle.Default,
      ["仅处理该卡片", "仅处理所有子节点", "处理该卡片及其子节点"],
      (alert: UIAlertView, buttonIndex: number) => ({
        index: buttonIndex
      })
    )
    nodes = [nodes, getSelectNodesAll(true), getSelectNodesAll()][index!]
  }
  switch (key) {
    case "completeSelected":
      actions[key]({
        content,
        nodes
      })
      break
    default:
      undoGroupingWithRefresh(() => {
        actions[key]({
          content,
          nodes
        })
      })
  }
}

const onSwitchChange: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  const { name, key, status } = sender.userInfo
  profile[name][key] = status
  switch (key) {
    case "lockExcerpt":
      if (status && profile.ohmymn.autoCorrect)
        showHUD("锁定摘录不建议和自动矫正同时开启", 2)
      break
    case "autoCorrect":
      if (status) showHUD("请按实际情况选择开关，不建议无脑打开自动矫正", 2)
      break
    default:
      break
  }
}

const onSelectChange: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  const { name, key, selections } = sender.userInfo
  profile[name][key] = selections
  switch (key) {
    case "panelPostion":
    case "panelHeight":
      layoutViewController()
      break
  }
}

const onInputOver: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  const { name, key, content } = sender.userInfo
  profile[name][key] = content
  content ? showHUD("输入已保存") : showHUD("输入已清空")
}

// 不管是创建摘录还是修改摘录，都会提前触发这个事件，所以要判断一下，在修改之前保存上次摘录
let isProcessNewExcerpt = false
let isChangeExcerptRange = false
let lastExcerptText = "😎"
const onPopupMenuOnNote: eventHandler = async sender => {
  if (!isThisWindow(sender, self.window)) return
  const note = <MbBookNote>sender.userInfo.note
  isChangeExcerptRange = false
  isProcessNewExcerpt = false
  const success = await delayBreak(
    10,
    0.05,
    () => isChangeExcerptRange || isProcessNewExcerpt
  )
  if (success) return
  // 保存修改摘录前的内容
  lastExcerptText = note.excerptText!
}

const onChangeExcerptRange: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  log("修改摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isChangeExcerptRange = true
  handleExcerpt(note, lastExcerptText)
}

const onProcessNewExcerpt: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  log("创建摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改
  if (profile.ohmymn.lockExcerpt) lastExcerptText = "😎"
  handleExcerpt(note)
}

export default {
  onInputOver,
  onButtonClick,
  onSelectChange,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange
}
