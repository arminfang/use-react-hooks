import { useMemo, useState } from "react";

interface Actions {
  set: (value: boolean) => void;
  setFalse: () => void;
  setTrue: () => void;
  toggle: () => void;
}

export default function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, setState] = useState<boolean>(!!defaultValue);

  const actions: Actions = useMemo(() => {
    const setTrue = () => setState(true);
    const setFalse = () => setState(false);
    const toggle = () => setState((prev) => !prev);
    return {
      set: (v) => setState(!!v),
      setFalse,
      setTrue,
      toggle,
    };
  }, []);

  return [state, actions];
}
