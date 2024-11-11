import PanelButton from "../PanelButton"
import icons from "lib/icons"
import asusctl from "service/asusctl"

const notifications = await Service.import("notifications")
const bluetooth = await Service.import("bluetooth")
const audio = await Service.import("audio")
const network = await Service.import("network")
const powerprof = await Service.import("powerprofiles")

export const ProfileIndicator = () => {
    const icon = asusctl.available
        ? asusctl.bind("profile").as(p => icons.asusctl.profile[p])
        : powerprof.bind("active_profile").as(p => icons.powerprofile[p])

    return PanelButton({
        child: Widget.Icon({ icon }),
        onClicked: () => {
            const profIdx = powerprof.profiles
                .findIndex(p => p.Profile === powerprof.active_profile)
            const newIdx = (profIdx + 1) % powerprof.profiles.length
            const prof = powerprof.profiles[newIdx]
            powerprof.active_profile = prof.Profile
        },
    })
}

export const ModeIndicator = () => {
    if (!asusctl.available) {
        return Widget.Icon({
            setup(self) {
                Utils.idle(() => self.visible = false)
            },
        })
    }

    return Widget.Icon({
        visible: asusctl.bind("mode").as(m => m !== "Hybrid"),
        icon: asusctl.bind("mode").as(m => icons.asusctl.mode[m]),
    })
}

export const MicrophoneIndicator = () => Widget.Icon()
    .hook(audio, self => self.visible =
        audio.recorders.length > 0
        || audio.microphone.is_muted
        || false)
    .hook(audio.microphone, self => {
        const vol = audio.microphone.is_muted ? 0 : audio.microphone.volume
        const { muted, low, medium, high } = icons.audio.mic
        const cons = [[67, high], [34, medium], [1, low], [0, muted]] as const
        self.icon = cons.find(([n]) => n <= vol * 100)?.[1] || ""
    })

export const DNDIndicator = () => Widget.Icon({
    visible: notifications.bind("dnd"),
    icon: icons.notifications.silent,
})

export const BluetoothIndicator = () => Widget.Overlay({
    class_name: "bluetooth",
    passThrough: true,
    visible: bluetooth.bind("enabled"),
    child: Widget.Icon({
        icon: icons.bluetooth.enabled,
    }),
    overlay: Widget.Label({
        hpack: "end",
        vpack: "start",
        label: bluetooth.bind("connected_devices").as(c => `${c.length}`),
        visible: bluetooth.bind("connected_devices").as(c => c.length > 0),
    }),
})

export const NetworkIndicator = () => Widget.Icon()
    .hook(network, self => {
        const icon = network[network.primary || "wifi"]?.icon_name
        self.icon = icon || ""
        self.visible = !!icon
    })

export const AudioIndicator = () => Widget.Icon()
    .hook(audio.speaker, self => {
        const vol = audio.speaker.is_muted ? 0 : audio.speaker.volume
        const { muted, low, medium, high, overamplified } = icons.audio.volume
        const cons = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]] as const
        self.icon = cons.find(([n]) => n <= vol * 100)?.[1] || ""
    })
