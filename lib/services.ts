import { bindHypr } from "./services/hypr"
import { WorkspaceService } from "./services/workspace"

export interface Services {
    workspace: WorkspaceService
}

const bound = new Set<keyof Services>()

export async function obtainService<S extends keyof Services>(type: S): Promise<Services[S]> {
    let service: Services[S] | null = null
    switch (type) {
        case "workspace": service = (await import("./services/workspace")).default as Services[S]
    }
    if (!service)
        throw Error("unregistered service")
    if (!bound.has(type)) {
        bound.add(type)
        bindHypr(type, service)
    }
    return service
}
