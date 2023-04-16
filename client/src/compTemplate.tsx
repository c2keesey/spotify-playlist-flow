import { FC, useState, useEffect } from "react";

interface Props {}

const ComponentName: FC<Props> = () => {
  const [stateVariable, setStateVariable] = useState();

  useEffect(() => {
    return () => {};
  }, []);

  return <div />;
};

export default ComponentName;
