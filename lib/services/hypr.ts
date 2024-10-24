import { Services } from "lib/services"
import { WorkspaceService } from "./workspace"

const hypr = await Service.import("hyprland")

export function bindHypr<S extends keyof Services>(type: S, service: Services[S]) {
    switch (type) {
        case "workspace": return bindWorkspace(service as Services[S])
    }
}


function bindWorkspace(workspaceService: WorkspaceService) {
    const getWs = (int: number) => {
        const wr = Math.floor(int / 10)
        const ws = int % 10
        return workspaceService.getWorkroom(wr).getWorkspace(ws)
    }

    let last = getWs(hypr.active.workspace.id)
    last.setActive(true)

    hypr.active.workspace.connect("notify::id", s => {
        last.setActive(false)
        last = getWs(s.id)
        last.setActive(true)
        last.setUrgent(false)
    })

    hypr.workspaces.forEach(w => getWs(w.id).setOccupied(w.windows > 0))

    hypr.connect("notify::workspaces", s => {
        s.workspaces.forEach(w => getWs(w.id).setOccupied(w.windows > 0))
    })

    hypr.connect("urgent-window", (s, id) => {
        const wsid = s.workspaces.find(w => w.lastwindow === id)?.id
        if (wsid)
            getWs(wsid).setUrgent(true)
    })
}

// https://google.com
