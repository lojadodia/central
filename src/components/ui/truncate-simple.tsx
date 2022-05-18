type ReadMoreProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonText?: string;
  character: number;
  children: string;
  hideButton?: boolean;
};

const TruncateSimple: React.FC<ReadMoreProps> = ({
  children,
  onClick,
  character = 200,
  buttonText = "Ver mais",
  hideButton = false,
}) => {
  if (!children) return null;

  return (
    <>
      {children && children.length < character
        ? children
        : children.substring(0, character)}
      {!hideButton && children.length > character && (
        <>

        </>
      )}
    </>
  );
};

export default TruncateSimple;
