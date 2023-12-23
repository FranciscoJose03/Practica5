import { clienteModelType, clienteModel } from "../db/Client.ts";
import { conductorModelType, conductorModel} from "../db/Conductor.ts";
import { viajeModelType, viajeModel } from "../db/Viaje.ts";
import { GraphQLError } from "graphql";

export const Mutation = {
    createCliente: async(_parent:unknown, args:{name: string, email: string}): Promise<clienteModelType> => {
        try{
            const{name, email} = args
            const cliente = new clienteModel({
                name,
                email
            })
            await cliente.save();
            return cliente;
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    deleteCliente: async(_parent:unknown, args:{id: string}): Promise<string> => {
        try{
            const clienteDelete = await clienteModel.findOneAndDelete({_id: args.id})
            if(!clienteDelete){
                throw new GraphQLError(`No se encontro ningun Cliente con el id ${args.id}`, {extensions: {code: "NOT_FOUND"},});
            }
            return "Cliente Delete"
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    createConductor: async(_parent:unknown, args:{name: string, email: string, username: string}): Promise<conductorModelType> => {
        try{
            const{name, email, username} = args
            const conductores = new conductorModel({
                name,
                email,
                username
            })
            await conductores.save();
            return conductores;
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    deleteConductor: async(_parent:unknown, args:{id: string}): Promise<string> => {
        try{
            const conductorDelete = await conductorModel.findOneAndDelete({_id: args.id})
            if(!conductorDelete){
                throw new GraphQLError(`No se encontro ningun Conductor con el id ${args.id}`, {extensions: {code: "NOT_FOUND"},});
            }
            return "Conductor Delete"
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    },
    addTarjeta: async(_parent:unknown, args:{idCliente: string, number: string, cvv: number, expirity: string, money: number}): Promise<clienteModelType> => {
        const{number, cvv, expirity, money} = args
        const cliente = await clienteModel.findById(args.idCliente);
        if(!cliente){
            throw new GraphQLError(`No Cliente found`, {extensions: { code: "NOT_FOUND" },})  
        }
        if(cliente.cards){
            for(let i in cliente.cards){
                if(cliente.cards[i].number == args.number){
                    throw new GraphQLError(`This tarjeta it has been created`, {extensions: {code:"HAS_BEEN_CREATED_BEFORE"}})
                }
            }
        }
        const cards = {
            number,
            cvv,
            expirity,
            money
        }
        
        cliente.cards.push(cards)
        
        await cliente.save()
        return cliente
    },
    deleteTarjeta: async(_parent:unknown, args:{id: string, number: string}):Promise<string> => {
        const cliente = await clienteModel.findOne({_id: args.id});
        if(!cliente){
            throw new GraphQLError(`No Cliente found`, {extensions: { code: "NOT_FOUND" },})  
        }else if(!cliente.cards){
            throw new GraphQLError(`Client not have cards`, {extensions: { code: "NOT_CARDS_FOUND" },})
        }

        let cont = 0
        for(let i in cliente.cards){
            if(cliente.cards[i].number === args.number){
                cliente.cards.splice(cont, 1)
            }
            cont ++;
        }

        await cliente.save();
        return "Tarjeta Delete";
    },
    createViaje: async(_:unknown, args: {idCliente: string, idConductor: string, money: number, distance: number, date: string, status: string}): Promise <viajeModelType> => {
        try{
            const cliente = await clienteModel.findById(args.idCliente);
            const conductor = await conductorModel.findById(args.idConductor)
            const viaje = new viajeModel({
                client: cliente,
                driver: conductor,
                money: args.money,
                distance: args.distance,
                date: args.date,
                status: args.status
            })
            await viaje.save()
            return viaje;
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "ERROR"},});
        }
    },
    acaboViaje: async(_parent:unknown, args:{id: string}): Promise<viajeModelType> => {
        try{
            const viajeAcabar = await viajeModel.findById({_id: args.id})
            
            if(!viajeAcabar){
                throw new GraphQLError(`No se encontro ningun Viaje con el id ${args.id}`, {extensions: {code: "NOT_FOUND"},});
            } else if(viajeAcabar?.status === "Realizado"){
                throw new GraphQLError("Viaje ya terminado", {extensions: {code: "NOT_FOUND"},});
            }

            const viajeAcabado = await viajeModel.findByIdAndUpdate(args.id, {status:"Realiado", date: new Date()},
                                    {new: true})

            if(!viajeAcabado){
                throw new GraphQLError(`No se encontro ningun Viaje con el id ${args.id}`, {extensions: {code: "NOT_FOUND"},});
            }
            return viajeAcabado
        }catch(error){
            throw new GraphQLError(error.message, {extensions: {code: "INTERNAL_SERVER_ERROR"},});
        }
    }
}