import { useRouter } from "next/router";
import ErrorMessage from "@components/ui/error-message";
import SidebarMenu from "@components/ui/sidebar-menu";
import Scrollbar from "@components/ui/scrollbar";
import CategoryListLoader from "@components/ui/loaders/category-loader";
import NotFound from "@components/common/not-found";
import { useCategoriesQuery } from "@data/category/use-categories.query";

const CategoryDropdownSidebar = () => {
  const { query } = useRouter();
  const { type } = query;
  const { data, isLoading: loading, error } = useCategoriesQuery({
    type: type as string,
  });

  if (loading) {
    return (
      <div className="hidden xl:block dark:bg-black">
        <div className="w-72 mt-8 px-2">
          <CategoryListLoader />
        </div>
      </div>
    );
  }
  if (error) return <ErrorMessage message={error.message} />;

  return (

      <div className="w-full">
          {data?.categories?.data?.length && (
              <SidebarMenu items={data?.categories?.data}/>
          ) }

      </div>

  );
};

export default CategoryDropdownSidebar;
