import {
  usePolygonIdStoredCreds,
  usePolygonIdWallet,
} from "@/features/polygon-id/usePolygonId";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Card from "@/components/Card";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { usePolygonIdMinter } from "@/features/polygon-id/usePolygonIdMinter";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import truncateAddress from "@/utils/truncateAddress";

export const PolygonIdWallet2 = (props: {
  isOpen: boolean;
  close: () => void;
}) => {
  const { wallet } = usePolygonIdWallet();
  const polygonIdStoredCreds = usePolygonIdStoredCreds();

  const { submitProof, loading, receipt, values } = usePolygonIdMinter();

  const polygonCredentials =
    polygonIdStoredCreds.data?.filter(
      ({ type }) => !type.includes("AuthBJJCredential")
    ) || [];

  const submitApproval = async () => {
    submitProof.mutate();
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="App min-h-screen">
      <div className="flex flex-col w-full p-10">
        <div className="text-lg  text-center font-bold">
          Polygon credentials
        </div>

        <div className="gap-2 my-6 grid grid-cols-3">
          {polygonCredentials.length > 0 ? (
            <>
              {polygonCredentials.map((cred) => (
                <Card key={cred.id}>
                  <div className="flex gap-4 items-center">
                    <div className="text-green-300 w-12">
                      <CheckCircleIcon />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">
                        {cred.credentialSubject.type as string}
                      </div>
                      <div>
                        {cred.credentialSubject.birthday as string}
                        {cred.credentialSubject.countryCode as string}
                      </div>
                    </div>
                  </div>

                  {receipt?.blockHash ? (
                    <div className="text-center mt-4">
                      <div>Transaction hash: </div>
                      <div>{truncateAddress(receipt.blockHash)}</div>
                    </div>
                  ) : loading ? (
                    <button className="btn">
                      <span className="loading loading-spinner btn-neutral text-white"></span>
                      loading
                    </button>
                  ) : (
                    <button
                      className={"btn text-white"}
                      onClick={submitApproval}
                    >
                      Approve
                    </button>
                  )}
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <div className="text-lg text-center">No Polygon credentials</div>
            </Card>
          )}
        </div>
        {receipt?.blockHash && (
          <button
            className={"btn btn-primary text-white"}
            onClick={handleClose}
          >
            Close page
          </button>
        )}
      </div>
    </div>
  );
};

export default PolygonIdWallet2;