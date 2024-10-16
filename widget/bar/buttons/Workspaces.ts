import PanelButton from "../PanelButton"
import { sh, range } from "lib/utils"
import { Sway } from "lib/sway"

const sway = await Sway.obtain()

const Workspaces = (wr: number) => {
    const workroom = sway.workspaces.getWorkroom(wr)
    return Widget.Box({
        children: range(workroom.length).map(ws => {
            const workspace = workroom.getWorkspace(ws)
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
}
export default () => PanelButton({
    window: "overview",
    class_name: "workspaces",
    // on_scroll_up: () => dispatch("m+1"),
    // on_scroll_down: () => dispatch("m-1"),
    // on_clicked: () => App.toggleWindow("overview"),
    child: sway.workspaces.bind('active_workroom').as(Workspaces),
})
