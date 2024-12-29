// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { Button } from "~/components/ui/button";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form";
// import { Input } from "~/components/ui/input";
// import { type LoginUserFormSchema } from "../forms";

// type LoginFormInnerProps = {
//   onSubmit: (values: LoginUserFormSchema) => void;
//   loading: boolean;
// };

// export const LoginFormInner = (props: LoginFormInnerProps) => {
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   const form = useFormContext<LoginUserFormSchema>();

//   return (
//     <form onSubmit={form.handleSubmit(props.onSubmit)}>
//       <FormField
//         control={form.control}
//         name="email"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Email</FormLabel>
//             <FormControl>
//               <Input type="email" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={form.control}
//         name="password"
//         render={({ field }) => (
//           <FormItem className="mt-2">
//             <FormLabel>Password</FormLabel>
//             <FormControl>
//               <Input type={showPassword ? "text" : "password"} {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <div className="flex justify-end">
//         <Link
//           href="/forgot-password"
//           className="my-4 font-semibold text-primary"
//         >
//           Lupa Password
//         </Link>
//       </div>
//       <Button disabled={props.loading} type="submit" className="mt-4 w-full">
//         {props.loading ? "Logging in.." : "Login"}
//       </Button>
//     </form>
//   );
// };
