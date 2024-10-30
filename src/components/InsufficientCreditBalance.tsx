"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { useRouter } from "next/navigation";
  import React from "react";
  import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
  type Props = {
    triggerRef: React.RefObject<HTMLButtonElement>;
  };
  
  const InsufficientCreditBalance = ({ triggerRef }: Props) => {
    const router = useRouter();
    return (
      <AlertDialog>
        <AlertDialogTrigger ref={triggerRef} hidden>
          Open
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-lg border-2 border-blue-400 bg-gray-100 shadow-lg p-6">
          <AlertDialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <FiAlertTriangle className="text-red-500" size={48} />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-800">Credit Insufficient</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              You currently don't have enough credits to proceed. Please recharge your balance or choose to cancel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between mt-6">
            <AlertDialogCancel
              className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
              onClick={() => {
                router.refresh();
                router.push("/home");
              }}
            >
              <FiCheckCircle className="mr-2" size={20} /> {/* Check icon */}
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
            onClick={()=> {
              router.refresh();
              router.push('/usage-and-pricing');
            }}>
              Get Credits
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default InsufficientCreditBalance;
  