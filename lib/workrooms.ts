import options from "options"
import { obtainService } from "./services"

const colors = ["#83a598", "#b8bb26", "#fe8019", "#8ec07c"]
const wrservice = await obtainService("workspace")

export default async function init() {
    wrservice.connect("notify::active-workroom", w => {
        options.theme.dark.primary.bg.value = colors[w.active_workroom]
    })
}
