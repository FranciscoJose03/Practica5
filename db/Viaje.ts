import mongoose, {Schema, InferSchemaType} from "mongoose";
import { clienteModel } from "./Client.ts";
import { conductorModel } from "./Conductor.ts";


const schema = mongoose.Schema;

const viajeSchema = new schema(
    {
        client: {type: Schema.Types.ObjectId, required: true, ref: "Cliente"},
        driver: {type: Schema.Types.ObjectId, required: true, ref: "Conductor"},
        money:  {type: Number, required: true},
        distance: {type: Number, required: true},
        date: {type: String, required: true},
        status: {type: String, required: true}
    },
    {timestamps: false}
);

viajeSchema
    .path("money")
    .validate((money:number) => {
        if(money < 5 ){
            throw new Error('El dinero minimo es 5€')
        }
    })

viajeSchema
    .path("distance")
    .validate((distance:number) => {
        if(distance <= 0.01 ){
            throw new Error('La distancia minima es 0.01km')
        }
    })

viajeSchema
    .path("date")
    .validate((date: string) => {
        const hoy = new Date();
        const hoy2 = hoy.toLocaleDateString().toString();
        const arrayhoy = hoy2.split('/')
        const arraydate = date.split('/')
        console.log(arraydate)
        console.log(arrayhoy)
        if(parseInt(arraydate[2]) > parseInt(arrayhoy[2])){
            return true
        }else if (parseInt(arraydate[2]) > parseInt(arrayhoy[2]) && parseInt(arraydate[1]) > parseInt(arrayhoy[1])){
            return true
        }else if(parseInt(arraydate[2]) > parseInt(arrayhoy[2]) && parseInt(arraydate[1]) > parseInt(arrayhoy[1]) && parseInt(arraydate[0]) > parseInt(arrayhoy[0])){
            return true
        }
        throw new Error('La fecha no puede ser anterior a la actual')
    })

viajeSchema
    .path("status")
    .validate((status: string) => {
        if (status == "EnProgreso" || status == "Preparado"){
            return true
        }
        throw new Error('El estado no es valido')
    })

viajeSchema
    .pre("save", async function(next) { //En esta pagina https://mongoosejs.com/docs/middleware.html#pre busque el funcionamiento del pre y su uso del next
        const viaje = this as viajeModelType
        const cliente = await clienteModel.findById(viaje.client).populate('travels')
        const conductor = await conductorModel.findById(viaje.driver).populate('travels')
        if(cliente && conductor){
            if(cliente.travels.length == 0 && conductor.travels.length == 0){
                if(cliente.cards.some(card => card.money >= viaje.money)){
                    const card = cliente.cards.find(card => card.money >= viaje.money)
                    if(card){
                        card.money -= viaje.money
                        cliente.travels.push(viaje)
                        await cliente.save()
                        conductor.travels.push(viaje)
                        await conductor.save()
                        next();
                    }
                }else{
                    throw new Error('No dinero suficiente')
                }
            }else{
                throw new Error('El cliente o el conductor ya tiene viajes')
            }
        }else{
            throw new Error('El save de Viaje dio error')
        }
    })
export type viajeModelType = mongoose.Document & InferSchemaType<typeof viajeSchema> //busque el error que tenia y saque la informacion de aqui https://github.com/Automattic/mongoose/issues/12420
export const viajeModel =  mongoose.model<viajeModelType>("viaje", viajeSchema);