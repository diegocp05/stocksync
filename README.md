<h1 align="center"> StockSync - Gestão B2B </h1>

<p align="center">
<img src="https://img.shields.io/github/issues/diegocp05/stocksync"/>
<img src="https://img.shields.io/github/forks/diegocp05/stocksync"/>
<img src="https://img.shields.io/github/stars/diegocp05/stocksync"/>
<img src="https://img.shields.io/github/license/diegocp05/stocksync"/>
</p>

<p align="center">Um sistema completo de <strong>Gestão de Estoque e Compras B2B</strong>. O StockSync permite que empresas gerenciem fornecedores, produtos e automatizem a geração de ordens de compra em PDF, tudo através de um painel de controle analítico, performático e seguro.</p>

<h1 align="center">
  <img height="400" alt="Banner StockSync" title="StockSync" src="https://cdn.dribbble.com/users/2034871/screenshots/15456247/media/581ce02434daff5ce5f50a8decece2ad.gif"/>
</h1>

## 🌟 Funcionalidades

### 📊 Dashboard Analítico
- **Visão Geral**: Métricas de produtos em baixo estoque, total de fornecedores e ordens pendentes.
- **Gráficos em Tempo Real**: Visualização de fluxo de entrada e saída de produtos no estoque.
- **Dark Mode**: Interface premium com suporte nativo a temas claro e escuro.

### 📦 Controle de Estoque
- **Gestão Inteligente**: Definição de limites de "estoque mínimo" com alertas visuais automáticos.
- **CRUD de Produtos**: Cadastro de itens atrelados a fornecedores específicos com SKUs únicos.
- **Rastreabilidade**: Monitoramento contínuo do nível atual de armazenamento.

### 🤝 Gestão de Fornecedores & Ordens
- **Base de Parceiros**: Manutenção do catálogo de fornecedores com dados completos (CNPJ, Contato).
- **Automação (Ordens de Compra)**: Geração de pedidos em formato **PDF** para disparo imediato às indústrias.
- **Segurança B2B**: Autenticação com JWT e separação de permissões por cargos (RBAC).

---

## 📋 Rotas da API (Destaques)

### 🔐 Autenticação

**Login de Usuário**  
`POST /api/auth/login`

**Exemplo de Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "c1f2e3d4-...",
    "name": "Admin",
    "email": "admin@stocksync.com",
    "role": "ADMIN"
  }
}
```

---

### 📦 Produtos

**Listar todos os produtos**  
`GET /api/products`

**Formato de Resposta:**
```json
[
  {
    "id": "a93b4c10...",
    "sku": "PRD-999",
    "name": "Rolamento de Aço Carbono",
    "currentStock": 2,
    "minStock": 15,
    "unitPrice": 45.5,
    "supplierId": "b1a2c3d4...",
    "supplier": {
      "id": "b1a2c3d4...",
      "name": "Indústrias Acme S.A"
    }
  }
]
```

---

## 🌟 Exemplos de Uso Completos

### Criar uma nova Ordem de Compra via Fetch
```javascript
async function criarOrdemCompra(token, fornecedorId, itens) {
  try {
    const response = await fetch('http://localhost:3333/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        supplierId: fornecedorId,
        items: itens
      })
    });
    
    const data = await response.json();
    console.log('Ordem gerada com sucesso! N°:', data.orderNumber);
    return data;
  } catch (error) {
    console.error('Erro ao gerar ordem:', error);
  }
}
```

---

## 🔧 Tecnologias Utilizadas

- **Frontend:** React.js + Vite + TypeScript  
- **Estilização e UI:** Tailwind CSS + Lucide Icons + Recharts  
- **Backend:** Node.js + Express + Zod  
- **Banco de Dados:** PostgreSQL + Prisma ORM  
- **Autenticação:** JWT (JSON Web Tokens) & Bcrypt  
- **Automação:** PDFKit para geração de documentos

---

## 📚 Como Executar Localmente

**Clone o repositório**
```bash
git clone https://github.com/diegocp05/stocksync.git
cd stocksync
```

**Suba o Banco de Dados (Docker)**
```bash
docker-compose up -d
```

**Configure e Inicie o Backend**
```bash
cd backend
npm install
# Configure as variáveis de ambiente (.env)
npx prisma db push
npm run dev
```

**Configure e Inicie o Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

A aplicação estará disponível em **http://localhost:5173** e a API em **http://localhost:3333**.

---

## 🚀 Autor
 
<sub>@diegocp05</sub>

<p align="center">
  Feito com ❤️ por <a href="https://github.com/diegocp05">Diego Costa</a>
</p>
