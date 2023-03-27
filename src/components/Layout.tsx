import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <div className=" flex h-screen justify-center bg-teal-50 py-8 text-teal-900 dark:bg-teal-900 dark:text-teal-50 md:mx-auto">
      <div className="no-scrollbar h-full w-full overflow-y-scroll">
        {props.children}
      </div>
    </div>
  );
};
