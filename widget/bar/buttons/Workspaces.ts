import PanelButton from "../PanelButton"
import options from "options"
import { sh, range } from "lib/utils"
import { Sway } from "lib/sway"
import { Workspace } from "i3-ts/message-types"
import { BindingGroup } from "types/@girs/gobject-2.0/gobject-2.0.cjs"

const sway = await Sway.obtain()

const { workspaces } = options.bar.workspaces

const Workspaces = (size: number) => Widget.Box({
    children: range(size).map(ws => {
        const workspace = sway.workspaces.getWorkspace(ws)
        return Widget.Label({
            attribute: ws,
            vpack: "center",
            // todo label
            label: `${ws}`,
            className: workspace.bind('ws')
                .as(ws => {
                    const active = ws.active ? "active" : ""
                    const occupied = ws.occupied ? "occupied" : ""
                    return `${active} ${occupied}`
                }),
        })
    })
})

export default () => PanelButton({
    window: "overview",
    class_name: "workspaces",
    // on_scroll_up: () => dispatch("m+1"),
    // on_scroll_down: () => dispatch("m-1"),
    // on_clicked: () => App.toggleWindow("overview"),
    child: sway.workspaces.bind("workspaces_count").as(Workspaces),
})
