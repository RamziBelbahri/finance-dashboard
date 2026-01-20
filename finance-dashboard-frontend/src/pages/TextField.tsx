import React, { useRef, useState } from "react";

interface Person {
    firstName: string
    lastName: string
}

interface Props {
    text: string;
    ok?: boolean;
    i?: number;
    fn?: (bob: string) => void;
    obj?: {
        f1: string
    };
    person: Person;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField: React.FC<Props> = ({handleChange}) => {
    const [count, setCount] = useState<{text: string}>({text: 'hello'});
    const inputRef = useRef<HTMLInputElement>(null);

    return(<div>
        <input ref={inputRef} onChange={handleChange} />
    </div>)
};