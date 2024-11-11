import icons from "lib/icons"

const n = await Service.import("notifications")
const notifs = n.bind("notifications")

export default () => Widget.Box({
    class_name: "messages",
    visible: notifs.as(n => n.length > 0),
    child: Widget.Box([
        Widget.Icon(icons.notifications.message),
    ]),
})
