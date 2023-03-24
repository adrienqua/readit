import React, { useEffect, useState } from "react"
import InputTest from "./InputTest"

const Test = () => {
    const [data, setData] = useState({
        name: "test",
    })
    const [test, setTest] = useState(data.name)

    useEffect(() => {}, [])

    return (
        <div>
            <h1>test</h1>
            <InputTest handleChange={setTest} value={test} />
        </div>
    )
}

export default Test
