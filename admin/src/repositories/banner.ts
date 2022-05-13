import { CreateBanner, UpdateBanner } from "@ts-types/generated";
import Base from "./base";

class Banner extends Base<CreateBanner, UpdateBanner> {
  popularBanners = (url: string) => {
    return this.http(url, "get");
  };
}

export default new Banner();
