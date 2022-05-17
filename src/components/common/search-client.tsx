import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Button from "@components/ui/button";
import ErrorMessage from "@components/ui/error-message";
import renderProductCard from "@components/product/render-product-card";
import NotFound from "@components/common/not-found";

const SearchClient = () => {
 
  return (
    <div className="bg-gray-100  dark:bg-black min-h-full">
      <div className="dark:bg-black pb-8 px-2 lg:px-8 lg:pb-8 lg:pt-0">
      <div className="relative" >
        {loading && !data?.pages?.length ? (
          <ProductSearchClientLoader limit={20} />
        ) : ( 
          <>

       
                {!!cacheData2?.length && (
                  <div className="relative">
                    <div className="absolute scroll-behavior" id="hh"></div>
                    <h1 className="mb-4 mt-0 text-xl dark:text-white text-heading font-semibold  uppercase">
                      {" "}
                      {menuTitle ? menuTitle : "Menus do dia"}
                    </h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-6 gap-2">
                      <Fragment>
                        {cacheData2?.map((product: any) => (
                          <motion.div key={product.id}>
                            {renderProductCard(product)}
                          </motion.div>
                        ))}
                      </Fragment>
                    </div>
                  </div>
                )}
                {cacheData?.map((items: Category) => (
                  <div key={items.id}>
                      <ProdutosItemsCategory
                        key={items.id}
                        name={items.name}
                        slug={items.slug}
                        products={items.products}
                      />
                  </div>
                ))}


          </>
        )}
      </div>
      
      {hasNextPage && (
        <div className="flex justify-center mt-8 lg:mt-12">
          <Button
            loading={loadingMore}
            onClick={handleLoadMore}
            className="text-sm md:text-base font-semibold h-11"
          >
            Carregar mais
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};

export default SearchClient;
