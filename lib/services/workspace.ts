export class WorkspaceService extends Service {
    static {
        Service.register(this, {}, {
            "active_workroom": ["int"],
        })
    }

    private _active_workroom: number = 0
    get active_workroom() { return this._active_workroom }

    private _workrooms: Map<number, WR> = new Map()

    getWorkroom(idx: number) {
        if (!this._workrooms.get(idx)) {
            const wr = new WR()
            wr.connect("notify::active", s => {
                if (s.active)
                    this.updateProperty("active_workroom", idx)
            })
            this._workrooms.set(idx, wr)
        }
        return this._workrooms.get(idx)!
    }
}

class WR extends Service {
    static {
        Service.register(this, {}, {
            "active_workspace": ["int"],
            "active": ["boolean"],
            "length": ["int"],
        })
    }

    private _length = 7
    get length() { return this._length }

    private _active_workspace = -1
    get active_workspace() { return this._active_workspace }

    private _active = false
    get active() { return this._active }

    private _workspaces: Map<number, WS> = new Map()

    getWorkspace(idx: number) {
        if (!this._workspaces.get(idx)) {
            const ws = new WS()
            ws.connect("notify::active", s => {
                if (s.active) {
                    this.setActive(true)
                    this.updateProperty("active_workspace", idx)
                } else {
                    const stillActive = Array.from(this._workspaces.values()).some(w => w.active)
                    this.setActive(stillActive)
                }
            })
            this._workspaces.set(idx, ws)
        }
        return this._workspaces.get(idx)!
    }

    setActive(active: boolean) {
        this.updateProperty("active", active)
    }
}

class WS extends Service {
    static {
        Service.register(this, {}, {
            "active": ["boolean"],
            "occupied": ["boolean"],
            "urgent": ["boolean"],
            "ws": ["jsobject"],
        })
    }

    private _active: boolean = false
    private _occupied: boolean = false
    private _urgent: boolean = false
    get active() { return this._active }
    get occupied() { return this._occupied }
    get urgent() { return this._urgent }

    get ws() { return this }

    setActive(active: boolean) {
        this.updateProperty("active", active)
    }

    setOccupied(occupied: boolean) {
        this.updateProperty("occupied", occupied)
    }

    setUrgent(urgent: boolean) {
        this.updateProperty("urgent", urgent)
    }

    override notify(property_name: string): void {
        super.notify(property_name)
        super.notify("ws")
    }
}

const ws = new WorkspaceService
export default ws
