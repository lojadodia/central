type Props = {
  price: any;
};
export const formmatPrice = ( price : Props) => {
  return price?.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });
};
