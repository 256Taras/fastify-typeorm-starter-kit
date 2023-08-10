# 🛠 INFRASTRUCTURE

The Infrastructure layer is the foundation of all application functionalities, interfacing directly with external systems like databases, email services, queue engines, and more.

## 🔌 Plugins Folder

In Fastify, plugins provide behavior that's common across all routes in your application. Features such as authentication, caching, templating, and other cross-cutting concerns should be managed by plugins situated in this folder.

Files within the `Plugins` directory usually make use of the [`fastify-plugin`](https://github.com/fastify/fastify-plugin) module, ensuring they remain non-encapsulated. These plugins have the capability to define decorators and establish hooks, which are subsequently available throughout your application.

### 📚 **Further Reading**:
- [The hitchhiker's guide to plugins](https://www.fastify.io/docs/latest/Guides/Plugins-Guide/)
- [Fastify decorators](https://www.fastify.io/docs/latest/Reference/Decorators/)
- [Fastify lifecycle](https://www.fastify.io/docs/latest/Reference/Lifecycle/)