import { viajeModelType } from "../db/Viaje.ts";
import { clienteModel, clienteModelType } from "../db/Client.ts";
import { conductorModel, conductorModelType } from "../db/Conductor.ts";
import {GraphQLError} from "graphql"

export const Travel = {
    client: async (parent: viajeModelType): Promise<clienteModelType> => {
        if(parent.client){
            const client = await clienteModel.findById(parent.client).exec()
            if(client){
                return client
            }
        }
        throw new GraphQLError("Cliente not found")
    },
    driver: async(parent: viajeModelType): Promise<conductorModelType> => {
        if(parent.driver){
            const conductor = await conductorModel.findById(parent.driver).exec()
            if(conductor){
                return conductor
            }
        }
        throw new GraphQLError("Conductor not found")
    }
}