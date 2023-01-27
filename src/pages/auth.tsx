import React from "react";
import { useCycle } from "framer-motion";
import FormInput from "../components/ui/FormInput";
import Button from "../components/ui/Button";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import type { UserCreationInfo } from "../types/auth";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Auth: NextPage = () => {
  const [isLogin, cycle] = useCycle(true, false);
  const { register, handleSubmit } = useForm<UserCreationInfo>();
  const createUserMutation = api.auth.create.useMutation({
    onSuccess: async () => router.push("/home"),
    onError: (error) => {
      console.log(error);
    },
  });
  const loginMutation = api.auth.login.useMutation({
    onSuccess: async () => router.push("/home"),
  });
  const { data, refetch } = api.auth.user.useQuery();
  const router = useRouter();

  const onSubmit = async (data: UserCreationInfo) => {
    if (isLogin) {
      await loginMutation.mutateAsync(data);
    } else {
      await createUserMutation.mutateAsync(data);
    }
    await refetch();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        className="fixed top-1/3 left-1/2 flex -translate-x-1/2 flex-col justify-center gap-y-3 rounded-lg  bg-black p-10 align-bottom"
      >
        {data && <h1>Hello, {data.username}</h1>}
        <Button action={cycle}>
          {isLogin ? "Don't have an account?" : "Back to login"}
        </Button>
        <FormInput
          label="Username"
          register={() => register("username", { required: true })}
        />
        {!isLogin && (
          <FormInput
            label="Email"
            register={() => register("email", { required: true })}
          />
        )}
        <FormInput
          label="Password"
          register={() => register("password", { required: true })}
        />
        <Button action={handleSubmit(onSubmit)}>
          {isLogin ? "login" : "sign up"}
        </Button>
      </form>
    </main>
  );
};

export default Auth;
