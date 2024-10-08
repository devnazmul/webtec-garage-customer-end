// =====================================
// #00155
// =====================================

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonLoading from "../../components/ButtonLoading";
import GoBackButton from "../../components/GoBackButton";
import CustomPasswordField from "../../components/InputFields/CustomPasswordField";
import { resetPassword } from "../../Apis/auth";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();

  const location = useLocation();
  const locSearch = new URLSearchParams(location.search);
  const token = locSearch.get("token");

  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // CHANGE FIELD CONTENT
  const onChangeFormData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // Validate password
    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters long and contain at least 1 number, 1 lowercase letter, and 1 uppercase letter";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = `Password didn't match`;
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      resetPassword({ token, data: formData })
        .then((res) => {
          setIsSent(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response && error.response.status === 422) {
            const tempErrors = {};
            const responseData = error.response.data;
            if (responseData && responseData.errors) {
              const errors = responseData.errors;
              // Iterate through error keys and map them
              Object.keys(errors).forEach((key) => {
                const errorMessage = errors[key][0]; // Assuming there's only one error message per field
                tempErrors[key] = errors[key][0];
              });
            } else {
              console.log(
                "Validation error, but no specific error messages provided."
              );
            }

            setErrors(tempErrors);
          }
          handleApiError(error, "#00121");
        });
    } else {
    }
  };

  return (
    <div className="w-full h-screen flex bg-base-300 justify-center flex-col-reverse md:flex-row items-center relative">
      <div className="w-full md:hidden absolute top-4 right-5 flex justify-end mt-2 z-50">
        <GoBackButton
          bgColorClass="bg-base-300"
          textColorClass="text-primary"
        />
      </div>
      <div className="w-full md:w-2/5 h-2/3 md:h-full flex flex-col justify-center items-center md:gap-5 bg-base-300 ">
        <div className="w-full bg-base-300 flex justify-center items-center p-5">
          {isSent ? (
            <div className="">
              {/* <MdOutlineMarkEmailRead className="text-7xl text-green-500" /> */}
              <h1 className="text-2xl font-semibold text-center mb-5">
                Successfully Changed Password.
              </h1>
              <div className="w-full flex justify-center gap-2">
                <span className="loading loading-spinner loading-xs text-primary"></span>
                <span className="text-primary">
                  Redirecting to the home page
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 bg-base-300 shadow-xl rounded-xl w-full p-5">
              <label
                htmlFor=""
                className="text-left  font-semibold text-2xl w-full"
              >
                Enter Your Password
              </label>
              <CustomPasswordField
                required={true}
                label={"Password"}
                id="password"
                onChange={onChangeFormData}
                value={formData?.password}
                placeholder={`Password`}
                name={`password`}
                error={errors?.password}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
                dataAuto={`password-change`}
              />
              <CustomPasswordField
                required={true}
                label={"Enter Password Confirmation"}
                id="password_confirmation"
                onChange={onChangeFormData}
                value={formData?.password_confirmation}
                placeholder={`Enter Password Confirmation`}
                name={`password_confirmation`}
                error={errors?.password_confirmation}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
                dataAuto={`password-confirm-change`}
              />
              <div className="flex gap-5 items-center justify-between w-full">
                <button
                  dataAuto={`login-change`}
                  disabled={isLoading}
                  onClick={() => {
                    navigate("/");
                  }}
                  className="btn w-full hidden md:block md:w-2/5 btn-outline btn-primary text-base-100"
                >
                  Back to home
                </button>
                <button
                  dataAuto={`change-pass-change`}
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="btn w-full md:w-2/5 btn-primary text-base-100"
                >
                  {isLoading ? <ButtonLoading /> : "Change Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full z-40 md:w-3/5 h-1/3 md:h-full px-0 py-5 md:py-0 md:px-10 lg:px-32 bg-primary flex justify-center items-center rounded-b-xl md:rounded-bl-[150px]">
        <img
          className="h-full w-full"
          src={
            isSent
              ? "/assets/change_password_done.svg"
              : "/assets/resetpassword.svg"
          }
          alt=""
        />
      </div>
    </div>
  );
}
