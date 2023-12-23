import { clienteModel, clienteModelType } from "../db/Client.ts";
import { conductorModel, conductorModelType } from "../db/Conductor.ts";
import { viajeModel, viajeModelType } from "../db/Viaje.ts";

import { GraphQLError } from "graphql";

export const Query = {
    
    clientes: async(_parent: unknown, _args: unknown): Promise<clienteModelType[]> => {
        const clients = await clienteModel.find();
        if(!clients){
            throw new GraphQLError(`No Clientes found`, {extensions: { code: "NOT_FOUND" },})  
        }
        return clients;
    },
    conductores: async(_parent: unknown, _args: unknown): Promise<conductorModelType[]> => {
        const conductors = await conductorModel.find();
        if(!conductors){
            throw new GraphQLError(`No Conductores found`, {extensions: { code: "NOT_FOUND" },})  
        }
        return conductors
    },
    viajes: async(_parent: unknown, _args: unknown): Promise<viajeModelType[]> => {
        const travel = await viajeModel.find();
        if(!travel){
            throw new GraphQLError(`No Viajes found`, {extensions: { code: "NOT_FOUND" },})  
        }
        return travel;
    }
}