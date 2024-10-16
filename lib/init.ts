import matugen from "./matugen"
import gtk from "./gtk"
import lowBattery from "./battery"
import notifications from "./notifications"
import workrooms from "./workrooms"

export default function init() {
    try {
        gtk()
        matugen()
        lowBattery()
        notifications()
        workrooms()
    } catch (error) {
        logError(error)
    }
}
