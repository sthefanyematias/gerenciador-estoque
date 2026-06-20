
# Gerenciador de Estoque — Supermercado Bom Preço

Aplicação web desenvolvida com Angular para gerenciamento de estoque e pessoal de um supermercado fictício. O projeto implementa um CRUD completo com controle de acesso baseado em perfis (RBAC), autenticação com fluxo de onboarding e registro de movimentações de estoque.

Desenvolvido como trabalho de tema livre para a disciplina de Projeto Integrador do curso superior de Análise e Desenvolvimento de Sistemas.

<br>

## Stack

- **Frontend**: Angular 17+ (standalone components, reactive forms, route guards)
- **Backend Mock**: JSON Server
- **Estilização**: CSS nativo com variáveis e responsividade

<br>

## Funcionalidades

**Gestão de Estoque**
- CRUD completo de produtos
- Movimentação de estoque: entrada e baixa com registro de motivo
- Histórico de movimentações por produto
- Alertas visuais de estoque crítico e em nível de alerta

**Gestão de Funcionários** *(restrito a administradores)*
- Cadastro, edição e exclusão de funcionários
- Consulta individual por ID
- Gerenciamento de perfis de acesso

**Autenticação e Segurança**
- Login por ID e senha
- Perfis de acesso: `admin`, `operador`, `consulta`
- Guards de rota por perfil e status de autenticação
- Fluxo de onboarding obrigatório na primeira autenticação
- Alteração de senha e recuperação por e-mail

<br>

## Pré-requisitos

- Node.js v18+
- Angular CLI: `npm install -g @angular/cli`
- JSON Server: `npm install -g json-server`

<br>

## Execução local

**1. Instalar dependências**

```bash
npm install
```

**2. Iniciar a API mock (Terminal 1)**

```bash
json-server --watch data/db.json
```

A API ficará disponível em `http://localhost:3000`.

**3. Iniciar o frontend (Terminal 2)**

```bash
ng serve --open
```

A aplicação ficará disponível em `http://localhost:4200`.

<br>

## Credenciais de teste

| ID | Senha | Perfil | Permissões |
|:---:|:---:|:---:|---|
| 1015 | 123456 | admin | Acesso total: produtos, funcionários, movimentações e exclusões |
| 1104 | 123456 | operador | Cadastro, edição e movimentação de produtos |
| 1098 | 123456 | consulta | Visualização e consulta de produtos |

Credenciais definidas em `data/db.json`.

<br>

## Estrutura de rotas

| Rota | Acesso | Descrição |
|---|:---:|---|
| `/login` | público | Autenticação |
| `/recuperar-senha` | público | Recuperação de senha |
| `/onboarding` | autenticado | Definição de senha no primeiro acesso |
| `/` | autenticado | Tela inicial |
| `/listar` | autenticado | Listagem de produtos |
| `/consultar` | autenticado | Consulta de produto por ID |
| `/cadastrar` | operador, admin | Cadastro de produto |
| `/editar/:id` | operador, admin | Edição de produto |
| `/movimentar` | operador, admin | Entrada e baixa de estoque |
| `/funcionarios` | admin | Listagem de funcionários |
| `/funcionarios/cadastrar` | admin | Cadastro de funcionário |
| `/funcionarios/consultar` | admin | Consulta de funcionário |
| `/funcionarios/editar/:id` | autenticado | Edição de perfil |
| `/funcionarios/excluir` | admin | Exclusão de funcionário |

<br>

## Autoras

Sthefany Evangelista Matias — [@sthefanyematias](https://github.com/sthefanyematias)

Patrícia Queiroz de Oliveira — [@patriciaqueiroz2025](https://github.com/patriciaqueiroz2025)
