import "lib/session"
import "style/style"
import init from "lib/init"
import options from "options"
import Bar from "widget/bar/Bar"
import { forMonitors } from "lib/utils"
import { setupQuickSettings } from "widget/quicksettings/QuickSettings"
import { setupDateMenu } from "widget/datemenu/DateMenu"
import NotificationPopups from "widget/notifications/NotificationPopups"
import ScreenCorners from "widget/bar/ScreenCorners"
import OSD from "widget/osd/OSD"
import Verification from "widget/powermenu/Verification"
import PowerMenu from "widget/powermenu/PowerMenu"
import SettingsDialog from "widget/settings/SettingsDialog"
import Sideleft from "widget/sideleft/main"


App.config({
    onConfigParsed: () => {
        setupQuickSettings()
        setupDateMenu()
        init()
    },
    closeWindowDelay: {
        "launcher": options.transition.value,
        "overview": options.transition.value,
        "quicksettings": options.transition.value,
        "datemenu": options.transition.value,
    },
    windows: () => [
        ...forMonitors(Bar),
        ...forMonitors(NotificationPopups),
        ...forMonitors(ScreenCorners),
        ...forMonitors(OSD),
        PowerMenu(),
        SettingsDialog(),
        Verification(),
        Sideleft(),
    ],
})

