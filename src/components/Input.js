import React from 'react'

const Input = ({ label, type, name, ref, onChange }) => {
  return (
    <label>
      {label}
      <input type={type} name={name} ref={ref} onChange={onChange} />
    </label>
  )
}

export default Input