export const typeDefs = `#graphql
    type Cliente{
        id: ID!
        name: String!
        email: String!
        cards: [Cards!]!
        travels: [Viaje!]!
    }

    type Cards{
        number: String!
        cvv: Int!
        expirity: String!
        money: Int!
    }

    type Conductor{
        id: ID!
        name: String!
        email: String!
        username: String!
        travels: [Viaje!]!
    }

    type Viaje{
        id: ID!
        client: Cliente!
        driver: Conductor!
        money: Int!
        distance: Int!
        date: String!
        status: String!
    }

    type Query{
        clientes: [Cliente!]!
        conductores: [Conductor!]!
        viajes: [Viaje!]!
    }

    type Mutation{
        createCliente(name: String!, email: String!): Cliente!
        deleteCliente(id: String!): String!

        createConductor(name: String!, email: String!, username: String!): Conductor!
        deleteConductor(id:String!): String!

        addTarjeta(idCliente: ID!, number: String!, cvv: Int!, expirity: String!, money: Int!): Cliente!
        deleteTarjeta(id:ID!, number: String!): String!

        createViaje(idCliente: ID!, idConductor: ID!, money: Int!, distance: Int!, date: String!, status: String!): Viaje!
        acaboViaje(id: ID!): Viaje!
    }
`