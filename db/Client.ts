import mongoose, {InferSchemaType} from "mongoose";

import { viajeModelType, viajeModel } from "./Viaje.ts";
import { conductorModel } from "./Conductor.ts";

const schema = mongoose.Schema;

const clienteSchema = new schema(
    {
        name: {type: String, required: true},
        email:{type: String, required: true, unique: true},
        cards: [{
            number: {type: String, required: true, unique: true},
            cvv: {type: Number, required: true},
            expirity: {type: String, required: true},
            money: {type: Number, required: false, default: 0}, 
        }, {required: false, default: []}],
        travels: [{type: schema.Types.ObjectId, required: false, ref: "viaje", default: []}]
    },
    {timestamps: false}
);

clienteSchema
    .path("email")
    .validate((email: string) => {
        if(/^[a-z]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/.test(email)){
            return true;
        }else{ 
            throw new Error("El email da error")
        }
    });

clienteSchema
    .path("cards.number")
    .validate((num: string) => {
        const number = num.toString()
        if(number.length == 16){
            return true
        }else{
            throw new Error(`El numero de la tarjeta no esta bien`)
        }
    })

clienteSchema
    .path("cards.cvv")
    .validate((cvv:number) => {
        const c = cvv.toString();
        if(c.length == 3){
            return true
        }else{
            throw new Error(`El numero de cvv no esta bien`)
        }
    })

clienteSchema
    .path("cards.expirity")
    .validate((expirity:string) => {
        if(/^(0[1-9]|1[0-2])\/\d{4}$/.test(expirity)){
            const mes = parseInt(expirity.split("/")[0])
            const a = parseInt(expirity.split("/")[1])
            const fecha = new Date();
            if(mes > fecha.getMonth() || a > fecha.getFullYear()){
                return true
            }
        }else{
            throw new Error(`El expirity no esta bien escrito`)
        }
    })

clienteSchema
    .path("cards.money")
    .validate((money: number) => {
        if(money >= 0){
            return true
        }
        throw new Error('El dinero no es negativo')
    })

clienteSchema
    .path("travels")
    .validate((travels: viajeModelType[]) => {
        for (let i = 0; i < travels.length; i++){
            if(travels[i].status != "Realizado"){
                throw new Error('No puede tener mas de un viaje activo')
            }
        }
        return true
    })

clienteSchema
    .post("findOneAndDelete", async function(cliente: clienteModelType) {
        if(cliente){
            await viajeModel.deleteMany({client: cliente._id})
            await conductorModel.updateMany({travels: cliente._id}, {$pull: {travels: cliente._id}})
        }
    })

export type clienteModelType = mongoose.Document & InferSchemaType<typeof clienteSchema> ////busque el error que tenia y saque la informacion de aqui https://github.com/Automattic/mongoose/issues/12420
export const clienteModel =  mongoose.model<clienteModelType>("cliente", clienteSchema);