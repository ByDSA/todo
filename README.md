# Instalación
```bash
git clone https://github.com/ByDSA/todo && cd todo/bin && sudo docker compose --project-name todo-app up -d
```

Hay 4 contenedores en la aplicación:
| Contenedor | Puerto | Descripción |
| --- | --- | --- |
| backend | 8080 | El servicio de TODO API |
| db | 27017 | La base de datos MongoDB de la aplicación |
| db-express | 8090 | Un UI para ver/editar la base de datos  |
| swagger | 8082 | Documentación la API |

# Decisiones relevantes
He basado el esqueleto y configuración del proyecto basándome en proyectos anteriores. Configuraciones como ESlint, jest, nodemon, tsconfig, git hooks (librería `husky`), etc. También tiene una GitHub Action para ejecutar los tests en cada push (los tests que no requieren una base de datos real). Uso de Conventional Commit para los mensajes de los commits y algunos hooks para comprobar que se cumplen estas reglas, y para impedir subir los cambios diréctamente a la rama `main`.

El servicio de fetching de los labels lo he hecho cacheando los resultados, ya que en el enunciado se dice que no cambian a menudo. He añadido un cron (`node-cron`) que se ejecuta cada 15 minutos para actualizar los labels en la base de datos. Si falla al intentar obtener los datos de los labels, se vuelven a pedir cada 10 segundos hasta obtenerlos. Tiene un timeout de unos pocos segundos.

Decidí usar una base de datos en MongoDB. Realmente para un proyecto así daba bastante igual si usaba PostgreSQL o MongoDB, puesto que no va a haber diferencias de rendimiento a tan baja escala. La decisión final de decantarme por MongoDB, fue que preví que tendría que cachear los labels y habría muchas lecturas y pocas escrituras. MongoDB es más rápido en lecturas que PostgreSQL, por lo que me pareció la mejor opción.

## Testing
Para los tests end-to-end he utilizado supertest y jest. He usado una base de datos específica de tests para no afectar a la base de datos principal. Era necesaria una base de datos para los tests porque así se comprueba que el ODM funciona correctamente.

He creado un par de tests para el servicio de cacheo de los labels en el que he mockeado la conexión.

He creado varios tests para comprobar que las rutas eran las correctas y el controlador llamaba por detrás a las funciones del repositorio apropiadas.

He hecho varios tests unitarios para los valores válidos e inválidos para los label. Hubiera sido interesante hacer tests unitarios para los valores válidos e inválidos de los TODO, pero no tuve tiempo.

# Problemas topados
No ha habido alguna parte en particular que fuera un gran problema. Por enumerar algunas de las cosas en que he invertido más tiempo:
- Separar el contenido en diferentes archivos y carpetas y organizarlos de forma que sea fácil de entender.
- Crear los barrels (`index.ts`) para encapsular la lógica de los módulos.
- Crear y manejar la base de datos de test, con sus propios fixtures.
- Escribir el OpenAPI de Swagger.
- Hacer bastantes tests end-to-end.
- Manejo de errores en la API y sus distintos status code.
- Crear algunas abstracciones mediante interfaces para aislar tecnologías concretas (por ejemplo, usar interfaces `Repository`, cuya implementación utiliza el ODM de MongoDB, pero también de mock para testing).
- Hacer que todas las dependencias vengan de fuera (inyección de dependencias) para que sea más fácil de testear.
- Creación de diferentes modelos de TODO según la operación de CRUD (por ejemplo, `CreationalTodo` o `UpdateTodo`).


# Cambios para producción
1. Añadir los archivos `.env` al `.gitignore`.
1. Se debería poder relacionar los TODO con los usuarios. Por ejemplo, compartiendo cookies en un mismo dominio y usando el token JWT para identificar al usuario.
1. Se debería proteger el acceso a los TODO para que sólo el usuario que los creó pueda hacer CRUD.