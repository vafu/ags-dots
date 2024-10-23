import PanelButton from "./PanelButton"

const hyprland = await Service.import("hyprland")

export default () => PanelButton({
    window: "title",
    className: "windowtitle",
    child: Widget.Box({
        children: [
            Widget.Label({
                class_name: "appname",
                label: hyprland.active.client.bind("class"),
            }),
            Widget.Label({
                label: hyprland.active.client.bind("title"),
            }),
        ],
    }),
})

