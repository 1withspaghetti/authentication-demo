import React, { createRef, useState } from "react";
import { InputHTMLAttributes } from "react";

type Props = {
    attr: InputHTMLAttributes<HTMLInputElement>, 
    id: string, 
    label: string, 
    regex?: {[key: string]: RegExp},
    children?: any
}

export default class FormInput extends React.Component<Props> {

    input: React.RefObject<HTMLInputElement>;
    state = {
        valid: true,
        error: ""
    }

    constructor(props: Props) {
        super(props);
        this.input = createRef();
    }

    testInput(): boolean {
        this.setState({valid: true});

        if (!this.input.current) return false;
        const value = this.input.current.value;

        if (!this.props.regex) return true;
        for (const [msg, regex] of Object.entries(this.props.regex)) {
            if (!regex.test(value)) {
                this.setState({valid: false, error: msg || "Invalid Input"})
                return false;
            }
        }
        return true;
    }

    getValue(): string {
        return this.input.current?.value || "";
    }

    render(): React.ReactNode {
        return (
            <div className="mt-2">
                <div className="flex justify-between font-semibold">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                    {this.props.children}
                </div>
                <input ref={this.input} type="text" id={this.props.id} name={this.props.id} {...this.props.attr} onChange={()=>this.testInput()} className={`w-64 rounded border-[3px] px-2 bg-neutral-100 dark:bg-slate-700 outline-none ${this.state.valid ? 'border-transparent focus:border-blue-500 dark:focus:border-blue-700' : 'border-red-500'}`}></input>
                {!this.state.valid && <div className="w-64 text-sm text-red-500">{this.state.error}</div>}
            </div>
        )
    }
}

/*export default function FormInput({attr, id, label, regex, test, children}: {attr: InputHTMLAttributes<HTMLInputElement>, id: string, label: string, regex?: {[key: string]: RegExp|string}[], test: (valid: boolean)=>void, children?: any}) {


    return (
        <div className="mt-2">
            <div className="flex justify-between font-semibold">
                <label htmlFor={id}>Password</label>
                {children}
            </div>
            <input type="text" id={id} name={id} {...attr} className="w-64 rounded border-[3px] px-2 border-transparent focus:border-blue-500 dark:focus:border-blue-700 bg-neutral-100 dark:bg-slate-700 outline-none"></input>
        </div>
    )
}*/