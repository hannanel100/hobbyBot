// show loading if the data is not ready

import Loader from "./Loader";

const Loading = () => {
  return (
    <div className="mt-20 grid place-content-center">
      <Loader size="lg" />
    </div>
  );
};

export default Loading;
