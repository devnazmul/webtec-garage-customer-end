import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomLoading from "../../components/CustomLoading";
import CustomToaster from "../../components/CustomToaster";
import CustomFieldV2 from "../../components/InputFields/CustomFieldV2";
import CustomField from "../../components/InputFields/CustomField";
import CustomNumberField from "../../components/InputFields/CustomNumberField";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import Swal from "sweetalert2";
import { getUser, updateUser } from "../../Apis/auth";
import ButtonLoading from "../../components/ButtonLoading";
import { ValidationErrorHandler } from "../../utils/ValidationErrorHandler";
import { useAuth } from "../../context/AuthContextV2";
import { getFullImageLink } from "../../utils/getFullImageLink";

const Profile = () => {
  const { user } = useAuth();
  const [addressData2, setAddressData2] = useState({});
  const [signUpDetails, setSignUpDetails] = useState({
    first_Name: "",
    last_Name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    country: "",
    city: "",
    postcode: "",
  });
  useEffect(() => {
    console.log({ signUpDetails });
  }, [signUpDetails]);
  const [loading, setLoading] = useState(true);
  const getUserDetails = () => {
    setLoading(true);
    getUser()
      .then((res) => {
        console.log({ res });
        setSignUpDetails(res);
        setAddressData2({
          address_line_2: res.address_line_2,
        });
        setLoading(false);
      })
      .catch((error) => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00203 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  // CHECK PHONE
  const [userPhoneValidation, setUserPhoneValidation] = useState("");
  const handleCheckPhone = (e) => {
    if (signUpDetails.phone) {
      if (signUpDetails?.phone.toString().split("").length !== 11) {
        setUserPhoneValidation("Phone must be 11 digit");
      } else {
        setUserPhoneValidation("");
      }
    } else {
      setUserPhoneValidation("");
    }
  };

  //   VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    setErrors({});
    const newErrors = {};

    // Validate first name
    if (!signUpDetails.first_Name || signUpDetails.first_Name.trim() === "") {
      newErrors.first_Name = "First name is required";
    }
    if (
      signUpDetails.first_Name &&
      !/^[A-Za-z\s]+$/.test(signUpDetails.first_Name)
    ) {
      newErrors.first_Name = "Only Capital and lowercase letters are allowed";
    }

    // Validate last name
    if (!signUpDetails.last_Name || signUpDetails.last_Name.trim() === "") {
      newErrors.last_Name = "Last name is required";
    }
    if (
      signUpDetails.last_Name &&
      !/^[A-Za-z\s]+$/.test(signUpDetails.last_Name)
    ) {
      newErrors.last_Name = "Only Capital and lowercase letters are allowed";
    }

    // Validate email
    if (signUpDetails.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          signUpDetails.email.trim()
        )
      ) {
        newErrors.email = "Invalid email";
      }
    } else {
      newErrors.email = "Email is required";
    }

    // VALIDATE PHONE
    if (signUpDetails.phone) {
      if (signUpDetails?.phone.toString().split("").length !== 11) {
        newErrors.phone = "Phone must be 11 digit";
      }
    } else {
      newErrors.phone = "Phone is required";
    }

    // VALIDATE ADDRESS
    if (
      !signUpDetails.address_line_1 ||
      signUpDetails.address_line_1.trim() === ""
    ) {
      newErrors.address_line_1 = "Address is required";
    }

    // VALIDATE CITY
    if (!signUpDetails.city || signUpDetails.city.trim() === "") {
      newErrors.city = "City is required";
    }

    // VALIDATE COUNTRY
    if (!signUpDetails.country || signUpDetails.country.trim() === "") {
      newErrors.country = "Country is required";
    }

    // VALIDATE POST CODE
    if (!signUpDetails.postcode || signUpDetails.postcode.trim() === "") {
      newErrors.postcode = "Postcode is required";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    ValidationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      updateUser({
        ...signUpDetails,
        address_line_2: addressData2?.address_line_2,
      })
        .then((res) => {
          setIsSubmitting(false);
          Swal.fire({
            title: "Success.",
            icon: "success",
            text: "Your profile has been updated successfully.",
            timer: 2000,
          });
          getUserDetails();
        })
        .catch((error) => {
          console.log({ error });
          setIsSubmitting(false);
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={`ID: #00203 - ${error?.response?.data?.message}`}
              errors={error?.response?.data?.errors}
            />
          ));
        });
    }
  };

  // PROFILE PIC UPLOAD
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div data-auto={`container-profile`} className={`py-10`}>
      {loading ? (
        <CustomLoading h="h-[300px]" />
      ) : (
        <div data-auto={`profile-container`} className="pb-5">
          <h1
            data-auto={`header-profile`}
            className={`text-2xl font-semibold text-center text-primary pb-5`}
          >
            Profile
          </h1>

          <div
            data-auto={`form-container`}
            className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-2 sm:gap-5`}
          >
            <div>
              {/* FIRST NAME */}
              <CustomFieldV2
                defaultValue={signUpDetails?.first_Name}
                disable={false}
                error={errors?.first_Name}
                fieldClassName={"w-full"}
                id={"first_Name"}
                label={"First Name"}
                name={"first_Name"}
                onChange={(e) =>
                  setSignUpDetails({
                    ...signUpDetails,
                    first_Name: e.target.value,
                  })
                }
                placeholder={"First Name"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
                maxLength={25}
                pattern={/^[A-Za-z\s]+$/}
                patternErrorMsg="Only Capital and lowercase letters are allowed"
                dataAuto={"firstName-profile"}
              />
            </div>

            <div>
              {/* LAST NAME  */}
              <CustomFieldV2
                defaultValue={signUpDetails?.last_Name}
                disable={false}
                error={errors?.last_Name}
                fieldClassName={"w-full"}
                id={"last_Name"}
                label={"Last Name"}
                name={"last_Name"}
                onChange={(e) =>
                  setSignUpDetails({
                    ...signUpDetails,
                    last_Name: e.target.value,
                  })
                }
                placeholder={"Last Name"}
                type={"text"}
                wrapperClassName={"w-full"}
                required={true}
                maxLength={25}
                pattern={/^[A-Za-z\s]+$/}
                patternErrorMsg="Only Capital and lowercase letters are allowed"
                dataAuto={"lastName-profile"}
              />
            </div>

            {/* EMAIL  */}
            {/* <CustomField
              defaultValue={signUpDetails?.email}
              disable={false}
              error={errors?.email}
              fieldClassName={"w-full"}
              id={"email"}
              label={"Email"}
              name={"email"}
              onChange={(e) =>
                setSignUpDetails({
                  ...signUpDetails,
                  email: e.target.value,
                })
              }
              placeholder={"Email"}
              type={"email"}
              wrapperClassName={"w-full"}
              required={true}
            /> */}

            {/* PHONE */}
            <CustomNumberField
              id={"phone"}
              label={"Phone"}
              min={0}
              onBlur={handleCheckPhone}
              name={"phone"}
              onChange={(e) =>
                setSignUpDetails({
                  ...signUpDetails,
                  phone: e.target.value,
                })
              }
              value={signUpDetails?.phone}
              placeholder={"Phone"}
              error={errors?.phone || userPhoneValidation}
              required={true}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
              maxLength={11}
              dataAuto={"phone-profile"}
            />

            {/* ADDRESS LINE 1 */}
            <div data-auto={`address-line-1-profile`} className="w-full">
              {/* LABEL */}
              <label
                data-auto={`label-address-line-1-profile`}
                htmlFor="address_line_1"
                className="label"
              >
                <span className="label-text text-md font-bold">
                  Address Line 1{" "}
                  <span className="text-error font-bold text-md">*</span>
                </span>
              </label>

              {/* FIELD  */}
              <CustomAutoComplete
                className={`input input-bordered rounded-md w-full`}
                placeholder="Address Line 1"
                type="text"
                name="address_line_1"
                onChange={(e) => {
                  setSignUpDetails({
                    ...signUpDetails,
                    address_line_1: e.target.value,
                  });
                }}
                formData={signUpDetails}
                setFormData={setSignUpDetails}
                defaultValue={signUpDetails?.address_line_1}
                dataAuto={"address-profile"}
              />

              {/* VALIDATION MESSAGE  */}
              {errors?.address_line_1 && (
                <label
                  data-auto={`error-address-line-1-profile`}
                  className="label h-7"
                >
                  <span className="label-text-alt text-error">
                    {errors?.address_line_1}
                  </span>
                </label>
              )}
            </div>

            {/* ADDRESS LINE 2 */}
            <div data-auto={`address-line-2-profile`} className="w-full">
              {/* LABEL */}
              <label
                data-auto={`label-address-line-2-profile`}
                htmlFor="address_line_2"
                className="label"
              >
                <span className="label-text text-md font-bold">
                  Address Line 2
                </span>
              </label>

              {/* FIELD  */}
              <CustomAutoComplete
                className={`input input-bordered rounded-md w-full`}
                placeholder="Address Line 2"
                type="text"
                name="address_line_2"
                onChange={(e) => {
                  setAddressData2({
                    ...addressData2,
                    address_line_2: e.target.value,
                  });
                }}
                formData={addressData2}
                setFormData={setAddressData2}
                defaultValue={addressData2?.address_line_2}
                dataAuto={"address2-profile"}
              />

              {/* VALIDATION MESSAGE  */}
              {errors?.address_line_2 && (
                <label
                  data-auto={`error-address-line-2-profile`}
                  className="label h-7"
                >
                  <span className="label-text-alt text-error">
                    {errors?.address_line_2}
                  </span>
                </label>
              )}
            </div>

            {/* CITY */}
            <CustomField
              id={"city"}
              label={"City"}
              required={true}
              type={"text"}
              name={"city"}
              onChange={(e) =>
                setSignUpDetails({
                  ...signUpDetails,
                  city: e.target.value,
                })
              }
              value={signUpDetails?.city}
              placeholder={"City"}
              error={errors?.city}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
              dataAuto={"city-profile"}
            />

            {/* COUNTRY */}
            <CustomField
              id={"country"}
              label={"Country"}
              required={true}
              type={"text"}
              name={"country"}
              onChange={(e) =>
                setSignUpDetails({
                  ...signUpDetails,
                  country: e.target.value,
                })
              }
              value={signUpDetails?.country}
              placeholder={"Country"}
              error={errors?.country}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
              dataAuto={"country-profile"}
            />

            {/* POSTCODE */}
            <CustomField
              id={"postcode"}
              label={"Postcode"}
              required={true}
              type={"text"}
              name={"postcode"}
              onChange={(e) =>
                setSignUpDetails({
                  ...signUpDetails,
                  postcode: e.target.value,
                })
              }
              value={signUpDetails?.postcode}
              placeholder={"Postcode"}
              error={errors?.postcode}
              wrapperClassName={`w-full`}
              fieldClassName={`w-full`}
              dataAuto={"postcode-profile"}
            />
          </div>

          <div
            data-auto={"update-profile"}
            className={`flex justify-center items-center w-full mt-10`}
          >
            <button
              data-auto={"update-button-profile"}
              disabled={isSubmitting}
              onClick={updateProfile}
              className={`btn btn-primary w-full md:w-52`}
            >
              {isSubmitting ? <ButtonLoading /> : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
