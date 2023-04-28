import type { DefaultTheme, LocaleSpecificConfig } from "vitepress"
import { version, unsignedVersion } from "../../package.json"
import modules from "../../modules"

export const META_DESCRIPTION = "MarginNote 插件开发框架"

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ["meta", { property: "og:description", content: META_DESCRIPTION }],
    ["meta", { name: "twitter:description", content: META_DESCRIPTION }]
  ],

  themeConfig: {
    editLink: {
      pattern:
        "https://github.com/marginnoteapp/ohmymn/tree/main/packages/docs/:path",
      text: "为此页提供修改建议"
    },
    outline: {
      label: "目录"
    },

    docFooter: {
      prev: "上一篇",
      next: "下一篇"
    },

    nav: [
      {
        text: "使用指南",
        link: "/guide/",
        activeMatch: "^/guide/"
      },
      { text: "开发", link: "/dev/", activeMatch: "^/dev/" },
      { text: "API", link: "/api/", activeMatch: "^/api/" },
      {
        text: `v${version}`,
        items: [
          {
            text: `签名版本（v${version}）`,
            link: "https://bbs.marginnote.cn/t/topic/20501"
          },
          {
            text: `未签名版本（v${unsignedVersion}）`,
            link: "/update"
          }
        ]
      }
    ],
    sidebar: {
      "/dev/": [
        {
          text: "基础",
          items: [
            {
              text: "开始",
              link: "/dev/"
            },
            {
              text: "插件结构",
              link: "/dev/structure"
            },
            {
              text: "插件对象",
              link: "/dev/jsextension"
            },
            {
              text: "生命周期",
              link: "/dev/lifecycle"
            },
            {
              text: "事件监听",
              link: "/dev/events"
            },
            {
              text: "数据存储",
              link: "/dev/store"
            }
          ]
        },
        {
          text: "MN 插件（Lite）",
          link: "/dev/lite"
        },
        {
          text: "OhMyMN 模块",
          link: "/dev/module/"
        },
        {
          text: "MN 插件（OhMyMN）",
          link: "/dev/ohmymn"
        }
      ],
      "/api/": [
        {
          text: "介绍",
          link: "/api/"
        },
        {
          text: "Objective-C API 转换",
          link: "/api/transform"
        },
        {
          text: "MarginNote",
          items: [
            {
              text: "MN",
              link: "/api/marginnote/"
            },
            {
              text: "笔记相关",
              link: "/api/marginnote/note"
            },
            {
              text: "NodeNote",
              link: "/api/marginnote/nodenote"
            },
            {
              text: "弹窗",
              link: "/api/marginnote/popup"
            },
            {
              text: "网络请求",
              link: "/api/marginnote/fetch"
            },
            {
              text: "等待/间隔",
              link: "/api/marginnote/delay"
            },
            {
              text: "文件操作",
              link: "/api/marginnote/file"
            },
            {
              text: "Low-Level API",
              items: [
                {
                  text: "Application",
                  link: "/api/marginnote/application"
                },
                {
                  text: "Database",
                  link: "/api/marginnote/database"
                },
                {
                  text: "StudyController",
                  link: "/api/marginnote/studycontroller"
                },
                {
                  text: "MbBookNote",
                  link: "/api/marginnote/mbbooknote"
                },
                {
                  text: "MbBook/MbTopic",
                  link: "/api/marginnote/mbbooktopic"
                },
                {
                  text: "Utility",
                  link: "/api/marginnote/utility"
                }
              ]
            }
          ]
        },
        {
          text: "OhMyMN",
          items: []
        },
        {
          text: "补充",
          items: [
            {
              text: "Foundation",
              link: "/api/foundation"
            },
            {
              text: "UIKit",
              link: "/api/uikit"
            }
          ]
        }
      ],
      "/": [
        {
          text: "基础",
          items: [
            {
              text: "简介",
              link: "/guide/"
            },
            {
              text: "注意事项",
              link: "/guide/attention"
            },
            {
              text: "基本概念",
              link: "/guide/concept"
            },
            {
              text: "配置管理",
              link: "/guide/profile"
            }
          ]
        },
        {
          text: "进阶",
          collapsed: true,
          items: [
            {
              text: "正则表达式",
              link: "/guide/regex"
            },
            {
              text: "Replace() 函数",
              link: "/guide/replace"
            },
            {
              text: "Split() 函数",
              link: "/guide/split"
            },
            {
              text: "模版语法",
              link: "/guide/mustache"
            },
            {
              text: "模版变量",
              link: "/guide/vars"
            },
            {
              text: "自定义输入格式",
              link: "/guide/custom"
            },
            {
              text: "自动编号",
              link: "/guide/serial"
            }
          ]
        },
        {
          text: "必选模块",
          items: modules.required.map(k => ({
            text: k[0],
            link: "/guide/modules/" + k[1]
          }))
        },
        {
          text: "可选模块",
          collapsed: true,
          items: modules.optional.map(k => ({
            text: k[0],
            link: "/guide/modules/" + k[1]
          }))
        }
      ]
    }
  }
}
