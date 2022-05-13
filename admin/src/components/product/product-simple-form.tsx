import Input from "@components/ui/input";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useFormContext } from "react-hook-form";

type IProps = {
  initialValues: any;
};

export default function ProductSimpleForm({ initialValues }: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-wrap my-5 sm:my-8">
      <Description
        title="Informação Simples do Produto"
        details={`${
          initialValues ? "Edite" : "Adicione"
        } a descrição simples do produto e as informações necessárias aqui`}
        className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label="Preço*"
          {...register("price")}
          type="text"
          error={errors.price?.message}
          variant="outline"
          className="mb-5"
        />
        {/*
        <Input
          label="Preço de Venda"
          type="number"
          {...register("sale_price")}
          error={errors.sale_price?.message}
          variant="outline"
          className="mb-5"
        />
        */}
        <Input
          label="Quantidade*"
          type="number"
          {...register("quantity")}
          error={errors.quantity?.message}
          variant="outline"
          className="mb-5"
        />
        {/*
        <Input
          label="SKU*"
          {...register("sku")}
          error={errors.sku?.message}
          variant="outline"
          className="mb-5"
        />
        */}
        
        <Input
          label="Cumprimento"
          {...register("length")}
          error={errors.length?.message}
          variant="outline"
          className="mb-5"
        />
        
        <Input
          label="Altura"
          {...register("height")}
          error={errors.height?.message}
          variant="outline"
          className="mb-5"
        />
        <Input
          label="Largura"
          {...register("width")}
          error={errors.width?.message}
          variant="outline"
          className="mb-5"
        />
        <Input
          label="Peso"
          {...register("weight")}
          error={errors.weight?.message}
          variant="outline"
          className="mb-5"
        />
       
      </Card>
    </div>
  );
}
