// Seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona a lista para adicionar os itens.
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  // Obtém o valor atual do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "");

  // Transforma o valor em centavos (EX: 150/100 = 1.5 que é equivalente a R$ 1,50).
  value = Number(value) / 100;

  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Retorna o valor formatado em moeda BRL (Real Brasileiro).
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Captura o evento de submit do formulário para obter valores.
form.onsubmit = event => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault();

  // Cria um objeto com os valores capturados para nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date().toLocaleString("pt-BR")
  };

  // Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense);
};

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `../img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", `ícone de ${newExpense.category_name}`);

    // Cria o elemento para exibir as informações da despesa.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // cria a categoria da despesa.
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciono o nome e a categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria ícone de remover item da lista.
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "../img/remove.svg");
    removeIcon.setAttribute("alt", "ícone de remover item");

    // Adiciona as informações ao item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item a lista.
    expenseList.append(expenseItem);

    updateTotals();
  } catch (error) {
    alert("Não foi possível adicionar uma nova despesa.");
    console.log("🚀 ~ expenseAdd ~ error:", error);
  }
}

// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul).
    const items = expenseList.children;

    // Atualiza a quantidade de itens da lista.
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // variável para incrementar o total
    let total = 0;

    // Percorre cada item (li) da lista (ul).
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remove caracteres não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte o valor para float.
      value = parseFloat(value);

      // Verifica se é um número válido.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não é um número válido."
        );
      }

      // Incrementar o valor total.
      total += Number(value);
    }

    // Cria a tag small para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small com um layout personalizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expenseTotal.innerHTML = "";

    expenseTotal.append(symbolBRL, total);
  } catch (error) {
    console.log("🚀 ~ updateTotals ~ error:", error);
    alert("Não foi possível atualizar os totais.");
  }
}

// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function (event) {
  // Verifica se o click ocorreu no ícone de remoção.
  if (event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense");

    // Remove o item da lista.
    item.remove();
  }

  // Atualiza os totais da lista.
  updateTotals();
});
