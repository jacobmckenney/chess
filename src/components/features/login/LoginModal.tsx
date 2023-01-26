import React, { useState } from "react";
import { useCycle } from "framer-motion";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { api } from "../../../utils/api";
import { useForm } from "react-hook-form";
import type { UserCreationInfo } from "../../../types/auth";
import type { User } from "@prisma/client";

interface Props {
  open: boolean;
}

const LoginModal: React.FC<Props> = ({ open }) => {
  const [isLogin, cycle] = useCycle(false, true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const { register, handleSubmit } = useForm<UserCreationInfo>();
  const createUserMutation = api.auth.create.useMutation();
  const loginMutation = api.auth.login.useMutation();

  const onSubmit = async (data: UserCreationInfo) => {
    console.log(isLogin);
    if (isLogin) {
      const user = await loginMutation.mutateAsync(data);
      setUser(user);
    } else {
      const user = await createUserMutation.mutateAsync(data);
      setUser(user);
    }
  };

  return (
    <>
      {open && (
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-1/2 flex-col justify-center rounded-lg bg-black px-10 align-middle text-white"
        >
          {JSON.stringify(user)}
          <Button action={cycle}>{isLogin ? "sign up" : "login"}</Button>
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
            register={() => register("password", { required: false })}
          />
          <Button type="submit">login</Button>
          <Button action={() => setUser(undefined)}>sign out</Button>
        </form>
      )}
    </>
  );
};

export default LoginModal;