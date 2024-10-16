import { i3_EVENT_TYPE } from "i3-ts/enum"
import { Workspace } from "i3-ts/message-types"
import { Connect } from "i3-ts/mod"

export class Sway extends Service {

    static #instance: Sway

    static {
        Service.register(this, {}, {
            'active': ['jsobject'],
            'workspaces': ['jsobject'],
            'monitors': ['jsobject'],
            'clients': ['jsobject']
        })
    }

    _workspaces = new WorkspaceService()
    public get workspaces() { return this._workspaces }

    private connection: OpenConnection

    constructor(connection: OpenConnection) {
        super()
        this.connection = connection
    }

    private async init() {
        const ws = await this.connection.getWorkspaces()
        ws.forEach(w => this.getWS(w)?.setOccupied(true))
        const focused = ws.find(w => w.focused)
        if (focused != null) {
            this.getWS(focused).setActive(true)
        }

        this.notify('workspaces')

        this.connection.subscribe(['workspace'])
        this.connection.on(
            i3_EVENT_TYPE.WORKSPACE,
            e => {
                switch (e.change) {
                    case "focus": {
                        this.getWS(e.old as Workspace).setActive(false)
                        this.getWS(e.current as Workspace).setActive(true)
                        break
                    }

                    case "init": {
                        this.getWS(e.current as Workspace).setOccupied(true)
                        break
                    }

                    case "empty": {
                        this.getWS(e.current as Workspace).setOccupied(false)
                        break
                    }
                    default: console.log(`unhandled ${e.change}`)
                }
            }
        )

        return this
    }

    static async obtain() {
        if (!Sway.#instance) Sway.#instance = await new Sway(await Connect()).init()
        return Sway.#instance
    }

    private extractIndices(workspace: Workspace) {
        const split = workspace.name.split('%')
        return {
            ws: parseInt(split[0]),
            wr: parseInt(split[1])
        }
    }

    private getWS(workspace: Workspace) {
        const { wr, ws } = this.extractIndices(workspace)
        return this.workspaces.getWorkroom(wr).getWorkspace(ws)
    }
}

type OpenConnection = Awaited<ReturnType<typeof Connect>>

export class WorkspaceService extends Service {
    static {
        Service.register(this, {}, {
            'active-workroom': ['int'],
        })
    }

    private _active_workroom: number = 0
    get active_workroom() { return this._active_workroom }

    private _workrooms: Map<number, WR> = new Map()

    getWorkroom(idx: number) {
        if (!this._workrooms.get(idx)) {
            const wr = new WR()
            wr.connect("notify::active", (s) => {
                if (s.active) {
                    this.updateProperty('active_workroom', idx)
                }
            })
            this._workrooms.set(idx, wr)
        }
        return this._workrooms.get(idx)!!
    }
}

class WR extends Service {
    static {
        Service.register(this, {}, {
            'active_workspace': ['int'],
            'active': ['boolean'],
            'length': ['int']
        })
    }

    private _length = 5
    get length() { return this._length }

    private _active_workspace = -1
    get active_workspace() { return this._active_workspace }

    private _active = false
    get active() { return this._active }

    private _workspaces: Map<number, WS> = new Map()

    getWorkspace(idx: number) {
        if (!this._workspaces.get(idx)) {
            const ws = new WS()
            ws.connect("notify::active", (s) => {
                if (s.active) {
                    this.setActive(true)
                    this.updateProperty('active_workspace', idx)
                } else {
                    const stillActive = Array.from(this._workspaces.values()).some(w => w.active)
                    this.setActive(stillActive)
                }
            })
            this._workspaces.set(idx, ws)
        }
        return this._workspaces.get(idx)!!
    }

    setActive(active: boolean) {
        this.updateProperty('active', active)
    }
}

class WS extends Service {
    static {
        Service.register(this, {}, {
            'active': ['boolean'],
            'occupied': ['boolean'],
            'ws': ['jsobject']
        })
    }

    id = Math.random() * 1000

    private _active: boolean = false
    private _occupied: boolean = false
    get active() { return this._active }
    get occupied() { return this._occupied }

    get ws() { return this }

    setActive(active: boolean) {
        this.updateProperty('active', active)
    }

    setOccupied(occupied: boolean) {
        this.updateProperty('occupied', occupied)
    }

    override notify(property_name: string): void {
        super.notify(property_name)
        super.notify('ws')
    }
}
