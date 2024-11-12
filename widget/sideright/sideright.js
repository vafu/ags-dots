import Widget from "resource:///com/github/Aylur/ags/widget.js"
import * as Utils from "resource:///com/github/Aylur/ags/utils.js"
const { execAsync, exec } = Utils
const { Box, EventBox } = Widget
import {
    ToggleIconBluetooth,
    ToggleIconWifi,
    HyprToggleIcon,
    ModuleNightLight,
    ModuleInvertColors,
    ModuleIdleInhibitor,
    ModuleReloadIcon,
    ModuleSettingsIcon,
    ModulePowerIcon,
    ModuleRawInput,
    ModuleCloudflareWarp,
} from "./quicktoggles.js"
import ModuleNotificationList from "./centermodules/notificationlist.js"
import ModuleAudioControls from "./centermodules/audiocontrols.js"
import ModuleWifiNetworks from "./centermodules/wifinetworks.js"
import ModuleBluetooth from "./centermodules/bluetooth.js"
import ModuleConfigure from "./centermodules/configure.js"
import { ModuleCalendar } from "./calendar.js"
import { getDistroIcon } from "commons/system.js"
import { ExpandingIconTabContainer } from "commons/widgets/tabcontainer.js"
import { checkKeybind } from "commons/widgets/utils/keybind.js"

const centerWidgets = [
    {
        name: "Notifications",
        materialIcon: "notifications",
        contentWidget: ModuleNotificationList,
    },
    {
        name: "Audio controls",
        materialIcon: "volume_up",
        contentWidget: ModuleAudioControls,
    },
    {
        name: "Bluetooth",
        materialIcon: "bluetooth",
        contentWidget: ModuleBluetooth,
    },
    {
        name: "Wifi networks",
        materialIcon: "wifi",
        contentWidget: ModuleWifiNetworks,
        onFocus: () => execAsync("nmcli dev wifi list").catch(print),
    },
]

const battery = await Service.import("battery")

function up(up) {
    const h = Math.floor(up / 60)
    const m = Math.floor(up % 60)
    return `${h}h ${m < 10 ? "0" + m : m}m`
}

const timeRow = Box({
    className: "spacing-h-10 sidebar-group-invisible-morehorizpad",
    children: [
        Widget.Icon({
            icon: getDistroIcon(),
            className: "txt txt-larger",
        }),
        Widget.Label({
            hpack: "center",
            className: "txt-small txt",
            label: battery.bind("time_remaining").as(s => `Time remaining: ${up(s)}`),
        }),
        Widget.Box({ hexpand: true }),
        // ModuleReloadIcon({ hpack: "end" }),
        // ModuleSettingsIcon({ hpack: 'end' }), // Button does work, gnome-control-center is kinda broken
        ModulePowerIcon({ hpack: "end" }),
    ],
})

const togglesBox = Widget.Box({
    hpack: "center",
    className: "sidebar-togglesbox spacing-h-5",
    children: [
        ToggleIconWifi(),
        ToggleIconBluetooth(),
        // await ModuleRawInput(),
        // await HyprToggleIcon('touchpad_mouse', 'No touchpad while typing', 'input:touchpad:disable_while_typing', {}),
        ModuleIdleInhibitor(),
    ],
})

export const sidebarOptionsStack = ExpandingIconTabContainer({
    tabsHpack: "center",
    tabSwitcherClassName: "sidebar-icontabswitcher",
    icons: centerWidgets.map(api => api.materialIcon),
    names: centerWidgets.map(api => api.name),
    children: centerWidgets.map(api => api.contentWidget()),
    onChange: (self, id) => {
        self.shown = centerWidgets[id].name
        if (centerWidgets[id].onFocus)
            centerWidgets[id].onFocus()
    },
})

export default () => Box({
    vexpand: true,
    css: "min-width: 2px;",
    children: [
        EventBox({
            onPrimaryClick: () => App.closeWindow("sideright"),
            onSecondaryClick: () => App.closeWindow("sideright"),
            onMiddleClick: () => App.closeWindow("sideright"),
        }),
        Box({
            vertical: true,
            vexpand: true,
            className: "sidebar-right spacing-v-15",
            children: [
                Box({
                    vertical: true,
                    className: "spacing-v-5",
                    children: [
                        timeRow,
                        togglesBox,
                    ],
                }),
                Box({
                    className: "sidebar-group",
                    children: [
                        sidebarOptionsStack,
                    ],
                }),
                ModuleCalendar(),
            ],
        }),
    ],
    setup: self => self
        .on("key-press-event", (widget, event) => { // Handle keybinds
            if (checkKeybind(event, userOptions.keybinds.sidebar.options.nextTab))
                sidebarOptionsStack.nextTab()

            else if (checkKeybind(event, userOptions.keybinds.sidebar.options.prevTab))
                sidebarOptionsStack.prevTab()
        })
    ,
})
