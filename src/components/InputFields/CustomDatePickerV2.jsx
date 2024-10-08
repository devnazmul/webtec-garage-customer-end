import {
  addMonths,
  format as formatDate,
  getDaysInMonth,
  setYear,
  startOfMonth,
  subMonths,
} from "date-fns";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { isDateInRange } from "../../utils/isDateInRange";
import { selectMonth } from "../../utils/selectMonth";
import ColorIndicatorDetails from "../ColorIndicatorDetails";
import { OutsideClickHandler } from "../OutsideClickHandler";
import DateTimeField from "../DateTime/DateTimeField";

const CustomDatePickerV2 = ({
  hint = false,
  hinComponent = <></>,
  specialDates = [],
  format = "dd-LL-yyyy",
  dateFormat = "DD-MM-YYYY",
  defaultDate,
  fieldClassName,
  id,
  label,
  required = false,
  name,
  value = "",
  onChange = (e) => {
    return e;
  },
  error,
  defaultValue,
  wrapperClassName,
  top = false,
  right = false,

  disabled = false,

  from = "01-01-1900",
  to = "31-12-3000",

  visibleBorder = false,
  small = false,
  dataAuto,
}) => {
  /**
   * State for the current step of the date picker
   */
  const [step, setStep] = useState("day");

  /**
   * State for the currently selected date
   */
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(moment(value, "DD-MM-YYYY")) : new Date()
  );

  /**
   * State for the currently selected month
   */
  const [currentMonth, setCurrentMonth] = useState(
    value !== null &&
      value !== undefined &&
      value !== "" &&
      typeof value === "string"
      ? new Date(
          value.split("-")[2],
          value.split("-")[1] - 1,
          value.split("-")[0]
        )
      : new Date()
  );

  /**
   * State for whether the date picker is active or not
   */
  const [isDatePickerActive, setDatePickerActive] = useState(false);

  /**
   * State for whether the component is initial or not
   */
  const [isInitial, setIsInitial] = useState(true);

  /**
   * Callback function that runs when the selected date changes
   * Emits the selected date to the parent component through the onChange function
   */
  useEffect(() => {
    console.log({ status: "calling", isInitial, selectedDate });
    if (!isInitial) {
      if (selectedDate) {
        onChange(formatDate(selectedDate, format));
      } else {
        onChange("");
      }
    }
  }, [selectedDate]);

  /**
   * Callback function that runs when the default date changes
   * Sets the selected date to the default date
   */
  useEffect(() => {
    setSelectedDate(defaultDate ? new Date(defaultDate) : "");
  }, [defaultDate]);

  /**
   * Callback function that runs when the value prop changes
   * Sets the selected date to an empty string if the value prop is falsy
   */
  useEffect(() => {
    if (!value) {
      setSelectedDate("");
    }
  }, [value]);

  /**
   * Callback function that runs when the current month changes
   * Sets the step to "day" and updates the current month
   * @param {Date} newMonth - The new month to set as the current month
   */
  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
    setStep("day");
  };

  /**
   * Callback function that runs when the year range changes
   * Sets the start and end years and updates the allYear array
   * @param {number} start - The start year of the range
   * @param {number} end - The end year of the range
   */
  const handleChangeYear = (start, end) => {
    console.log({ start, end });
    setStartYear(start);
    setEndYear(end);
    setAllYear(
      Array.from({ length: end - start + 1 }, (_, index) => start + index)
    );
  };

  /**
   * Callback function that runs when a date is clicked
   * Sets the selected date to the clicked date and deactivates the date picker
   * @param {Date} day - The clicked date
   */
  const handleDateClick = (day) => {
    setSelectedDate(day);
    setDatePickerActive(false);
    setIsInitial(false);
  };

  /**
   * Callback function that runs when the input is clicked
   * Toggles the date picker activation state
   */

  const handleInputClick = () => {
    setDatePickerActive(!isDatePickerActive);
  };

  // RENDER CALENDER
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(
      value ? moment(value, "DD-MM-YYYY").toDate() : currentMonth
    );
    const firstDayOfMonth = startOfMonth(
      value ? moment(value, "DD-MM-YYYY").toDate() : currentMonth
    );
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return (
      <div
        data-auto={`container-${dataAuto}`}
        className="grid grid-rows-6 grid-cols-7  md:gap-1"
      >
        {weekDays.map((weekDay) => (
          <div
            data-auto={`weekday-${dataAuto}`}
            key={weekDay}
            className="text-center py-2 font-bold"
          >
            {weekDay}
          </div>
        ))}

        {/* EMPTY  */}
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
          <div
            data-auto={`empty-${dataAuto}`}
            key={`empty-${index}`}
            className={`p-2 ${small ? "h-7 w-7" : "md:h-10 md:w-10 h-7 w-7"}`}
          ></div>
        ))}

        {/* DAYS  */}
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
          (day, i) => (
            <button
              data-auto={`day${i + 1}-${dataAuto}`}
              key={i}
              title={
                specialDates.find(
                  (obj) =>
                    obj?.date ===
                    moment(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    ).format("DD-MM-YYYY")
                )?.title
              }
              disabled={
                specialDates.some(
                  (obj) =>
                    obj?.date ===
                    moment(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    ).format("DD-MM-YYYY")
                ) &&
                specialDates.find(
                  (obj) =>
                    obj?.date ===
                    moment(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    ).format("DD-MM-YYYY")
                )?.isDisabled &&
                !isDateInRange(
                  moment(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    )
                  ).format("DD-MM-YYYY"),
                  from,
                  to
                )
              }
              className={`text-center ${
                small ? "h-7 w-7" : "md:h-10 md:w-10 h-7 w-7"
              } rounded-md  flex justify-center items-center ${
                !isDateInRange(
                  moment(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    )
                  ).format("DD-MM-YYYY"),
                  from,
                  to
                )
                  ? `cursor-not-allowed bg-base-100 text-opacity-40 group border border-base-100 text-gray-500  border-opacity-40 relative`
                  : `${
                      specialDates.some(
                        (obj) =>
                          obj?.date ===
                          moment(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            )
                          ).format("DD-MM-YYYY")
                      )
                        ? `${
                            specialDates.find(
                              (obj) =>
                                obj?.date ===
                                moment(
                                  new Date(
                                    currentMonth.getFullYear(),
                                    currentMonth.getMonth(),
                                    day
                                  )
                                ).format("DD-MM-YYYY")
                            )?.textColor
                          }  ${
                            specialDates.find(
                              (obj) =>
                                obj?.date ===
                                moment(
                                  new Date(
                                    currentMonth.getFullYear(),
                                    currentMonth.getMonth(),
                                    day
                                  )
                                ).format("DD-MM-YYYY")
                            )?.isDisabled
                              ? `cursor-not-allowed  group border `
                              : `cursor-pointer`
                          } ${
                            specialDates.find(
                              (obj) =>
                                obj?.date ===
                                moment(
                                  new Date(
                                    currentMonth.getFullYear(),
                                    currentMonth.getMonth(),
                                    day
                                  )
                                ).format("DD-MM-YYYY")
                            )?.borderColor
                          } relative`
                        : `${
                            moment(
                              new Date(
                                currentMonth.getFullYear(),
                                currentMonth.getMonth(),
                                day
                              )
                            ).format("DD-MM-YYYY") ===
                            moment(new Date()).format("DD-MM-YYYY")
                              ? "bg-primary"
                              : ""
                          } cursor-pointer ${
                            selectedDate
                              ? selectedDate &&
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() ===
                                  currentMonth.getMonth() &&
                                selectedDate.getFullYear() ===
                                  currentMonth.getFullYear()
                                ? "bg-primary text-base-300 border-primary"
                                : "bg-gray-500  bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content"
                              : new Date(moment(value, "DD-MM-YYYY")) &&
                                new Date(
                                  moment(value, "DD-MM-YYYY")
                                ).getDate() === day &&
                                new Date(
                                  moment(value, "DD-MM-YYYY")
                                ).getMonth() === currentMonth.getMonth() &&
                                new Date(
                                  moment(value, "DD-MM-YYYY")
                                ).getFullYear() === currentMonth.getFullYear()
                              ? "bg-primary text-base-300 border-primary"
                              : "bg-gray-500  bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content"
                          }
                ${
                  today.getFullYear() === currentMonth.getFullYear() &&
                  today.getDate() === day &&
                  today.getMonth() === currentMonth.getMonth()
                }`
                    }  border-2
            `
              } `}
              onClick={(event) => {
                event.preventDefault();
                isDateInRange(
                  moment(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    )
                  ).format("DD-MM-YYYY"),
                  from,
                  to
                ) &&
                  !specialDates.find(
                    (obj) =>
                      obj?.date ===
                      moment(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                      ).format("DD-MM-YYYY")
                  )?.isDisabled &&
                  handleDateClick(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    )
                  );
              }}
            >
              {day}
            </button>
          )
        )}

        {/* EMPTY  */}
        {Array.from({
          length: 11 - Array.from({ length: firstDayOfMonth.getDay() })?.length,
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className={`p-2 ${small ? "h-7 w-7" : "md:h-10 md:w-10 h-7 w-7"}`}
          ></div>
        ))}
      </div>
    );
  };

  const [allYear, setAllYear] = useState(
    Array.from(
      {
        length:
          parseInt(formatDate(currentMonth, "yyyy")) +
          11 -
          parseInt(formatDate(currentMonth, "yyyy")) +
          1,
      },
      (_, index) => parseInt(formatDate(currentMonth, "yyyy")) + index
    )
  );

  const [startYear, setStartYear] = useState(
    parseInt(formatDate(currentMonth, "yyyy"))
  );
  const [endYear, setEndYear] = useState(
    parseInt(formatDate(currentMonth, "yyyy")) + 11
  );

  useEffect(() => {
    setStartYear(parseInt(formatDate(currentMonth, "yyyy")));
    setEndYear(parseInt(formatDate(currentMonth, "yyyy")) + 11);

    setAllYear(
      Array.from(
        {
          length:
            parseInt(formatDate(currentMonth, "yyyy")) +
            11 -
            parseInt(formatDate(currentMonth, "yyyy")) +
            1,
        },
        (_, index) => parseInt(formatDate(currentMonth, "yyyy")) + index
      )
    );
  }, [currentMonth]);

  const [errorMessages, setErrorMessages] = useState("");

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setStep("day");
        setDatePickerActive(false);
      }}
      className={`relative ${wrapperClassName}`}
      dataAuto={`container-${dataAuto}`}
    >
      {/* CALENDER AND RESET BUTTON  */}
      {selectedDate ? (
        <>
          {!disabled && (
            <button
              data-auto={`reset-${dataAuto}`}
              data-tip="reset"
              className={`tooltip tooltip-bottom absolute right-2 ${
                label ? "top-[50px]" : "top-[14px]"
              } text-xl text-primary `}
              onClick={(event) => {
                event.preventDefault();
                setSelectedDate(null);
                onChange("");
              }}
            >
              <BiReset />
            </button>
          )}
        </>
      ) : (
        <>
          {!disabled && (
            <button
              data-auto={`openCalendar-${dataAuto}`}
              data-tip="calender"
              className={`tooltip tooltip-bottom absolute right-2 ${
                label ? "top-[50px]" : "top-[14px]"
              } text-xl text-primary `}
              onClick={(event) => {
                event.preventDefault();
                !disabled && handleInputClick();
              }}
            >
              <FaRegCalendarAlt />
            </button>
          )}
        </>
      )}

      {/* LABEL */}
      {label && (
        <label data-auto={`label-${dataAuto}`} htmlFor={id} className="label">
          <span
            data-cy={"label_content_custom_date_picker"}
            className="label-text text-md font-bold"
          >
            {label}{" "}
            {!disabled && required && (
              <span
                data-cy={"label_required_custom_date_picker"}
                className="text-error font-bold text-md"
              >
                *
              </span>
            )}
          </span>
        </label>
      )}

      {/* FIELD  */}
      <DateTimeField
        visibleBorder={visibleBorder}
        format={dateFormat}
        id={id}
        disabled={disabled}
        fieldClassName={fieldClassName}
        value={
          selectedDate
            ? formatDate(selectedDate, format)
            : value
            ? formatDate(new Date(moment(value, "DD-MM-YYYY")), format)
            : ""
        }
        setSelectedDate={setSelectedDate}
        error={error}
        onError={(e) => setErrorMessages(e)}
        minDate={from}
        maxDate={to}
      />

      {/* VALIDATION MESSAGE  */}
      {(errorMessages || error) && (
        <label data-auto={`error-message-${dataAuto}`} className="label">
          <span
            data-cy={"error_content_custom_date_picker"}
            className="label-text-alt text-error"
          >
            {errorMessages || error}
          </span>
        </label>
      )}

      {isDatePickerActive && !disabled && (
        <div
          data-auto={`datePickerActive-${dataAuto}`}
          style={{
            zIndex: 50,
          }}
          className={`${top ? "bottom-full -mb-6" : "top-full mt-2"} ${
            right ? "right-0" : "left-0"
          } bg-base-300 border border-primary-content absolute rounded-xl ${
            small
              ? "md:w-[250px]  px-3  py-3"
              : "md:w-[350px] px-3 md:px-5   md:py-5"
          } w-[250px] text-sm`}
        >
          {/* hinComponent */}
          {hint && (
            <>
              <button
                data-cy={"hint_button_custom_date_picker"}
                className="tooltip tooltip-primary  absolute right-1 top-1"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
                data-tip="details"
              >
                <IoMdInformationCircle className={`text-primary text-2xl`} />
              </button>
              <dialog
                data-cy={"hint_dialog_container_custom_date_picker"}
                id="my_modal_1"
                className="modal"
              >
                <div
                  data-cy={"hint_dialog_sub_container_custom_date_picker"}
                  className="modal-box"
                >
                  <ColorIndicatorDetails />
                  <div
                    data-cy={"hint_dialog_form_container_custom_date_picker"}
                    className="modal-action"
                  >
                    <form
                      data-cy={"hint_dialog_form_custom_date_picker"}
                      method="dialog"
                    >
                      {/* if there is a button in form, it will close the modal */}
                      <button
                        data-cy={"hint_dialog_form_button_custom_date_picker"}
                        className="btn btn-primary"
                      >
                        Close
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </>
          )}
          <div data-cy={"day_step_container_custom_date_picker"} className="">
            {step === "day" && (
              <div
                data-cy={"day_step_sub_container_custom_date_picker"}
                className="mb-4 flex justify-between items-center pt-7 md:pt-0"
              >
                <button
                  data-auto={`month-left-${dataAuto}`}
                  className="text-lg w-7 md:w-10 h-7 md:h-10 hover:text-base-300 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                  onClick={(event) => {
                    event.preventDefault();
                    handleMonthChange(subMonths(currentMonth, 1));
                  }}
                >
                  {"<"}
                </button>

                <p
                  data-cy={"day_step_button_container_custom_date_picker"}
                  className="text-lg font-bold flex items-center gap-2"
                >
                  <button
                    data-auto={`month-${dataAuto}`}
                    onClick={() => {
                      setStep("month");
                    }}
                  >
                    {formatDate(currentMonth, "MMMM")}
                  </button>
                  <button
                    data-auto={`year-${dataAuto}`}
                    onClick={() => {
                      setStep("year");
                    }}
                  >
                    {formatDate(currentMonth, "yyyy")}
                  </button>
                </p>

                <button
                  data-auto={`month-right-${dataAuto}`}
                  className="text-lg w-7 md:w-10 h-7 md:h-10 hover:text-base-300 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                  onClick={(event) => {
                    event.preventDefault();
                    handleMonthChange(addMonths(currentMonth, 1));
                  }}
                >
                  {">"}
                </button>
              </div>
            )}
          </div>
          <>
            {step === "month" && (
              <>
                <h3
                  data-auto={`month-container-${dataAuto}`}
                  className={`text-center mb-2 text-primary text-lg font-medium`}
                >
                  Select Month
                </h3>

                <div className={`grid grid-cols-3 gap-1`}>
                  <button
                    data-auto={`january-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 0));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    January
                  </button>
                  <button
                    data-auto={`february-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 1));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    February
                  </button>
                  <button
                    data-auto={`march-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 2));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    March
                  </button>
                  <button
                    data-auto={`april-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 3));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    April
                  </button>
                  <button
                    data-auto={`may-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 4));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    May
                  </button>
                  <button
                    data-auto={`june-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 5));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    June
                  </button>
                  <button
                    data-auto={`july-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 6));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    July
                  </button>
                  <button
                    data-auto={`august-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 7));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    August
                  </button>
                  <button
                    data-auto={`september-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 8));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    September
                  </button>
                  <button
                    data-auto={`october-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 9));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    October
                  </button>
                  <button
                    data-auto={`november-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 10));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    November
                  </button>
                  <button
                    data-auto={`december-${dataAuto}`}
                    onClick={() => {
                      handleMonthChange(selectMonth(currentMonth, 11));
                    }}
                    className={`btn btn-primary btn-outline text-xs w-18`}
                  >
                    December
                  </button>
                </div>
              </>
            )}

            {step === "day" && (
              <>{isDatePickerActive && !disabled && renderCalendar()}</>
            )}

            {step === "year" && (
              <>
                {
                  <div data-cy={"year_container_custom_date_picker"}>
                    <div
                      data-cy={"year_buttons_custom_date_picker"}
                      className="mb-4 flex justify-between items-center"
                    >
                      <button
                        data-auto={`year-left-${dataAuto}`}
                        className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                        onClick={(event) => {
                          event.preventDefault();
                          handleChangeYear(startYear - 12, startYear - 1);
                        }}
                      >
                        {"<"}
                      </button>

                      <p
                        data-auto={`current-year-${dataAuto}`}
                        className="text-lg font-bold flex items-center gap-2"
                      >
                        {formatDate(currentMonth, "yyyy")}
                      </p>

                      <button
                        data-auto={`year-right-${dataAuto}`}
                        className="text-lg w-10 h-10 bg-base-300 rounded-full text-accent hover:bg-primary font-bold cursor-pointer"
                        onClick={(event) => {
                          event.preventDefault();
                          handleChangeYear(startYear + 12, endYear + 12);
                        }}
                      >
                        {">"}
                      </button>
                    </div>
                    <div
                      data-cy={"all_years_custom_date_picker"}
                      className={`grid grid-cols-3 gap-1`}
                    >
                      {allYear.map((year, i) => (
                        <button
                          data-auto={`year-${year}-${dataAuto}`}
                          key={i}
                          disabled={
                            (isNaN(from) &&
                              year < moment(from, "DD-MM-YYYY").year()) ||
                            (isNaN(to) &&
                              year > moment(to, "DD-MM-YYYY").year())
                          }
                          onClick={() => {
                            if (
                              !(
                                isNaN(from) &&
                                year < moment(from, "DD-MM-YYYY").year()
                              ) ||
                              !(
                                isNaN(from) &&
                                year > moment(to, "DD-MM-YYYY").year()
                              )
                            ) {
                              {
                                console.log({
                                  allYear: setYear(currentMonth, year),
                                  currentMonth,
                                });
                              }
                              handleMonthChange(setYear(currentMonth, year));
                            }
                          }}
                          className={`btn btn-primary ${
                            parseInt(formatDate(currentMonth, "yyyy")) === year
                              ? ""
                              : "btn-outline"
                          }  text-xs w-18`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                }
              </>
            )}
          </>
        </div>
      )}
    </OutsideClickHandler>
  );
};

CustomDatePickerV2.propTypes = {
  format: PropTypes.string,
  defaultDate: PropTypes.instanceOf(Date),
};

export default CustomDatePickerV2;
