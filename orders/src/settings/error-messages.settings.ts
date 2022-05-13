export const errorMessage = {
  product: {
    name: { required: "Nome é obrigatório" },
    sku: { required: "SKU é obrigatório" },
    price: { required: "O preço é obrigatório" },
    sale_price: {
      message: "O preço de venda deve ser menor ou igual ao preço!",
    },
    quantity: {
      required: "Quantidade é necessária",
      validate: {
        isInteger: (value: string) => {
          return Number.isInteger(+value) || "Quantidade deve ser inteira";
        },
      },
    },
    unit: { required: "Unidade é necessária" },
    type: {
      required: "Tipo é requerido",
    },
    status: { required: "Status é requerido" },
  },
};
