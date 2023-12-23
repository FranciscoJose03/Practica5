import { clienteModelType } from "../db/Client.ts";
import { viajeModel, viajeModelType } from "../db/Viaje.ts";

export const Client = {
    travels: async (parent: clienteModelType): Promise<viajeModelType[]> => {
        return await viajeModel.find({client: parent.id})
    }
}