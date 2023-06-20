[Home Page](./00_Documentation.md)
# API

## What is an API
**Application Programming Interfact**

An API is a software intermediary that allows *two applications to talk to each other*.

When you use an application on your mobile phone, the application connects to the Internet and sends data to a server. The server then retrieves that data, interprets it, performs actions and sends it back to your phone. The application then interprets that data and presents you with the information you wanted in a readable way. 

The API is the interface that can be asked by a service to get information from the database.

## What is REST
**Representational State Transfer**

A REST API is an architectural style or design pattern for creating web APIs.

Here are some key characteristics and principles of REST APIs:
- **Uniform interface**: All API requests for the same resource should look the same, regardless of where the request comes from. The API should ensure that the same piece of data, such as the name or email address of a user, belongs to only one uniform resource identifier (URI). Resources shouldn't be too large but should contain every piece of information that the client might need.
- **Client-server decoupling**: In REST API design, the client and server applications must be completely independent of each other. The client application should only know the URI of the requested resource and should not interact with the server application in any other ways. Similarly, the server application should only pass the requested data to the client via HTTP and should not modify the client application [3].
- **Statelessness**: REST APIs are stateless, meaning that each request must include all the information necessary for processing it. The server does not store any data related to a client request. This allows for scalability and simplicity in API design.
- **Self-descriptive messages**: The messages returned to the client contain enough information to describe how the client should process them. This allows the client to understand and interact with the API without prior knowledge of the server implementation.
- **HATEOAS (Hypermedia as the Engine of Application State)**: RESTful APIs should provide hyperlinks in the responses, allowing the client to navigate the available actions it can take. This enables the client to discover and interact with the API dynamically.
