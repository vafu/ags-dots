import options from "options"
import { HyprWS } from "./sway"

const colors = ["#83a598", "#b8bb26", "#fe8019", "#8ec07c"]
const wrservice = new HyprWS()

export default async function init() {
    wrservice.workspaces.connect("notify::active-workroom", w => {
        options.theme.dark.primary.bg.value = colors[w.active_workroom]
    })
}
