import { CreateCourier, UpdateCourier } from "@ts-types/generated";
import Base from "./base";

class Courier extends Base<CreateCourier, UpdateCourier> {
  popularCouriers = (url: string) => {
    return this.http(url, "get");
  };
}

export default new Courier();
