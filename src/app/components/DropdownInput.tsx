import React from "react";

export default function DropdownInput({id, handleOnChange, value}: Readonly<{id: string, handleOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void, value: string}>) {
    return (
        <form className="max-w-sm">
            <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Select an option
            </label>
            <select
                id={id}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleOnChange}
                value={value || ""}
            >
                <option selected>Choose a game</option>
                <option value="spades">Spades</option>
                <option value="dominoes">Dominoes</option>
            </select>
        </form>
    );
}
