import { useState } from "react";
import CustomTab from "../../components/CustomTab";
import Customer from "./components/Registration/Customer/Customer";
import GarageOwner from "./components/Registration/GarageOwner/GarageOwner";
import { useAuth } from "../../context/AuthContextV2";
import { BiSolidCarGarage } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";

export default function Register() {
  const { authPopupOptions } = useAuth();
  const [activeTab, setActiveTab] = useState("customer");
  const registrationTabs = [
    { id: "customer", title: "As Customer", Icon: CgProfile },
    { id: "garage_owner", title: "As Garage owner", Icon: BiSolidCarGarage },
  ];

  console.warn({ form: authPopupOptions?.forms });
  return (
    <div className={`mt-5 h-full px-2 sm:px-5 pb-20`}>
      {/* TABS  */}
      {authPopupOptions?.forms?.customerRegistration &&
        authPopupOptions?.forms?.garageRegistration && (
          <div className={`w-full flex justify-center items-center mb-5`}>
            <CustomTab
              gridCol={`grid-cols-2`}
              tabs={registrationTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              dataAuto={activeTab}
            />
          </div>
        )}

      <>
        {!!(activeTab === "customer") &&
          authPopupOptions?.forms?.customerRegistration && <Customer />}
        {!!(activeTab === "garage_owner") &&
          authPopupOptions?.forms?.garageRegistration && <GarageOwner />}
      </>
    </div>
  );
}
