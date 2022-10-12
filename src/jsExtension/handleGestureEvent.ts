import {
  defineGestureHandlers,
  gestureHandlerController,
  initGesture,
  MN,
  UISwipeGestureRecognizerDirection
} from "marginnote"
import { PanelControl } from "~/modules/addon/typings"
import { actionTrigger } from "~/modules/gesture/utils"
import { closePanel } from "./switchPanel"

// Not support Mac
// Cannot access self unless use function
export const gestureHandlers = () =>
  gestureHandlerController([
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Up,
        "SwipeUpOnMindMapView"
      )
    },
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Down,
        "SwipeDownOnMindMapView"
      )
    },
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Left,
        "SwipeLeftOnMindMapView"
      )
    },
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Right,
        "SwipeRightOnMindMapView"
      )
    },
    {
      view: self.settingViewController.tableView!,
      gesture: initGesture.tap(1, 2, "DoubleClickOnTableView")
    }
  ])

export default defineGestureHandlers({
  onSwipeUpOnMindMapView(sender) {
    const { singleBarSwipeUp, muiltBarSwipeUp, selectionBarSwipeUp } =
      self.globalProfile.gesture
    actionTrigger(
      singleBarSwipeUp[0],
      muiltBarSwipeUp[0],
      selectionBarSwipeUp[0],
      sender
    )
  },
  onSwipeDownOnMindMapView(sender) {
    const { singleBarSwipeDown, muiltBarSwipeDown, selectionBarSwipeDown } =
      self.globalProfile.gesture
    actionTrigger(
      singleBarSwipeDown[0],
      muiltBarSwipeDown[0],
      selectionBarSwipeDown[0],
      sender
    )
  },
  onSwipeLeftOnMindMapView(sender) {
    const { singleBarSwipeLeft, muiltBarSwipeLeft, selectionBarSwipeLeft } =
      self.globalProfile.gesture
    actionTrigger(
      singleBarSwipeLeft[0],
      muiltBarSwipeLeft[0],
      selectionBarSwipeLeft[0],
      sender
    )
  },
  onSwipeRightOnMindMapView(sender) {
    const { singleBarSwipeRight, muiltBarSwipeRight, selectionBarSwipeRight } =
      self.globalProfile.gesture
    actionTrigger(
      singleBarSwipeRight[0],
      muiltBarSwipeRight[0],
      selectionBarSwipeRight[0],
      sender
    )
  },
  onDoubleClickOnTableView() {
    const { panelControl } = self.globalProfile.addon
    if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
  }
})
