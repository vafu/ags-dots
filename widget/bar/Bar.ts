import BatteryBar from "./buttons/BatteryBar"
import ColorPicker from "./buttons/ColorPicker"
import Date from "./buttons/Date"
import Media from "./buttons/Media"
import PowerMenu from "./buttons/PowerMenu"
import SysTray from "./buttons/SysTray"
import PanelButton from "./PanelButton"
import Workspaces from "./buttons/Workspaces"
import ScreenRecord from "./buttons/ScreenRecord"
import Messages from "./buttons/Messages"
import WindowTitle from "./WindowTitle"
import options from "options"
import {
    ProfileIndicator,
    NetworkIndicator,
    AudioIndicator,
    BluetoothIndicator,
} from "./buttons/SystemIndicators"

const { start, center, end, indicators } = options.bar.layout
const { transparent, position } = options.bar

export type BarWidget = keyof typeof widget

const SystemIndicators = () => PanelButton({
    window: "quicksettings",
    on_clicked: () => App.toggleWindow("quicksettings"),
    child: Widget.Box({
        children: indicators.bind().as(c => c.map(w => widget[w]())),
    }),
})

const widget = {
    battery: BatteryBar,
    colorpicker: ColorPicker,
    date: Date,
    media: Media,
    powermenu: PowerMenu,
    systray: SysTray,
    indicators: SystemIndicators,
    // taskbar: Taskbar,
    windowtitle: WindowTitle,
    workspaces: Workspaces,
    screenrecord: ScreenRecord,
    messages: Messages,
    power_profile: ProfileIndicator,
    // ModeIndicator,
    // DNDIndicator,
    bluetooth: BluetoothIndicator,
    network: NetworkIndicator,
    audio: AudioIndicator,
    // microphone: MicrophoneIndicator,
    expander: () => Widget.Box({ expand: true }),
}

export default (monitor: number) => Widget.Window({
    monitor,
    class_name: "bar",
    name: `bar${monitor}`,
    exclusivity: "exclusive",
    anchor: position.bind().as(pos => [pos, "right", "left"]),
    child: Widget.CenterBox({
        css: "min-width: 2px; min-height: 2px;",
        startWidget: Widget.Box({
            hexpand: true,
            children: start.bind().as(s => s.map(w => widget[w]())),
        }),
        centerWidget: Widget.Box({
            hpack: "center",
            children: center.bind().as(c => c.map(w => widget[w]())),
        }),
        endWidget: Widget.Box({
            hexpand: true,
            children: end.bind().as(e => e.map(w => widget[w]())),
        }),
    }),
    setup: self => self.hook(transparent, () => {
        self.toggleClassName("transparent", transparent.value)
    }),
})
