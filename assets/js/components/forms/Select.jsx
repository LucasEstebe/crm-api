import React from 'react';

const Select = ({name,value = 1,error ="",label,onChange, children}) => {


    return(
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select className={"form-control " + (error && "is-invalid")} name={name} id={name} onChange={onChange} value={value}>
            {children}
        </select>
        <p className={"invalid-feedback"}>{error}</p>
    </div>)
}

export default Select