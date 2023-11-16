"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import { IResetValues } from "@/interfaces/components";
import { DefaultButton } from "@/components/button";
import { PasswordField } from "@/components/input";
import { resetPasswordSchema } from "@/schemas";
import { motion } from "framer-motion";
import StaggerChildren, { childVariants } from "@/animations/staggerChildren";
import AuthLayout from "@/layout/authLayout";
import { resetUserPassword } from "@/services";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const continueUrl = searchParams.get("oobCode");
  console.log({
    mode,
    oobCode,
    continueUrl,
  });

  const onSubmit = async (values: IResetValues, actions: any) => {
    const { newPassword } = values;
    setIsLoading(true);
    console.log("clicked");
    if (oobCode) {
      resetUserPassword(values, oobCode, router, setIsLoading);
    } else {
      toast.error("Wrong Url");
    }

    await setIsLoading(false);
  };

  const { handleChange, errors, touched, handleSubmit, values, handleBlur } =
    useFormik({
      initialValues: {
        newPassword: "",
      },
      validationSchema: resetPasswordSchema,
      onSubmit,
    });

  return (
    <AuthLayout>
      <div>SignIn</div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
        <StaggerChildren>
          <motion.div variants={childVariants} className="">
            <PasswordField
              placeholder="New Password"
              name="newPassword"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.newPassword}
              error={errors.newPassword}
              touched={touched.newPassword}
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <DefaultButton
              type="submit"
              isLoading={isLoading}
              label="Forgot Password"
            />
          </motion.div>
        </StaggerChildren>
      </form>
    </AuthLayout>
  );
}
