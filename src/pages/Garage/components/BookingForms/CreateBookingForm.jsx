// ==================================
// #00142
// ===================================

import React, { useEffect, useState } from "react";

import CustomLoading from "../../../../components/CustomLoading";

import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createBookingWIthPackage,
  postBookingDetails,
  postPreBookingDetails,
} from "../../../../Apis/homepageapi";
import CustomMultiStepper from "../../../../components/CustomMultiStepper";
import CustomPopup from "../../../../components/CustomPopup";
import GoBackButtonSm from "../../../../components/GoBackButtonSm";
import Headings from "../../../../components/Headings/Headings";
import { useAuth } from "../../../../context/AuthContextV2";
import { useData } from "../../../../context/DataContext";
import { handleApiError } from "../../../../utils/apiErrorHandler";
import Login from "../../../Auth/Login";
import JobDetailsForm from "../Steps/JobDetailsForm";
import ReviewForm from "../Steps/ReviewForm";
import ServiceDetailsForm from "../Steps/ServiceDetailsForm";
import GarageJobDetailsForm from "../Steps/GarageJobDetailsForm";
import ReviewFormForBooking from "../Steps/ReviewFormForBooking";

export default function CreateBookingForm({
  garageData,
  isLoadingCoupon,
  coupons,
  dataAuto,
}) {
  const navigate = useNavigate();
  const { user, isAuthenticated, handleOpenLoginPopup } = useAuth();
  const { loading, homeSearchData, subServices } = useData();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    garage_id: garageData?.garage?.id,
    booking_garage_package_ids: [],
    // STEP 1
    service: [],
    booking_sub_service_ids:
      homeSearchData?.sub_services?.length > 0
        ? subServices?.filter(
            (ss) =>
              garageData?.garage?.sub_services?.some(
                (gs) => gs?.id === ss?.id
              ) && homeSearchData?.sub_services?.some((gs) => gs === ss?.id)
          )
        : [],
    car_registration_no: "",
    automobile_make_id: "",
    automobile_model_id: "",
    transmission: "manual",

    // STEP 2
    job_start_date: moment(new Date()).format("YYYY-MM-DD"),
    job_start_time: "",
    job_end_date: moment().add(1, "month").format("YYYY-MM-DD"),
    additional_information: "",
    images: [],
    videos: [],
    file_links: [],

    coupon_code: "",
    car_registration_year: "",
    fuel: "Fuel",
  });
  const [appliedCouponDetails, setAppliedCouponDetails] = useState({});

  // CREATE FUNCTION
  const mutation = useMutation({
    mutationKey: "createJob",
    mutationFn: createBookingWIthPackage,
    onSuccess: () => {
      Swal.fire({
        title: "Success?",
        text: "Booked successfully!",
        icon: "success",
        confirmButtonText: "Ok",
        customClass: {
          title: "text-primary",
          container: "",
          popup: "bg-base-300 shadow-xl rounded-xl border border-primary",
          icon: "text-red-500",
          cancelButton: "bg-green-500",
        },
      }).then(() => {
        navigate("/my-account/my-bookings");
      });
    },
  });

  const createFunction = async () => {
    const updatedDate = {
      ...formData,
      job_start_date: moment(formData.job_start_date).format("YYYY-MM-DD"),
      // job_start_time: moment(formData.job_start_time, "HH:mm").format("HH:mm"),
      job_end_date: moment(formData.job_end_date).format("YYYY-MM-DD"),
    };

    try {
      mutation.mutate(updatedDate);
    } catch (error) {
      handleApiError(mutation.error);
    }
  };

  // HANDLE SUBMIT FORM
  const handleOnSubmit = () => {
    if (user || isAuthenticated) {
      createFunction();
    } else {
      // OPEN THE LOGIN POPUP
      handleOpenLoginPopup({ garageRegistration: false });
    }
  };

  if (loading) {
    return <CustomLoading />;
  } else {
    return (
      <div
        data-auto={`container-${dataAuto}`}
        className="py-5 px-5 md:px-5 flex justify-center items-center bg-base-300 h-full"
      >
        <div
          data-auto={`sub-container-${dataAuto}`}
          className={`w-full border max-w-[600px] p-5 shadow-lg rounded-xl h-auto relative`}
        >
          {/* TITLE  */}
          <div
            data-auto={`title-${dataAuto}`}
            className={`flex justify-center w-full`}
          >
            <Headings
              level={2}
              className={` text-center mb-2  w-[90%] flex flex-col`}
            >
              Booking With{" "}
              <span className={`text-primary`}>{garageData?.garage?.name}</span>
            </Headings>
          </div>

          {/* STEPPER  */}
          <div
            data-auto={`stepper-${dataAuto}`}
            className="w-full flex justify-center items-center mb-5"
          >
            <CustomMultiStepper
              steps={[
                {
                  serial: 1,
                  id: 1,
                  title: "Service Details",
                },
                {
                  serial: 2,
                  id: 2,
                  title: "Job Details",
                },
                {
                  serial: 3,
                  id: 3,
                  title: "Review",
                },
              ]}
              currentStep={step}
            />
          </div>

          {step === 1 && (
            <ServiceDetailsForm
              garageData={garageData}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <GarageJobDetailsForm
              appliedCouponDetails={appliedCouponDetails}
              setAppliedCouponDetails={setAppliedCouponDetails}
              isLoadingCoupon={isLoadingCoupon}
              coupons={coupons}
              garageData={garageData}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 3 && (
            <ReviewFormForBooking
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
              handleOnSubmit={handleOnSubmit}
              isLoading={mutation.isPending}
            />
          )}
        </div>
      </div>
    );
  }
}
