import React from "react"

export default function TitlePage({ title, description }) {
  return (
    <>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </>
  )
}
