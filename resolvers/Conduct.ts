import { conductorModelType } from "../db/Conductor.ts";
import { viajeModel, viajeModelType } from "../db/Viaje.ts";

export const Conduct = {
    travels: async (parent: conductorModelType): Promise<viajeModelType[]> => {
        return await viajeModel.find({driver: parent.id})
    }
}