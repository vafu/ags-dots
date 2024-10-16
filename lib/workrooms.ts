import options from "options";
import { Sway } from "./sway";

const colors = ["#fabc2b", "#abf2c1", "#dda2bf"]

export default async function init() {
    const sway = await Sway.obtain()
    sway.workspaces.connect('notify::active-workroom', (w) => {
        options.theme.dark.primary.bg.value = colors[w.active_workroom - 1]
    })
}
