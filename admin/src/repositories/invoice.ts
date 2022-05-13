import Base from "./base";

import { InvoiceInput, InvoiceUpdateInput } from "@ts-types/generated";

class Invoice extends Base<InvoiceInput, InvoiceUpdateInput> {}

export default new Invoice();
