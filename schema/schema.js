import {GraphQLObjectType , GraphQLID , GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull} from "graphql"
import { Client } from "../models/Clients.models.js"
import { Project } from "../models/Projects.models.js"

// Client Type

const ClientType = new GraphQLObjectType({
    name : "Client",
    fields : () => ({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        email : {type : GraphQLString},
        phone : {type : GraphQLString},
    })

})

// Project Type

const ProjectType = new GraphQLObjectType({
    name : "Project",
    fields : () => ({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        description : {type : GraphQLString},
        status : {type : GraphQLString},
        client : {
            type : ClientType,
            args : {id : {type : GraphQLID}},
            resolve : (parent , args) => {
                return Client.findById(parent.clientId)
            }
        }
    })

})

const RootQuery = new GraphQLObjectType({
    name : "RootQueryType",
    fields : {
        projects : {
            type : new GraphQLList(ProjectType),
            resolve(parent , args){
                return Project.find()
            }

        },
        clients : {
            type : new GraphQLList(ClientType),
            resolve(parent , args){
                return Client.find()
            }

        },
        client : {
            type : ClientType,
            args : {id : {type : GraphQLID}},
            resolve(parent , args){
                return Client.findById(args.id)
            }
        },
        project : {
            type : ProjectType,
            args : {id : {type : GraphQLID}},
            resolve(parent , args){
                return Project.findById(args.id)
            }
        },
    }
})


// Mutations

const mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        addClient : {
            type : ClientType,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                email : {type : new GraphQLNonNull(GraphQLString)},
                phone : {type : new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const {
                    name,
                    email,
                    phone
                } = args
                if(phone.length !== 10){
                    return new Error("Phone number must be 10 digits")
                }
                if(!email.includes("@")){
                    return new Error("Invalid Email")
                }
                return Client.findOne({ email: email })
                    .then(existingClient => {
                        if (existingClient) {
                            throw new Error('Email already exists');
                        }
                        let client = new Client({
                            name : name,
                            email : email,
                            phone : phone
                        })
                        return client.save();
                    });
            }
        },
        deleteClient : {
            type : ClientType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Client.findByIdAndDelete(args.id)
            }
        },
        updateClient : {
            type : ClientType,
            args : {
                id : {type : GraphQLID},
                name : {type : GraphQLString},
                email : {type : GraphQLString},
                phone : {type : GraphQLString},
            },
            resolve(parent, args){
                const {
                    id,
                    name,
                    email,
                    phone
                } = args
                if(phone.length !== 10){
                    return new Error("Phone number must be 10 digits")
                }
                if(!email.includes("@")){
                    return new Error("Invalid Email")
                }
                return Client.findByIdAndUpdate(id , {
                    name : name,
                    email : email,
                    phone : phone
                })
            }
        },

        addProject : {
            type : ProjectType,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                description : {type : new GraphQLNonNull(GraphQLString)},
                status : {type : GraphQLString},
                clientId : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const {
                    name,
                    description,
                    status,
                    clientId
                } = args
                return Client.findById(clientId)
                    .then(client => {
                        if (!client) {
                            throw new Error('Client does not exist');
                        }
                        let project = new Project({
                            name : name,
                            description : description,
                            status : status,
                            clientId : clientId
                        })
                        return project.save();
                    });
            }
        },
    }
})



const schema = new GraphQLSchema({
   query : RootQuery,
   mutation : mutation
})
export {schema}