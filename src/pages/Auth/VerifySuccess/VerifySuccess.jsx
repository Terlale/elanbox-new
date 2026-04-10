import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../api/axios"; 
import styles from "./verifySeccess.module.scss";

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); 
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setErrorMsg("Token mövcud deyil!");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.get("/users/confirmation", {
          params: { token },
        });

        if (response.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg("Verification failed. Try again!");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg(err.response?.data?.message || "Verification failed. Try again!");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className={styles.wrapper}>
      {status === "loading" && <h1>Yoxlanılır...</h1>}

      {status === "success" && (
        <>
          <h1>🎉 Hesabınız uğurla təsdiqləndi!</h1>
          <p>Email ünvanınız təsdiqləndi. İndi hesabınıza daxil ola bilərsiniz.</p>
          <button onClick={() => navigate("/login")}>Login səhifəsinə keç</button>
        </>
      )}

      {status === "error" && (
        <>
          <h1>❌ Təsdiq uğursuz oldu!</h1>
          <p>{errorMsg}</p>
          <button onClick={() => navigate("/register")}>Qeydiyyata qayıt</button>
        </>
      )}
    </div>
  );
};

export default VerifySuccess;
