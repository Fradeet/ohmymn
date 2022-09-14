import { MN } from "~/sdk"

const zh = {
  intro: "自动添加评论",
  link: "https://ohmymn.marginnote.cn/guide/modules/autocomment.html",
  on: "摘录时自动执行",
  preset: {
    label: "选择需要的预设",
    $option2: ["自定义", "修改时间"] as TupleString
  },
  add_comment: {
    label: "添加评论",
    $option2: ["使用 AutoComment 的设置", "确定"] as TupleString
  },
  custom_comment: {
    help: "自定义，点击查看具体格式",
    link: ""
  }
}

const en: typeof zh = {
  intro: "Auto Add Comments",
  link: "https://ohmymn.marginnote.cn/guide/modules/autocomment.html",
  on: "Auto Executed",
  preset: {
    label: "Select Presets",
    $option2: ["Custom", "Modified Time"]
  },
  add_comment: {
    $option2: ["Use AutoComment Settings", "Confirm"],
    label: "Add Comment"
  },
  custom_comment: {
    help: "Customize. Click for specific formats",
    link: ""
  }
}

export const lang = MN.isZH ? zh : en
