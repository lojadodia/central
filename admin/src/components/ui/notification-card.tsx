type NotificationCardType = {
  src?: string;
  text?: string | React.ReactNode;
  time?: string;
};

const NotificationCard: React.FC<NotificationCardType> = ({
  src,
  text,
  time,
}) => {
  return (
    <a
      href="#"
      className="flex items-start px-4 pt-4 pb-3 bg-white border-b border-gray-200 hover:bg-gray-50"
    >
      <img
        className="h-8 w-8 rounded-full object-cover mr-3"
        src={src}
        alt="avatar"
      />

      <div className="flex flex-col -mt-1">
        <p className="text-gray-500 text-sm mb-1">{text}</p>
        <span className="text-sm text-gray-400">{time}</span>
      </div>
    </a>
  );
};

export default NotificationCard;
