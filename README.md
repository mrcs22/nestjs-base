# NestJS Base Project Template
### This project serves as a template for a base project using NestJS.

### TO DO
- [ ] Export mocked module to simplify tests setup 
- [ ] Add user picture ralation and handle picture upload


#### Setup
To set up the project, follow these steps:

- Clone this repository to your local machine.

- Navigate to the project directory.

- Run the following command to install dependencies:

```bash
 npm install
 ```

#### After installing dependencies, you can use the following npm scripts to create, generate and run TypeORM Migration:

 
- Run TypeORM Migration:
```bash
 npm run typeorm:migration-run
```

- Generate TypeORM Migration based on currrent entities:
```bash
 npm run typeorm:migration-generate --name=<MigrationName>
```

- Create empty TypeORM Migration:
```bash
 npm run typeorm:migration-create --name=<MigrationName>
```

#### This project includes a Bash script generateModule.sh to facilitate the generation of modules following current project structure. Here's how to use it:

```bash
./generateModule.sh --name=<module_entity_name> --pt-name=<portuguese_name> --permission-name=<permission_name>
```

Replace with appropriate values the variables
-  <module_entity_name> (required. Used for all file/class/method names)
-  <portuguese_name> (required. Used for app level error messages),
-  <permission_name> (optional. If not provided  <module_entity_name> is used instead).



Notes
Tests are setup to cover only services.