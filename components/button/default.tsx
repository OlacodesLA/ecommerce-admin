import { ButtonLoader } from "../loader";

type Props = {
  type: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  label: string;
  disable?: boolean;
};

const DefaultButton = ({ type, isLoading, label, disable }: Props) => {
  return (
    <button
      type={type}
      className="bg-black rounded-lg w-full py-2.5 mt-3 text-white text-base font-semibold"
      disabled={disable ? isLoading || disable : isLoading}
    >
      {isLoading ? <ButtonLoader /> : label}
    </button>
  );
};

export default DefaultButton;
