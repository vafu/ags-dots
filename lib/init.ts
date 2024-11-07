import matugen from "./matugen"
import gtk from "./gtk"
import lowBattery from "./battery"
import notifications from "./notifications"
import workrooms from "./workrooms"
import config from "config/config"

export default function init() {
    try {
        config()
        gtk()
        matugen()
        lowBattery()
        notifications()
        workrooms()
    } catch (error) {
        logError(error)
    }
}
