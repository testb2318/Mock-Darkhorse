import { Link } from "react-router-dom";
import { classNames } from "../../../utils/helpers";

export const SubMenu = ({ headerMenu, currentSubTab, setCurrentSubTab }) => {
  return (
    <div className="flex items-center w-full">
      <div className="pl-6 sm:block">
        <div className="">
          <nav aria-label="Tabs" className="flex w-full gap-x-5">
            {headerMenu.map((tab) => (
              <Link
                key={tab.name}
                to={tab.to}
                onClick={() => setCurrentSubTab(tab.name)}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.name === currentSubTab
                    ? "border-indigo-200 text-indigo-300"
                    : "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200",
                  "border-b-2 px-1 py-4 text-center gap-3 lg:text-lg text-[10px]"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};