/* eslint-disable max-len */
import { type Opt } from "lib/option"
import options from "options"
import { bash, dependencies } from "lib/utils"

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
    $("bg", t(dark.bg, light.bg)),
    $("red", t(dark.red, light.red)),
    $("green", t(dark.green, light.green)),
    $("yellow", t(dark.yellow, light.yellow)),
    $("blue", t(dark.blue, light.blue)),
    $("purple", t(dark.purple, light.purple)),
    $("aqua", t(dark.aqua, light.aqua)),
    $("gray", t(dark.gray, light.gray)),
    $("gray_dim", t(dark.gray_dim, light.gray_dim)),
    $("red_dim", t(dark.red_dim, light.red_dim)),
    $("green_dim", t(dark.green_dim, light.green_dim)),
    $("yellow_dim", t(dark.yellow_dim, light.yellow_dim)),
    $("blue_dim", t(dark.blue_dim, light.blue_dim)),
    $("purple_dim", t(dark.purple_dim, light.purple_dim)),
    $("aqua_dim", t(dark.aqua_dim, light.aqua_dim)),
    $("fg", t(dark.fg, light.fg)),
    $("bg0_h", t(dark.bg0_h, light.bg0_h)),
    $("bg0", t(dark.bg0, light.bg0)),
    $("bg1", t(dark.bg1, light.bg1)),
    $("bg2", t(dark.bg2, light.bg2)),
    $("bg3", t(dark.bg3, light.bg3)),
    $("bg4", t(dark.bg4, light.bg4)),
    $("orange", t(dark.orange, light.orange)),
    $("orange_dim", t(dark.orange_dim, light.orange_dim)),
    $("bg0_s", t(dark.bg0_s, light.bg0_s)),
    $("fg4", t(dark.fg4, light.fg4)),
    $("fg3", t(dark.fg3, light.fg3)),
    $("fg2", t(dark.fg2, light.fg2)),
    $("fg1", t(dark.fg1, light.fg1)),
    $("fg0", t(dark.fg0, light.fg0)),

    $("primary-fg", `$${primary}`),
    $("primary-bg", `$${primary}_dim`),

    $("error-fg", "$red"),
    $("error-bg", "$red_dim"),

    $("scheme", scheme),
    $("padding", `${padding}pt`),
    $("spacing", `${spacing}pt`),
    $("radius", `${radius}px`),
    $("transition", `${options.transition}ms`),

    $("shadows", `${shadows}`),

    $("widget", "$bg3"),
    $("border-bg", "$bg4"),
    $("widget-bg", `transparentize($widget, ${widget.opacity.value / 100})`),

    $("hover-bg", `transparentize($widget, ${(widget.opacity.value * .9) / 100})`),
    $("hover-fg", `lighten($fg, 8%)`),

    $("border-width", `${border.width}px`),
    $("border-color", `transparentize($border-bg, ${border.opacity.value / 100})`),
    $("border", "$border-width solid $border-color"),

    $("active-gradient", "linear-gradient(to right, $fg3, $fg2)"),
    $("shadow-color", t("rgba(0,0,0,.6)", "rgba(0,0,0,.4)")),
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

        await Utils.writeFile(variables().join("\n"), vars)
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
