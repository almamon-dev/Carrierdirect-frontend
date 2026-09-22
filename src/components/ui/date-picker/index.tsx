import * as React from "react";
import Input, { InputProps } from "@/components/ui/input";

export interface DatePickerProps extends Omit<InputProps, "type"> {}

export default function DatePicker(props: DatePickerProps) {
    return <Input type="date" {...props} />;
}
