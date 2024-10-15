import { i3_EVENT_TYPE } from "i3-ts/enum"
import { Workspace } from "i3-ts/message-types"
import { Connect } from "i3-ts/mod"
import Workspace from "widget/overview/Workspace"

export class Sway extends Service {

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
        ws.forEach(w => this.workspaces.addWorkspace(w))
        const focused = ws.find(w => w.focused)
        if (focused != null) {
            this.workspaces.setActive(focused)
        }

        this.notify('workspaces')

        this.connection.subscribe(['workspace'])
        this.connection.on(
            i3_EVENT_TYPE.WORKSPACE,
            e => {
                switch (e.change) {
                    case "focus": {
                        this.workspaces.setActive(e.current as Workspace, e.old as Workspace)
                        break
                    }

                    case "init": {
                        this.workspaces.addWorkspace(e.current as Workspace)
                        break
                    }

                    case "empty": {
                        this.workspaces.removeWorkspace(e.current as Workspace)
                        break
                    }
                    default: console.log(`unhandled ${e.change}`)
                }
            }
        )

        return this
    }

    static async obtain() {
        return new Sway(await Connect()).init()
    }
}

type OpenConnection = Awaited<ReturnType<typeof Connect>>

const min_workspaces = 5

export class WorkspaceService extends Service {
    static {
        Service.register(this, {}, {
            'active_workroom': ['int'],
            'workspaces_count': ['int'],
        })
    }

    active_workroom: number = 0
    workspaces_count: number = min_workspaces

    workspaces: { [wr: string]: { [ws: string]: WS } } = {};

    public getWorkspace(ws: number, wr: number = this.active_workroom): WS {
        return this.getWsByIdx(wr, ws)
    }

    setActive(current: Workspace, old: Workspace | null = null) {
        if (old != null) {
            this.getWS(old).setActive(false)
        }
        this.getWS(current).setActive(true)

        // better handle workrooms
        const { wr } = this.extractIndices(current)
        if (wr != this.active_workroom) {
            this.active_workroom = wr
            this.notify('active_workroom')
            this.emit('changed')
        }
    }

    addWorkspace(workspace: Workspace) {
        this.getWS(workspace).setOccupied(true)
    }

    removeWorkspace(workspace: Workspace) {
        this.getWS(workspace).setOccupied(false)
    }

    private extractIndices(workspace: Workspace) {
        const split = workspace.name.split('%')
        return {
            ws: parseInt(split[0]),
            wr: parseInt(split[1])
        }
    }

    private getWsByIdx(wr: number, ws: number) {
        if (!this.workspaces[wr]) this.workspaces[wr] = {}
        if (!this.workspaces[wr][ws]) this.workspaces[wr][ws] = new WS()
        return this.workspaces[wr][ws]
    }

    private getWS(workspace: Workspace) {
        const { ws, wr } = this.extractIndices(workspace)
        return this.getWsByIdx(wr, ws)
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

    private _active: boolean = false
    private _occupied: boolean = false
    get active() { return this._active }
    get occupied() { return this._occupied }

    get ws() { return this }

    setActive(active: boolean) {
        this._active = active
        this.notify('active')
    }

    setOccupied(occupied: boolean) {
        console.log("occupied:", occupied)
        this._occupied = occupied
        this.notify('occupied')
    }

    override notify(property_name: string): void {
        super.notify(property_name)
        super.notify('ws')
    }
}
