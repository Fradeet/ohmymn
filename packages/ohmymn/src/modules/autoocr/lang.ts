import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro:
      "使用百度 OCR 服务在摘录时进行小语种的在线矫正。使用 SimpleTex 等服务进行公式识别。",
    on: {
      label: "摘录时自动执行",
      help: "【仅当前文档】"
    },
    lang: {
      $option21: [
        "自动检测",
        "中英文混合",
        "英文",
        "日语",
        "韩语",
        "法语",
        "西班牙语",
        "葡萄牙语",
        "德语",
        "意大利语",
        "俄语",
        "丹麦语",
        "荷兰语",
        "马来语",
        "瑞典语",
        "印尼语",
        "波兰语",
        "罗马尼亚语",
        "土耳其语",
        "希腊语",
        "匈牙利语"
      ] as StringTuple<21>,
      help: "【仅当前文档】",
      label: "识别语言"
    },
    formula_ocr: {
      label: "公式识别",
      $option3: ["Pure Latex", "$ Latex $", "$$ Latex $$"] as StringTuple<3>
    },
    formula_ocr_providers: {
      label: "公式识别提供商",
      $option2: ["百度", "Mathpix", "SimpleTex", "Doc2X"] as StringTuple<4>,
      help: "公式识别不支持摘录时自动识别，只能在 MagicAtion for Text 中手动进行公式识别。点击查看使用技巧。",
      link: doc("autoocr")
    },
    markdown: {
      label: "使用的 Markdown 插件",
      help: "用于显示公式，推荐使用 Milkdown 。",
      $option3: ["Markdown", "myMarkDown", "Milkdown"] as StringTuple<3>
    },
    simpletex_model: {
      label: "SimpleTex 模型",
      $option2: ["轻量", "标准"] as StringTuple<2>
    },
    baidu_api_key: {
      help: "百度 Api Key，点击查看如何获取。",
      link: doc("autoocr", "百度-ocr"),
      no_baidu_api_key: "没有设置百度 OCR Api Key"
    },
    baidu_secret_key: {
      help: "百度 Secret Key",
      no_baidu_secret_key: "没有设置百度 OCR Secret Key"
    },
    mathpix_app_key: {
      help: "Mathpix App Key，点击查看如何获取。",
      link: doc("autoocr", "mathpix"),
      no_mathpix_key: "没有输入 Mathpix key！",
      mathpix_key_error: "Mathpix key 输入错误！"
    },
    timeout: "超时！",
    doc2x_api_key: {
      help: "Doc2X Api Key，点击查看如何获取。",
      link: doc("autoocr", "doc2x"),
      no_doc2x_key: "没有输入 Doc2X API key！",
      doc2x_key_error: "Doc2X API key 输入错误！",
      cant_ocr: "无法 OCR！"
    },
    simpletex_api_key: {
      help: "SimpleTex Api Key，点击查看如何获取。",
      link: doc("autoocr", "simpletex"),
      no_simpletex_key: "没有输入 SimpleTex API key！",
      simpletex_key_error: "SimpleTex API key 输入错误！"
    },
    $show_key2: [
      "点击查看密钥，不要让其他人看到",
      "点击隐藏密钥，不要让其他人看到"
    ] as StringTuple<2>,
    text_ocr: "文字识别",
    hand_writting_ocr: "手写识别",
    qr_code_ocr: "二维码识别",
    sure: "确定",
    detect_link:
      "结果已复制到剪贴板上，但检测到识别结果中含有链接，是否直接在浏览器中打开？",
    baidu_token_error: "百度 OCR Api Key 或 Secret Key 输入错误！",
    success_clipboard: "结果已复制到剪贴板上，快去粘贴吧！"
  },
  en: {
    intro:
      "Use Baidu OCR service to correct small languages online when excerpting. Use services such as SimpleTex for formula recognition.",
    on: {
      label: "Auto Run When Excerpting",
      help: "[Only Current Document]"
    },
    lang: {
      help: "[Only Current Document]",
      label: "Language",
      $option21: [
        "Auto",
        "Chinese+English",
        "English",
        "Japanese",
        "Korean",
        "French",
        "Spanish",
        "Portuguese",
        "German",
        "Italian",
        "Russian",
        "Danish",
        "Dutch",
        "Malay",
        "Swedish",
        "Indonesian",
        "Polish",
        "Romanian",
        "Turkish",
        "Greek",
        "Hungarian"
      ]
    },
    formula_ocr_providers: {
      label: "Formula OCR Providers",
      $option2: ["Baidu", "Mathpix", "SimpleTex", "Doc2X"],
      help: "Formula OCR is not supported in auto mode, only in MagicAtion for Text. Click to see the usage.",
      link: doc("autoocr")
    },
    markdown: {
      label: "Markdown Addon Used",
      help: "For displaying formulas, Milkdown is recommended",
      $option3: ["Markdown", "myMarkDown", "Milkdown"]
    },
    formula_ocr: {
      label: "Formula OCR",
      $option3: ["Pure Latex", "$ Latex $", "$$ Latex $$"]
    },
    baidu_api_key: {
      link: doc("autoocr", "baidu-ocr"),
      help: "Baidu Api Key, click to see how to get it.",
      no_baidu_api_key: "No Baidu OCR Api Key"
    },
    baidu_secret_key: {
      help: "Baidu Secret Key",
      no_baidu_secret_key: "No Baidu OCR Secret Key"
    },
    mathpix_app_key: {
      link: doc("autoocr", "mathpix"),
      help: "Mathpix App Key, click to see how to get it.",
      no_mathpix_key: "No Mathpix key！",
      mathpix_key_error: "Mathpix key is wrong!"
    },
    timeout: "Timeout!",
    doc2x_api_key: {
      link: doc("autoocr", "doc2x"),
      help: "Doc2X API Key, click to see how to get it.",
      doc2x_key_error: "Doc2X API key is wrong!",
      no_doc2x_key: "No Doc2X API key!",
      cant_ocr: "Can't OCR!"
    },
    simpletex_api_key: {
      link: doc("autoocr", "simpletex"),
      help: "SimpleTex API Key, click to see how to get it.",
      no_simpletex_key: "No SimpleTex API key！",
      simpletex_key_error: "SimpleTex API key is wrong!"
    },
    simpletex_model: {
      label: "SimpleTex Model",
      $option2: ["Light", "Standard"]
    },
    $show_key2: ["Click to show secret key", "Click to hide secret key"],
    text_ocr: "Text OCR",
    hand_writting_ocr: "Handwritting OCR",
    qr_code_ocr: "QRCode OCR",
    sure: "Confirm",
    detect_link:
      "The result has been copied to the clipboard, but a link is detected in the recognition result, is it opened directly?",
    baidu_token_error: "Api Key or Secret Key is wrong!",
    success_clipboard:
      "The results have been copied to the clipboard, go ahead and paste them!"
  }
})
