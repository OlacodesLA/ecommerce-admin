"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import { IRegistrationValues } from "@/interfaces/components";
import { DefaultButton } from "@/components/button";
import { PasswordField, TextField } from "@/components/input";
import { registerSchema } from "@/schemas";
import { motion } from "framer-motion";
import StaggerChildren, { childVariants } from "@/animations/staggerChildren";
import { registerUser } from "@/services";
import AuthLayout from "@/layout/authLayout";
import { Heading } from "@/components/ui/heading";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (values: IRegistrationValues, actions: any) => {
    registerUser(values, router, setIsLoading);
  };

  const { handleChange, errors, touched, handleSubmit, values, handleBlur } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: "",
      },
      validationSchema: registerSchema,
      onSubmit,
    });

  return (
    <AuthLayout>
      <Heading title="Sign Up" description="create an account to get started" />

      <form onSubmit={handleSubmit} className=" flex flex-col gap-2 mt-5">
        <StaggerChildren>
          <motion.div variants={childVariants} className="">
            <TextField
              type="text"
              placeholder="First Name"
              name="firstName"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.firstName}
              error={errors.firstName}
              touched={touched.firstName}
            />
          </motion.div>
          <motion.div variants={childVariants} className="">
            <TextField
              type="text"
              placeholder="Last Name"
              name="lastName"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.lastName}
              error={errors.lastName}
              touched={touched.lastName}
            />
          </motion.div>
          <motion.div variants={childVariants} className="">
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
            className="flex gap-2 items-start"
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
            <PasswordField
              name="password2"
              placeholder="Confirm Password"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.password2}
              error={errors.password2}
              touched={touched.password2}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <DefaultButton
              type="submit"
              isLoading={isLoading}
              label="Create Account"
            />
          </motion.div>
        </StaggerChildren>
      </form>
    </AuthLayout>
  );
}
