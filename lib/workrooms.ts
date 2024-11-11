import options from "options"
import { obtainService } from "./services"

const colors = ["blue", "orange", "green", "yellow"]
const wrservice = await obtainService("workspace")

export default async function init() {
    wrservice.connect("notify::active-workroom", w => {
        options.theme.primary.value = colors[w.active_workroom]
    })
}
