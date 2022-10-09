import { themeChange } from "theme-change";
import { useEffect } from "react";

const ThemeSelector = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <select className="select select-bordered" data-choose-theme>
      <option value="cupcake" className="bg-base-100">
        Cupcake
      </option>
      <option value="synthwave" className="bg-base-100">
        Synthwave
      </option>
      <option value="coffee" className="bg-base-100">
        Coffee
      </option>
      <option value="emerald" className="bg-base-100">
        Emerald
      </option>
      <option value="halloween" className="bg-base-100">
        Halloween
      </option>
      <option value="night" className="bg-base-100">
        Night
      </option>
    </select>
  );
};

export default ThemeSelector;
