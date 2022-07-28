/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  z,
  ZodString,
  ZodNumber,
  ZodDate,
  ZodBigInt,
  ZodBoolean,
  ZodUndefined,
  ZodNull,
  ZodVoid,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodError,
  ZodEffects,
} from "zod";

type ZodPrimitives =
  | ZodString
  | ZodNumber
  | ZodDate
  | ZodBigInt
  | ZodBoolean
  | ZodUndefined
  | ZodNull
  | ZodVoid
  | ZodAny
  | ZodUnknown
  | ZodNever;

export const useZodValidator = <T extends string = string>(
  fields: Record<T, ZodPrimitives | ZodEffects<ZodPrimitives, string, string>>,
): {
  errors: Partial<Record<T, string[]>>;
  validate: (data: Record<T, unknown>) => Promise<void>;
  resetError: (field: T) => void;
} => {
  const [errors, setErrors] = useState<Partial<Record<T, string[]>>>({});
  const formObject = z.object(fields).strict();
  const validate = async (obj: Record<T, unknown>) => {
    try {
      await formObject.parseAsync(obj);
      setErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err.flatten().fieldErrors);
        setErrors(err.flatten().fieldErrors as Record<T, string[]>);
      } else {
        throw err;
      }
    }
    return Promise.resolve();
  };
  const resetError = (field: T) => {
    setErrors(errors => ({ ...errors, [field]: undefined }));
  };
  return { errors, validate, resetError };
};
