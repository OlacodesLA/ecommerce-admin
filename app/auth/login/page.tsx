"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import { ILoginValues } from "@/interfaces/components";
import { DefaultButton } from "@/components/button";
import { PasswordField, TextField } from "@/components/input";
import { loginSchema } from "@/schemas";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import StaggerChildren, { childVariants } from "@/animations/staggerChildren";
import AuthLayout from "@/layout/authLayout";
import Link from "next/link";
import useAppDispatch from "@/hooks/useAppDispatch";
import { loginUser, loginWithGoogle } from "@/services";
import useMounted from "@/utils";

const Login = () => {
  const router: AppRouterInstance = useRouter();
  const mounted = useMounted();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (values: ILoginValues, actions: any) => {
    setIsLoading(true);
    console.log("clicked");
    await loginUser(values, router, setIsLoading);
  };

  const onGoogle = async () => {
    loginWithGoogle(router);
  };

  const { handleChange, errors, touched, handleSubmit, values, handleBlur } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit,
    });
  console.log(errors);
  return (
    <AuthLayout>
      <div className="text-black font-semibold text-4xl mb-4 text-center">
        Admin Login
      </div>

      <form onSubmit={handleSubmit} className=" flex flex-col gap-2 ">
        <StaggerChildren>
          <motion.div variants={childVariants} className="mb-3">
            <TextField
              type="email"
              placeholder="Email"
              name="email"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.email}
              error={errors.email}
              touched={touched.email}
            />
          </motion.div>
          <motion.div
            variants={childVariants}
            className="flex gap-2 items-start mb-2"
          >
            <PasswordField
              name="password"
              placeholder="Password"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.password}
              error={errors.password}
              touched={touched.password}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <DefaultButton type="submit" isLoading={isLoading} label="Log in" />
          </motion.div>

          <motion.div variants={childVariants}>
            <div className="flex justify-between mt-2">
              <div className="text-black text-sm">
                Dont have an Account?{" "}
                <Link className="text-blue-600" href="/auth/register">
                  Register
                </Link>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 "
              >
                Forgot Password
              </Link>
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
              <div className="h-px w-full bg-slate-200"></div>
              OR
              <div className="h-px w-full bg-slate-200"></div>
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <button
              type="button"
              onClick={onGoogle}
              className="px-4 py-2 border w-full  flex justify-center gap-2 border-gray-400 rounded-lg text-gray-700  font-medium  hover:border-slate-400  hover:text-slate-900  hover:shadow transition duration-150"
            >
              <img
                className="w-6 h-6"
                src="/google.svg"
                loading="lazy"
                alt="google logo"
              />
              <span>Login with Google</span>
            </button>
          </motion.div>
        </StaggerChildren>
      </form>

      {/* <Sharingan /> */}
    </AuthLayout>
  );
};

export default Login;
