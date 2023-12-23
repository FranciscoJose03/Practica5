import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./gql/gqlSchema.ts";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Conduct } from "./resolvers/Conduct.ts";
import { Client } from "./resolvers/Client.ts";
import { Travel } from "./resolvers/Travel.ts";

const MONGO_URL = "mongodb+srv://frodriguezc2:Fran120513@cluster0.mij1xjc.mongodb.net/?retryWrites=true&w=majority";

try{
  await mongoose.connect(MONGO_URL);
  const app = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Viaje: Travel,
      Cliente: Client,
      Conductor: Conduct
    },
  });

  const {url} = await startStandaloneServer(app);
  console.log(`🚀 Server ready at ${url}`)

}catch{
  console.log("Fallo el enlace")
}
