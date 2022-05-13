import React, { FC, useRef, useEffect } from "react";
import Portal from "@reach/portal";
import { motion, AnimatePresence } from "framer-motion";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import cn from "classnames";
import Scrollbar from "@components/ui/scrollbar";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { zoomOutIn } from "@utils/motion/zoom-out-in";
import { useUI } from "@contexts/ui.context";
import useOnClickOutside from "@utils/use-click-outside";

type ModalProps = {
  open?: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  rootClassName?: string;
  useBlurBackdrop?: boolean;
  containerClassName?: string;
  variant?: "center" | "bottom";
};
type DivElementRef = React.MutableRefObject<HTMLDivElement>;

// variant based classes for modal root, container & close btn
const rootClasses = {
  center: "p-5",
  bottom: "p-5 pb-0",
};
const containerClasses = {
  center: "h-auto max-h-full top-1/2 -translate-y-1/2 rounded-lg",
  bottom: "h-full max-h-70vh bottom-0 rounded-tl-2xl rounded-tr-2xl",
};

const Modal: FC<ModalProps> = ({
  children,
  open,
  // onClose,
  rootClassName,
  useBlurBackdrop,
  containerClassName,
  variant = "center",
}) => {
  const { closeModal } = useUI();
  const modalRootRef = useRef() as DivElementRef;
  const modalInnerRef = useRef() as DivElementRef;
  useOnClickOutside(modalInnerRef, () => closeModal());

  useEffect(() => {
    if (modalRootRef.current) {
      if (open) {
        disableBodyScroll(modalRootRef.current);
      } else {
        enableBodyScroll(modalRootRef.current);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [open]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={modalRootRef}
            key="modal"
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className={cn(
              "modal-root fixed bg-black bg-opacity-40 inset-0 z-50",
              useBlurBackdrop && "use-blur-backdrop",
              rootClasses[variant],
              rootClassName
            )}
          >
            {/* <button
              onClick={onClose}
              aria-label="Close panel"
              className={cn(
                "fixed z-10 inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white shadow text-gray-600 transition duration-200 focus:outline-none focus:text-gray-800 focus:shadow-md hover:text-gray-800 hover:shadow-md",
                closeBtnClasses[variant]
              )}
            >
              <CloseIcon className="w-2.5 h-2.5" />
            </button> */}
            <motion.div
              initial="from"
              animate="to"
              exit="from"
              variants={zoomOutIn()}
              className="relative w-full h-full"
            >
              <div
                ref={modalInnerRef}
                className={cn(
                  "w-full absolute left-1/2 transform  -translate-x-1/2 bg-white overflow-x-hidden shadow-xl",
                  containerClasses[variant],
                  containerClassName
                )}
              >
                <Scrollbar className="w-full h-full">{children}</Scrollbar>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Modal;
