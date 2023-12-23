import mongoose, {InferSchemaType} from "mongoose";

import { viajeModel } from "./Viaje.ts";
import { clienteModel } from "./Client.ts";

const schema = mongoose.Schema;

const conductorSchema = new schema(
    {
        name: {type: String, required: true},
        email:{type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        travels: [{type: schema.Types.ObjectId, required: false, ref: "viaje", default: []}]
    },
    {timestamps: false}
);

conductorSchema
    .path("email")
    .validate((email: string) => {
        if(/^[a-z]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/.test(email)){
            return email;
        }else{ 
            throw new Error("El email da error")
        }
    });

conductorSchema
    .path("travels")
    .validate((travels: string[])=> {
        if(travels.length > 1){
            throw new Error("El Conductor tiene un viaje")
        }else{
            return true
        }
    });

conductorSchema
    .post("findOneAndDelete", async function(conductor: conductorModelType) {
        if(conductor){
            await viajeModel.deleteMany({driver: conductor.id})
            await clienteModel.deleteMany({travels: conductor.travels})
        }
    });

export type conductorModelType = mongoose.Document & InferSchemaType<typeof conductorSchema> //busque el error que tenia y saque la informacion de aqui https://github.com/Automattic/mongoose/issues/12420
export const conductorModel =  mongoose.model<conductorModelType>("conductor", conductorSchema);