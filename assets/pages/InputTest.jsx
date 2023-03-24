import React, { useEffect, useState } from "react"

const InputTest = ({ handleChange, value, name }) => {
    const handleFormChange = (currentTarget) => {
        handleChange(currentTarget.target.value)
    }

    return (
        <div>
            <h1>test</h1>
            <input
                type="text"
                name={name}
                onChange={handleFormChange}
                value={value}
            />
        </div>
    )
}

export default InputTest
