"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";

export const LinkSubmission = () => {
  const [link, setLink] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted link:", link);
    setLink("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="Paste video link"
          value={link}
          onChange={handleChange}
          className="border border-gray-300 rounded-3xl px-6 py-2 mr-4 flex-1 outline-none"
        />
        <button
          type="submit"
          className="bg-white border border-gray-300 text-[#2CA15D] px-6 py-2 rounded-3xl"
        >
          Search
        </button>
      </div>
    </form>
  );
};
