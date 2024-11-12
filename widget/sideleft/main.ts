import SidebarLeft from "./sideleft.js"
import PopupWindow from "widget/PopupWindow.js"

export default () => PopupWindow({
    keymode: "on-demand",
    name: "sideleft",
    layout: "left",
    transition: "crossfade",
    exclusivity: "normal",
    child: SidebarLeft(),
})
