import SidebarLeft from "./sideleft.js"
import Widget from "resource:///com/github/Aylur/ags/widget.js"
const { Box } = Widget
import PopupWindow from "widget/PopupWindow.js"

export default () => PopupWindow({
    keymode: "on-demand",
    name: "sideleft",
    layout: "left",
    transition: "slide_right",
    exclusivity: "exclusive",
    child: Box({
        children: [
            SidebarLeft(),
        ],
    }),
})
