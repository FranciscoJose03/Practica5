export type Cliente = {
    id: string,
    name: string,
    email:string,
    cards: Array<Cards>,
    travels: Array<Viaje>
}

export type Cards = {
    number: string,
    cvv: number,
    expirity: string,
    money: number
}

export type Conductor = {
    id: string,
    name: string,
    email: string,
    username: string,
    travels: Array<Viaje>
}

export type Viaje = {
    id: string,
    client: Cliente,
    driver: Conductor,
    money: number,
    distance: number,
    date: Date,
    status: string
}