import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { MdClearAll, MdDeleteSweep, MdFileDownloadDone } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getClientJobs } from "../../../Apis/auth";
import CustomDataSet from "../../../components/CustomDataSet";
import CustomLoading from "../../../components/CustomLoading";
import CustomPopup from "../../../components/CustomPopup";
import CustomTab from "../../../components/CustomTab";
import Headings from "../../../components/Headings/Headings";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import ViewJob from "./ViewJob";
import { FaStar } from "react-icons/fa";
import { decryptID, encryptID } from "../../../utils/encryptAndDecryptID";
import { CgSandClock } from "react-icons/cg";
import StatusCapsule from "../../../components/Table/StatusCapsule";

export default function MyJob() {
  const navigate = useNavigate();
  // SEARCH PARAMS
  const [searchParams] = useSearchParams();
  const id = decryptID(searchParams.get("id") || "");

  // LOADINGS
  const [isPendingDelete, setIsPendingDelete] = useState(true);

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,

    search: "",
    status: "",

    id: id,
  });

  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
      setIsUpdated(Math.random());
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  // IF ANY DATA UPDATED
  const [isUpdated, setIsUpdated] = useState();

  const [job, setJob] = useState({});

  // HANDLE VIEW
  const handleView = (data) => {
    setJob(data);
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewAppliedJob",
      title: "Applied Job Details",
    });
  };

  // HANDLE RATE
  const handleRate = (data) => {
    // deleteFunc(id?.id);
    navigate(
      `/my-account/ratting/${encryptID(data.garage_id)}/${encryptID(data.id)}`
    );
  };

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "rate",
      handler: handleRate,
      Icon: FaStar,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      permissions: true,
      disabledOn: [
        {
          attributeName: "status",
          value: "pending",
        },

        {
          attributeName: "status",
          value: "rejected_by_client",
        },
        {
          attributeName: "status",
          value: "active",
        },
      ],
    },

    {
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-green-500",
      backgroundColorClass: "bg-green-900",
      disabledOn: [],
      permissions: true,
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      name: "Car Reg",
      attribute_name: "car_reg",
      minWidth: 70,
      show: true,
      isMainField: true,
    },

    {
      name: "Job Start Date",
      attribute_name: "job_start_date",
      minWidth: 10,
      show: true,
    },
    {
      name: "Job Start Time",
      attribute_name: "job_start_time",
      minWidth: 10,
      show: true,
    },
    {
      name: "Status",
      align: "left",
      attribute_name: "format_status",
      minWidth: 10,
      show: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [tabs, setTabs] = useState([
    { id: "all", title: "All", Icon: MdClearAll },
    { id: "completed", title: "Completed", Icon: MdFileDownloadDone },
    { id: "pending", title: "Pending", Icon: CgSandClock },
  ]);

  useEffect(() => {
    setFilters({ ...filters, status: activeTab === "all" ? "" : activeTab });
  }, [activeTab]);

  const { isPending, error, data, isError } = useQuery({
    queryKey: ["myJobs", filters],
    queryFn: () => getClientJobs(filters),
  });
  // POPUP ERROR MESSAGE
  useEffect(() => {
    if (isError) {
      handleApiError(error);
    }
  }, [isError]);
  // DELETE API
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  // const deleteFunc = (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     customClass: {
  //       title: "text-primary",
  //       container: "",
  //       popup: "bg-base-300 shadow-xl rounded-xl border border-primary",
  //       icon: "text-red-500",
  //       cancelButton: "bg-green-500",
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setIsDeleteLoading(true);
  //       deleteClientBooking(id)
  //         .then((res) => {
  //           setIsUpdated(Math.random());
  //           setSelectedIds([]);
  //           refetch();
  //           Swal.fire({
  //             title: "Deleted!",
  //             text: "Booking has been deleted.",
  //             icon: "success",
  //           });
  //           setIsDeleteLoading(false);
  //         })
  //         .catch((error) => {
  //           setIsDeleteLoading(false);
  //           handleApiError(error, "#00121");
  //         });
  //     }
  //   });
  // };
  /***********************************************************************
   *                    UI RENDERING
   ***********************************************************************/

  return (
    <div className="h-full my-10 " data-auto={"container-myJob"}>
      <div className="relative h-full" data-auto={"sub-container-myJob"}>
        {/* POPUP  */}
        <CustomPopup
          popupClasses={`w-full sm:w-[70vw] md:w-[70vw] lg:w-[50vw]`}
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          Component={
            popupOption?.type === "viewAppliedJob" && (
              <ViewJob
                job={job}
                handleClosePopup={(e) => {
                  setPopupOption({ ...popupOption, open: false, type: "" });
                }}
                popupOption={popupOption}
                setPopupOption={setPopupOption}
              />
            )
          }
        />

        {/* HEADING AND TABLE */}
        <div>
          {/* ======= HEADING AND FILTERING AREA =========  */}
          <div
            id="header"
            className="flex flex-col md:flex-row justify-between items-center relative gap-5"
          >
            <div
              id="header-content"
              className="flex flex-col justify-center items-center gap-2 w-full text-left"
            >
              <div id="header-title" className={`flex items-center gap-5`}>
                <Headings level={1}>
                  {activeTab === "all"
                    ? "All Applied Jobs"
                    : activeTab === "completed"
                    ? "Completed Applied Jobs"
                    : "Pending Applied Jobs"}
                </Headings>
              </div>
              <h3 data-auto={"header-total-myJob"}>
                Total {data?.total}{" "}
                {data?.total > 1 ? "Applied Jobs" : "Applied Job"} Found
              </h3>
              {/* ======= TAB AREA =========  */}
              <div className={`flex justify-center`}>
                <CustomTab
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  gridCol="grid-cols-3"
                  filters={filters}
                  setFilters={setFilters}
                  dataAuto="myJob"
                />
              </div>
            </div>
          </div>

          {/* =========== TABLE AREA ============  */}
          <div id="table" className="pt-5 relative">
            {/* DATASET AND FILTERS */}
            <div id="dataset" className={`flex justify-between items-center`}>
              <CustomDataSet cols={cols} setCols={setCols} dataAuto="myJob" />
              {/* <CustomFilter
              totalData={getEmployeesQuery?.data?.data?.length}
              isLoading={isCombineDataLoading}
              onApplyChange={(e) => {
                console.log({ e });
                setFilters((prev) => ({
                  ...prev,
                  ...e,
                }));
              }}
              options={filterOptions}
              /> */}
            </div>

            <Table
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              itemsPerPage={filters?.perPage}
              totalItems={data?.total}
              setPageNo={(data) => setFilters({ ...filters, page: data })}
              // setPerPage={setPerPage}
              perPage={filters?.perPage}
              isLoading={isPending}
              rows={data?.data?.map((d) => ({
                ...d,
                id: d?.id,
                car_reg: d?.car_registration_no,
                job_start_time: moment(d?.job_start_time, "HH:mm").format(
                  "hh:mm A"
                ),
                format_status: <StatusCapsule text={d?.status} />,
              }))}
              actions={actions}
              cols={cols}
              dataAuto="myJob"
              getFullDataToActionHandler={true}
            />

            {/* PAGINATION  */}
            {data?.total !== 0 && (
              <div
                data-auto={"pagination-myJob"}
                className="flex-col flex justify-center bg-base-300 items-center py-5"
              >
                <Pagination
                  forcePage={filters?.page}
                  itemsPerPage={filters?.perPage}
                  totalItems={data?.total}
                  onChangePage={(page) => {
                    setFilters({ ...filters, page: page });
                  }}
                  dataAuto="myJob"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
