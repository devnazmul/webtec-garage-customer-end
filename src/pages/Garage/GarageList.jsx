import { useEffect, useState } from "react";
import { getGaragesV2 } from "../../Apis/garage";
import CustomLoading from "../../components/CustomLoading";
import FilterSideBar from "../../components/FilterSideBar/FilterSideBar";
import { useData } from "../../context/DataContext";
import { handleApiError } from "../../utils/apiErrorHandler";
import ActionBar from "./components/ActionBar";
import CreateAndUpdateJobForm from "./components/CreateAndUpdateJobForm";
import GarageListComponent from "./components/GarageListComponent";
import SelectedFilters from "./components/Filters/SelectedFilters";
import { useGeoLocationData } from "../../context/GeoLocationDataContext";

export default function GarageList() {
  const { defaultLocationProps, isGeoLocationLoading } = useGeoLocationData();

  const {
    loading,
    homeSearchData,
    setHomeSearchData,
    totalGarageFound,
    setTotalGarageFound,
    setGarageList,
  } = useData();
  const [tab, setTab] = useState("garages"); // ACCEPT "garages" OR "job"
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  // GET DATA
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      const filterData = localStorage.getItem("search_data")
        ? JSON.parse(localStorage.getItem("search_data"))
        : homeSearchData;

      setIsLoading(true);
      if (filterData) {
        getGaragesV2({
          perPage: filterData?.perPage,
          search_key: filterData?.search_key,
          country_code: filterData?.country_code,
          address: filterData?.address,
          city: filterData?.city,
          service_ids: filterData?.services,
          sub_service_ids: filterData?.sub_services,
          make_ids: filterData?.makes,
          model_ids: filterData?.models,

          start_lat:
            filterData?.start_lat || defaultLocationProps?.rangeData?.minLat,
          end_lat:
            filterData?.end_lat || defaultLocationProps?.rangeData?.maxLat,
          start_long:
            filterData?.start_long || defaultLocationProps?.rangeData?.minLon,
          end_long:
            filterData?.end_long || defaultLocationProps?.rangeData?.maxLon,

          wifi_available: filterData?.wifi_available,
          is_mobile_garage: filterData?.is_mobile_garage,
          page: filterData?.page,
          date_time: filterData?.date_time,
        })
          .then((res) => {
            if (res?.data?.data?.length === 0) {
              setTotalGarageFound(0);
              setGarageList([]);
              setTab("garages");
            } else {
              setTotalGarageFound(res?.data?.total);
              setGarageList(res?.data?.data);
              setTab("garages");
            }
            setIsLoading(false);
          })
          .catch((error) => {
            handleApiError(error, "");
            setIsLoading(false);
          });
      }
    }, 200);
  }, [homeSearchData]);

  if (loading) {
    return <CustomLoading />;
  } else {
    return (
      <div data-cy="dashboard" className={`w-full`}>
        <div
          className={`relative h-full md:min-h-[calc(100vh-130px)] flex items-start `}
        >
          <div
            className={` fixed md:sticky bg-base-300 left-0 top-20 bottom-0 z-30 md:z-20  ${
              isFilterOpen ? "w-full sm:w-[300px] md:w-[400px]" : "w-0"
            }`}
          >
            {/* FILTERS  */}
            <div
              className={`scrollbar-none min-h-[calc(100vh-245px)] max-h-[calc(100vh-245px)] md:min-h-[calc(100vh-305px)] md:max-h-[calc(100vh-305px)] overflow-y-auto overflow-x-hidden`}
            >
              <FilterSideBar
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
              />
            </div>
          </div>

          {/* GARAGES OR JOB FORM  */}
          <div className={`relative w-full duration-100 `}>
            <div
              className={`sticky z-20 bg-base-300 top-0 right-0 w-full px-5 pt-5 pb-2 shadow-md`}
            >
              {/* ACTIONS  */}
              <ActionBar
                tab={tab}
                setTab={setTab}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
              />

              {tab === "garages" && (
                <>
                  {/* SEARCH BAR  */}
                  <div className={`flex items-center justify-between`}>
                    <div
                      data-auto={`search-container-home`}
                      className={`input flex input-primary py-1 pr-1 pl-5 border outline-none focus-visible:outline-none focus-within:outline-none bg-base-300 w-full h-[2.58rem] rounded-lg text-primary`}
                    >
                      <input
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        data-auto={`searchInput-home`}
                        type="text"
                        placeholder="Search Here..."
                        className={`w-full bg-transparent outline-none focus-visible:outline-none focus-within:outline-none focus:outline-none`}
                      />
                      <button
                        onClick={() => {
                          setHomeSearchData((prev) => ({
                            ...prev,
                            search_key: searchQuery,
                          }));
                        }}
                        data-auto={`searchButton-home`}
                        className={`btn  btn-sm  h-full btn-primary w-24 sm:w-24`}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* SELECTED FILTERS  */}
                  <div>
                    <SelectedFilters />
                  </div>

                  {/* TOTAL GARAGE NUMBER  */}
                  <p
                    data-auto={`totalRestaurant-home`}
                    className={`font-bold pt-2`}
                  >
                    {totalGarageFound}{" "}
                    {totalGarageFound > 1 ? "Garages are" : "Garage is"} found
                  </p>
                </>
              )}
            </div>

            {/* MAIN SECTION  */}
            <div
              className={`${
                tab === "garages" ? "pt-5 px-5 " : ""
              }  pb-5 scrollbar  overflow-y-auto`}
            >
              {isLoading ? (
                <CustomLoading h="h-[300px]" />
              ) : (
                <div>
                  {tab === "garages" && <GarageListComponent setTab={setTab} />}
                  {tab === "job" && <CreateAndUpdateJobForm />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
