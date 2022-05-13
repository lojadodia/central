import React from "react";
import { IosArrowDown } from "@components/icons/ios-arrow-down";
import { IosArrowUp } from "@components/icons/ios-arrow-up";

const StickerCard = ({
  title,
  subtitle,
  icon,
  price,
  indicator,
  indicatorText,
  note,
  link,
  linkText,
}: any) => {
  return (
    <div className="flex flex-col w-full h-full p-7 rounded bg-white dark:bg-neutral-900  shadow">
      <div className="w-full flex justify-between mb-auto pb-8">
        <div className="w-full flex flex-col">
          <span className="text-base text-heading dark:text-white font-semibold mb-1">
            {title}
          </span>
          <span className="text-xs text-body font-semibold">{subtitle}</span>
        </div>

        <div className="w-12 h-12 flex items-center justify-center ml-3">
          {icon}
        </div>
      </div>

      <span className="text-xl font-semibold text-heading dark:text-white mb-2">{price}</span>
      {indicator === "up" && (
        <span
          className="text-sm text-body font-semibold mb-12 inline-block"
          style={{ color: "#03D3B5" }}
        >
          <IosArrowUp width="9px" height="11px" className="inline-block" />{" "}
          {indicatorText}
          <span className="text-sm font-normal text-body"> {note}</span>
        </span>
      )}
      {indicator === "down" && (
        <span
          className="text-sm text-body font-semibold mb-12 inline-block"
          style={{ color: "#FC6687" }}
        >
          <IosArrowDown width="9px" height="11px" className="inline-block" />{" "}
          {indicatorText}
          <span className="text-sm font-normal text-body"> {note}</span>
        </span>
      )}
      {link && (
        <a
          className="text-xs text-purple-700 no-underline font-semibold"
          href={link}
          target="_blank"
        >
          {linkText}
        </a>
      )}
    </div>
  );
};

export default StickerCard;
