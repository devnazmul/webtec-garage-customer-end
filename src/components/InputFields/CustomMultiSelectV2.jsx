import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiFillAlert } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { FiPlus, FiSearch } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { OutsideClickHandler } from "../OutsideClickHandler";
import ButtonLoading from "../ButtonLoading";
import { MdOutlineChangeCircle } from "react-icons/md";
import { TfiExchangeVertical } from "react-icons/tfi";
import { IoInformationCircleSharp } from "react-icons/io5";
export default function CustomMultiSelectV2({
  options = [], // required []
  defaultSelectedValues = [], // []
  showCheckbox = true,
  loading = false,
  inputStyleClass = "",
  optionStyleClass = "",
  optionContainerClass = "",
  maxHeight = "max-h-[200px]",
  emptyRecordMsg = "No option found!",
  onSelect = (e) => {
    return e;
  },
  onRemove = (e) => {
    return e;
  },
  onSearch = (e) => {
    return e;
  },
  singleSelect = false,
  caseSensitiveSearch = false,
  closeOnSelect = true,
  CustomCloseIcon = RxCrossCircled,
  CustomCheckIcon = TiTick,
  disable = false,
  required = false,
  addButtonLabel = "Select",
  AddButtonIcon = FiPlus,
  ChangeButtonIcon = TfiExchangeVertical,
  label,
  error,
  id,
  top = false,
  left = true,
  right = false,
  bottom = true,

  selectAllOption = false,

  addNewItemButton = false,
  onClickAddNewItemButton = () => {},
  hint = "",
  visibleBorder = false,
  isSearchEnabled = true,
}) {
  const [selectedValues, setSelectedValues] = useState(defaultSelectedValues);
  const [filteredOptions, setFilterdOptions] = useState([]);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [searchFieldValue, setSearchFieldValue] = useState("");

  const [isAllSelected, setIsAllSelected] = useState(
    options.length === selectedValues?.length
  );

  // Ref to track the first render
  const isFirstRender = useRef(true);

  // Memoized version of the onSelect callback
  const memoizedOnSelect = useCallback(onSelect, []);

  useEffect(() => {
    setComponentLoading(true);
    if (!loading) {
      setComponentLoading(true);
      setSelectedValues(defaultSelectedValues);
      setFilterdOptions(options);
      setComponentLoading(false);
    }
  }, [loading, defaultSelectedValues]);

  // Handle changes to selected values
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      // Call onSelect only if the selected values are different from the default values
      if (
        JSON.stringify(selectedValues) !== JSON.stringify(defaultSelectedValues)
      ) {
        onSelect(selectedValues);
        onRemove(selectedValues);
        selectedValues?.length > 0 &&
          closeOnSelect &&
          singleSelect &&
          setIsOptionOpen(false);
        setFilterdOptions(options);
        setSearchFieldValue("");
        memoizedOnSelect(selectedValues);
      }
    }
  }, [selectedValues, defaultSelectedValues, memoizedOnSelect]);

  useEffect(() => {
    if (options.length > 0) {
      if (options.length === selectedValues?.length) {
        setIsAllSelected(true);
      } else {
        setIsAllSelected(false);
      }
    } else {
      setIsAllSelected(false);
    }
  }, [selectedValues]);

  //  SEARCH
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchFieldValue(searchTerm);
    setFilterdOptions(
      options.filter(
        (option) =>
          option.label &&
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="w-full relative">
      {/* LABEL */}
      <div className="flex gap-5 items-center justify-between">
        <div className={`flex items-center gap-2`}>
          {label ? (
            <label htmlFor={id} className={`label`}>
              <span className="label-text  text-md font-bold">
                {label}{" "}
                {required && !disable && (
                  <span className="text-error font-bold text-md">*</span>
                )}
              </span>
            </label>
          ) : (
            <></>
          )}

          {hint && (
            <div
              className={`dropdown ${right && "dropdown-start"} ${
                top && "dropdown-top"
              } ${bottom && "dropdown-bottom"}`}
            >
              <div
                tabIndex={0}
                role="button"
                title="info"
                className=" btn btn-circle btn-ghost btn-xs mt-1"
              >
                <IoInformationCircleSharp className={`text-primary text-xl `} />
              </div>
              <div
                tabIndex={0}
                className="card compact dropdown-content z-[1] shadow-lg border border-primary-content shadow-primary-content bg-base-300 rounded-xl w-64"
              >
                <div tabIndex={0} className="card-body">
                  <h2 className="card-title text-primary">{label}</h2>
                  <p> {hint}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {selectAllOption ? (
          <div className="mt-2 flex items-center gap-2">
            <label role="button" htmlFor="">
              Select all
            </label>
            <input
              id=""
              name=""
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedValues(options);
                } else {
                  setSelectedValues([]);
                }
              }}
              checked={isAllSelected}
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary mr-2"
            />
          </div>
        ) : (
          ""
        )}
      </div>

      {/* FIELD  */}
      <div
        // disabled={disable}
        style={{ display: "flex" }}
        className={`relative z-10
        ${
          disable
            ? `h-[3.2rem] cursor-not-allowed ${
                visibleBorder && "disabled:border-gray-200 border-opacity-10"
              }`
            : `h-auto`
        }
        w-full input ${
          isOptionOpen ? "border-2 border-primary" : ""
        }  flex-wrap rounded-md bg-base-300 input-bordered outline-none focus:outline-none items-center px-1`}
        // className={`z-10 ${
        //   disable
        //     ? `h-[3.2rem] cursor-not-allowed ${
        //         visibleBorder && "disabled:border-gray-200 border-opacity-10"
        //       }`
        //     : `h-auto`
        // }   w-full input rounded-md bg-base-300  input-bordered focus:outline-none py-1 px-1 ${
        //   isOptionOpen ? "border-2 border-primary" : ""
        // }`}
      >
        {/* SELECTED OPTIONS  */}
        {selectedValues?.map((opt, index) => (
          <span
            onClick={() => setIsOptionOpen(true)}
            key={index}
            className="bg-primary-content cursor-pointer z-10 px-5 py-1 rounded-md my-1 mx-1 shadow-md inline-flex gap-2 items-center"
          >
            {opt?.Icon && <opt.Icon />} {opt?.label}{" "}
            {!disable && (
              <button
                onClick={() =>
                  setSelectedValues(
                    selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                  )
                }
              >
                <CustomCloseIcon
                  className={`text-red-500 hover:bg-red-500 rounded-full hover:text-base-300`}
                />
              </button>
            )}
          </span>
        ))}

        {disable ? (
          <div
            className={`relative min-w-[100px!important] h-11 items-center text-gray-600  flex-1`}
          >
            <input
              type="text"
              disabled={true}
              placeholder="search"
              className={`w-full input-bordered outline-none bg-transparent px-2 h-full`}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              setIsOptionOpen(!isOptionOpen);
            }}
            className={`relative flex-1 min-w-[100px!important] ${
              singleSelect && selectedValues?.length > 0 ? "h-1" : "h-11"
            } items-center text-gray-600`}
          >
            {singleSelect ? (
              <>
                {selectedValues?.length > 0 ? (
                  ""
                ) : (
                  <div
                    className={`h-full font-normal cursor-pointer flex items-center px-3 text-gray-400`}
                  >
                    <span>
                      Select
                      {required && !disable && (
                        <span className="font-bold text-md">*</span>
                      )}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <input
                onClick={() => {
                  setIsOptionOpen(!isOptionOpen);
                }}
                type="text"
                value={searchFieldValue}
                onChange={handleSearch}
                placeholder="search"
                className={`w-full input-bordered outline-none bg-transparent px-2 h-full`}
              />
            )}
          </div>
        )}
        {/* SELECT MORE BUTTON  */}
        {/* {!disable && (
          <button
            data-tip="Change"
            onClick={() => {
              setIsOptionOpen(!isOptionOpen);
            }}
            className={`${
              selectedValues?.length === 0
                ? "w-full justify-start"
                : "justify-center"
            }  gap-1 ml-2 my-2 tooltip tooltip-bottom  inline-flex  items-center rounded-full text-gray-600  flex-1`}
          >
            {singleSelect && selectedValues?.length > 0 ? (
              <>
                <ChangeButtonIcon className="text-md" />
              </>
            ) : (
              <>
                {!singleSelect && <AddButtonIcon className="" />}{" "}
                <>{addButtonLabel}</>
              </>
            )}
          </button>
        )} */}
      </div>

      {/* OPTIONS  */}
      <OutsideClickHandler
        className={`absolute ${
          top ? "bottom-full -mb-7" : "top-full mt-2"
        } z-30 bg-base-300 duration-200 transition-all overflow-hidden  ${
          isOptionOpen ? "opacity-100 h-auto block" : "opacity-0 h-0 hidden"
        }  shadow-lg border-2 border-primary rounded-md w-full left-0`}
        onOutsideClick={() => {
          setIsOptionOpen(false);
        }}
      >
        <div
          className={`overflow-y-auto px-0 py-0 overflow-x-hidden ${maxHeight}  scrollbar `}
        >
          {componentLoading ? (
            <div className="flex justify-center items-center py-5">
              <ButtonLoading />
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <Fragment key={index}>
                <button
                  onClick={() => {
                    if (
                      selectedValues?.some((s_opt) => s_opt?.id === opt?.id)
                    ) {
                      // IF ALREADY SELECTED
                      setSelectedValues(
                        selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                      );
                    } else {
                      // IF NOT SELECTED
                      if (singleSelect) {
                        setSelectedValues([opt]);
                      } else {
                        setSelectedValues([...selectedValues, opt]);
                      }
                    }
                  }}
                  className={`px-5 py-1   justify-between w-full flex gap-2 items-center   ${
                    showCheckbox &&
                    selectedValues?.some((s_opt) => s_opt?.id === opt?.id)
                      ? "bg-primary text-base-300"
                      : "hover:bg-primary-content"
                  }`}
                >
                  <span className="inline-flex gap-2 items-center text-left w-full">
                    {opt?.Icon && <opt.Icon />} {opt?.label}
                  </span>

                  {selectedValues?.some((s_opt) => s_opt?.id === opt?.id) &&
                    showCheckbox && (
                      <CustomCheckIcon
                        className={`${
                          selectedValues?.some((s_opt) => s_opt?.id === opt?.id)
                            ? "text-base-300"
                            : ""
                        }`}
                      />
                    )}
                </button>
                {index + 1 < filteredOptions.length ? <hr /> : ""}
              </Fragment>
            ))
          ) : (
            <div className="flex justify-center items-center py-5">
              <span className={`font-bold text-red-500`}>{emptyRecordMsg}</span>
            </div>
          )}
        </div>
        {addNewItemButton && (
          <button
            onClick={onClickAddNewItemButton}
            className={`w-full text-center bg-primary text-base-300 py-2 hover:bg-primary-focus`}
          >
            Add New
          </button>
        )}
      </OutsideClickHandler>

      {/* VALIDATION MESSAGE  */}
      {error && (
        <label className="label h-7">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
