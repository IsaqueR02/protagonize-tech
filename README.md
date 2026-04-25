# 🚀 Protagonize-tech | Gerenciador de Tarefas

**Desafio Técnico – Bootcamp Web Front (Angular + ASP.NET)**

## 🎯 Objetivo do Projeto
Nesse desafio foi proposto desenvolver uma aplicação web para cadastro e gerenciamento de tarefas, utilizando **Angular** no front-end, **ASP.NET Core Web API (C#)** no back-end e **SQL Server** como banco de dados. 

O sistema permite a gestão completa do ciclo de vida de uma tarefa (CRUD), com persistência em banco de dados relacional e uma interface reativa, demonstrando a integração fluida entre o ecossistema .NET e o Angular.

---

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* Angular (Standalone Components)
* TypeScript / SCSS (Variáveis CSS para Dark Mode)
* `ngx-toastr` (Feedback visual e tratamento de erros)

**Back-end:**
* ASP.NET Core Web API (C#)
* Entity Framework Core (ORM)
* SQL Server (Banco de Dados)

---

## ⚙️ Escopo e Funcionalidades

A aplicação gerencia a entidade **Tarefa** com os seguintes campos: `Id` (Automático), `Título`, `Descrição`, `Status` (Pendente/Concluída) e `Data de Criação`.

### O que foi implementado:
- [x] **API RESTful Completa:** Endpoints para Listar (GET), Buscar por ID (GET), Criar (POST), Atualizar (PUT) e Excluir (DELETE).
- [x] **Comunicação Integrada:** Front-end consumindo a API via `HttpClient` com configuração de CORS ativa.
- [x] **Edição Inline:** Atualização de tarefas na própria lista, sem redirecionamentos de página.
- [x] **Design Responsivo & Dark Mode:** Interface moderna adaptável a dispositivos móveis com suporte a temas.
- [x] **Tratamento de Erros (Diferencial):** Validação de formulários e uso de **SnackBar** para feedback das operações HTTP.

---

## 🚀 Como testar a aplicação

Para rodar este projeto localmente, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) e [Angular CLI](https://angular.io/cli)
* [.NET SDK](https://dotnet.microsoft.com/download) (versão 8.0 ou superior)
* [SQL Server](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads) (Express ou Developer)

Siga os passos abaixo na ordem apresentada.

### Passo 1: Configurar e rodar o Back-end (API)

1. Abra o terminal e navegue até a pasta da API:
   ```bash
   cd api_tasks-manager

2. Restaure os pacotes do projeto:
   ```bash
   dotnet restore
3. Crie o banco de dados e as tabelas usando as Migrations do Entity Framework:
    ```bash
   dotnet ef migrations add InitialCreate

   &
   
   dotnet efdatabase update


4. Inicie a API:
   ```bash
   dotnet run

Passo 2: Configurar e rodar o Front-end (Angular)
1. Abra um novo terminal e navegue até a pasta da interface:
    ```Bash
    cd ui_tasks-manager
2. Instale as dependências do projeto (incluindo o ngx-toastr):
    ```Bash
    npm install
3. Inicie o servidor de desenvolvimento do Angular:
    ```Bash
    ng serve
4. Abra o navegador e acesse a aplicação em:
  http://localhost:4200
