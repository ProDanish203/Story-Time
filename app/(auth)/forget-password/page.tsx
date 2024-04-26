"use client";
import AuthLayout from "../../layouts/AuthLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ForgetFields } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ForgetSchema } from "@/lib/AuthValidation";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgetPass } from "@/API/auth.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetFields>({ resolver: zodResolver(ForgetSchema) });

  const router = useRouter();
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: forgetPass,
  });

  const onSubmit: SubmitHandler<ForgetFields> = async (data) => {
    console.log(data);
    const { success, response } = await mutateAsync(data.email);
    if (!success) return toast.error(response);
    else toast.success("An Email has been sent");
  };

  return (
    <AuthLayout title="Forgot Password?" subTitle="Enter your details below">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email" className="text-xl text-[#395E66] font-bold">
            Email Address
          </Label>
          <Input
            type="email"
            {...register("email")}
            id="email"
            placeholder="Type here"
            className="py-6"
          />
        </div>

        {errors?.email?.message && (
          <ErrorMessage text={errors?.email?.message} />
        )}
        {/* <AuthButton
          buttonTitle={"Reset Password"}
          isModal={!errors?.email?.message}
        /> */}
        <Button
          className="mt-7 py-7 text-white bg-primaryCol rounded-md text-md w-full hover:bg-[#395e66be]"
          type="submit"
          disabled={isPending}
        >
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;
