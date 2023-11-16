interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="">
      <h2 className="text-3xl font-bold tracking-light">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
