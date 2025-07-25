import { Input, Textarea, Label, Field } from "@headlessui/react"

const Test = () => {
  return (
    <form>
        <Field>
            <Label>Name</Label>
            <Input name="username" className="border data-[hover]:shadow data-[focus]:bg-blue-100"/>
        </Field>
        <Field>
            <Label>Desc</Label>
            <Textarea name="description" />
        </Field>
    </form>
  );
};

export default Test;
