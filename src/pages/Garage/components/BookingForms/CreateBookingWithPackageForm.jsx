// ==================================
// #00142
// ===================================

import React, { useEffect, useState } from "react";

import CustomLoading from "../../../../components/CustomLoading";

import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createBookingWIthPackage } from "../../../../Apis/homepageapi";
import CustomMultiStepper from "../../../../components/CustomMultiStepper";
import Headings from "../../../../components/Headings/Headings";
import { useAuth } from "../../../../context/AuthContextV2";
import { useData } from "../../../../context/DataContext";
import { handleApiError } from "../../../../utils/apiErrorHandler";
import JobDetailsForm from "../Steps/JobDetailsForm";
import ReviewForm from "../Steps/ReviewForm";
import SelectPackagePackageForm from "../Steps/SelectPackagePackageForm";

export default function CreateBookingWithPackageForm({
  garageData,
  isLoadingCoupon,
  coupons,
}) {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuthPopupOptions, handleOpenLoginPopup } =
    useAuth();
  const { loading } = useData();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    garage_id: garageData?.garage?.id,

    // STEP 1
    booking_garage_package_ids: [],

    // STEP 2
    service: [],
    booking_sub_service_ids: [],
    car_registration_no: "",
    automobile_make_id: "",
    automobile_model_id: "",
    transmission: "manual",

    // STEP 3
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

    price: 0, // IGNORE THIS
  });
  const [appliedCouponDetails, setAppliedCouponDetails] = useState({});

  // CREATE FUNCTION
  const mutation = useMutation({
    mutationKey: "createJob",
    mutationFn: createBookingWIthPackage,
    onSuccess: () => {
      Swal.fire({
        title: "Success?",
        text: "A new job created successfully!",
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
      console.error("hii");
      // OPEN THE LOGIN POPUP
      handleOpenLoginPopup({
        garageRegistration: false,
      });
    }
  };

  useEffect(() => {
    console.log({ formData });
  }, [formData]);
  if (loading) {
    return <CustomLoading />;
  } else {
    return (
      <div
        data-auto={`container-packageForm`}
        className="py-5 px-5 md:px-5 flex justify-center items-center bg-base-300 h-full"
      >
        <div
          data-auto={`sub-container-packageForm`}
          className={`w-full border max-w-[600px] p-5 shadow-lg rounded-xl h-auto relative`}
        >
          {/* TITLE  */}
          <div
            data-auto={`title-packageForm`}
            className={`flex justify-center w-full`}
          >
            <Headings
              level={2}
              className={` text-center mb-2  w-[90%] flex flex-col`}
            >
              Booking A Package From{" "}
              <span className={`text-primary`}>{garageData?.garage?.name}</span>
            </Headings>
          </div>
          {/* STEPPER  */}
          <div
            data-auto={`stepper-packageForm`}
            className="w-full flex justify-center items-center mb-5"
          >
            <CustomMultiStepper
              steps={[
                {
                  serial: 1,
                  id: 1,
                  title: "Package",
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
            <SelectPackagePackageForm
              garageData={garageData}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 2 && (
            <JobDetailsForm
              appliedCouponDetails={appliedCouponDetails}
              setAppliedCouponDetails={setAppliedCouponDetails}
              isLoadingCoupon={isLoadingCoupon}
              coupons={coupons}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
              garageData={garageData}
            />
          )}
          {step === 3 && (
            <ReviewForm
              appliedCouponDetails={appliedCouponDetails}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
              handleOnSubmit={handleOnSubmit}
              isLoading={mutation.isPending}
              garageData={garageData}
            />
          )}
        </div>
      </div>
    );
  }
}
