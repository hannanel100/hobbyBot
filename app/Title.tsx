import Image from "next/image";
const Title = () => (
  <div className="mx-auto mb-4 flex items-center justify-center">
    <h1 className=" text-4xl font-bold">
      Hobby<span className="text-teal-500">Bot</span>
    </h1>
    <Image
      className="hidden dark:block"
      src="/dark_icon.png"
      width={100}
      height={100}
      alt="logo"
    />
    <Image
      className="block dark:hidden"
      src="/icon.png"
      width={100}
      height={100}
      alt="logo"
    />
  </div>
);

export default Title;
