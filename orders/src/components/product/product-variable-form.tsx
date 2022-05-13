import Input from "@components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Title from "@components/ui/title";

import Checkbox from "@components/ui/checkbox/checkbox";
import SelectInput from "@components/ui/select-input";
import { cartesian } from "@utils/cartesian";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { Attribute, Product } from "@ts-types/generated";

const NAME_EXTRAS = "extras"
type IProps = {
	initialValues?: Product | null;
	attributes?: Attribute[] | null;
};

function filteredAttributes(attributes: any, variations: any) {
	let res = [];
	res = attributes.filter((el: any) => {
		return !variations.find((element: any) => {
			return element?.attribute?.slug === el?.slug;
		});
	});
	return res;
}

function getCartesianProduct(values: any) {
	// console.log(values)
	const formattedValues = values
		?.map((v: any) =>
			v.value?.map((a: any) => ({ name: v.attribute.name, value: a.value }))
		)
		.filter((i: any) => i !== undefined)
		.filter((f: {name: string}[]) => {
		
			if (Array.isArray(f) && f.length === 0) return true
			return f.find(e => e.name.toLocaleLowerCase().localeCompare(NAME_EXTRAS) !== 0)
		});

	if (isEmpty(formattedValues)) return [];
	return cartesian(...formattedValues);
}


export default function ProductVariableForm({
	attributes,
	initialValues,
}: IProps) {

	const {
		register,
		control,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext();

	// This field array will keep all the attribute dropdown fields
	const { fields, append, remove } = useFieldArray({
		shouldUnregister: true,
		control,
		name: "variations",
	});


	const variations = watch("variations");

	useEffect(() => {
		
		register("custom_variation")
		setValue("custom_variation", variations ?[...variations]: [])


	}, [register])

	const custom_variation = watch("custom_variation")
	
	let variation: any[];
	
	// adicionar variações na list da custom_variation
	if (custom_variation) {
				
	
			variation = variations.filter((v: any) => {
				let custom = custom_variation.find((c: any) => c.attribute.id === v.attribute.id)
				if (!custom || !custom.value) return false
				let maps: number[] = custom.value.map((c: any) => c.id) as number[]
	
				const variation_one = v.value.filter((a: { id: number }) => !maps.includes(a.id))[0]
				return variation_one
			})
			if (variation.length) {
				let maps: number[] = custom_variation.map((cv:any) => cv.attribute.id)
				let newProperty: object = variation.find(np => maps.includes(np.attribute.id))
				let newCustomProperty: object = custom_variation.find((cv: any) => cv.attribute.id === newProperty.attribute.id)
				if (newCustomProperty.value) {
	
					let maps2: number[] = newCustomProperty.value.map((ncp: any) => ncp.id)
					let value = newProperty.value.find((np: any) => !maps2.includes(np.id))
					newCustomProperty.value.push(value)
				}
	
			} else {
				let maps: number[] = custom_variation.map((cv:any) => cv.attribute.id)
				variation = variations.find((v: any) => !maps.includes(v.attribute.id))
				if (variation) {
					custom_variation.push(variation);
				}
			}
		


	}
	

	const cartesianProduct = getCartesianProduct(getValues("variations"));

	return (
		<div className="flex flex-wrap my-5 sm:my-8">
			<Description
				title="Informação de variação do produto"
				details={`${initialValues ? "Atualize" : "Escolha"
					} a variação do seu produto e as informações necessárias a partir daqui`}
				className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
			/>
			<Card className="w-full sm:w-8/12 md:w-2/3 p-0 md:p-0">
				<div className="border-t border-dashed border-gray-200 dark:border-neutral-600 mb-5 md:mb-8">
					<Title className="text-lg uppercase text-center px-5 md:px-8 mb-0 mt-8">
						Opções
					</Title>
					<div>
						{fields?.map((field: any, index: number) => {
							return (
								<div
									key={field.id}
									className="border-b border-dashed border-gray-200 dark:border-neutral-600 last:border-0 p-5 md:p-8"
								>
									<div className="flex items-center justify-between">
										<Title className="mb-0">Opção {index + 1}</Title>
										<button
											onClick={() => remove(index)}
											type="button"
											className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none"
										>
											Remover
										</button>
									</div>

									<div className="grid grid-cols-fit gap-5">
										<div className="mt-5">
											<Label>Nome do Extra*</Label>
											<SelectInput
												name={`variations[${index}].attribute`}
												control={control}
												defaultValue={field.attribute}
												getOptionLabel={(option: any) => option.name}
												getOptionValue={(option: any) => option.id}
												options={filteredAttributes(attributes, variations)!}
												
											/>
										</div>
									
										<div className="mt-5 col-span-2">
											<Label>Opção de Extra*</Label>
											<SelectInput
												isMulti

												name={`variations[${index}].value`}
												control={control}
												defaultValue={field && (field?.value ?? "")}
												getOptionLabel={(option: any) => option.value}
												getOptionValue={(option: any) => option.id}
												options={
													watch(`variations[${index}].attribute`)?.values
												}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>



					<div className="px-5 md:px-8">
						<Button
							disabled={fields?.length === attributes?.length}
							onClick={(e: any) => {
								e.preventDefault();
								append({ attribute: "", value: [] });
							}}
							type="button"
						>
							Adicionar uma Opção
						</Button>
					</div>

					{!!custom_variation && custom_variation[0] && custom_variation[0].attribute &&
						<div className="pt-5">
							<Title className="text-lg mt-5 uppercase text-center px-5 md:px-8 mb-0 border-t border-dashed border-gray-200 dark:border-neutral-600 pt-10 w-100">
								Preços
							</Title>
							<div className="flex border-t mt-5 w-full flex-col  border-dashed border-gray-200 dark:border-neutral-600 last:border-0 p-5 md:p-8">


								<div className="flex flex-wrap">

									{custom_variation?.map((field: any, index: number) => {
										
										return field && field.attribute && field.value && field?.value.map((custom: any, idx: number) => {
											const option = field.attribute.values.find((e: any) => e.value === custom.value)
											const sync_price = custom.sync_price || option.sync_price

											return (<div key={idx} className="w-3/12 mx-2">

												<Input {...register(`custom_variation[${index}].value[${idx}].id`)} type="hidden" defaultValue={custom.id} />
												<Input {...register(`custom_variation[${index}].value[${idx}].value`)} type="hidden" defaultValue={custom.value} />
												<Input {...register(`custom_variation[${index}].value[${idx}].name`)} type="hidden" defaultValue={custom.name} />

												<Input
													{...register(`custom_variation[${index}].value[${idx}].sync_price`, { value: sync_price })}
													defaultValue={getValues(`custom_variation[${index}].value[${idx}].sync_price`)}
												
													label={`${custom.value} Preço*`}
													type="text"
													error={
														errors.variation_options?.[index]?.price?.message
													}
													variant="outline"
													className="mb-5"
												/>
											</div>
											)
										}
										)
									})}

								</div>
							</div>
						</div>
					}

					{/* Preview generation section start */}
					{!!cartesianProduct?.length && (
						<div className="border-t border-dashed border-gray-200 dark:border-neutral-600 pt-5 md:pt-8 mt-5 md:mt-8">
							<Title className="text-lg uppercase text-center px-5 md:px-8 mb-0">
								{cartesianProduct?.length} Variações Adicionadas
							</Title>
							{cartesianProduct.map((fieldAttributeValue: {name: string, value: string}, index: number) => {
								let price = 0.0
								if (typeof fieldAttributeValue === 'object' && !(fieldAttributeValue instanceof Array)) {
									price = attributes?.find((e) => (e.name == fieldAttributeValue.name))?.values.find((v: {value: string}) => v.value === fieldAttributeValue.value)?.sync_price! ?? 0
									
									
								} else if (typeof fieldAttributeValue === "object" && fieldAttributeValue instanceof Array) {
									
									price = fieldAttributeValue.reduce((a, b: {name: string, value: string}) => {
										if (b.name.toLocaleLowerCase().localeCompare(NAME_EXTRAS) === 0) {
											return a
										}
										let _price = 0.0;
										let variation2 = custom_variation?.find((e:{attribute: {name: string}}) => (e.attribute.name == b.name))
										
										if (variation2 && variation2.value) {
											let value = variation2.value.find((v:{value:string}) => v.value.localeCompare(b.value) === 0)
											if (value) {
												_price = Number(value.sync_price ?? 0.0)
											}
										}
										return a + _price
									}, 0)
									
								}
								setValue(`variation_options.${index}.price`, price)
								
								return (
									<div
										key={`fieldAttributeValues-${index}`}
										className="border-b last:border-0 border-dashed border-gray-200 dark:border-neutral-600 p-5 md:p-8 md:last:pb-0 mb-5 last:mb-8 mt-5"
									>
										<Title className="!text-lg mb-8">
											Variante :{" "}
											<span className="text-blue-600 font-normal">
												{Array.isArray(fieldAttributeValue)
													? fieldAttributeValue?.map((a) => a.value).join("/")
													: fieldAttributeValue.value}
											</span>
										</Title>
										<TitleAndOptionsInput
											register={register}
											setValue={setValue}
											index={index}
											fieldAttributeValue={fieldAttributeValue}
										/>

										<input
											{...register(`variation_options.${index}.id`)}
											type="hidden"
										/>

										<div className="grid grid-cols-2 gap-5">
											<Input
												label="Preço*"
												type="text"
												defaultValue={price}
												{...register(`variation_options.${index}.price`)}
												error={
													errors.variation_options?.[index]?.price?.message
												}
												variant="outline"
												className="mb-5"
											/>
											{/*
												<Input
													label="Preço de Venda"
													type="number"
													{...register(`variation_options.${index}.sale_price`)}
													error={
														errors.variation_options?.[index]?.sale_price
															?.message
													}
													variant="outline"
													className="mb-5"
												/>
												
												<Input
													label="SKU*"
													{...register(`variation_options.${index}.sku`)}
													error={
														errors.variation_options?.[index]?.sku?.message
													}
													variant="outline"
													className="mb-5"
												/>
												*/}
											<Input
												label="Quantidade*"
												type="number"
												defaultValue={100000}
												{...register(`variation_options.${index}.quantity`)}
												error={
													errors.variation_options?.[index]?.quantity?.message
												}
												variant="outline"
												className="mb-5"
											/>
										</div>
										<div className="mb-5 mt-5">
											<Checkbox
												{...register(`variation_options.${index}.is_disable`)}
												error={
													errors.variation_options?.[index]?.is_disable
														?.message
												}
												label="Desativar esta variante"
											/>
										</div>
									</div>
								);
							}
							)}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}

export const TitleAndOptionsInput = ({
	fieldAttributeValue,
	index,
	setValue,
	register,
}: any) => {
	fieldAttributeValue = Array.isArray(fieldAttributeValue) ? fieldAttributeValue.filter((f: {name: string, value: string}) =>
	(f.name.toLocaleLowerCase().localeCompare(NAME_EXTRAS) !== 0)) : fieldAttributeValue.name.toLocaleLowerCase().localeCompare(NAME_EXTRAS) != 0 ? fieldAttributeValue : []

	const title = Array.isArray(fieldAttributeValue)
		? fieldAttributeValue.filter((f: {name: string, value: string}) =>
		(f.name.toLocaleLowerCase().localeCompare(NAME_EXTRAS) !== 0)
		).map((a) => a.value).join("/")
		: fieldAttributeValue.value;
	const options = Array.isArray(fieldAttributeValue)
		? JSON?.stringify(fieldAttributeValue.filter((f: {name: string, value: string}) => f.name.toLocaleLowerCase().localeCompare(NAME_EXTRAS) !== 0))
		: JSON?.stringify([fieldAttributeValue]);

	useEffect(() => {
		setValue(`variation_options.${index}.title`, title);
		setValue(`variation_options.${index}.options`, options);
	}, [fieldAttributeValue]);
	return (
		<>
			<input {...register(`variation_options.${index}.title`)} type="hidden" />
			<input
				{...register(`variation_options.${index}.options`)}
				type="hidden"
			/>
		</>
	);
};
