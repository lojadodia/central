import { CreateFaq, UpdateFaq } from "@ts-types/generated";
import Base from "./base";

class Faq extends Base<CreateFaq, UpdateFaq> {
  popularFaqs = (url: string) => {
    return this.http(url, "get");
  };
}

export default new Faq();
