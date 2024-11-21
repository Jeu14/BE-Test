# Be-Test

## Instruções de como rodar e testar o projeto

- Após baixar o projeto em sua máquina, abra o terminal e instale as dependências necessárias utilizando o seguinte comando:

```bash
$ npm install
```

- Em seguida, execute o comando abaixo para iniciar os contêineres definidos no arquivo docker-compose.yml. Esse comando irá configurar e iniciar o banco de dados MySQL em um contêiner, expondo a porta 3306 (certifique-se de que a porta não está sendo usada) e criando um volume persistente para os dados.

```bash
$ docker compose up -d
```

### `ATENÇÃO: Não esqueça de remover a extensão (.example) do arquivo (.env). É nele que estão  as variavéis de ambiente necessárias para a aplicação se conectar ao banco de dados.`

- Após isso, execute o seguinte comando para rodar as migrations e criar as entidades necessárias na base de dados:

```bash
$ node ace migration:run
```

### Após seguir as etapas listadas acima, execute o seguinte comando para iniciar o servidor:

```bash
$ node ace serve --watch
```

## Logo abaixo estão alguns exemplos de requisições que podem ser feitas nas rotas presentes no projeto.

### `ATENÇÃO: Caso opte por não criar as rotas manualmente, basta copiar o arquivo (insomnia.json) e importá-lo no insomnia. Nele contém todas as rotas e exemplos de requisição.`

## **Endpoints**

### **Cadastrar usuário**

#### **Exemplo de requisição**

```javascript
// POST /signup
{
  "email": "test@example.com",
  "password": "mypassword"
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"id": 1,
	"email": "test@example.com"
}
```

### **Login do usuário**

#### **Exemplo de requisição**

```javascript
// POST /login
{
  "email": "test@example.com",
  "password": "mypassword"
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"type": "Bearer",
	"token": "oat_OQ.UkZGU1dUV0VPT2NJQ3FWNzJMRW41eXQtSGUwRmY3S0xtM0dXdkxxSTg3MzMxNjc4NQ"
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigem o token de autenticação do usuário logado, recebido no header com o formato Bearer Token.

### **Cadastrar cliente**

#### **Exemplo de requisição**

```javascript
// POST /client/store
{
  "name": "Test",
  "cpf": "123.456.789-01",
	"phone": "75998856560",
	"address": {
    "street": "Rua Bahia",
    "number": "123",
    "city": "Salvador",
    "state": "BA",
    "zip_code": "44278-000",
    "country": "Brasil"
  }
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"message": "Client registered successfully",
	"client": {
		"id": 1,
		"name": "Test",
		"cpf": "123.456.789-01",
		"phone": "75998856560",
		"address": {
			"street": "Rua Bahia",
			"number": "123",
			"city": "Salvador",
			"state": "BA",
			"zip_code": "44278-000",
			"country": "Brasil"
		},
		"user_id": 1
	}
}
```

### **Listar clientes**

#### **Exemplo de requisição**

```javascript
// GET /client/index
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
;[
  {
    "id": 1,
    "name": 'Test',
    "cpf": '123.456.789-01',
    "phone": '75998856560',
    "address": 'Rua Bahia, 123 - Salvador',
    "userId": 1,
  },
]
```

### **Detalhar cliente**

#### **Exemplo de requisição**

```javascript
// GET /client/show/1
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"client": {
		"id": 1,
		"name": "Test",
		"cpf": "123.456.789-01",
		"phone": "75998856560",
		"address": {
			"id": 1,
			"street": "Rua Bahia",
			"number": "123",
			"city": "Salvador",
			"state": "BA",
			"zipCode": "44278-000",
			"country": "Brasil",
			"clientId": 1
		},
		"user_id": 1
	},
	"sales": []
}
```

### **Editar cliente**

#### **Exemplo de requisição**

```javascript
// PUT /client/update/1
{
  "name": "Test",
  "cpf": "123.456.789-01",
	"phone": "75998854567",
	"address": {
    "street": "Rua das Flores",
    "number": "123",
    "city": "Salvador",
    "state": "BA",
    "zip_code": "44278-000",
    "country": "Brasil"
  }
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"message": "Client updated successfully",
	"client": {
		"id": 1,
		"name": "Test",
		"cpf": "123.456.789-01",
		"phone": "75998854567",
		"address": {
			"street": "Rua das Flores",
			"number": "123",
			"city": "Salvador",
			"state": "BA",
			"zip_code": "44278-000",
			"country": "Brasil"
		},
		"user_id": 1
	}
}
```

### **Deletar cliente**

#### **Exemplo de requisição**

```javascript
// DELETE /client/delete/1
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"message": "Client and associated sales successfully deleted"
}
```

### **Cadastrar produto**

#### **Exemplo de requisição**

```javascript
// POST /product/store

{
  "name": "Produto 3",
  "description": "Descrição do Produto 3",
  "price": 24.90,
  "stock": 4
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"message": "Product registered successfully",
	"product": {
		"id": 1,
		"name": "Produto 1",
		"description": "Descrição do Produto 1",
		"price": 24.9,
		"stock": 4
	}
}
```


### **Listar produtos**

#### **Exemplo de requisição**

```javascript
// GET /product/index
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
	{
		"id": 1,
		"name": "Produto 1",
		"description": "Descrição do Produto 1",
		"price": "24.9",
		"stock": 4
	},
]
```

### **Detalhar produto**

#### **Exemplo de requisição**

```javascript
// GET /product/show/1
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"id": 1,
	"name": "Produto 1",
	"description": "Descrição do Produto 1",
	"price": "24.90",
	"stock": 4
}
```

### **Editar produto**

#### **Exemplo de requisição**

```javascript
// PUT /product/update/1
{
	"stock": 6
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"id": 1,
	"name": "Produto 1",
	"description": "Descrição do Produto 1",
	"price": "24.90",
	"stock": 6
}
```

### **Deletar produto**

#### **Exemplo de requisição**

```javascript
// DELETE /product/delete/1
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"message": "Product deleted successfully"
}
```

### **Cadastrar Venda**

#### **Exemplo de requisição**

```javascript
// POST /sale/store
{
	"quantity": 2,
	"client_id": 2,
	"product_id": 2
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"message": "Sale registered successfully!",
	"sale": {
		"id": 1,
		"quantity": 2,
		"unit_price": "24.90",
		"total_price": 49.8,
		"client_id": 2,
		"product_id": 2,
		"date": "2024-11-20T22:58:58.745+00:00"
	}
}
```