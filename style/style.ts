/* eslint-disable max-len */
import { type Opt } from "lib/option"
import options from "options"
import { bash, dependencies } from "lib/utils"
import GLib from "types/@girs/glib-2.0/glib-2.0"

const gtkcss_path = `${GLib.get_user_config_dir()}/gtk-3.0/gtk.css`
const gtkcss = Utils.readFile(gtkcss_path)
function transformCss(cssContent: string): string {
    return cssContent.replace(/@define-color\s+([\w-]+)\s+(.+?);/g, (_, variableName, colorValue) => {
        return `$${variableName}:${colorValue};`
            .replaceAll("@", "$")
    })
}
const deps = [
    "font",
    "theme",
    "bar.corners",
    "bar.flatButtons",
    "bar.position",
    "bar.battery.charging",
    "bar.battery.blocks",
]

const {
    dark,
    light,
    blur,
    primary,
    scheme,
    padding,
    spacing,
    radius,
    shadows,
    widget,
    border,
} = options.theme

const popoverPaddingMultiplier = 1.6

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const t = (dark: Opt<any> | string, light: Opt<any> | string) => scheme.value === "dark"
    ? `${dark}` : `${light}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $ = (name: string, value: string | Opt<any>) => `$${name}: ${value};`

const variables = () => [
    $("primary-fg", `$${primary}_1`),
    $("primary-bg", `$${primary}_2`),

    $("error-fg", "$error_fg_color"),
    $("error-bg", "$error_bg_color"),

    $("scheme", scheme),
    $("padding", `${padding}pt`),
    $("spacing", `${spacing}pt`),
    $("radius", `${radius}px`),
    $("transition", `${options.transition}ms`),

    $("shadows", `${shadows}`),

    $("widget", "$view_bg_color"),
    $("border-bg", "$headerbar_border_color"),
    $("widget-bg", `transparentize($widget, ${widget.opacity.value / 100})`),

    $("hover-bg", `transparentize($widget, ${(widget.opacity.value * .9) / 100})`),
    $("hover-fg", "lighten($view_fg_color, 8%)"),

    $("border-width", `${border.width}px`),
    $("border-color", `transparentize($border-bg, ${border.opacity.value / 100})`),
    $("border", "$border-width solid $border-color"),

    $("active-gradient", "linear-gradient(to right, $accent_color, $accent_bg_color)"),
    $("shadow-color", "$shade_color"),
    $("text-shadow", t("2pt 2pt 2pt $shadow-color", "none")),
    $("box-shadow", t("2pt 2pt 2pt 0 $shadow-color, inset 0 0 0 $border-width $border-color", "none")),

    $("popover-border-color", `transparentize($border-bg, ${Math.max(((border.opacity.value - 1) / 100), 0)})`),
    $("popover-padding", `$padding * ${popoverPaddingMultiplier}`),
    $("popover-radius", radius.value === 0 ? "0" : "$radius + $popover-padding"),

    $("font-size", `${options.font.size}pt`),
    $("font-name", options.font.name),

    // etc
    $("charging-bg", "$primary-fg"),
    $("bar-battery-blocks", options.bar.battery.blocks),
    $("bar-position", options.bar.position),
    $("hyprland-gaps-multiplier", options.hyprland.gaps),
    $("screen-corner-multiplier", `${options.bar.corners.value * 0.01}`),
]

async function resetCss() {
    if (!dependencies("sass", "fd"))
        return

    try {
        const vars = `${TMP}/variables.scss`
        const scss = `${TMP}/main.scss`
        const css = `${TMP}/main.css`

        const fd = await bash(`fd ".scss" ${App.configDir}`)
        const files = fd.split(/\s+/)
        const imports = [vars, ...files].map(f => `@import '${f}';`)

        await Utils.writeFile(transformCss(gtkcss) + "\n" + variables().join("\n"), vars)
        await Utils.writeFile(imports.join("\n"), scss)
        await bash`sass ${scss} ${css}`

        App.applyCss(css, true)
    } catch (error) {
        error instanceof Error
            ? logError(error)
            : console.error(error)
    }
}

Utils.monitorFile(`${App.configDir}/style`, resetCss)
options.handler(deps, resetCss)
await resetCss()
