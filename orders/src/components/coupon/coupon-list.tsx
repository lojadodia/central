import Pagination from "@components/ui/pagination";
import Image from "next/image";
import dayjs from "dayjs";
import { Table } from "@components/ui/table";
import { CouponPaginator } from "@ts-types/generated";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import { Attachment } from "@ts-types/generated";
import usePrice from "@utils/use-price";
import { ROUTES } from "@utils/routes";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 64,
  },
  {
    title: "Baner",
    dataIndex: "image",
    key: "image",
    width: 74,
    render: (image: Attachment) => (
      <Image
        src={image?.thumbnail ?? siteSettings.product.placeholder}
        alt="coupon banner"
        layout="fixed"
        width={42}
        height={42}
        className="rounded overflow-hidden"
      />
    ),
  },
  {
    title: "Código",
    dataIndex: "code",
    key: "code",
    align: "center",
    render: (text: string) => <span className="whitespace-nowrap">{text}</span>,
  },
  {
    title: "Montante",
    dataIndex: "amount",
    key: "amount",
    align: "center",
    width: 132,
    render: (amount: number, record: any) => {
      const { price } = usePrice({
        amount: amount,
      });
      if (record.type === "PERCENTAGE_COUPON") {
        return <span>{amount}%</span>;
      }
      return <span>{price}</span>;
    },
  },
  {
    title: "Ativo",
    dataIndex: "active_from",
    key: "active_from",
    align: "center",
    render: (date: string) => (
      <span className="whitespace-nowrap">
        {dayjs().to(dayjs.utc(date).tz(dayjs.tz.guess()))}
      </span>
    ),
  },
  {
    title: "Expirado",
    dataIndex: "expire_at",
    key: "expire_at",
    align: "center",
    render: (date: string) => (
      <span className="whitespace-nowrap">
        {dayjs().to(dayjs.utc(date).tz(dayjs.tz.guess()))}
      </span>
    ),
  },
  {
    title: "Ação",
    dataIndex: "id",
    key: "actions",
    align: "center",
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.COUPONS}/edit/${id}`}
        modalActionType="DELETE_COUPON"
      />
    ),
  },
];

type IProps = {
  coupons: CouponPaginator | null | undefined;
  onPagination: (current: number) => void;
};
const CouponList = ({ coupons, onPagination }: IProps) => {
  const { data, paginatorInfo } = coupons!;
  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        {/* @ts-ignore */}
        <Table columns={columns} data={data} rowKey="id" scroll={{ x: 900 }} />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CouponList;
