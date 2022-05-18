import { useRef } from "react";
import Link from "@components/ui/link";
import cn from "classnames";
import { useUI } from "@contexts/ui.context";
import { siteSettings } from "@settings/site.settings";
import Logo from "@components/ui/logo";
import Search from "@components/common/search";
import JoinButton from "@components/layout/navbar/join-button";
import ProductTypeMenu from "@components/layout/navbar/product-type-menu";
import { addActiveScroll } from "@utils/add-active-scroll";
import dynamic from "next/dynamic";
import Button from "@components/ui/button";
import { RiUser3Fill, RiFileList2Fill, RiTruckFill, RiShoppingBag3Fill, RiTimeLine, RiCalendar2Fill, RiMapPin2Fill, RiExternalLinkLine, RiAlertFill } from "react-icons/ri";
import { useCheckout } from "@contexts/checkout.context";
import { useCart } from "@contexts/quick-cart/cart.context";
import usePrice from "@utils/use-price";

const AuthorizedMenu = dynamic(
  () => import("@components/layout/navbar/authorized-menu"),
  { ssr: false }
);

type DivElementRef = React.MutableRefObject<HTMLDivElement>;

const NavbarWithSearch = () => {
  const navbarRef = useRef() as DivElementRef;
  const { isAuthorize, displayHeaderSearch, displayMobileSearch } = useUI();
  const { client, delivery_schedule, order_type, delivery_time } = useCheckout();
  addActiveScroll(navbarRef);

  const { innerWidth: width} = window;

  const { total } = useCart();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  if(width > 900){
    if(displayHeaderSearch){
      var bg = "bg-white dark:bg-black border-b dark:border-neutral-700";
    }else{
      var bg = "bg-transparent dark:bg-transparent ";
    }
  }else{
      var bg = "bg-white dark:bg-black border-b dark:border-neutral-700";
  }

  return (
    <header
      ref={navbarRef}
      className="site-header-with-search h-14 md:h-14 lg:h-auto"
    >
      <nav
        className="w-full px-4 lg:px-8 flex justify-between items-center top-0 right-0 z-20 transition-transform duration-300 is-sticky dark:bg-neutral-900 fixed shadow-sm border-b dark:border-neutral-700" style={{height:"78px"}}
      >
        {displayMobileSearch ? (
          <div className="w-full">
            <Search label="grocery search at header" variant="minimal" />
          </div>
        ) : (
          <>
            <Logo className="mx-auto lg:mx-0" />
            <div className="inline-block px-4 w-full">
            {total > 0 && (
                <Button className="px-4 uppercase py-3 mr-2 text-center display-inline text-sm bg-primary  text-white  rounded h-12  border-gray-200 border dark:border-neutral-700 dark:bg-neutral-600 cursor-pointer" size="small" >
                  <RiFileList2Fill style={{ display: "inline-block", verticalAlign: '-2px' }} />&nbsp; {totalPrice}
                </Button>
              )

              }
              {client?.name && (
                <Button className="px-4 uppercase py-3 mr-2 text-center text-sm bg-primary display-inline text-white  rounded h-12  border-gray-200 border dark:border-neutral-700 dark:bg-neutral-600  cursor-pointer" size="small" >
                  <RiUser3Fill style={{ display: "inline-block", verticalAlign: '-2px' }} />&nbsp; {client?.name?.replace(/ .*/,'')}
                </Button>
              )

              }
             {order_type && (
              <Button className="px-4 py-3 mr-2 text-center text-sm bg-primary display-inline text-white  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer dark:bg-neutral-600" size="small" >
                { order_type == "takeaway" ?
                (<><RiShoppingBag3Fill style={{ display: "inline-block", verticalAlign: '-2px' }} />&nbsp; TAKEAWAY</>)
                :
                (<><RiTruckFill style={{ display: "inline-block", verticalAlign: '-2px' }} />&nbsp; ENTREGA</>)
                }
              </Button>
            )}
             {delivery_schedule && (
              <Button className="px-4 py-3 mr-2 text-center text-sm bg-primary  hidden lg:display-inline  text-white  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer dark:bg-neutral-600" size="small" >
                { delivery_schedule == "schedule" ? "AGENDAMENTO" : "AGORA"}
              </Button>
              )}

            {delivery_time && (
              <Button className="px-4 py-3 mr-2 text-center text-sm bg-primary hidden lg:display-inline  text-white  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer dark:bg-neutral-600" size="small" >
                { delivery_time }
              </Button>
              )}
            </div>
          
         
            <ul className=" lg:flex items-center flex-shrink-0 space-x-10">
              {/* 
            <li key="track-orders">
                  <Link
                    href={ROUTES.ABOUT}
                    className="font-semibold text-heading flex items-center transition duration-200 no-underline hover:text-primary focus:text-primary"
                  >
                    Acerca
                  </Link>
                </li>

                */}

              {isAuthorize ? (
                <li>
                  <AuthorizedMenu />
                </li>
              ) : (
                <li>
                  <JoinButton />
                </li>
              )}
            </ul>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavbarWithSearch;
