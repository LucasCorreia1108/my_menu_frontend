# My Menu — Frontend

Frontend do **My Menu**, um cardápio digital de um restaurante de culinária italiana onde o
cliente navega pelos pratos, monta um carrinho e finaliza o pedido. A aplicação é uma SPA em
React + Vite que consome uma API REST externa.

## Funcionalidades

- **Cardápio** (`/plates`): listagem dos pratos disponíveis com popup de detalhes e seleção de quantidade.
- **Carrinho** (`/cart`): adicionar/remover itens, ajustar porções e confirmar o pedido informando o horário de retirada.
- **Autenticação** (`/auth`): login e cadastro (com validação de formulário via [Yup](https://github.com/jquense/yup)); a sessão fica no `localStorage`.
- **Perfil** (`/profile`): dados do usuário logado e logout.
- **Pedidos** (`/orders`): histórico de pedidos do usuário.
- **Feedback global**: componente de Snackbar (MUI) que exibe mensagens de sucesso/erro em qualquer ação do site.

## Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) para as rotas
- [MUI](https://mui.com/) (`@mui/material`, `@emotion/*`) e [react-icons](https://react-icons.github.io/react-icons/)
- [Yup](https://github.com/jquense/yup) para validação de formulários
- CSS Modules para estilização

## Pré-requisitos

- Node.js **20.19+**
- npm

## Configuração

A aplicação consome uma API externa configurada pela variável de ambiente `VITE_API_URL`.
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://sua-api.exemplo.com
```

> As requisições usam esse valor como base (ex.: `${VITE_API_URL}/auth/login`, `${VITE_API_URL}/plates/available`, `${VITE_API_URL}/orders`).

## Como rodar

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# build de produção
npm run build

# pré-visualizar o build
npm run preview

# lint
npm run lint
```

## Estrutura do projeto

```
src/
├── components/      # Navbar, Footer, cards e popups (prato, confirmação de pedido)
├── contexts/        # useCartContext (carrinho) e useSnackbarContext (feedback global)
├── page/            # páginas: home, plates, cart, auth, profile, orders, about, loading
├── services/        # chamadas à API: auth, plates, order
├── utils/           # utilitários
├── App.jsx          # layout raiz (providers + Navbar/Outlet/Footer)
└── main.jsx         # definição das rotas
```

## Rotas

| Caminho     | Página   |
| ----------- | -------- |
| `/`         | Home     |
| `/plates`   | Cardápio |
| `/cart`     | Carrinho |
| `/auth`     | Login / Cadastro |
| `/profile`  | Perfil   |
| `/orders`   | Pedidos  |

## Instalação

Clone o repositório
git clone https://github.com/LucasCorreia1108/api_my_menu.git
Backend
cd backend
npm install
npm run dev

git clone https://github.com/LucasCorreia1108/my_menu_frontend.git
Frontend
cd frontend
npm install
npm run dev

## Variáveis de Ambiente

Crie um arquivo .env na pasta backend:

MONGO_CS=sua_string_de_conexao
MONGO_DB_NAME=my_menu

## Deploy

O projeto está configurado para deploy na [Vercel](https://vercel.com/) https://my-menu-frontend-zeta.vercel.app/, com
rewrite de todas as rotas para `/` (necessário para uma SPA com client-side routing).

---

Feito por [Lucas Correia](https://www.linkedin.com/in/lucascorreia-dev/).
