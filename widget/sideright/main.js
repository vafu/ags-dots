import SidebarRight from "./sideright.js"
import PopupWindow from "widget/PopupWindow.js"

export default () => PopupWindow({
    keymode: "on-demand",
    name: "sideright",
    anchor: ["top", "bottom", "right"],
    layout: "left",
    transition: "crossfade",
    exclusivity: "normal",
    child: SidebarRight(),
})
